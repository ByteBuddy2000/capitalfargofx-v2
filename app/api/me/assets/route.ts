// app/api/me/assets/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Asset } from "@/models/Asset"

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    )
  }

  try {
    await connectToDB()
    const assets = await Asset.find({ userId }).sort({ symbol: 1 }).lean()
    return NextResponse.json({ assets })
  } catch (error: unknown) {
    console.error("Failed to load user assets:", error)
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    )
  }
}
