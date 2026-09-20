// controllers/getUserTransactions.action.ts
"use server"

import { getServerSession } from "next-auth"
import mongoose from "mongoose"
import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Transaction } from "@/models/Transaction"

export type MeTransactionsResponse = {
  success: boolean
  message?: string
  transactions: Array<Record<string, unknown>>
}

export async function getUserTransactions(): Promise<MeTransactionsResponse> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      success: false,
      message: "Authentication required.",
      transactions: [],
    }
  }

  try {
    await connectToDB()
console.log("Session User ID:", userId)

    const transactions = await Transaction.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      transactions: JSON.parse(JSON.stringify(transactions)),
    }
  } catch (error: unknown) {
    console.error("Failed to load user transactions:", error)

    return {
      success: false,
      message: "Internal server error.",
      transactions: [],
    }
  }
}
