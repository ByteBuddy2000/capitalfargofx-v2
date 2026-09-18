// app/admin/controllers/referrals.actions.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Referral } from "@/models/Referral"

export type AdminReferralsResponse = {
  success: boolean
  message?: string
  referrals: Array<Record<string, unknown>>
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  const admin = session?.user

  if (!admin?.id || (admin.role !== "admin" && admin.role !== "super admin")) {
    return null
  }

  return admin
}

export async function getAdminReferrals(): Promise<AdminReferralsResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
        referrals: [],
      }
    }

    await connectToDB()

    const referrals = await Referral.find({})
      .populate("referrerId", "username")
      .populate("referredUserId", "username fullName")
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      referrals: JSON.parse(JSON.stringify(referrals)),
    }
  } catch (error: unknown) {
    console.error("Failed to load admin referrals:", error)

    return {
      success: false,
      message: "Unable to load referrals.",
      referrals: [],
    }
  }
}
