// app/admin/controllers/settings.actions.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { PlatformSettings } from "@/models/PlatformSettings"

export type AdminSettingsResponse = {
  success: boolean
  message?: string
  settings?: Record<string, unknown>
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  const admin = session?.user

  if (
    !admin?.id ||
    (admin.role !== "admin" && admin.role !== "super admin")
  ) {
    return null
  }

  return admin
}

export async function getAdminSettings(): Promise<AdminSettingsResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    await connectToDB()

    const settings = await PlatformSettings.findOne({})
      .sort({ updatedAt: -1 })
      .lean()

    if (!settings) {
      return {
        success: false,
        message: "Platform settings not found.",
      }
    }

    return {
      success: true,
      settings: JSON.parse(JSON.stringify(settings)),
    }
  } catch (error: unknown) {
    console.error("Failed to load admin settings:", error)

    return {
      success: false,
      message: "Unable to load settings.",
    }
  }
}

export async function updateAdminSettings(
  data: Record<string, unknown>
): Promise<AdminSettingsResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    await connectToDB()

    const settings = await PlatformSettings.findOneAndUpdate(
      {},
      data,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).lean()

    return {
      success: true,
      settings: JSON.parse(JSON.stringify(settings)),
    }
  } catch (error: unknown) {
    console.error("Failed to save admin settings:", error)

    return {
      success: false,
      message: "Unable to save settings.",
    }
  }
}