// controllers/investmentplans.actions.ts

"use server"

import { connectToDB } from "@/lib/connectToDB"
import { Plan } from "@/models/Plan"


export type PlansResponse = {
  success: boolean
  message?: string
  plans: Array<Record<string, unknown>>
}

export async function getActivePlans(): Promise<PlansResponse> {
  try {
    await connectToDB()

    const plans = await Plan.find({ status: "ACTIVE" })
      .sort({ featured: -1, minimumAmount: 1 })
      .lean()

    return {
      success: true,
      plans: JSON.parse(JSON.stringify(plans)),
    }
  } catch (error: unknown) {
    console.error("Failed to load active plans:", error)

    return {
      success: false,
      message: "Internal server error.",
      plans: [],
    }
  }
}

export async function getInvestmentPlans() {
  try {
    await connectToDB()

    const plans = await Plan.find({
      status: "ACTIVE",
    }).lean()

    const sortedPlans = plans.sort((a, b) => {
      const levelA = Number(a.name.match(/\d+/)?.[0] ?? 999)
      const levelB = Number(b.name.match(/\d+/)?.[0] ?? 999)

      return levelA - levelB
    })

    return JSON.parse(JSON.stringify(sortedPlans))
  } catch (error) {
    console.error("Failed to fetch investment plans:", error)
    return []
  }
}