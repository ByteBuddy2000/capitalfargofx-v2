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
      .populate("planId", "name")
      .populate("depositId", "asset")
      .sort({ createdAt: -1 })
      .lean()

    const serializedInvestments = investments.map((investment) => {
      const plan =
        investment.planId &&
        typeof investment.planId === "object" &&
        "name" in investment.planId
          ? (investment.planId as { _id?: unknown; name?: string })
          : undefined
      const deposit =
        investment.depositId &&
        typeof investment.depositId === "object" &&
        "asset" in investment.depositId
          ? (investment.depositId as { _id?: unknown; asset?: string })
          : undefined

      return {
        ...investment,
        id: String(investment._id),
        planId: String(plan?._id ?? investment.planId),
        depositId: String(deposit?._id ?? investment.depositId),
        planName: investment.planName || plan?.name || "",
        assetName: investment.assetName || deposit?.asset || "",
      }
    })

    return {
      success: true,
      investments: JSON.parse(JSON.stringify(serializedInvestments)),
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
