// app/admin/controllers/wallets.actions.ts
"use server"

import mongoose from "mongoose"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { CryptoWallet } from "@/models/CryptoWallet"
import { Asset, ASSET_SYMBOLS } from "@/models/Asset"

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

export type AssetResponse = {
  success: boolean
  message?: string
  asset?: Record<string, unknown>
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

  if (!admin?.id || (admin.role !== "admin" && admin.role !== "super admin")) {
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

    const wallets = await CryptoWallet.find({}).sort({ symbol: 1 }).lean()

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

    await connectToDB()

    const existingWallet = await CryptoWallet.findOne({
      symbol: values.symbol,
      _id: { $ne: id || null },
    })

    if (existingWallet) {
      return {
        success: false,
        message: `${values.symbol} wallet already exists.`,
      }
    }

    if (!values.name || !values.symbol || !values.network || !values.address) {
      return {
        success: false,
        message: "Valid wallet values are required.",
      }
    }

    if (!Number.isFinite(values.minDeposit) || values.minDeposit < 0) {
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

export async function createAsset(data: {
  userId: string
  symbol: string
  walletAddress?: string
}): Promise<AssetResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    await connectToDB()

    if (!mongoose.isValidObjectId(data.userId)) {
      return {
        success: false,
        message: "Invalid user.",
      }
    }

    const symbol = String(data.symbol).toUpperCase()

    if (!ASSET_SYMBOLS.includes(symbol as never)) {
      return {
        success: false,
        message: "Invalid asset symbol.",
      }
    }

    const existingAsset = await Asset.findOne({
      userId: data.userId,
      symbol,
    })

    if (existingAsset) {
      return {
        success: false,
        message: `${symbol} asset already exists.`,
      }
    }

    const asset = await Asset.create({
      userId: data.userId,
      symbol,
      walletAddress: data.walletAddress || "",
      availableBalance: 0,
      lockedBalance: 0,
    })

    return {
      success: true,
      asset: JSON.parse(JSON.stringify(asset)),
    }
  } catch (error) {
    console.error("Failed to create asset:", error)

    return {
      success: false,
      message: "Unable to create asset.",
    }
  }
}

export async function updateAsset(
  assetId: string,
  updates: {
    walletAddress?: string
  }
): Promise<AssetResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    await connectToDB()

    if (!mongoose.isValidObjectId(assetId)) {
      return {
        success: false,
        message: "Invalid asset ID.",
      }
    }

    const asset = await Asset.findByIdAndUpdate(
      assetId,
      {
        ...(updates.walletAddress !== undefined && {
          walletAddress: updates.walletAddress.trim(),
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean()

    if (!asset) {
      return {
        success: false,
        message: "Asset not found.",
      }
    }

    return {
      success: true,
      asset: JSON.parse(JSON.stringify(asset)),
    }
  } catch (error) {
    console.error("Failed to update asset:", error)

    return {
      success: false,
      message: "Unable to update asset.",
    }
  }
}

export async function deleteAsset(assetId: string): Promise<AssetResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    await connectToDB()

    if (!mongoose.isValidObjectId(assetId)) {
      return {
        success: false,
        message: "Invalid asset ID.",
      }
    }

    const asset = await Asset.findByIdAndDelete(assetId).lean()

    if (!asset) {
      return {
        success: false,
        message: "Asset not found.",
      }
    }

    return {
      success: true,
      asset: JSON.parse(JSON.stringify(asset)),
      message: "Asset deleted successfully.",
    }
  } catch (error) {
    console.error("Failed to delete asset:", error)

    return {
      success: false,
      message: "Unable to delete asset.",
    }
  }
}

export async function deleteAdminWallet(
  walletId: string
): Promise<SaveWalletResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    if (!mongoose.isValidObjectId(walletId)) {
      return {
        success: false,
        message: "Invalid wallet ID.",
      }
    }

    await connectToDB()

    const wallet = await CryptoWallet.findByIdAndDelete(walletId).lean()

    if (!wallet) {
      return {
        success: false,
        message: "Wallet not found.",
      }
    }

    return {
      success: true,
      wallet: JSON.parse(JSON.stringify(wallet)),
      message: "Wallet deleted successfully.",
    }
  } catch (error) {
    console.error("Failed to delete admin wallet:", error)

    return {
      success: false,
      message: "Unable to delete wallet.",
    }
  }
}
