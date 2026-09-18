import React, { useState } from "react"
import {
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  Layers,
  ShieldCheck,
} from "lucide-react"
import { User, Deposit, Withdrawal } from "@/types"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toast"
import { AdminTab } from "./AdminLayout"
import { approveAdminDeposit, rejectAdminDeposit } from "../controllers/deposit.actions"
import { updateAdminWithdrawal } from "../controllers/withdrawal.action"

interface AdminOverviewProps {
  currentUser: User
  onNavigateTab: (tab: AdminTab) => void
  overview?: {
    users: User[]
    deposits: Deposit[]
    withdrawals: Withdrawal[]
    investments: Array<{ amount: number; status: string }>
  } | null
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onNavigateTab,
  overview,
}) => {
  const { success, error: toastError } = useToast()

  const [users, setUsers] = useState<User[]>(overview?.users ?? [])
  const [deposits, setDeposits] = useState<Deposit[]>(overview?.deposits ?? [])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(overview?.withdrawals ?? [])
  const [investments, setInvestments] = useState<
    Array<{ amount: number; status: string }>
  >(overview?.investments ?? [])
  const auditLogs: Array<{
    id: string
    action: string
    actorUsername: string
    entity: string
    entityId?: string
    notes?: string
    timestamp: string
  }> = []

  const handleQuickApproveDeposit = (deposit: Deposit) => {
    void approveAdminDeposit(deposit.id)
      .then(() => {
        setDeposits((current) =>
          current.filter((item) => item.id !== deposit.id)
        )
        success(
          "Deposit Approved",
          `$${(deposit?.amount || 0).toLocaleString()} credited and investment activated!`
        )
      })
      .catch((error) =>
        toastError(
          "Approval Error",
          error instanceof Error ? error.message : "Unable to approve deposit."
        )
      )
  }

  const handleQuickApproveWithdrawal = (withdrawal: Withdrawal) => {
    void updateAdminWithdrawal(withdrawal.id, { status: "COMPLETED" })
      .then(() => {
        setWithdrawals((current) =>
          current.filter((item) => item.id !== withdrawal.id)
        )
        success(
          "Withdrawal Dispatched",
          `$${(withdrawal?.amount || 0).toLocaleString()} broadcast to blockchain network.`
        )
      })
      .catch((error) =>
        toastError(
          "Approval Error",
          error instanceof Error
            ? error.message
            : "Unable to approve withdrawal."
        )
      )
  }

  const pendingDeposits = deposits.filter((d) => d.status === "PENDING")
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "PENDING")

  const totalDepositsVolume = deposits
    .filter((d) => d.status === "COMPLETED")
    .reduce((sum, d) => sum + d.amount, 0)

  const totalWithdrawalsVolume = withdrawals
    .filter((w) => w.status === "COMPLETED")
    .reduce((sum, w) => sum + w.amount, 0)

  const totalActiveCapital = investments
    .filter((i) => i.status === "ACTIVE")
    .reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-linear-to-r from-slate-900 via-amber-950/40 to-slate-900 p-6 shadow-xl sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="mb-1 block text-xs font-bold tracking-wider text-amber-400 uppercase">
            Institutional Operations Center
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Financial & Node Administration
          </h1>
          <p className="mt-1 max-w-xl text-xs text-slate-400">
            Real-time ledger reconciliation, cryptocurrency verification queues,
            and system parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => onNavigateTab("deposits")}
            className="border-none bg-amber-500 font-bold text-slate-950 hover:bg-amber-600"
          >
            Review Deposit Queue ({pendingDeposits.length})
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Registered Investors
            </span>
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <p className="font-mono text-3xl font-black text-white">
            {users.length}
          </p>
          <span className="mt-1 block text-[11px] text-slate-400">
            Verified Portfolios
          </span>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Total Settled Deposits
            </span>
            <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="font-mono text-3xl font-black text-emerald-400">
            $
            {(totalDepositsVolume || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <span className="mt-1 block text-[11px] font-semibold text-emerald-400">
            100% On-Chain Settled
          </span>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Active Contract Capital
            </span>
            <Layers className="h-5 w-5 text-purple-400" />
          </div>
          <p className="font-mono text-3xl font-black text-purple-400">
            $
            {(totalActiveCapital || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <span className="mt-1 block text-[11px] font-semibold text-purple-300">
            Yield Generating Cycles
          </span>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Total Withdrawals
            </span>
            <ArrowUpFromLine className="h-5 w-5 text-amber-400" />
          </div>
          <p className="font-mono text-3xl font-black text-amber-400">
            $
            {(totalWithdrawalsVolume || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <span className="mt-1 block text-[11px] font-semibold text-amber-300">
            Executed Liquidity
          </span>
        </div>
      </div>

      {/* Pending Queues Split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Pending Deposits Queue */}
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Pending Deposits ({pendingDeposits.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("deposits")}
              className="cursor-pointer text-xs font-bold text-amber-400 hover:underline"
            >
              View All →
            </button>
          </div>

          {pendingDeposits.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-500">
              No deposits awaiting verification.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingDeposits.slice(0, 3).map((dep) => (
                <div
                  key={dep.id}
                  className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white">
                        {dep.userFullName}
                      </span>
                      <span className="block font-mono text-[11px] text-slate-400">
                        @{dep.userId}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-black text-emerald-400">
                        ${(dep?.amount || 0).toLocaleString()}
                      </span>
                      <span className="block font-mono text-[10px] text-slate-400">
                        {dep.cryptoCurrency} ({dep.planName})
                      </span>
                    </div>
                  </div>

                  <div className="truncate rounded-xl bg-slate-900 p-2 font-mono text-[10px] text-slate-400">
                    TXID: {dep.transactionHash}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleQuickApproveDeposit(dep)}
                      className="bg-emerald-600 text-xs font-bold hover:bg-emerald-700"
                    >
                      Approve & Credit Plan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Withdrawals Queue */}
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ArrowUpFromLine className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Pending Withdrawals ({pendingWithdrawals.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab("withdrawals")}
              className="cursor-pointer text-xs font-bold text-amber-400 hover:underline"
            >
              View All →
            </button>
          </div>

          {pendingWithdrawals.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-500">
              No withdrawals pending liquidity dispatch.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingWithdrawals.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white">
                        {w.userFullName}
                      </span>
                      <span className="block font-mono text-[11px] text-slate-400">
                        To: {w.destinationAddress.substring(0, 14)}...
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-black text-amber-400">
                        ${(w?.amount || 0).toLocaleString()}
                      </span>
                      <span className="block font-mono text-[10px] text-slate-400">
                        {w.cryptoCurrency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleQuickApproveWithdrawal(w)}
                      className="bg-amber-600 text-xs font-bold text-slate-950 hover:bg-amber-700"
                    >
                      Approve & Broadcast
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent System Audit Logs Preview */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              Recent System Audit Trail
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab("audit")}
            className="cursor-pointer text-xs font-bold text-blue-400 hover:underline"
          >
            Full Audit Logs →
          </button>
        </div>

        <div className="space-y-2.5">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950 p-3 text-xs"
            >
              <div>
                <span className="mr-2 font-mono font-bold text-amber-400">
                  [{log.action}]
                </span>
                <span className="font-medium text-slate-300">
                  {log.notes || `${log.entity} ${log.entityId}`}
                </span>
                <span className="ml-2 font-mono text-[11px] text-slate-500">
                  by @{log.actorUsername}
                </span>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-slate-500">
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
