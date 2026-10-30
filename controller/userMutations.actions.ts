// userMutations.actions.ts
"use server"

import mongoose from "mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Deposit } from "@/models/Deposit"
import { Investment } from "@/models/Investment"
import { Plan } from "@/models/Plan"
import { User } from "@/models/User"
import { Withdrawal } from "@/models/Withdrawal"
import { AuditLog } from "@/models/AuditLog"
import { convertFiatToCrypto } from "@/lib/coingecko"

type UserAuditAction =
  "DEPOSIT_SUBMITTED" | "WITHDRAWAL_REQUESTED" | "INVESTMENT_SETTLED"

const COINGECKO_COIN_IDS = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
} as const

const getDepositConversion = async (
  amount: number,
  asset: keyof typeof COINGECKO_COIN_IDS
) => {
  if (!Object.prototype.hasOwnProperty.call(COINGECKO_COIN_IDS, asset)) {
    throw new Error("Unsupported cryptocurrency asset.")
  }

  const conversion = await convertFiatToCrypto({
    cryptoId: COINGECKO_COIN_IDS[asset],
    fiatCurrency: "usd",
    fiatAmount: amount,
  })

  const decimals = asset === "USDT" ? 6 : 8
  return {
    ...conversion,
    cryptoAmount: Number(conversion.cryptoAmount.toFixed(decimals)),
  }
}

export async function getDepositCryptoQuote(
  amount: number,
  asset: keyof typeof COINGECKO_COIN_IDS
) {
  const id = await userId()
  if (!id) return { success: false, message: "Authentication required." }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, message: "A valid USD amount is required." }
  }

  try {
    const conversion = await getDepositConversion(amount, asset)
    return { success: true, cryptoAmount: conversion.cryptoAmount }
  } catch (error) {
    console.error("Failed to quote deposit crypto amount:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to retrieve the current cryptocurrency price.",
    }
  }
}

async function writeUserAudit({
  actorId,
  actorUsername,
  action,
  entity,
  entityId,
  previousState,
  newState,
  notes,
}: {
  actorId: string
  actorUsername: string
  action: UserAuditAction
  entity: string
  entityId: string
  previousState?: Record<string, unknown>
  newState: Record<string, unknown>
  notes: string
}) {
  await AuditLog.create({
    actorId,
    actorUsername,
    action,
    entity,
    entityId,
    previousState,
    newState,
    notes,
  })
}

async function userId() {
  const session = await getServerSession(authOptions)
  return session?.user?.id || null
}

export async function createUserDeposit(data: {
  planId: string
  amount: number
  asset: "BTC" | "ETH" | "USDT"
  network: string
  receivingAddress: string
  txHash: string
}) {
  const id = await userId()
  if (!id) return { success: false, message: "Authentication required." }

  try {
    await connectToDB()
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      return { success: false, message: "A valid USD amount is required." }
    }

    const plan = await Plan.findOne({
      status: "ACTIVE",
      $or: [
        ...(mongoose.isValidObjectId(data.planId)
          ? [{ _id: data.planId }]
          : []),
        { slug: data.planId },
      ],
    }).lean()
    if (!plan) return { success: false, message: "Investment plan not found." }
    if (
      data.amount < plan.minimumAmount ||
      (plan.maximumAmount > 0 && data.amount > plan.maximumAmount)
    ) {
      return {
        success: false,
        message: "Deposit amount is outside the selected plan limits.",
      }
    }

    const actor = await User.findById(id).select("username").lean()
    if (!actor) return { success: false, message: "User account not found." }

    const conversion = await getDepositConversion(data.amount, data.asset)
    const deposit = await Deposit.create({
      ...data,
      amount: data.amount,
      cryptoAmount: conversion.cryptoAmount,
      userId: id,
      planId: plan._id,
    })

    await writeUserAudit({
      actorId: id,
      actorUsername: actor.username,
      action: "DEPOSIT_SUBMITTED",
      entity: "Deposit",
      entityId: deposit._id.toString(),
      newState: {
        status: deposit.status,
        amount: deposit.amount,
        cryptoAmount: deposit.cryptoAmount,
        asset: deposit.asset,
        network: deposit.network,
        planId: plan._id.toString(),
      },
      notes: "User submitted a deposit for review.",
    })

    return { success: true, deposit: JSON.parse(JSON.stringify(deposit)) }
  } catch (error) {
    console.error("Failed to create deposit:", error)
    return { success: false, message: "Unable to submit deposit." }
  }
}

export async function createUserWithdrawal(data: {
  amount: number
  asset: "BTC" | "ETH" | "USDT"
  network: string
  destinationAddress: string
}) {
  const id = await userId()
  if (!id) return { success: false, message: "Authentication required." }

  try {
    await connectToDB()
    const user = await User.findById(id).lean()
    if (!user || Number(user.availableBalance) < Number(data.amount)) {
      return { success: false, message: "Insufficient available balance." }
    }

    const withdrawal = await Withdrawal.create({ ...data, userId: id })
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $inc: { availableBalance: -Number(data.amount) } },
      { new: true }
    )
      .select("username availableBalance")
      .lean()
    if (!updatedUser) throw new Error("User account not found.")

    await writeUserAudit({
      actorId: id,
      actorUsername: updatedUser.username,
      action: "WITHDRAWAL_REQUESTED",
      entity: "Withdrawal",
      entityId: withdrawal._id.toString(),
      previousState: {
        availableBalance:
          Number(updatedUser.availableBalance) + Number(data.amount),
      },
      newState: {
        status: withdrawal.status,
        amount: withdrawal.amount,
        asset: withdrawal.asset,
        network: withdrawal.network,
        availableBalance: updatedUser.availableBalance,
      },
      notes: "User requested a withdrawal.",
    })

    return { success: true, withdrawal: JSON.parse(JSON.stringify(withdrawal)) }
  } catch (error) {
    console.error("Failed to create withdrawal:", error)
    return { success: false, message: "Unable to submit withdrawal." }
  }
}

export async function settleUserInvestment(investmentId: string) {
  const id = await userId()
  if (!id || !mongoose.isValidObjectId(investmentId))
    return { success: false, message: "Invalid investment." }

  try {
    await connectToDB()
    const actor = await User.findById(id).select("username").lean()
    if (!actor) return { success: false, message: "User account not found." }

    const investment = await Investment.findOneAndUpdate(
      {
        _id: investmentId,
        userId: id,
        status: "ACTIVE",
        maturityDate: { $lte: new Date() },
      },
      { $set: { status: "COMPLETED", payoutProcessed: true } },
      { new: true }
    ).lean()
    if (!investment)
      return {
        success: false,
        message: "Investment is not ready for settlement.",
      }

    const payout = investment.principalReturn
      ? investment.totalExpectedReturn
      : investment.expectedProfit
    await User.findByIdAndUpdate(id, {
      $inc: {
        availableBalance: payout,
        earningBalance: investment.expectedProfit,
      },
    })

    await writeUserAudit({
      actorId: id,
      actorUsername: actor.username,
      action: "INVESTMENT_SETTLED",
      entity: "Investment",
      entityId: investment._id.toString(),
      previousState: { status: "ACTIVE" },
      newState: {
        status: investment.status,
        payoutProcessed: investment.payoutProcessed,
        payout,
        expectedProfit: investment.expectedProfit,
      },
      notes: "User settled a matured investment.",
    })

    return { success: true, investment: JSON.parse(JSON.stringify(investment)) }
  } catch (error) {
    console.error("Failed to settle investment:", error)
    return { success: false, message: "Unable to settle investment." }
  }
}
