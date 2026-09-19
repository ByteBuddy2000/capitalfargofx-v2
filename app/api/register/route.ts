// app/api/register/route.ts
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { connectToDB } from "@/lib/connectToDB"
import { ASSET_SYMBOLS, Asset } from "@/models/Asset"
import { Referral } from "@/models/Referral"
import { User } from "@/models/User"
import { generateVerificationToken } from '@/lib/token';
import { transporter } from '@/lib/mail';

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"


const BTC_ADDRESS_REGEX =
  /^(?:[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1q[a-z0-9]{38,59}|bc1p[a-z0-9]{58})$/
const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
const TRC20_ADDRESS_REGEX = /^T[1-9A-HJ-NP-Za-km-z]{33}$/

const validateBtcAddress = (address: string): boolean =>
  BTC_ADDRESS_REGEX.test(address.trim())

const validateEthAddress = (address: string): boolean =>
  ETH_ADDRESS_REGEX.test(address.trim())

const validateUsdtAddress = (address: string): boolean => {
  const value = address.trim()
  return ETH_ADDRESS_REGEX.test(value) || TRC20_ADDRESS_REGEX.test(value)
}

const registrationSchema = z.object({
  fullName: z.string().trim().min(1),
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_]{3,30}$/),
  email: z.string().trim().email(),
  password: z.string().min(6),
  btcWallet: z.string().trim().optional().default(""),
  ethWallet: z.string().trim().optional().default(""),
  usdtWallet: z.string().trim().optional().default(""),
  referralCode: z.string().trim().optional().default(""),
  role: z.enum(["user", "admin", "super admin"]).optional().default("user"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = registrationSchema.parse(body)

    await connectToDB()

    const normalizedUsername = data.username.toLowerCase()
    const normalizedEmail = data.email.toLowerCase()
    const normalizedWallets = {
      BTC: data.btcWallet,
      ETH: data.ethWallet,
      USDT: data.usdtWallet,
    }

    if (normalizedWallets.BTC && !validateBtcAddress(normalizedWallets.BTC)) {
      return NextResponse.json(
        {
          message:
            "Invalid Bitcoin address. Use a valid BTC Legacy, SegWit, or Taproot address.",
        },
        { status: 400 }
      )
    }
    

    if (normalizedWallets.ETH && !validateEthAddress(normalizedWallets.ETH)) {
      return NextResponse.json(
        {
          message:
            "Invalid Ethereum address. Enter a valid 0x... Ethereum mainnet address.",
        },
        { status: 400 }
      )
    }

    if (
      normalizedWallets.USDT &&
      !validateUsdtAddress(normalizedWallets.USDT)
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid USDT address. Use a valid ERC-20 (0x...) or TRC-20 (T...) address.",
        },
        { status: 400 }
      )
    }

    const existingUser = await User.exists({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "That username or email is already registered." },
        { status: 409 }
      )
    }

    const upline = data.referralCode
      ? await User.findOne({ username: data.referralCode.toLowerCase() }).exec()
      : null

    const passwordHash = await bcrypt.hash(data.password, 12)

    const token = generateVerificationToken()
    const emailVerificationExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    )

    const createdUser = await User.create({
      fullName: data.fullName,
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      btcWallet: normalizedWallets.BTC,
      ethWallet: normalizedWallets.ETH,
      usdtWallet: normalizedWallets.USDT,
      uplineId: upline?._id || null,
      uplineUsername: upline?.username || null,
      role: data.role,
      status: "INACTIVE",
      emailVerificationToken: token,
      emailVerificationExpires,
    })

    const verifyURL = `${BASE_URL}/api/verify?token=${token}`;

    try {
      await transporter.sendMail({
        from: `"CapitalsFargoFX" <${process.env.GMAIL_USER}>`,
        to: normalizedEmail,
        subject: "Verify your email",
        html: `
          <h2>Verify your account</h2>
          <p>Click the link below:</p>
          <a href="${verifyURL}">${verifyURL}</a>
        `,
      })
    } catch (mailError) {
      await User.deleteOne({ _id: createdUser._id })
      console.error("Registration verification email failed:", mailError)
      return NextResponse.json(
        { message: "Unable to send the verification email. Please try again later." },
        { status: 503 }
      )
    }

    try {
      await Asset.insertMany(
        ASSET_SYMBOLS.map((symbol) => ({
          userId: createdUser._id,
          symbol,
          walletAddress: normalizedWallets[symbol],
        }))
      )
    } catch (assetError) {
      console.error("Asset creation failed for new user:", assetError)
      await User.deleteOne({ _id: createdUser._id })
      return NextResponse.json(
        { message: "Unable to create your account." },
        { status: 400 }
      )
    }

    if (upline) {
      await Referral.create({
        referrerId: upline._id,
        referredUserId: createdUser._id,
      })
    }

    return NextResponse.json(
      {
        user: {
          id: createdUser._id.toString(),
          fullName: createdUser.fullName,
          username: createdUser.username,
          email: createdUser.email,
          role: createdUser.role,
          status: createdUser.status,
          btcWallet: createdUser.btcWallet,
          ethWallet: createdUser.ethWallet,
          usdtWallet: createdUser.usdtWallet,
          uplineUsername: createdUser.uplineUsername,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.issues[0]?.message || "Invalid registration payload.",
        },
        { status: 400 }
      )
    }

    const message =
      error instanceof Error ? error.message : "Unknown registration error."

    console.error("Registration API error:", error)
    return NextResponse.json(
      {
        message:
          message.includes("MONGODB") || message.includes("Mongo")
            ? `Database error: ${message}`
            : "Invalid registration payload.",
      },
      {
        status:
          message.includes("MONGODB") || message.includes("Mongo") ? 500 : 400,
      }
    )
  }
}
