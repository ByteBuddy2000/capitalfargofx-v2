// app/api/admin/change-password/route.ts
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authErrorStatus, requireAdmin } from "@/lib/auth"
import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    const data = changePasswordSchema.parse(await request.json())

    await connectToDB()
    const user = await User.findById(admin.id).select("+passwordHash").exec()

    if (!user) {
      return NextResponse.json(
        { message: "Administrator account not found." },
        { status: 404 }
      )
    }

    const currentPasswordMatches = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash
    )

    if (!currentPasswordMatches) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 400 }
      )
    }

    user.passwordHash = await bcrypt.hash(data.newPassword, 12)
    await user.save()

    return NextResponse.json({ message: "Password updated successfully." })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid password payload." },
        { status: 400 }
      )
    }

    const status = authErrorStatus(error)
    return NextResponse.json(
      {
        message: status
          ? "Administrator access required."
          : "Unable to update password.",
      },
      { status: status || 500 }
    )
  }
}
