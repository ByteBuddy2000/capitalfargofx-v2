// app/admin/controllers/security.actions.ts
"use server"

import bcrypt from "bcryptjs"
import { z } from "zod"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export type ChangePasswordResponse = {
  success: boolean
  message: string
}

export async function changeAdminPassword(
  data: unknown
): Promise<ChangePasswordResponse> {
  try {
    const session = await getServerSession(authOptions)
    const admin = session?.user

    if (!admin?.id) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    if (admin.role !== "admin" && admin.role !== "super admin") {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    const validatedData = changePasswordSchema.parse(data)

    await connectToDB()

    const user = await User.findById(admin.id).select("+passwordHash").exec()

    if (!user) {
      return {
        success: false,
        message: "Administrator account not found.",
      }
    }

    const currentPasswordMatches = await bcrypt.compare(
      validatedData.currentPassword,
      user.passwordHash
    )

    if (!currentPasswordMatches) {
      return {
        success: false,
        message: "Current password is incorrect.",
      }
    }

    user.passwordHash = await bcrypt.hash(validatedData.newPassword, 12)

    await user.save()

    return {
      success: true,
      message: "Password updated successfully.",
    }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message || "Invalid password payload.",
      }
    }

    console.error("Failed to update admin password:", error)

    return {
      success: false,
      message: "Unable to update password.",
    }
  }
}
