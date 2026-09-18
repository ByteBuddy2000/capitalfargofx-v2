"use server"

import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { PlatformSettings } from "@/models/PlatformSettings"
import { Referral } from "@/models/Referral"
import { User } from "@/models/User"
import { SupportTicket } from "@/models/SupportTicket"

export async function getUserReferrals() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return { success: false, referrals: [] }

  try {
    await connectToDB()
    const referrals = await Referral.find({ referrerId: userId })
      .populate("referrerId", "username")
      .populate("referredUserId", "username fullName")
      .sort({ createdAt: -1 })
      .lean()

    return { success: true, referrals: JSON.parse(JSON.stringify(referrals)) }
  } catch (error) {
    console.error("Failed to load user referrals:", error)
    return { success: false, referrals: [] }
  }
}

export async function getUserPlatformSettings() {
  try {
    await connectToDB()
    const settings = await PlatformSettings.findOne({})
      .sort({ updatedAt: -1 })
      .lean()
    return {
      success: true,
      settings: settings ? JSON.parse(JSON.stringify(settings)) : null,
    }
  } catch (error) {
    console.error("Failed to load platform settings:", error)
    return { success: false, settings: null }
  }
}

export async function getUserSupportTickets() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { success: false, tickets: [] }

  try {
    await connectToDB()
    const tickets = await SupportTicket.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean()
    return { success: true, tickets: JSON.parse(JSON.stringify(tickets)) }
  } catch (error) {
    console.error("Failed to load support tickets:", error)
    return { success: false, tickets: [] }
  }
}

export async function createUserSupportTicket(data: {
  subject: string
  category: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  message: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return { success: false, message: "Authentication required." }

  try {
    await connectToDB()
    const user = await User.findById(session.user.id)
      .select("fullName email")
      .lean()
    if (!user) return { success: false, message: "User not found." }

    const ticket = await SupportTicket.create({
      ...data,
      userId: user._id,
      userFullName: user.fullName,
      userEmail: user.email,
    })
    return { success: true, ticket: JSON.parse(JSON.stringify(ticket)) }
  } catch (error) {
    console.error("Failed to create support ticket:", error)
    return { success: false, message: "Unable to submit support inquiry." }
  }
}

export async function updateUserProfile(data: {
  btcWallet: string
  ethWallet: string
  usdtWallet: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return { success: false, message: "Authentication required." }

  try {
    await connectToDB()
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .select("-passwordHash")
      .lean()

    return user
      ? { success: true, user: JSON.parse(JSON.stringify(user)) }
      : { success: false, message: "User not found." }
  } catch (error) {
    console.error("Failed to update user profile:", error)
    return { success: false, message: "Unable to update profile." }
  }
}

export async function changeUserPassword(data: {
  currentPassword: string
  newPassword: string
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return { success: false, message: "Authentication required." }

  try {
    await connectToDB()
    const user = await User.findById(session.user.id).select("+passwordHash")
    if (
      !user ||
      !(await bcrypt.compare(data.currentPassword, user.passwordHash))
    ) {
      return { success: false, message: "Current password is incorrect." }
    }

    user.passwordHash = await bcrypt.hash(data.newPassword, 12)
    await user.save()
    return { success: true }
  } catch (error) {
    console.error("Failed to change user password:", error)
    return { success: false, message: "Unable to update password." }
  }
}
