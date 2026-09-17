// app/admin/controllers/wallets.actions.ts
"use server"

import mongoose from "mongoose"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { CryptoWallet } from "@/models/CryptoWallet"

export type AdminWalletsResponse = {
  success: boolean
  message?: string
  wallets: Array<Record<string, unknown>>
}

export type SaveWalletResponse = {
  success: boolean
  message?: string
  wallet?: Record<string, unknown>
}

type WalletInput = {
  id?: string
  asset?: string
  name?: string
  symbol?: string
  network?: string
  address?: string
  qrCodeUrl?: string
  minDeposit?: number | string
  depositFee?: string
  isActive?: boolean
  active?: boolean
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

export async function getAdminWallets(): Promise<AdminWalletsResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
        wallets: [],
      }
    }

    await connectToDB()

    const wallets = await CryptoWallet.find({})
      .sort({ symbol: 1 })
      .lean()

    return {
      success: true,
      wallets: JSON.parse(JSON.stringify(wallets)),
    }
  } catch (error: unknown) {
    console.error("Failed to load admin wallets:", error)

    return {
      success: false,
      message: "Unable to load wallets.",
      wallets: [],
    }
  }
}

export async function saveAdminWallet(
  data: WalletInput
): Promise<SaveWalletResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    const id = typeof data.id === "string" ? data.id : ""

    const values = {
      asset: String(data.asset || data.symbol || ""),
      name: String(data.name || "").trim(),
      symbol: String(data.symbol || "").trim(),
      network: String(data.network || "").trim(),
      address: String(data.address || "").trim(),
      qrCodeUrl: String(data.qrCodeUrl || ""),
      minDeposit: Number(data.minDeposit || 0),
      depositFee: String(data.depositFee || "0.00%"),
      isActive: data.isActive !== false && data.active !== false,
    }

    if (
      !values.name ||
      !values.symbol ||
      !values.network ||
      !values.address
    ) {
      return {
        success: false,
        message: "Valid wallet values are required.",
      }
    }

    if (
      !Number.isFinite(values.minDeposit) ||
      values.minDeposit < 0
    ) {
      return {
        success: false,
        message: "Minimum deposit must be a valid non-negative number.",
      }
    }

    await connectToDB()

    const wallet =
      id && mongoose.isValidObjectId(id)
        ? await CryptoWallet.findByIdAndUpdate(id, values, {
            new: true,
            runValidators: true,
          }).lean()
        : await CryptoWallet.create(values)

    if (!wallet) {
      return {
        success: false,
        message: "Wallet not found.",
      }
    }

    return {
      success: true,
      wallet: JSON.parse(JSON.stringify(wallet)),
    }
  } catch (error: unknown) {
    console.error("Failed to save admin wallet:", error)

    return {
      success: false,
      message: "Unable to save wallet.",
    }
  }
}