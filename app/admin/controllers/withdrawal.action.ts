// app/admin/controllers/withdrawal.actions.ts
"use server"

import mongoose from "mongoose"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Withdrawal } from "@/models/Withdrawal"
import { User } from "@/models/User"
import { Transaction } from "@/models/Transaction"
import { LedgerEntry } from "@/models/LedgerEntry"

export type AdminWithdrawalsResponse = {
  success: boolean
  message?: string
  withdrawals: Array<Record<string, unknown>>
}

export type UpdateAdminWithdrawalResponse = {
  success: boolean
  message?: string
  withdrawal?: Record<string, unknown>
}

export async function getAdminWithdrawals(): Promise<AdminWithdrawalsResponse> {
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
        withdrawals: [],
      }
    }

    await connectToDB()

    const withdrawals = await Withdrawal.find({})
      .populate("userId", "fullName username email")
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      withdrawals: JSON.parse(JSON.stringify(withdrawals)),
    }
  } catch (error: unknown) {
    console.error("Failed to load admin withdrawals:", error)

    return {
      success: false,
      message: "Internal server error.",
      withdrawals: [],
    }
  }
}

export async function updateAdminWithdrawal(
  id: string,
  data: {
    status?: string
    txHash?: string
    adminNotes?: string
  }
): Promise<UpdateAdminWithdrawalResponse> {
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
        message: "Valid withdrawal id is required.",
      }
    }

    const status = data.status

    if (!status || !["PROCESSING", "COMPLETED", "REJECTED"].includes(status)) {
      return {
        success: false,
        message: "Invalid withdrawal status.",
      }
    }

    const normalizedStatus = status as "PROCESSING" | "COMPLETED" | "REJECTED"

    await connectToDB()

    const withdrawal = await Withdrawal.findById(id).exec()

    if (
      !withdrawal ||
      withdrawal.status === "COMPLETED" ||
      withdrawal.status === "REJECTED"
    ) {
      return {
        success: false,
        message: "Pending withdrawal not found.",
      }
    }

    withdrawal.status = normalizedStatus
    withdrawal.txHash = data.txHash || ""
    withdrawal.adminNotes = data.adminNotes || ""

    if (normalizedStatus === "PROCESSING") {
      withdrawal.processedAt = new Date()
    }

    if (normalizedStatus === "COMPLETED") {
      withdrawal.completedAt = new Date()

      await User.findByIdAndUpdate(withdrawal.userId, {
        $inc: {
          totalWithdrawals: withdrawal.amount,
        },
      }).exec()
    }

    if (normalizedStatus === "REJECTED") {
      const user = await User.findByIdAndUpdate(
        withdrawal.userId,
        {
          $inc: {
            availableBalance: withdrawal.amount,
          },
        },
        {
          new: true,
        }
      ).exec()

      if (user) {
        await LedgerEntry.create({
          userId: withdrawal.userId,
          type: "REFUND",
          amount: withdrawal.amount,
          asset: "USD",
          direction: "CREDIT",
          referenceType: "WITHDRAWAL",
          referenceId: withdrawal._id,
          balanceBefore:
            Number(user.availableBalance || 0) - Number(withdrawal.amount),
          balanceAfter: Number(user.availableBalance || 0),
          description:
            withdrawal.adminNotes || "Withdrawal rejected and refunded",
        })
      }
    }

    await withdrawal.save()

    await Transaction.findOneAndUpdate(
      {
        referenceId: withdrawal._id,
      },
      {
        status: normalizedStatus,
        txHash: withdrawal.txHash,
        description: `Withdrawal ${normalizedStatus.toLowerCase()}`,
      },
      {
        new: true,
      }
    ).exec()

    return {
      success: true,
      message: `Withdrawal ${normalizedStatus.toLowerCase()} successfully.`,
      withdrawal: JSON.parse(JSON.stringify(withdrawal)),
    }
  } catch (error: unknown) {
    console.error("Failed to update admin withdrawal:", error)

    return {
      success: false,
      message: "Internal server error.",
    }
  }
}
