// app/admin/components/AdminDeposits.tsx
"use client"
import React, { useState } from "react"
import { ArrowDownToLine, Search } from "lucide-react"
import { User, Deposit } from "@/types"
import { useToast } from "@/components/ui/Toast"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import {
  approveAdminDeposit,
  rejectAdminDeposit,
} from "../controllers/deposit.actions"

interface AdminDepositsProps {
  currentUser: User
  initialDeposits?: Deposit[]
}

export const AdminDeposits: React.FC<AdminDepositsProps> = ({
  initialDeposits = [],
}) => {
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING")
  const [searchTerm, setSearchTerm] = useState("")

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [targetDeposit, setTargetDeposit] = useState<Deposit | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [allDeposits, setAllDeposits] = useState<Deposit[]>(initialDeposits)

  const { success, error: toastError } = useToast()

  const filtered = allDeposits.filter((d) => {
    if (filter !== "ALL" && d.status !== filter) return false
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      const matchUser =
        d.userFullName.toLowerCase().includes(q) ||
        d.userId.toLowerCase().includes(q)
      const matchTx = d.txHash?.toLowerCase().includes(q) ?? false
      const matchPlan = d.planName.toLowerCase().includes(q)
      if (!matchUser && !matchTx && !matchPlan) return false
    }
    return true
  })

  const handleApprove = async (deposit: Deposit) => {
    try {
      const result = await approveAdminDeposit(deposit.id)
      if (!result.success) {
        throw new Error(result.message || "Unable to approve deposit.")
      }
      setAllDeposits((deposits) =>
        deposits.map((item) =>
          item.id === deposit.id ? { ...item, status: "APPROVED" } : item
        )
      )
      success(
        "Deposit Approved",
        `$${deposit.amount.toLocaleString()} funded into ${deposit.planName || "investment"} plan!`
      )
    } catch (error) {
      toastError(
        "Approval Error",
        error instanceof Error ? error.message : "Unable to approve deposit."
      )
    }
  }

  const handleOpenReject = (deposit: Deposit) => {
    setTargetDeposit(deposit)
    setRejectReason(
      "Unconfirmed blockchain transaction hash or payment mismatch."
    )
    setRejectModalOpen(true)
  }

  const handleConfirmReject = async () => {
    if (!targetDeposit) return
    try {
      const result = await rejectAdminDeposit(targetDeposit.id, {
        reason: rejectReason,
      })
      if (!result.success) {
        throw new Error(result.message || "Unable to reject deposit.")
      }
      success(
        "Deposit Rejected",
        `Deposit #${targetDeposit.id.substring(0, 10)} marked as rejected.`
      )
      setRejectModalOpen(false)
      setAllDeposits((deposits) =>
        deposits.map((item) =>
          item.id === targetDeposit.id ? { ...item, status: "REJECTED" } : item
        )
      )
    } catch (error) {
      toastError(
        "Error",
        error instanceof Error ? error.message : "Unable to reject deposit."
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <ArrowDownToLine className="h-6 w-6 text-emerald-400" />
            Deposit Verification Queue
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Review submitted blockchain transaction hashes, approve capital
            deposits, and deploy yield contracts.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          {(["PENDING", "ALL", "APPROVED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                filter === tab
                  ? "bg-amber-500 font-black text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              {tab} (
              {tab === "ALL"
                ? allDeposits.length
                : allDeposits.filter((d) => d.status === tab).length}
              )
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Investor name, plan, or TXID hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pr-4 pl-9 text-xs font-medium text-white focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No deposits found in this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="py-3.5 pl-6">Investor</th>
                  <th className="py-3.5">Plan & Amount</th>
                  <th className="py-3.5">Crypto & Network</th>
                  <th className="py-3.5">Transaction Hash (TXID)</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5">Submitted</th>
                  <th className="py-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((d) => (
                  <tr
                    key={d.id}
                    className="transition-colors hover:bg-slate-800/50"
                  >
                    <td className="py-4 pl-6">
                      <span className="block font-bold text-white">
                        {d.userFullName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {d.userEmail}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="block font-mono text-sm font-black text-emerald-400">
                        ${(d?.amount || 0).toLocaleString()}
                      </span>
                      <span className="block text-[10px] font-semibold text-slate-400">
                        {d.planName} Plan
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-white">{d.asset}</span>
                      <span className="block text-[10px] text-slate-400">
                        {d.network}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="block max-w-xs font-mono text-[11px] break-all text-amber-300 select-all">
                        {d.txHash}
                      </span>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          d.status === "APPROVED"
                            ? "success"
                            : d.status === "PENDING"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-4 font-mono text-[11px] text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString()}{" "}
                      {new Date(d.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      {d.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleApprove(d)}
                            className="bg-emerald-600 text-xs font-bold hover:bg-emerald-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenReject(d)}
                            className="border-rose-800 bg-rose-950/40 text-xs text-rose-300 hover:bg-rose-900"
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-slate-500">
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {targetDeposit && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Deposit Request"
          description={`Reject deposit of $${(targetDeposit?.amount || 0).toLocaleString()} for ${targetDeposit.userFullName}.`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                Reason for Rejection
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-900 focus:border-rose-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setRejectModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmReject}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
