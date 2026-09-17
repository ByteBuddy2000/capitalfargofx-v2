// controllers/me.actions.ts
"use server"

import mongoose from "mongoose"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Notification } from "@/models/Notification"

export type MeNotificationsResponse = {
  success: boolean
  message?: string
  notifications: Array<Record<string, unknown>>
}

export type UpdateNotificationResponse = {
  success: boolean
  message?: string
  notification?: Record<string, unknown>
}

export async function getUserNotifications(): Promise<MeNotificationsResponse> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      success: false,
      message: "Authentication required.",
      notifications: [],
    }
  }

  try {
    await connectToDB()

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      notifications: JSON.parse(JSON.stringify(notifications)),
    }
  } catch (error: unknown) {
    console.error("Failed to load user notifications:", error)

    return {
      success: false,
      message: "Internal server error.",
      notifications: [],
    }
  }
}

export async function markNotificationAsRead(
  id: string
): Promise<UpdateNotificationResponse> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      success: false,
      message: "Authentication required.",
    }
  }

  if (!id || !mongoose.isValidObjectId(id)) {
    return {
      success: false,
      message: "Notification id is required.",
    }
  }

  try {
    await connectToDB()

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    ).lean()

    if (!notification) {
      return {
        success: false,
        message: "Notification not found.",
      }
    }

    return {
      success: true,
      notification: JSON.parse(JSON.stringify(notification)),
    }
  } catch (error: unknown) {
    console.error("Failed to mark notification as read:", error)

    return {
      success: false,
      message: "Internal server error.",
    }
  }
}