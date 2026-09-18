// AdminUsers.tsx
"use client"
import React, { useState } from "react"
import { Users, Search, Trash2 } from "lucide-react"
import { User, UserStatus } from "@/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Modal } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { deleteUser, updateAdminUser } from "../controllers/users.action"

interface AdminUsersProps {
  currentUser: User
  initialUsers?: User[]
}

const normalizeUser = (value: unknown): User => {
  const record: Record<string, unknown> =
    value && typeof value === "object" ? Object(value) : {}

  return {
    id: String(record.id || record._id || ""),
    fullName: String(record.fullName || ""),
    username: String(record.username || ""),
    email: String(record.email || ""),
    role:
      record.role === "admin" || record.role === "super admin"
        ? record.role
        : "user",
    status:
      record.status === "SUSPENDED" || record.status === "BANNED"
        ? record.status
        : "ACTIVE",
    btcWallet: String(record.btcWallet || ""),
    ethWallet: String(record.ethWallet || ""),
    usdtWallet: String(record.usdtWallet || ""),
    uplineId: record.uplineId ? String(record.uplineId) : null,
    uplineUsername: record.uplineUsername
      ? String(record.uplineUsername)
      : null,
    availableBalance: Number(record.availableBalance || 0),
    earningBalance: Number(record.earningBalance || 0),
    totalDeposits: Number(record.totalDeposits || 0),
    totalWithdrawals: Number(record.totalWithdrawals || 0),
    referralEarnings: Number(record.referralEarnings || 0),
    kycStatus:
      record.kycStatus === "VERIFIED" || record.kycStatus === "UNVERIFIED"
        ? record.kycStatus
        : "PENDING",
    createdAt: String(record.createdAt || ""),
    updatedAt: String(record.updatedAt || ""),
  }
}

export const AdminUsers: React.FC<AdminUsersProps> = ({
  currentUser,
  initialUsers = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  // Balance adjustment modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  const [targetUser, setTargetUser] = useState<User | null>(null)
  const [balanceType, setBalanceType] = useState<"available" | "earning">(
    "available"
  )
  const [adjustOperation, setAdjustOperation] = useState<"CREDIT" | "DEBIT">(
    "CREDIT"
  )
  const [adjustAmount, setAdjustAmount] = useState<number>(100)
  const [adjustReason, setAdjustReason] = useState(
    "Administrative ledger adjustment"
  )

  const { success, error: toastError } = useToast()

  const [allUsers, setAllUsers] = useState<User[]>(initialUsers)

  const visibleUsers = allUsers.filter((u) => {
    return u.role === "user" || u.role === "admin"
  })

  const filtered = visibleUsers.filter((u) => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    )
  })

  const handleOpenAdjust = (u: User) => {
    setTargetUser(u)
    setAdjustAmount(100)
    setAdjustReason("Manual administrative credit / correction")
    setAdjustModalOpen(true)
  }

  const handleConfirmAdjust = async () => {
    if (!targetUser) return
    try {
      const updatedUser = await updateAdminUser({
        userId: targetUser.id,
        balanceType,
        operation: adjustOperation,
        amount: Number(adjustAmount),
        reason: adjustReason,
      })
      if (!updatedUser.success || !updatedUser.user) return
      const savedUser = normalizeUser(updatedUser.user)
      setAllUsers((users) =>
        users.map((user) => (user.id === savedUser.id ? savedUser : user))
      )
      success(
        "Balance Adjusted",
        `Successfully ${adjustOperation === "CREDIT" ? "credited" : "debited"} $${adjustAmount} to ${targetUser.fullName}'s ${balanceType} balance.`
      )
      setAdjustModalOpen(false)
    } catch (error) {
      toastError(
        "Adjustment Error",
        error instanceof Error ? error.message : "Unable to adjust balance."
      )
    }
  }

  const handleToggleStatus = async (u: User, newStatus: UserStatus) => {
    try {
      const updatedUser = await updateAdminUser({
        userId: u.id,
        status: newStatus,
      })
      if (!updatedUser.success || !updatedUser.user) return
      const savedUser = normalizeUser(updatedUser.user)
      setAllUsers((users) =>
        users.map((user) => (user.id === savedUser.id ? savedUser : user))
      )
      success("Status Updated", `${u.fullName} is now ${newStatus}`)
    } catch (error) {
      toastError(
        "Status Update Error",
        error instanceof Error ? error.message : "Unable to update status."
      )
    }
  }

  const handleDeleteUser = async (u: User) => {
    if (!window.confirm(`Delete ${u.fullName} and all related records?`)) return

    try {
      const result = await deleteUser(u.id)
      if (!result.success) {
        toastError("Delete Failed", result.message || "Unable to delete user.")
        return
      }

      setAllUsers((users) => users.filter((user) => user.id !== u.id))
      success("User Deleted", `${u.fullName} and related records were deleted.`)
    } catch (error) {
      toastError(
        "Delete Failed",
        error instanceof Error ? error.message : "Unable to delete user."
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <Users className="h-6 w-6 text-blue-400" />
            Investor Accounts Directory
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Manage registered clients, perform authoritative ledger adjustments,
            and audit account access.
          </p>
        </div>
      </div>

      {/* Search Controls */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search investors by full name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pr-4 pl-9 text-xs font-medium text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Users DataTable */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-350">
            <table className="w-full table-auto text-left text-xs text-slate-300">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="px-6 py-4 whitespace-nowrap">Investor</th>
                  <th className="px-4 py-4 whitespace-nowrap">
                    Available Balance
                  </th>
                  <th className="px-4 py-4 whitespace-nowrap">
                    Locked In Plans
                  </th>
                  <th className="px-4 py-4 whitespace-nowrap">
                    Upline Sponsor
                  </th>
                  <th className="px-4 py-4 whitespace-nowrap">Role & Status</th>
                  <th className="px-4 py-4 whitespace-nowrap">Registered</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">
                    Management Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-700 bg-blue-900/60 text-xs font-bold text-blue-300">
                          {u.fullName.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <span className="block font-bold text-white">
                            {u.fullName}
                          </span>

                          <span className="block truncate font-mono text-[11px] text-slate-400">
                            @{u.username} • {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono text-sm font-bold whitespace-nowrap text-emerald-400">
                      $
                      {(u?.availableBalance || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-4 py-4 font-mono whitespace-nowrap text-slate-300">
                      $
                      {(u?.earningBalance || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-4 py-4 font-mono text-[11px] whitespace-nowrap text-slate-400">
                      {u.uplineUsername
                        ? `@${u.uplineUsername}`
                        : "Direct (None)"}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                            u.role === "admin" || u.role === "super admin"
                              ? "border border-amber-800 bg-amber-950 text-amber-300"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {u.role}
                        </span>

                        <Badge
                          variant={u.status === "ACTIVE" ? "success" : "danger"}
                        >
                          {u.status}
                        </Badge>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono text-[11px] whitespace-nowrap text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAdjust(u)}
                          className="border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-amber-300 hover:bg-slate-700"
                        >
                          Adjust Balance
                        </Button>

                        {u.id !== currentUser.id && (
                          <>
                            <select
                              value={u.status}
                              onChange={(e) =>
                                handleToggleStatus(
                                  u,
                                  e.target.value as UserStatus
                                )
                              }
                              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs font-semibold text-slate-300 focus:outline-none"
                            >
                              <option value="ACTIVE">ACTIVE</option>
                              <option value="SUSPENDED">SUSPENDED</option>
                              <option value="BANNED">BANNED</option>
                            </select>
                            <Button
                              size="sm"
                              onClick={() => handleDeleteUser(u)}
                              aria-label={`Delete ${u.fullName}`}
                              className="bg-red-600 px-2.5 py-1 text-white hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3 text-xs text-slate-400">
          <span>
            Showing {filtered.length} of {visibleUsers.length} users
          </span>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {targetUser && (
        <Modal
          isOpen={adjustModalOpen}
          onClose={() => setAdjustModalOpen(false)}
          title="Authoritative Balance Adjustment"
          description={`Adjust financial ledger balance for ${targetUser.fullName} (@${targetUser.username}).`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Target Balance
                </label>
                <select
                  value={balanceType}
                  onChange={(e) =>
                    setBalanceType(e.target.value as "available" | "earning")
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value="available">Available Balance</option>
                  <option value="earning">Earning (Locked) Balance</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Action
                </label>
                <select
                  value={adjustOperation}
                  onChange={(e) =>
                    setAdjustOperation(e.target.value as "CREDIT" | "DEBIT")
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value="CREDIT">Credit (+ Add Funds)</option>
                  <option value="DEBIT">Debit (- Subtract Funds)</option>
                </select>
              </div>
            </div>

            <Input
              label="Adjustment Amount (USD)"
              type="number"
              min={1}
              step={10}
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(Number(e.target.value))}
              required
            />

            <Input
              label="Audit Justification Reason"
              placeholder="e.g. Approved promotional incentive or balance correction"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              helperText="This explanation will be permanently recorded in the system audit trail."
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setAdjustModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmAdjust}
                className="bg-amber-600 font-bold hover:bg-amber-700"
              >
                Apply Ledger Adjustment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
