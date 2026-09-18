// app/admin/controllers/overview.actions.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"
import { Deposit } from "@/models/Deposit"
import { Withdrawal } from "@/models/Withdrawal"
import { Investment } from "@/models/Investment"

export type AdminOverviewResponse = {
  success: boolean
  message?: string
  users: Array<Record<string, unknown>>
  deposits: Array<Record<string, unknown>>
  withdrawals: Array<Record<string, unknown>>
  investments: Array<Record<string, unknown>>
}

export async function getAdminOverview(): Promise<AdminOverviewResponse> {
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
        deposits: [],
        withdrawals: [],
        investments: [],
      }
    }

    await connectToDB()

    const [users, deposits, withdrawals, investments] = await Promise.all([
      User.find({ role: "user" })
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .lean(),

      Deposit.find({})
        .populate("userId", "fullName username email")
        .populate("planId", "name")
        .sort({ createdAt: -1 })
        .lean(),

      Withdrawal.find({})
        .populate("userId", "fullName username email")
        .sort({ createdAt: -1 })
        .lean(),

      Investment.find({})
        .populate("planId", "name")
        .sort({ createdAt: -1 })
        .lean(),
    ])

    return {
      success: true,
      users: JSON.parse(JSON.stringify(users)),
      deposits: JSON.parse(JSON.stringify(deposits)),
      withdrawals: JSON.parse(JSON.stringify(withdrawals)),
      investments: JSON.parse(JSON.stringify(investments)),
    }
  } catch (error: unknown) {
    console.error("Failed to load admin overview:", error)

    return {
      success: false,
      message: "Unable to load administrator data.",
      users: [],
      deposits: [],
      withdrawals: [],
      investments: [],
    }
  }
}
