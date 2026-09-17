// controllers/getUserDesposit.actions.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Deposit } from "@/models/Deposit"

export type MeDepositsResponse = {
  success: boolean
  message?: string
  deposits: Array<Record<string, unknown>>
}

export async function getUserDeposits(): Promise<MeDepositsResponse> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      success: false,
      message: "Authentication required.",
      deposits: [],
    }
  }

  try {
    await connectToDB()

    const deposits = await Deposit.find({ userId })
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      deposits: JSON.parse(JSON.stringify(deposits)),
    }
  } catch (error: unknown) {
    console.error("Failed to load user deposits:", error)

    return {
      success: false,
      message: "Internal server error.",
      deposits: [],
    }
  }
}