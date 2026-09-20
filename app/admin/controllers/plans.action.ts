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

export type DeletePlanResponse = {
  success: boolean
  message?: string
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

    const plans = await Plan.find({})
      .sort({ minimumAmount: 1 })
      .lean()

    return {
      success: true,
      plans: JSON.parse(JSON.stringify(plans)),
    }
  } catch (error) {
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

    let slug = String(body.slug || "")
      .trim()
      .toLowerCase()

    /**
     * Auto-generate slug from plan name
     * Examples:
     * Level 1 Plan -> level-1
     * Level 6 Plan -> level-6
     * Diamond VIP Tier -> diamond-vip-tier
     */
    if (!slug && name) {
      const match = name.match(/level\s*(\d+)/i)

      if (match) {
        slug = `level-${match[1]}`
      } else {
        slug = name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      }
    }

    const description = String(body.description || "")

    const returnPercentage = Number(body.returnPercentage)
    const durationHours = Number(body.durationHours)
    const minimumAmount = Number(body.minimumAmount)
    const maximumAmount = Number(body.maximumAmount || 0)

    const referralPercentage = Number(
      body.referralPercentage ??
      body.referralCommissionRate ??
      0
    )

    const principalReturn = Boolean(body.principalReturn)

    const status =
      body.isActive === false ||
      body.status === "INACTIVE"
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

    /**
     * Prevent duplicate slugs.
     * Ignore the current plan when editing.
     */
    const existingPlan = await Plan.findOne({
      slug,
      ...(id && mongoose.isValidObjectId(id)
        ? { _id: { $ne: id } }
        : {}),
    }).lean()

    if (existingPlan) {
      return {
        success: false,
        message: `A plan with slug "${slug}" already exists.`,
      }
    }

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

    let plan

    if (id && mongoose.isValidObjectId(id)) {
      plan = await Plan.findByIdAndUpdate(
        id,
        values,
        {
          new: true,
          runValidators: true,
        }
      ).lean()
    } else {
      plan = await Plan.create(values)
    }

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
  } catch (error) {
    console.error("Failed to save admin plan:", error)

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to save plan.",
    }
  }
}

export async function deleteAdminPlan(
  planId: string
): Promise<DeletePlanResponse> {
  try {
    const admin = await requireAdminSession()

    if (!admin) {
      return {
        success: false,
        message: "Administrator access required.",
      }
    }

    if (!mongoose.isValidObjectId(planId)) {
      return {
        success: false,
        message: "Invalid plan ID.",
      }
    }

    await connectToDB()

    const plan = await Plan.findByIdAndDelete(planId).lean()

    if (!plan) {
      return {
        success: false,
        message: "Plan not found.",
      }
    }

    return {
      success: true,
      message: "Plan deleted successfully.",
    }
  } catch (error) {
    console.error("Failed to delete admin plan:", error)

    return {
      success: false,
      message: "Unable to delete plan.",
    }
  }
}