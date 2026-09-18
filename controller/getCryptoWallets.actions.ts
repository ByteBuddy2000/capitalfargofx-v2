"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { CryptoWallet } from "@/models/CryptoWallet"

export async function getCryptoWallets() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { success: false, wallets: [] }
  }

  try {
    await connectToDB()
    const wallets = await CryptoWallet.find({ isActive: true })
      .sort({ symbol: 1 })
      .lean()

    return {
      success: true,
      wallets: JSON.parse(JSON.stringify(wallets)),
    }
  } catch (error) {
    console.error("Failed to load crypto wallets:", error)
    return { success: false, wallets: [] }
  }
}
