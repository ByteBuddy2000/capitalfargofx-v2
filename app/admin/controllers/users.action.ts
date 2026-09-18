// app/admin/controllers/users.actions.ts
"use server"

import mongoose from "mongoose"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"
import { LedgerEntry } from "@/models/LedgerEntry"
import { Transaction } from "@/models/Transaction"
import { Deposit } from "@/models/Deposit"
import { Investment } from "@/models/Investment"
import { SupportTicket } from "@/models/SupportTicket"
import { Withdrawal } from "@/models/Withdrawal"
import { AuditLog } from "@/models/AuditLog"
import { Notification } from "@/models/Notification"

const publicUser = (user: Record<string, unknown>) => ({
  ...user,
  id: String(user._id),
  _id: undefined,
  passwordHash: undefined,
  uplineId: user.uplineId ? String(user.uplineId) : null,
  createdAt:
    user.createdAt instanceof Date
      ? user.createdAt.toISOString()
      : user.createdAt,
  updatedAt:
    user.updatedAt instanceof Date
      ? user.updatedAt.toISOString()
      : user.updatedAt,
})

type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED"
type BalanceType = "available" | "earning"
type Operation = "CREDIT" | "DEBIT"

export type AdminUsersResponse = {
  success: boolean
  message?: string
  users: Array<Record<string, unknown>>
}

export type UpdateAdminUserResponse = {
  success: boolean
  message?: string
  user?: Record<string, unknown>
}

export type DeleteUserResponse = {
  success: boolean
  message?: string
}

export async function getAdminUsers(): Promise<AdminUsersResponse> {
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
        users: [],
      }
    }

    await connectToDB()

    const users = await User.find({})
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      users: users.map((user) => publicUser(user as Record<string, unknown>)),
    }
  } catch (error: unknown) {
    console.error("Failed to load admin users:", error)

    return {
      success: false,
      message: "Unable to load users.",
      users: [],
    }
  }
}

export async function updateAdminUser(data: {
  userId?: string
  status?: UserStatus
  balanceType?: BalanceType
  operation?: Operation
  amount?: number
  reason?: string
}): Promise<UpdateAdminUserResponse> {
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

    await connectToDB()

    if (!data.userId || data.userId === admin.id) {
      return {
        success: false,
        message: "A valid target user is required.",
      }
    }

    const user = await User.findById(data.userId).exec()

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      }
    }

    if (data.status) {
      user.status = data.status
      await user.save()
    } else {
      const amount = Number(data.amount)

      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !data.balanceType ||
        !data.operation ||
        !data.reason?.trim()
      ) {
        return {
          success: false,
          message: "Balance type, operation, amount, and reason are required.",
        }
      }

      const field =
        data.balanceType === "available" ? "availableBalance" : "earningBalance"

      const before = Number(user[field] || 0)

      const after =
        data.operation === "CREDIT" ? before + amount : before - amount

      if (after < 0) {
        return {
          success: false,
          message: "Balance cannot become negative.",
        }
      }

      user[field] = after
      await user.save()

      const referenceId = user._id
      const reason = data.reason.trim()

      await LedgerEntry.create({
        userId: user._id,
        type: "ADJUSTMENT",
        amount,
        asset: "USD",
        direction: data.operation === "CREDIT" ? "CREDIT" : "DEBIT",
        referenceType: "ADMIN_ADJUSTMENT",
        referenceId,
        balanceBefore: before,
        balanceAfter: after,
        description: reason,
        metadata: {
          adminId: admin.id,
          reason,
        },
      })

      await Transaction.create({
        userId: user._id,
        type: "ADJUSTMENT",
        amount,
        asset: "USD",
        status: "COMPLETED",
        description: reason,
        referenceId,
      })
    }

    return {
      success: true,
      user: publicUser(user.toObject() as unknown as Record<string, unknown>),
    }
  } catch (error: unknown) {
    console.error("Failed to update admin user:", error)

    return {
      success: false,
      message: "Unable to update user.",
    }
  }
}

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
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

    if (!mongoose.isValidObjectId(userId) || userId === admin.id) {
      return {
        success: false,
        message: "A valid user other than the current administrator is required.",
      }
    }

    await connectToDB()

    const user = await User.findById(userId).select("_id").lean()

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      }
    }

    await Promise.all([
      Deposit.deleteMany({ userId }),
      Investment.deleteMany({ userId }),
      SupportTicket.deleteMany({ userId }),
      Transaction.deleteMany({ userId }),
      Withdrawal.deleteMany({ userId }),
      Notification.deleteMany({ userId }),
      AuditLog.deleteMany({ $or: [{ actorId: userId }, { entityId: userId }] }),
    ])

    await User.deleteOne({ _id: userId })

    return {
      success: true,
      message: "User and related records deleted successfully.",
    }
  } catch (error: unknown) {
    console.error("Failed to delete user:", error)

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unable to delete user.",
    }
  }
}
