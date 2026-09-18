import React, { useState } from "react"
import { ArrowUpFromLine, Search } from "lucide-react"
import { User, Withdrawal } from "@/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { updateAdminWithdrawal } from "../controllers/withdrawal.action"

interface AdminWithdrawalsProps {
  currentUser: User
  initialWithdrawals?: Withdrawal[]
}

export const AdminWithdrawals: React.FC<AdminWithdrawalsProps> = ({
  initialWithdrawals = [],
}) => {
  const [filter, setFilter] = useState<
    "PENDING" | "ALL" | "COMPLETED" | "REJECTED"
  >("PENDING")
  const [searchTerm, setSearchTerm] = useState("")

  // Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [targetWithdrawal, setTargetWithdrawal] = useState<Withdrawal | null>(
    null
  )

  const [broadcastTxHash, setBroadcastTxHash] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [allWithdrawals, setAllWithdrawals] =
    useState<Withdrawal[]>(initialWithdrawals)

  const { success, error: toastError } = useToast()

  const filtered = allWithdrawals.filter((w) => {
    if (filter !== "ALL" && w.status !== filter) return false
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      const matchUser =
        w.userFullName.toLowerCase().includes(q) ||
        w.userId.toLowerCase().includes(q)
      const matchDest = w.destinationAddress.toLowerCase().includes(q)
      if (!matchUser && !matchDest) return false
    }
    return true
  })

  const handleOpenApprove = (w: Withdrawal) => {
    setTargetWithdrawal(w)
    const broadcastId = `0x${w.id}_broadcast`
    setBroadcastTxHash(broadcastId)
    setApproveModalOpen(true)
  }

  const handleConfirmApprove = async () => {
    if (!targetWithdrawal) return
    try {
      const result = await updateAdminWithdrawal(targetWithdrawal.id, {
        status: "COMPLETED",
        txHash: broadcastTxHash,
        adminNotes: "Approved by admin console and broadcasted.",
      })
      if (!result.success) {
        throw new Error(result.message || "Unable to process withdrawal.")
      }
      setAllWithdrawals((withdrawals) =>
        withdrawals.map((item) =>
          item.id === targetWithdrawal.id
            ? { ...item, status: "COMPLETED", txHash: broadcastTxHash }
            : item
        )
      )
      success(
        "Withdrawal Dispatched",
        `$${targetWithdrawal.amount.toLocaleString()} broadcast to blockchain network!`
      )
      setApproveModalOpen(false)
    } catch (error) {
      toastError(
        "Approval Error",
        error instanceof Error ? error.message : "Unable to process withdrawal."
      )
    }
  }

  const handleOpenReject = (w: Withdrawal) => {
    setTargetWithdrawal(w)
    setRejectReason("Invalid or blacklisted wallet address. Balance restored.")
    setRejectModalOpen(true)
  }

  const handleConfirmReject = async () => {
    if (!targetWithdrawal) return
    try {
      const result = await updateAdminWithdrawal(targetWithdrawal.id, {
        status: "REJECTED",
        adminNotes: rejectReason,
      })
      if (!result.success) {
        throw new Error(result.message || "Unable to reject withdrawal.")
      }
      setAllWithdrawals((withdrawals) =>
        withdrawals.map((item) =>
          item.id === targetWithdrawal.id
            ? { ...item, status: "REJECTED" }
            : item
        )
      )
      success(
        "Withdrawal Rejected & Refunded",
        `$${targetWithdrawal.amount.toLocaleString()} refunded to user available balance.`
      )
      setRejectModalOpen(false)
    } catch (error) {
      toastError(
        "Error",
        error instanceof Error ? error.message : "Unable to reject withdrawal."
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <ArrowUpFromLine className="h-6 w-6 text-amber-400" />
            Withdrawal Execution Queue
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Authorize outbound cryptocurrency liquidations and broadcast network
            transaction hashes.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          {(["PENDING", "ALL", "COMPLETED", "REJECTED"] as const).map((tab) => (
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
                ? allWithdrawals.length
                : allWithdrawals.filter((w) => w.status === tab).length}
              )
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Investor or destination wallet address..."
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
            No withdrawals found in this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="py-3.5 pl-6">Investor</th>
                  <th className="py-3.5">Amount (USD)</th>
                  <th className="py-3.5">Asset</th>
                  <th className="py-3.5">Destination Address</th>
                  <th className="py-3.5">Broadcast Hash</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5">Requested</th>
                  <th className="py-3.5 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((w) => (
                  <tr
                    key={w.id}
                    className="transition-colors hover:bg-slate-800/50"
                  >
                    <td className="py-4 pl-6">
                      <span className="block font-bold text-white">
                        {w.userFullName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {w.userEmail}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-sm font-black text-amber-400">
                      $
                      {(w?.amount || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 font-bold text-white">
                      {w.cryptoCurrency} ({w.network})
                    </td>
                    <td className="max-w-xs py-4 font-mono text-[11px] break-all text-slate-300">
                      {w.destinationAddress}
                    </td>
                    <td className="max-w-40 truncate py-4 font-mono text-[11px] text-emerald-400">
                      {w.transactionHash || "—"}
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          w.status === "COMPLETED"
                            ? "success"
                            : w.status === "PENDING"
                              ? "warning"
                              : "danger"
                        }
                      >
                        {w.status}
                      </Badge>
                    </td>
                    <td className="py-4 font-mono text-[11px] text-slate-400">
                      {new Date(w.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 pr-6 text-right">
                      {w.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenApprove(w)}
                            className="bg-amber-600 text-xs font-bold text-slate-950 hover:bg-amber-700"
                          >
                            Dispatch
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenReject(w)}
                            className="border-rose-800 bg-rose-950/40 text-xs text-rose-300 hover:bg-rose-900"
                          >
                            Reject & Refund
                          </Button>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-slate-500">
                          Settled
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

      {/* Approve Modal */}
      {targetWithdrawal && (
        <Modal
          isOpen={approveModalOpen}
          onClose={() => setApproveModalOpen(false)}
          title="Broadcast & Finalize Withdrawal"
          description={`Dispatching $${(targetWithdrawal?.amount || 0).toLocaleString()} ${targetWithdrawal.cryptoCurrency} to ${targetWithdrawal.destinationAddress}.`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <Input
              label="Blockchain Broadcast TXID Hash"
              placeholder="e.g. 0x8a72b..."
              value={broadcastTxHash}
              onChange={(e) => setBroadcastTxHash(e.target.value)}
              helperText="Enter the network transaction ID after broadcasting the transfer."
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setApproveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmApprove}
                className="bg-amber-600 font-bold hover:bg-amber-700"
              >
                Confirm Broadcast
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {targetWithdrawal && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Withdrawal & Refund Balance"
          description={`Rejecting will immediately refund $${(targetWithdrawal?.amount || 0).toLocaleString()} back to ${targetWithdrawal.userFullName}'s Available Balance.`}
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
                Reject & Restore Balance
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
