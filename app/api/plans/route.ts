import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/connectToDB"
import { Plan } from "@/models/Plan"
import { CURRENT_PLANS } from "@/lib/defaultPlans"

export type PlansResponse = {
  plans: Array<Record<string, unknown>>
}

export async function GET(): Promise<
  NextResponse<PlansResponse | { message: string }>
> {
  try {
    await connectToDB()
    let plans = await Plan.find({ status: "ACTIVE" })
      .sort({ featured: -1, minimumAmount: 1 })
      .lean()
    if (plans.length === 0) {
      await Plan.insertMany(CURRENT_PLANS, { ordered: false })
      plans = await Plan.find({ status: "ACTIVE" })
        .sort({ featured: -1, minimumAmount: 1 })
        .lean()
    }
    return NextResponse.json({ plans })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    )
  }
}
