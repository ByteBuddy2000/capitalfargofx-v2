// app/admin/controllers/plans.actions.ts
"use server"

import mongoose from "mongoose"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { connectToDB } from "@/lib/connectToDB"
import { Plan } from "@/models/Plan"

export type AdminPlansResponse = {
  success: boolean
  message?: string
  plans: Array<Record<string, unknown>>
}

export type SavePlanResponse = {
  success: boolean
  message?: string
  plan?: Record<string, unknown>
  adminId?: string
}

type PlanInput = {
  id?: string
  name?: string
  slug?: string
  description?: string
  returnPercentage?: number | string
  durationHours?: number | string
  minimumAmount?: number | string
  maximumAmount?: number | string
  referralPercentage?: number | string
  referralCommissionRate?: number | string
  principalReturn?: boolean
  isActive?: boolean
  status?: string
  featured?: boolean
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  const admin = session?.user

  if (!admin?.id || (admin.role !== "admin" && admin.role !== "super admin")) {
    return null
  }

  return admin
}

export async function getAdminPlans(): Promise<AdminPlansResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
        plans: [],
      }
    }

    await connectToDB()

    const plans = await Plan.find({}).sort({ minimumAmount: 1 }).lean()

    return {
      success: true,
      plans: JSON.parse(JSON.stringify(plans)),
    }
  } catch (error: unknown) {
    console.error("Failed to load admin plans:", error)

    return {
      success: false,
      message: "Unable to load plans.",
      plans: [],
    }
  }
}

export async function saveAdminPlan(
  body: PlanInput
): Promise<SavePlanResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    const id = typeof body.id === "string" ? body.id : ""

    const name = String(body.name || "").trim()

    const slug = String(body.slug || body.name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")

    const description = String(body.description || "")

    const returnPercentage = Number(body.returnPercentage)
    const durationHours = Number(body.durationHours)
    const minimumAmount = Number(body.minimumAmount)
    const maximumAmount = Number(body.maximumAmount || 0)

    const referralPercentage = Number(
      body.referralPercentage ?? body.referralCommissionRate ?? 0
    )

    const principalReturn = Boolean(body.principalReturn)

    const status =
      body.isActive === false || body.status === "INACTIVE"
        ? "INACTIVE"
        : "ACTIVE"

    const featured = Boolean(body.featured)

    if (
      !name ||
      !slug ||
      !Number.isFinite(returnPercentage) ||
      !Number.isFinite(durationHours) ||
      !Number.isFinite(minimumAmount)
    ) {
      return {
        success: false,
        message: "Valid plan values are required.",
      }
    }

    await connectToDB()

    const values = {
      name,
      slug,
      description,
      returnPercentage,
      durationHours,
      minimumAmount,
      maximumAmount,
      referralPercentage,
      principalReturn,
      status,
      featured,
    }

    const plan =
      id && mongoose.isValidObjectId(id)
        ? await Plan.findByIdAndUpdate(id, values, {
            new: true,
            runValidators: true,
          }).lean()
        : await Plan.create(values)

    if (!plan) {
      return {
        success: false,
        message: "Plan not found.",
      }
    }

    return {
      success: true,
      plan: JSON.parse(JSON.stringify(plan)),
      adminId: admin.id,
    }
  } catch (error: unknown) {
    console.error("Failed to save admin plan:", error)

    return {
      success: false,
      message: "Unable to save plan.",
    }
  }
}
