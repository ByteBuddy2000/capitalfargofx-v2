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
    const plan = await Plan.findOne({
      status: "ACTIVE",
      $or: [
        ...(mongoose.isValidObjectId(data.planId) ? [{ _id: data.planId }] : []),
        { slug: data.planId },
      ],
    }).lean()
    if (!plan) return { success: false, message: "Investment plan not found." }

    const deposit = await Deposit.create({ ...data, userId: id, planId: plan._id })
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
    await User.findByIdAndUpdate(id, { $inc: { availableBalance: -Number(data.amount) } })
    return { success: true, withdrawal: JSON.parse(JSON.stringify(withdrawal)) }
  } catch (error) {
    console.error("Failed to create withdrawal:", error)
    return { success: false, message: "Unable to submit withdrawal." }
  }
}

export async function settleUserInvestment(investmentId: string) {
  const id = await userId()
  if (!id || !mongoose.isValidObjectId(investmentId)) return { success: false, message: "Invalid investment." }

  try {
    await connectToDB()
    const investment = await Investment.findOneAndUpdate(
      { _id: investmentId, userId: id, status: "ACTIVE", maturityDate: { $lte: new Date() } },
      { $set: { status: "COMPLETED", payoutProcessed: true } },
      { new: true }
    ).lean()
    if (!investment) return { success: false, message: "Investment is not ready for settlement." }

    const payout = investment.principalReturn ? investment.totalExpectedReturn : investment.expectedProfit
    await User.findByIdAndUpdate(id, { $inc: { availableBalance: payout, earningBalance: investment.expectedProfit } })
    return { success: true, investment: JSON.parse(JSON.stringify(investment)) }
  } catch (error) {
    console.error("Failed to settle investment:", error)
    return { success: false, message: "Unable to settle investment." }
  }
}
