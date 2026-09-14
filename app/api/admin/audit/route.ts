import { NextResponse } from "next/server"
import { authErrorStatus, requireAdmin } from "@/lib/auth"
import { connectToDB } from "@/lib/connectToDB"
import { AuditLog } from "@/models/AuditLog"

export async function GET() {
  try {
    await requireAdmin()
    await connectToDB()
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(500).lean()
    return NextResponse.json({ logs })
  } catch (error: unknown) {
    const status = authErrorStatus(error)
    return NextResponse.json({ message: status ? "Administrator access required." : "Unable to load audit logs." }, { status: status || 500 })
  }
}
