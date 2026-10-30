"use server"

import { getServerSession } from "next-auth"
import { Deposit, type DepositAsset } from "@/models/Deposit"
import mongoose from "mongoose"
import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"

export interface AssetAllocationData {
  userId: string
  assets: Record<
    DepositAsset,
    {
      total: number
      cryptoTotal: number
      count: number
    }
  >
  totalApprovedDeposits: number
}

const EMPTY_ASSETS: AssetAllocationData["assets"] = {
  BTC: { total: 0, cryptoTotal: 0, count: 0 },
  ETH: { total: 0, cryptoTotal: 0, count: 0 },
  USDT: { total: 0, cryptoTotal: 0, count: 0 },
}

/**
 * Retrieves the authenticated user's approved deposit totals.
 */
export async function getUserAssetAllocation(): Promise<AssetAllocationData> {
  const session = await getServerSession(authOptions)

  const sessionUserId = (
    session?.user as { id?: string; _id?: string } | undefined
  )?.id ?? (
    session?.user as { _id?: string } | undefined
  )?._id

  if (!sessionUserId || !mongoose.isValidObjectId(sessionUserId)) {
    throw new Error("Unauthorized: authenticated user session required.")
  }

  await connectToDB()

  const userId = new mongoose.Types.ObjectId(sessionUserId)

  const [results] = await Deposit.aggregate<{
    assets: Array<{
      _id: DepositAsset
      total: number
      cryptoTotal: number
      count: number
    }>
    totalApprovedDeposits: Array<{ count: number }>
  }>([
    {
      $match: {
        userId,
        status: "APPROVED",
      },
    },
    {
      $facet: {
        assets: [
          {
            $group: {
              _id: "$asset",
              total: { $sum: "$amount" },
              cryptoTotal: { $sum: { $ifNull: ["$cryptoAmount", 0] } },
              count: { $sum: 1 },
            },
          },
        ],
        totalApprovedDeposits: [{ $count: "count" }],
      },
    },
  ])

  const assets = { ...EMPTY_ASSETS }

  for (const item of results?.assets ?? []) {
    assets[item._id] = {
      total: item.total,
      cryptoTotal: item.cryptoTotal,
      count: item.count,
    }
  }

  return {
    userId: sessionUserId,
    assets,
    totalApprovedDeposits:
      results?.totalApprovedDeposits?.[0]?.count ?? 0,
  }
}