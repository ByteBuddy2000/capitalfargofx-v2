// app/api/admin/plans/route.ts
import { NextRequest, NextResponse } from "next/server"
import { authErrorStatus, requireAdmin } from "@/lib/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Plan } from "@/models/Plan"
import { CURRENT_PLANS } from "@/lib/defaultPlans"

export async function GET() {
  try {
    await requireAdmin()
    await connectToDB()
    let plans = await Plan.find({}).sort({ minimumAmount: 1 }).lean()
    if (plans.length === 0) {
      await Plan.insertMany(CURRENT_PLANS, { ordered: false })
      plans = await Plan.find({}).sort({ minimumAmount: 1 }).lean()
    }
    return NextResponse.json({ plans })
  } catch (error: unknown) {
    const status = authErrorStatus(error)
    return NextResponse.json(
      {
        message: status
          ? "Administrator access required."
          : "Unable to load plans.",
      },
      { status: status || 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    await connectToDB()
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""
    const values = {
      name: String(body.name || "").trim(),
      slug: String(body.slug || body.name || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"),
      description: String(body.description || ""),
      returnPercentage: Number(body.returnPercentage),
      durationHours: Number(body.durationHours),
      minimumAmount: Number(body.minimumAmount),
      maximumAmount: Number(body.maximumAmount || 0),
      referralPercentage: Number(
        body.referralPercentage ?? body.referralCommissionRate ?? 0
      ),
      principalReturn: Boolean(body.principalReturn),
      status:
        body.isActive === false || body.status === "INACTIVE"
          ? "INACTIVE"
          : "ACTIVE",
      featured: Boolean(body.featured),
    }
    if (
      !values.name ||
      !values.slug ||
      !Number.isFinite(values.returnPercentage) ||
      !Number.isFinite(values.durationHours) ||
      !Number.isFinite(values.minimumAmount)
    ) {
      return NextResponse.json(
        { message: "Valid plan values are required." },
        { status: 400 }
      )
    }
    const plan =
      id && /^[a-f\d]{24}$/i.test(id)
        ? await Plan.findByIdAndUpdate(id, values, {
            new: true,
            runValidators: true,
          }).lean()
        : await Plan.create(values)
    if (!plan)
      return NextResponse.json({ message: "Plan not found." }, { status: 404 })
    return NextResponse.json({ plan, adminId: admin.id })
  } catch (error: unknown) {
    const status = authErrorStatus(error)
    return NextResponse.json(
      {
        message: status
          ? "Administrator access required."
          : "Unable to save plan.",
      },
      { status: status || 500 }
    )
  }
}
