"use server"

import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireAuth } from "@/lib/auth"
import { connectToDB } from "@/lib/connectToDB"
import { CURRENT_PLANS } from "@/lib/defaultPlans"
import { Asset, ASSET_SYMBOLS, type AssetSymbol } from "@/models/Asset"
import { Deposit } from "@/models/Deposit"
import { Investment } from "@/models/Investment"
import { LedgerEntry } from "@/models/LedgerEntry"
import { Notification } from "@/models/Notification"
import { Plan, type IPlan } from "@/models/Plan"
import { Referral } from "@/models/Referral"
import { Transaction } from "@/models/Transaction"
import { User } from "@/models/User"
import { Withdrawal } from "@/models/Withdrawal"
import type {
  Deposit as DepositType,
  Investment as InvestmentType,
  User as UserType,
  Withdrawal as WithdrawalType,
} from "@/types"

const assets = ["BTC", "ETH", "USDT"] as const
const assetSchema = z.enum(assets)

const depositSchema = z.object({
  planId: z.string().trim().min(1),
  amount: z.coerce.number().finite().positive(),
  asset: assetSchema,
  network: z.string().trim().min(2),
  receivingAddress: z.string().trim().min(10),
  txHash: z.string().trim().min(10).max(200),
})

const withdrawalSchema = z.object({
  amount: z.coerce.number().finite().positive(),
  asset: assetSchema,
  network: z.string().trim().min(2),
  destinationAddress: z.string().trim().min(10),
})

const registrationSchema = z.object({
  fullName: z.string().trim().min(1),
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_]{3,30}$/),
  email: z.string().trim().email(),
  password: z.string().min(6),
  btcWallet: z.string().trim().optional().default(""),
  ethWallet: z.string().trim().optional().default(""),
  usdtWallet: z.string().trim().optional().default(""),
  referralCode: z.string().trim().optional().default(""),
})

export type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string }

export type RegisterActionUser = Pick<
  UserType,
  | "id"
  | "fullName"
  | "username"
  | "email"
  | "role"
  | "status"
  | "btcWallet"
  | "ethWallet"
  | "usdtWallet"
  | "uplineUsername"
>

export type RegisterActionData = { user: RegisterActionUser }
export type DepositActionData = { deposit: DepositType }
export type WithdrawalActionData = {
  withdrawal: WithdrawalType
  user: Partial<UserType>
}
export type SettlementActionData = {
  investment: InvestmentType
  payout: number
}

const actionError = (error: unknown, fallback: string): ActionResult<never> => {
  if (error instanceof z.ZodError) {
    return {
      success: false,
      error: error.issues[0]?.message || "Invalid input.",
    }
  }
  if (
    error instanceof mongoose.Error &&
    error.name === "MongoServerError" &&
    (error as mongoose.mongo.MongoServerError).code === 11000
  ) {
    return {
      success: false,
      error: "That transaction hash has already been submitted.",
    }
  }
  console.error(error)
  return { success: false, error: fallback }
}

const serializeDeposit = (
  deposit: Record<string, unknown>,
  plan: IPlan
): DepositType => ({
  ...(deposit as Omit<
    DepositType,
    | "id"
    | "planName"
    | "expectedReturnPercentage"
    | "durationHours"
    | "expectedProfit"
    | "totalExpectedReturn"
  >),
  id: String(deposit._id ?? deposit.id),
  planName: plan.name,
  expectedReturnPercentage: plan.returnPercentage,
  durationHours: plan.durationHours,
  expectedProfit:
    (Number(deposit.amount) * Number(plan.returnPercentage)) / 100,
  totalExpectedReturn: plan.principalReturn
    ? Number(deposit.amount) +
      (Number(deposit.amount) * Number(plan.returnPercentage)) / 100
    : (Number(deposit.amount) * Number(plan.returnPercentage)) / 100,
})

const serializeWithdrawal = (
  withdrawal: { _id?: unknown } & Record<string, unknown>
): WithdrawalType => ({
  ...(withdrawal as unknown as Omit<WithdrawalType, "id">),
  id: String(withdrawal._id ?? withdrawal.id),
})

const serializeInvestment = (
  investment: { _id?: unknown } & Record<string, unknown>
): InvestmentType => ({
  ...(investment as unknown as Omit<InvestmentType, "id">),
  id: String(investment._id ?? investment.id),
})

export async function registerUserAction(
  input: unknown
): Promise<ActionResult<RegisterActionData>> {
  let createdUser: InstanceType<typeof User> | null = null

  try {
    const data = registrationSchema.parse(input)
    await connectToDB()

    const normalizedUsername = data.username.toLowerCase()
    const normalizedEmail = data.email.toLowerCase()
    const normalizedWallets = {
      BTC: data.btcWallet,
      ETH: data.ethWallet,
      USDT: data.usdtWallet,
    }

    if (
      await User.exists({
        $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
      })
    ) {
      return {
        success: false,
        error: "That username or email is already registered.",
      }
    }

    const upline = data.referralCode
      ? await User.findOne({ username: data.referralCode.toLowerCase() }).exec()
      : null

    createdUser = await User.create({
      fullName: data.fullName,
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(data.password, 12),
      btcWallet: normalizedWallets.BTC,
      ethWallet: normalizedWallets.ETH,
      usdtWallet: normalizedWallets.USDT,
      uplineId: upline?._id || null,
      uplineUsername: upline?.username || null,
    })

    await Asset.insertMany(
      ASSET_SYMBOLS.map((symbol) => ({
        userId: createdUser?._id,
        symbol,
        walletAddress: normalizedWallets[symbol],
      }))
    )

    if (upline) {
      await Referral.create({
        referrerId: upline._id,
        referredUserId: createdUser._id,
      })
    }

    const user = createdUser
    revalidatePath("/login")
    return {
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
          btcWallet: user.btcWallet,
          ethWallet: user.ethWallet,
          usdtWallet: user.usdtWallet,
          uplineUsername: user.uplineUsername,
        },
      },
    }
  } catch (error) {
    if (createdUser) {
      await Asset.deleteMany({ userId: createdUser._id })
      await User.deleteOne({ _id: createdUser._id })
    }
    return actionError(error, "Unable to create your account.")
  }
}

export async function createDepositAction(
  input: unknown
): Promise<ActionResult<DepositActionData>> {
  try {
    const data = depositSchema.parse(input)
    const user = await requireAuth()
    await connectToDB()

    const planSlug = data.planId.replace(/^plan-/i, "").toLowerCase()
    const planQuery = mongoose.isValidObjectId(data.planId)
      ? {
          $or: [
            { _id: data.planId },
            { slug: data.planId },
            { slug: planSlug },
          ],
          status: "ACTIVE",
        }
      : { $or: [{ slug: data.planId }, { slug: planSlug }], status: "ACTIVE" }

    let plan = (await Plan.findOne(planQuery).exec()) as IPlan | null
    if (!plan) {
      await Plan.insertMany(CURRENT_PLANS, { ordered: false }).catch(
        () => undefined
      )
      plan = (await Plan.findOne(planQuery).exec()) as IPlan | null
    }
    if (!plan)
      return {
        success: false,
        error: "That investment plan is unavailable or no longer active.",
      }
    if (
      data.amount < plan.minimumAmount ||
      (plan.maximumAmount > 0 && data.amount > plan.maximumAmount)
    ) {
      return {
        success: false,
        error: `Deposit must be between $${plan.minimumAmount} and ${plan.maximumAmount ? `$${plan.maximumAmount}` : "the plan maximum"}.`,
      }
    }
    if (await Deposit.exists({ txHash: data.txHash })) {
      return {
        success: false,
        error: "That transaction hash has already been submitted.",
      }
    }

    const deposit = await Deposit.create({
      ...data,
      userId: user._id,
      planId: plan._id,
    })
    await Transaction.create({
      userId: user._id,
      type: "DEPOSIT",
      amount: data.amount,
      asset: data.asset,
      status: "PENDING",
      description: `${plan.name} pending deposit`,
      referenceId: deposit._id,
    })
    await Notification.create({
      userId: user._id,
      title: "Deposit submitted",
      message: "Your deposit is awaiting verification.",
      type: "DEPOSIT",
    })

    revalidatePath("/dashboard")
    return {
      success: true,
      data: {
        deposit: serializeDeposit(
          deposit.toObject() as unknown as Record<string, unknown>,
          plan
        ),
      },
    }
  } catch (error) {
    return actionError(error, "Could not register deposit.")
  }
}

const fallbackPrices = { BTC: 64000, ETH: 3400, USDT: 1 }
async function getAssetPrice(asset: AssetSymbol): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd",
      { next: { revalidate: 60 } }
    )
    const data = (await response.json()) as Record<string, { usd?: number }>
    const ids = { BTC: "bitcoin", ETH: "ethereum", USDT: "tether" }
    return Number(data[ids[asset]]?.usd) || fallbackPrices[asset]
  } catch {
    return fallbackPrices[asset]
  }
}

export async function createWithdrawalAction(
  input: unknown
): Promise<ActionResult<WithdrawalActionData>> {
  try {
    const data = withdrawalSchema.parse(input)
    const user = await requireAuth()
    const minimum = Number(process.env.MIN_WITHDRAWAL_AMOUNT || 50)
    if (data.amount < minimum)
      return {
        success: false,
        error: `Minimum withdrawal amount is $${minimum}.`,
      }

    await connectToDB()
    const selectedAsset = await Asset.findOne({
      userId: user._id,
      symbol: data.asset,
    }).exec()
    const assetAmount = data.amount / (await getAssetPrice(data.asset))
    let updated: InstanceType<typeof User> | null = null

    if (selectedAsset && selectedAsset.availableBalance > 0) {
      if (selectedAsset.availableBalance < assetAmount)
        return { success: false, error: `Insufficient ${data.asset} balance.` }
      const reservedAsset = await Asset.updateOne(
        { _id: selectedAsset._id, availableBalance: { $gte: assetAmount } },
        { $inc: { availableBalance: -assetAmount } }
      ).exec()
      if (reservedAsset.modifiedCount !== 1)
        return { success: false, error: `Insufficient ${data.asset} balance.` }
      updated = await User.findOneAndUpdate(
        { _id: user._id, availableBalance: { $gte: data.amount } },
        { $inc: { availableBalance: -data.amount } },
        { new: true }
      ).exec()
      if (!updated)
        await Asset.updateOne(
          { _id: selectedAsset._id },
          { $inc: { availableBalance: assetAmount } }
        ).exec()
    } else {
      updated = await User.findOneAndUpdate(
        { _id: user._id, availableBalance: { $gte: data.amount } },
        { $inc: { availableBalance: -data.amount } },
        { new: true }
      ).exec()
    }
    if (!updated)
      return { success: false, error: "Insufficient available balance." }

    const withdrawal = await Withdrawal.create({ userId: user._id, ...data })
    await Transaction.create({
      userId: user._id,
      type: "WITHDRAWAL",
      amount: data.amount,
      asset: data.asset,
      status: "PENDING",
      description: `Withdrawal to ${data.asset}`,
      referenceId: withdrawal._id,
    })
    await LedgerEntry.create({
      userId: user._id,
      type: "WITHDRAWAL",
      amount: data.amount,
      asset: "USD",
      direction: "DEBIT",
      referenceType: "WITHDRAWAL",
      referenceId: withdrawal._id,
      balanceBefore: updated.availableBalance + data.amount,
      balanceAfter: updated.availableBalance,
      description: "Pending withdrawal reserve",
    })

    revalidatePath("/dashboard")
    return {
      success: true,
      data: {
        withdrawal: serializeWithdrawal(
          withdrawal.toObject() as unknown as { _id?: unknown } & Record<
            string,
            unknown
          >
        ),
        user: updated.toObject() as unknown as Partial<UserType>,
      },
    }
  } catch (error) {
    return actionError(error, "Error processing withdrawal request.")
  }
}

export async function settleInvestmentAction(
  input: unknown
): Promise<ActionResult<SettlementActionData>> {
  try {
    const id = z.string().trim().min(1).parse(input)
    const user = await requireAuth()
    await connectToDB()
    const investment = await Investment.findOne({
      _id: id,
      userId: user._id,
      status: "ACTIVE",
      payoutProcessed: false,
    }).exec()
    if (!investment)
      return { success: false, error: "Active investment not found." }
    if (new Date(investment.maturityDate) > new Date())
      return { success: false, error: "Investment has not matured yet." }

    investment.status = "COMPLETED"
    investment.payoutProcessed = true
    await investment.save()
    const payout =
      investment.expectedProfit +
      (investment.principalReturn ? investment.amount : 0)
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        availableBalance: payout,
        earningBalance: investment.expectedProfit,
      },
    }).exec()
    await Transaction.create({
      userId: user._id,
      type: "PROFIT",
      amount: investment.expectedProfit,
      asset: "USD",
      status: "COMPLETED",
      description: "Investment maturity payout",
      referenceId: investment._id,
    })

    revalidatePath("/dashboard")
    return {
      success: true,
      data: {
        investment: serializeInvestment(
          investment.toObject() as unknown as { _id?: unknown } & Record<
            string,
            unknown
          >
        ),
        payout,
      },
    }
  } catch (error) {
    return actionError(error, "Unable to settle this investment.")
  }
}
