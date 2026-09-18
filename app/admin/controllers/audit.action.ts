// app/admin/controllers/audit.action.ts
"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { AuditLog } from "@/models/AuditLog"

export type AdminAuditLogsResponse = {
  success: boolean
  message?: string
  logs: Array<Record<string, unknown>>
}

export async function getAdminAuditLogs(): Promise<AdminAuditLogsResponse> {
  try {
    const session = await getServerSession(authOptions)
    const admin = session?.user

    if (
      !admin?.id ||
      (admin.role !== "admin" && admin.role !== "super admin")
    ) {
      return {
        success: false,
        message: "Administrator access required.",
        logs: [],
      }
    }

    await connectToDB()

    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).lean()

    return {
      success: true,
      logs: JSON.parse(JSON.stringify(logs)),
    }
  } catch (error: unknown) {
    console.error("Failed to load admin audit logs:", error)

    return {
      success: false,
      message: "Unable to load audit logs.",
      logs: [],
    }
  }
}
