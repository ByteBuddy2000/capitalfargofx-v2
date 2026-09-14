import { NextRequest, NextResponse } from "next/server"
import { authErrorStatus, requireAdmin } from "@/lib/auth"
import { connectToDB } from "@/lib/connectToDB"
import { PlatformSettings } from "@/models/PlatformSettings"
import { INITIAL_SETTINGS } from "@/lib/storage"

export async function GET() {
  try {
    await requireAdmin()
    await connectToDB()
    let settings: Record<string, unknown> | null = await PlatformSettings.findOne({}).sort({ updatedAt: -1 }).lean()
    if (!settings) {
      const created = await PlatformSettings.create(INITIAL_SETTINGS)
      settings = created.toObject() as unknown as Record<string, unknown>
    }
    return NextResponse.json({ settings })
  } catch (error: unknown) {
    const status = authErrorStatus(error)
    return NextResponse.json({ message: status ? "Administrator access required." : "Unable to load settings." }, { status: status || 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    await connectToDB()
    const settings = await PlatformSettings.findOneAndUpdate({}, await request.json(), { new: true, upsert: true, runValidators: true }).lean()
    return NextResponse.json({ settings })
  } catch (error: unknown) {
    const status = authErrorStatus(error)
    return NextResponse.json({ message: status ? "Administrator access required." : "Unable to save settings." }, { status: status || 500 })
  }
}
