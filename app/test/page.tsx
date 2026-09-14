import React from "react"

import { connectToDB } from "@/lib/connectToDB"
import SeedUser from "./SeedUser"

export default async function Page() {
  let dbStatus = "Checking database connection..."
  let dbMessage = ""

  try {
    await connectToDB()
    dbStatus = "Database connection successful"
    dbMessage = "MongoDB is reachable and ready for registrations."
  } catch (error) {
    dbStatus = "Database connection failed"
    dbMessage =
      error instanceof Error ? error.message : "Unknown MongoDB connection error."
  }

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h1 className="text-lg font-bold text-slate-900">Database Test</h1>
        <p className="mt-2 text-sm font-semibold text-slate-700">{dbStatus}</p>
        <p className="mt-1 text-xs text-slate-500">{dbMessage}</p>
      </div>

      <SeedUser />
    </div>
  )
}
