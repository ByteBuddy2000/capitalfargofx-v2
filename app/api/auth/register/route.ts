import { NextResponse } from "next/server"

import { registerUserAction } from "@/app/actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await registerUserAction(body)

    if (!result.success) {
      return NextResponse.json({ message: result.error }, { status: 400 })
    }

    return NextResponse.json({ user: result.data.user }, { status: 201 })
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json(
      { message: "Invalid registration payload." },
      { status: 400 }
    )
  }
}
