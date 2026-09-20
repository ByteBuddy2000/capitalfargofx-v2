// app/api/verify/resend/route.ts
import { NextRequest, NextResponse } from "next/server"

import { connectToDB } from "@/lib/connectToDB"
import { User } from "@/models/User"
import { generateVerificationToken } from "@/lib/token"
import { transporter } from "@/lib/mail"

const BASE_URL =  process.env.NEXTAUTH_URL || "http://localhost:3000"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      )
    }

    await connectToDB()

    const user = await User.findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      )
    }

    if (user.status === "ACTIVE") {
      return NextResponse.json(
        { message: "Email already verified." },
        { status: 400 }
      )
    }

    const token = generateVerificationToken()

    user.emailVerificationToken = token
    user.emailVerificationExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    )

    await user.save()

    const verifyURL = `${BASE_URL}/api/verify?token=${token}`

    await transporter.sendMail({
      from: `"CapitalsFargoFX" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your CapitalsFargoFX Account",
      html: `
        <h2>Email Verification</h2>

        <p>Hello ${user.fullName},</p>

        <p>
          Click the link below to verify your account:
        </p>

        <p>
          <a href="${verifyURL}">
            Verify Email
          </a>
        </p>

        <p>
          This link expires in 24 hours.
        </p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully.",
    })
  } catch (error) {
    console.error("Resend verification error:", error)

    return NextResponse.json(
      {
        message:
          "Unable to resend verification email. Please try again later.",
      },
      { status: 500 }
    )
  }
}