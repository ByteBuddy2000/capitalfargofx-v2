// controllers/me.actions.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Withdrawal } from "@/models/Withdrawal"

export type MeWithdrawalsResponse = {
  success: boolean
  message?: string
  withdrawals: Array<Record<string, unknown>>
}

export async function getUserWithdrawals(): Promise<MeWithdrawalsResponse> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      success: false,
      message: "Authentication required.",
      withdrawals: [],
    }
  }

  try {
    await connectToDB()

    const withdrawals = await Withdrawal.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      withdrawals: JSON.parse(JSON.stringify(withdrawals)),
    }
  } catch (error: unknown) {
    console.error("Failed to load user withdrawals:", error)

    return {
      success: false,
      message: "Internal server error.",
      withdrawals: [],
    }
  }
}