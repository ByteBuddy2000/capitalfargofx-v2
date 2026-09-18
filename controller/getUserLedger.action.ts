// controllers/getUserLedger.actions.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { LedgerEntry } from "@/models/LedgerEntry"

export type MeLedgerResponse = {
  success: boolean
  message?: string
  entries: Array<Record<string, unknown>>
}

export async function getUserLedger(): Promise<MeLedgerResponse> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      success: false,
      message: "Authentication required.",
      entries: [],
    }
  }

  try {
    await connectToDB()

    const entries = await LedgerEntry.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      entries: JSON.parse(JSON.stringify(entries)),
    }
  } catch (error: unknown) {
    console.error("Failed to load user ledger:", error)

    return {
      success: false,
      message: "Internal server error.",
      entries: [],
    }
  }
}
