// app/admin/controllers/users.actions.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"
import { LedgerEntry } from "@/models/LedgerEntry"
import { Transaction } from "@/models/Transaction"

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

type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED"
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
