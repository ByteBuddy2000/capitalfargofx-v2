// controllers/getUserAssets.action.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Asset } from "@/models/Asset"

export async function getUserAssets() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      success: false,
      message: "Authentication required.",
      assets: [],
    }
  }

  try {
    await connectToDB()

    const assets = await Asset.find({ userId }).sort({ symbol: 1 }).lean()

    return {
      success: true,
      assets: JSON.parse(JSON.stringify(assets)),
    }
  } catch (error: unknown) {
    console.error("Failed to load user assets:", error)

    return {
      success: false,
      message: "Internal server error.",
      assets: [],
    }
  }
}
