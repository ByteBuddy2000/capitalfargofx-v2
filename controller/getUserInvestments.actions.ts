// controllers/getUserInvestments.actions.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Investment } from "@/models/Investment"

export type MeInvestmentsResponse = {
  success: boolean
  message?: string
  investments: Array<Record<string, unknown>>
}

export async function getUserInvestments(): Promise<MeInvestmentsResponse> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      success: false,
      message: "Authentication required.",
      investments: [],
    }
  }

  try {
    await connectToDB()

    const investments = await Investment.find({ userId })
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      investments: JSON.parse(JSON.stringify(investments)),
    }
  } catch (error: unknown) {
    console.error("Failed to load user investments:", error)

    return {
      success: false,
      message: "Internal server error.",
      investments: [],
    }
  }
}
