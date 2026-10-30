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
      .populate("referrerId", "username fullName")
      .populate("referredUserId", "username fullName")
      .sort({ createdAt: -1 })
      .lean()

    const serializedReferrals = referrals.map((referral) => {
      const referrer =
        referral.referrerId && typeof referral.referrerId === "object"
          ? (referral.referrerId as unknown as Record<string, unknown>)
          : null
      const referredUser =
        referral.referredUserId && typeof referral.referredUserId === "object"
          ? (referral.referredUserId as unknown as Record<string, unknown>)
          : null

      return {
        ...referral,
        id: String(referral._id),
        referrerId: String(referrer?._id || referral.referrerId),
        referrerUsername: String(referrer?.username || "unknown"),
        referrerFullName: String(referrer?.fullName || "Unknown sponsor"),
        referredUserId: String(
          referredUser?._id || referral.referredUserId
        ),
        referredUsername: String(referredUser?.username || "unknown"),
        referredFullName: String(
          referredUser?.fullName || "Unknown Investor"
        ),
      }
    })

    return {
      success: true,
      referrals: JSON.parse(JSON.stringify(serializedReferrals)),
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
