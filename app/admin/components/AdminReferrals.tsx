import React, { useState } from "react"
import { Users, Search, TrendingUp, Gift } from "lucide-react"
import { Referral, User } from "@/types"
import { Badge } from "@/components/ui/Badge"

interface AdminReferralsProps {
  currentUser: User
  initialReferrals?: Referral[]
}

export const AdminReferrals: React.FC<AdminReferralsProps> = ({ initialReferrals = [] }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [allReferrals, setAllReferrals] = useState<Referral[]>(() =>
    initialReferrals.map((record) => ({
      ...record,
      id: String(record.id || ""),
      referrerUsername: record.referrerUsername || "unknown",
      referredUsername: record.referredUsername || "unknown",
      referredFullName: record.referredFullName || "Unknown Investor",
      totalDeposits: Number(record.totalDeposits || 0),
      commissionsEarned: Number(record.commissionsEarned || 0),
      status: record.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      createdAt: record.createdAt || new Date().toISOString(),
    }))
  )
  const filtered = allReferrals.filter((r) => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return (
      r.referrerUsername.toLowerCase().includes(q) ||
      r.referredUsername.toLowerCase().includes(q) ||
      r.referredFullName.toLowerCase().includes(q)
    )
  })

  const totalCommissionsPaid = allReferrals.reduce(
    (sum, r) => sum + r.commissionsEarned,
    0
  )
  const totalReferredVolume = allReferrals.reduce(
    (sum, r) => sum + r.totalDeposits,
    0
  )

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white">
            <Users className="h-6 w-6 text-purple-400" />
            Affiliate & Downline Network
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Global downline trees, permanent sponsor bindings, and real-time
            commission disbursements.
          </p>
        </div>
      </div>

      {/* Network Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Affiliate Bindings
            </span>
            <Users className="h-5 w-5 text-purple-400" />
          </div>
          <p className="font-mono text-3xl font-black text-white">
            {allReferrals.length}
          </p>
          <span className="mt-1 block text-[11px] font-semibold text-purple-300">
            Active Downlines
          </span>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Downline Deposit Volume
            </span>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <p className="font-mono text-3xl font-black text-blue-400">
            $
            {(totalReferredVolume || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <span className="mt-1 block text-[11px] text-slate-400">
            Cumulative Principal
          </span>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Total Commissions Paid
            </span>
            <Gift className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="font-mono text-3xl font-black text-emerald-400">
            $
            {(totalCommissionsPaid || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <span className="mt-1 block text-[11px] font-semibold text-emerald-400">
            Instant 5% Tier-1 Settlements
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Referrer username or Referred investor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pr-4 pl-9 text-xs font-medium text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Referrals Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No affiliate pairs match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="py-3.5 pl-6">Upline Sponsor</th>
                  <th className="py-3.5">Referred Investor</th>
                  <th className="py-3.5">Downline Volume</th>
                  <th className="py-3.5">Commission Paid (5%)</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 pr-6 text-right">Bound Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-slate-800/50"
                  >
                    <td className="py-4 pl-6">
                      <span className="font-mono font-bold text-purple-400">
                        @{r.referrerUsername}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="block font-bold text-white">
                        {r.referredFullName}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        @{r.referredUsername}
                      </span>
                    </td>
                    <td className="py-4 font-mono font-bold text-white">
                      $
                      {(r?.totalDeposits || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 font-mono font-bold text-emerald-400">
                      +$
                      {(r?.commissionsEarned || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4">
                      <Badge variant="success">{r.status}</Badge>
                    </td>
                    <td className="py-4 pr-6 text-right font-mono text-[11px] text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
