import { NextRequest, NextResponse } from "next/server"
import { authErrorStatus, requireAdmin } from "@/lib/auth"
import { connectToDB } from "@/lib/connectToDB"
import { CryptoWallet } from "@/models/CryptoWallet"
import { INITIAL_WALLETS } from "@/lib/storage"

export async function GET() {
  try {
    await requireAdmin()
    await connectToDB()
    let wallets = await CryptoWallet.find({}).sort({ symbol: 1 }).lean()
    if (wallets.length === 0) {
      await CryptoWallet.insertMany(INITIAL_WALLETS)
      wallets = await CryptoWallet.find({}).sort({ symbol: 1 }).lean()
    }
    return NextResponse.json({ wallets })
  } catch (error: unknown) {
    const status = authErrorStatus(error)
    return NextResponse.json({ message: status ? "Administrator access required." : "Unable to load wallets." }, { status: status || 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    await connectToDB()
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""
    const values = {
      asset: String(body.asset || body.symbol || ""),
      name: String(body.name || "").trim(),
      symbol: String(body.symbol || "").trim(),
      network: String(body.network || "").trim(),
      address: String(body.address || "").trim(),
      qrCodeUrl: String(body.qrCodeUrl || ""),
      minDeposit: Number(body.minDeposit || 0),
      depositFee: String(body.depositFee || "0.00%"),
      isActive: body.isActive !== false && body.active !== false,
    }
    if (!values.name || !values.symbol || !values.network || !values.address) return NextResponse.json({ message: "Valid wallet values are required." }, { status: 400 })
    const wallet = id ? await CryptoWallet.findByIdAndUpdate(id, values, { new: true, runValidators: true }).lean() : await CryptoWallet.create(values)
    return NextResponse.json({ wallet })
  } catch (error: unknown) {
    const status = authErrorStatus(error)
    return NextResponse.json({ message: status ? "Administrator access required." : "Unable to save wallet." }, { status: status || 500 })
  }
}
