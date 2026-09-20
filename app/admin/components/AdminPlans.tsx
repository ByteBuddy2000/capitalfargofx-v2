// AdminPlans.tsx
"use client"
import React, { useState } from "react"
import { Layers, Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { InvestmentPlan, User } from "@/types"
import { useToast } from "@/components/ui/Toast"
import {
  deleteAdminPlan,
  saveAdminPlan,
} from "../controllers/plans.action"

interface AdminPlansProps {
  currentUser: User
  initialPlans?: InvestmentPlan[]
}

const normalizePlan = (value: unknown): InvestmentPlan => {
  const record: Record<string, unknown> =
    value && typeof value === "object" ? Object(value) : {}

  const normalizedPlan: InvestmentPlan = {
    id: String(record.id || record._id || ""),
    name: String(record.name || ""),
    slug: String(record.slug || ""),
    description: String(record.description || ""),
    minimumAmount: Number(record.minimumAmount || 0),
    maximumAmount: Number(record.maximumAmount || 0),
    returnPercentage: Number(record.returnPercentage || 0),
    durationHours: Number(record.durationHours || 0),
    referralPercentage: Number(record.referralPercentage || 0),
    referralCommissionRate: Number(
      record.referralCommissionRate || record.referralPercentage || 0
    ),
    principalReturn: Boolean(record.principalReturn),
    isActive:
      typeof record.isActive === "boolean"
        ? record.isActive
        : record.status === "ACTIVE",
    status: record.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    featured: Boolean(record.featured),
    createdAt: String(record.createdAt || new Date().toISOString()),
    updatedAt: String(record.updatedAt || new Date().toISOString()),
  }

  return normalizedPlan
}

export const AdminPlans: React.FC<AdminPlansProps> = ({
  initialPlans = [],
}) => {
  const [plans, setPlans] = useState<InvestmentPlan[]>(
    initialPlans.map(normalizePlan)
  )
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null)

  const { success, error: toastError } = useToast()

  const handleOpenEdit = (plan: InvestmentPlan) => {
    setEditingPlan({ ...plan })
    setEditModalOpen(true)
  }

  const handleOpenCreate = () => {
    const newPlan: InvestmentPlan = {
      id: "",
      name: "Diamond VIP Tier",
      slug: "diamond-tier",
      description:
        "Exclusive institutional high-frequency liquidity cycle for VIP portfolios.",
      returnPercentage: 75,
      durationHours: 48,
      minimumAmount: 25000,
      maximumAmount: 100000,
      referralCommissionRate: 5,
      principalReturn: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setEditingPlan(newPlan)
    setEditModalOpen(true)
  }

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPlan) return

    void saveAdminPlan(editingPlan)
      .then((savedPlan) => {
        if (!savedPlan.success || !savedPlan.plan) {
          toastError(
            "Plan Save Failed",
            savedPlan.message || "Unable to save plan."
          )
          return
        }
        const saved = normalizePlan(savedPlan.plan)
        setPlans((current) => {
          const exists = current.some((plan) => plan.id === saved.id)
          return exists
            ? current.map((plan) => (plan.id === saved.id ? saved : plan))
            : [...current, saved]
        })
        success("Plan Configuration Saved", `${saved.name} is now updated.`)
        setEditModalOpen(false)
        setEditingPlan(null)
      })
      .catch((error) => {
        toastError(
          "Plan Save Failed",
          error instanceof Error ? error.message : "Unable to save plan."
        )
      })
  }

  const handleDeletePlan = async (plan: InvestmentPlan) => {
    if (!plan.id || !window.confirm(`Delete ${plan.name}?`)) return

    try {
      const result = await deleteAdminPlan(plan.id)
      if (!result.success) {
        toastError("Plan Delete Failed", result.message || "Unable to delete plan.")
        return
      }

      setPlans((current) => current.filter((item) => item.id !== plan.id))
      success("Plan Deleted", `${plan.name} was deleted.`)
    } catch (error) {
      toastError(
        "Plan Delete Failed",
        error instanceof Error ? error.message : "Unable to delete plan."
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <Layers className="h-6 w-6 text-blue-400" />
            Structured Investment Plans
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Configure ROI yield multipliers, lock durations, minimum/maximum
            thresholds, and contract rules.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="h-4 w-4" />}
          className="bg-blue-600 font-bold text-white hover:bg-blue-700"
        >
          Create New Plan Tier
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm"
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-black text-white">{plan.name}</h3>
                <Badge variant={plan.isActive ? "success" : "neutral"}>
                  {plan.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>

              <div className="mb-2 font-mono text-3xl font-black text-emerald-400">
                +{plan.returnPercentage}% ROI
              </div>

              <p className="mb-6 text-xs leading-relaxed text-slate-400">
                {plan.description}
              </p>

              <div className="mb-6 space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lock Duration:</span>
                  <span className="font-bold text-white">
                    {plan.durationHours} Hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Min Investment:</span>
                  <span className="font-bold text-emerald-400">
                    ${(plan?.minimumAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Investment:</span>
                  <span className="font-bold text-slate-300">
                    {(plan?.maximumAmount || 0) > 0
                      ? `$${(plan?.maximumAmount || 0).toLocaleString()}`
                      : "Unlimited"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Referral Commission:</span>
                  <span className="font-bold text-purple-400">
                    {plan.referralCommissionRate}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleOpenEdit(plan)}
                leftIcon={<Edit2 className="h-4 w-4" />}
                className="flex-1 justify-center border-slate-700 bg-slate-900 font-bold text-slate-200 hover:bg-slate-700"
              >
                Update Plan
              </Button>
              <Button
                onClick={() => handleDeletePlan(plan)}
                aria-label={`Delete ${plan.name}`}
                className="bg-red-600 px-3 text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit ${editingPlan.name}`}
          description="Update yield percentages, duration parameters, and limits for this plan."
          maxWidth="lg"
        >
          <form onSubmit={handleSavePlan} className="space-y-4">
            <Input
              label="Plan Name"
              value={editingPlan.name}
              onChange={(e) =>
                setEditingPlan({ ...editingPlan, name: e.target.value })
              }
              required
            />

            <div>
              <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                Plan Description
              </label>
              <textarea
                rows={2}
                value={editingPlan.description}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Return Percentage (%)"
                type="number"
                min={1}
                max={500}
                value={editingPlan.returnPercentage}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    returnPercentage: Number(e.target.value),
                  })
                }
                required
              />

              <Input
                label="Duration (Hours)"
                type="number"
                min={1}
                max={720}
                value={editingPlan.durationHours}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    durationHours: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Minimum Amount ($)"
                type="number"
                min={10}
                value={editingPlan.minimumAmount}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    minimumAmount: Number(e.target.value),
                  })
                }
                required
              />

              <Input
                label="Maximum Amount ($ - 0 for Unlimited)"
                type="number"
                min={0}
                value={editingPlan.maximumAmount}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    maximumAmount: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={editingPlan.isActive}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      isActive: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Plan Is Active & Visible</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={editingPlan.principalReturn}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      principalReturn: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Principal Capital Returned at Maturity</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditModalOpen(false)
                  setEditingPlan(null)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="bg-blue-600 font-bold hover:bg-blue-700"
              >
                Update Plan
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
