// app/admin/controllers/deposit.actions.ts
"use server"

import mongoose from "mongoose"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Deposit, type IDeposit } from "@/models/Deposit"
import { Investment } from "@/models/Investment"
import { User, type IUser } from "@/models/User"
import { Transaction } from "@/models/Transaction"
import { type IPlan } from "@/models/Plan"
import { Notification } from "@/models/Notification"

export type AdminDepositsResponse = {
  success: boolean
  message?: string
  deposits: Array<Record<string, unknown>>
}

export type AdminDepositActionResponse = {
  success: boolean
  message?: string
  deposit?: Record<string, unknown>
  investment?: Record<string, unknown>
}

export async function getAdminDeposits(): Promise<AdminDepositsResponse> {
  try {
    const session = await getServerSession(authOptions)
    const admin = session?.user

    if (
      !admin?.id ||
      (admin.role !== "admin" && admin.role !== "super admin")
    ) {
      return {
        success: false,
        message: "Administrator access required.",
        deposits: [],
      }
    }

    await connectToDB()

    const deposits = await Deposit.find({})
      .populate("userId", "fullName username email")
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      deposits: JSON.parse(JSON.stringify(deposits)),
    }
  } catch (error: unknown) {
    console.error("Failed to load admin deposits:", error)

    return {
      success: false,
      message: "Internal server error.",
      deposits: [],
    }
  }
}

export async function approveAdminDeposit(
  id: string,
  data?: {
    adminNotes?: string
  }
): Promise<AdminDepositActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    const admin = session?.user

    if (
      !admin?.id ||
      (admin.role !== "admin" && admin.role !== "super admin")
    ) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    if (!id || !mongoose.isValidObjectId(id)) {
      return {
        success: false,
        message: "Valid deposit id is required.",
      }
    }

    await connectToDB()

    const deposit = (await Deposit.findOne({
      _id: id,
      status: "PENDING",
    })
      .populate("planId")
      .populate("userId")
      .exec()) as
      | (IDeposit & {
          planId: IPlan
          userId: IUser
        })
      | null

    if (!deposit) {
      return {
        success: false,
        message: "Pending deposit not found.",
      }
    }

    const plan = deposit.planId as IPlan

    if (!plan) {
      return {
        success: false,
        message: "Associated investment plan not found.",
      }
    }

    const investor = await User.findById(deposit.userId).exec()

    if (!investor) {
      return {
        success: false,
        message: "Investor account not found.",
      }
    }

    const expectedProfit =
      (Number(deposit.amount) * Number(plan.returnPercentage || 0)) / 100

    const totalExpectedReturn = plan.principalReturn
      ? Number(deposit.amount) + expectedProfit
      : expectedProfit

    deposit.status = "APPROVED"
    deposit.approvedAt = new Date()
    deposit.adminNotes =
      data?.adminNotes || "Approved via Admin Security Console"

    await deposit.save()

    const investment = await Investment.create({
      userId: deposit.userId,
      planId: plan._id ?? plan.id,
      depositId: deposit._id,
      amount: deposit.amount,
      returnPercentage: plan.returnPercentage,
      expectedProfit,
      totalExpectedReturn,
      durationHours: plan.durationHours,
      startDate: new Date(),
      maturityDate: new Date(
        Date.now() + Number(plan.durationHours) * 60 * 60 * 1000
      ),
      status: "ACTIVE",
      principalReturn: Boolean(plan.principalReturn),
      payoutProcessed: false,
    })

    investor.totalDeposits =
      Number(investor.totalDeposits || 0) + Number(deposit.amount)

    await investor.save()

    const existingTx = await Transaction.findOne({
      referenceId: deposit._id,
    }).exec()

    if (existingTx) {
      existingTx.status = "COMPLETED"
      existingTx.description = `${plan.name} confirmed deposit`
      await existingTx.save()
    } else {
      await Transaction.create({
        userId: deposit.userId,
        type: "DEPOSIT",
        amount: deposit.amount,
        asset: deposit.asset,
        txHash: deposit.txHash,
        status: "COMPLETED",
        description: `${plan.name} confirmed deposit`,
        referenceId: deposit._id,
      })
    }

    await Transaction.create({
      userId: deposit.userId,
      type: "INVESTMENT",
      amount: deposit.amount,
      asset: "USD",
      status: "COMPLETED",
      description: `${plan.name} investment activated`,
      referenceId: investment._id,
    })

    await Notification.create({
      userId: deposit.userId,
      title: "Deposit approved",
      message: `Your ${plan.name} deposit has been approved and the investment is now active.`,
      type: "DEPOSIT",
    })

    if (investor.uplineId) {
      const uplineUser = await User.findById(investor.uplineId).exec()

      if (uplineUser && uplineUser._id.toString() !== investor._id.toString()) {
        const rate = Number(plan.referralPercentage || 5)
        const commissionAmount = (Number(deposit.amount) * rate) / 100

        if (commissionAmount > 0) {
          uplineUser.availableBalance =
            Number(uplineUser.availableBalance || 0) + commissionAmount

          uplineUser.referralEarnings =
            Number(uplineUser.referralEarnings || 0) + commissionAmount

          await uplineUser.save()

          await Transaction.create({
            userId: uplineUser._id,
            type: "REFERRAL_COMMISSION",
            amount: commissionAmount,
            asset: "USD",
            status: "COMPLETED",
            description: `${rate}% referral bonus on ${investor.username}'s investment`,
            referenceId: deposit._id,
          })
        }
      }
    }

    return {
      success: true,
      message: "Deposit approved successfully.",
      deposit: JSON.parse(JSON.stringify(deposit)),
      investment: JSON.parse(JSON.stringify(investment)),
    }
  } catch (error: unknown) {
    console.error("Failed to approve admin deposit:", error)

    return {
      success: false,
      message: "Internal server error.",
    }
  }
}

export async function rejectAdminDeposit(
  id: string,
  data?: {
    reason?: string
  }
): Promise<AdminDepositActionResponse> {
  try {
    const session = await getServerSession(authOptions)
    const admin = session?.user

    if (
      !admin?.id ||
      (admin.role !== "admin" && admin.role !== "super admin")
    ) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    if (!id || !mongoose.isValidObjectId(id)) {
      return {
        success: false,
        message: "Valid deposit id is required.",
      }
    }

    await connectToDB()

    const deposit = await Deposit.findOne({
      _id: id,
      status: "PENDING",
    }).exec()

    if (!deposit) {
      return {
        success: false,
        message: "Pending deposit not found.",
      }
    }

    deposit.status = "REJECTED"
    deposit.rejectedAt = new Date()
    deposit.adminNotes = data?.reason || "Rejected by administrator."

    await deposit.save()

    const existingTx = await Transaction.findOne({
      referenceId: deposit._id,
    }).exec()

    if (existingTx) {
      existingTx.status = "REJECTED"
      existingTx.description = `Deposit rejected: ${deposit.adminNotes}`
      await existingTx.save()
    }

    await Notification.create({
      userId: deposit.userId,
      title: "Deposit rejected",
      message: deposit.adminNotes,
      type: "DEPOSIT",
    })

    return {
      success: true,
      message: "Deposit rejected successfully.",
      deposit: JSON.parse(JSON.stringify(deposit)),
    }
  } catch (error: unknown) {
    console.error("Failed to reject admin deposit:", error)

    return {
      success: false,
      message: "Internal server error.",
    }
  }
}
