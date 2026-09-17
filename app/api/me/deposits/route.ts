// app/api/me/deposits/route.ts
import { NextResponse } from "next/server"
import { authErrorStatus, requireAuth } from "@/lib/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Deposit } from "@/models/Deposit"

export type MeDepositsResponse = {
  deposits: Array<Record<string, unknown>>
}

export async function GET(): Promise<
  NextResponse<MeDepositsResponse | { message: string }>
> {
  try {
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      )
    }

    await connectToDB()
    const deposits = await Deposit.find({ userId: user._id })
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json({ deposits })
  } catch (error: unknown) {
    const authStatus = authErrorStatus(error)
    if (authStatus)
      return NextResponse.json(
        { message: "Authentication required." },
        { status: authStatus }
      )
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    )
  }
}
