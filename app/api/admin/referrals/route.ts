// app/api/admin/referrals/route.ts
import { NextResponse } from "next/server"
import { authErrorStatus, requireAdmin } from "@/lib/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Referral } from "@/models/Referral"

export async function GET() {
  try {
    await requireAdmin()
    await connectToDB()
    const referrals = await Referral.find({})
      .populate("referrerId", "username")
      .populate("referredUserId", "username fullName")
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json({ referrals })
  } catch (error: unknown) {
    const status = authErrorStatus(error)
    return NextResponse.json(
      {
        message: status
          ? "Administrator access required."
          : "Unable to load referrals.",
      },
      { status: status || 500 }
    )
  }
}
