import React, { useState } from "react"
import {
  Users,
  Copy,
  Check,
  TrendingUp,
  UserCheck,
  DollarSign,
  Gift,
} from "lucide-react"
import { Referral, User } from "@/types"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toast"

interface ReferralsViewProps {
  currentUser: User
  initialReferrals: Referral[]
}

export const ReferralsView: React.FC<ReferralsViewProps> = ({
  currentUser,
  initialReferrals,
}) => {
  const [copied, setCopied] = useState(false)
  const { success } = useToast()

  const referrals: Referral[] = initialReferrals.map((record) => {
    const referred = record.referredUserId as
      | { _id?: string; username?: string; fullName?: string }
      | string
      | undefined
    return {
      id: String(record.id || ""),
      referrerId: currentUser.id,
      referrerUsername: currentUser.username,
      referredUserId: String(
        typeof referred === "object" ? referred?._id : referred || ""
      ),
      referredUsername: String(
        typeof referred === "object" ? referred?.username : ""
      ),
      referredFullName: String(
        typeof referred === "object" ? referred?.fullName : ""
      ),
      level: Number(record.level || 1),
      totalDeposits: Number(record.totalDeposits || 0),
      commissionsEarned: Number(record.commissionsEarned || 0),
      status: record.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      createdAt: String(record.createdAt || ""),
    }
  })

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${currentUser?.username || ""}`
      : `/?ref=${currentUser?.username || ""}`

  const copyLink = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(referralLink)
    }
    setCopied(true)
    success(
      "Referral Link Copied",
      "Share your link to earn 5% instant commissions"
    )
    setTimeout(() => setCopied(false), 2500)
  }

  const totalDownlineDeposits = referrals.reduce(
    (sum, r) => sum + (r?.totalDeposits || 0),
    0
  )

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900">
            <Users className="h-6 w-6 text-purple-600" />
            Affiliate & Referral Network
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Build your capital network and earn instant 5% commission on
            qualifying partner contracts.
          </p>
        </div>
      </div>

      {/* Referral Link Hero Banner */}
      <div className="space-y-6 rounded-3xl border border-purple-800 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-purple-700 bg-purple-950/80 px-3 py-1 text-xs font-bold tracking-wider text-purple-300 uppercase">
              <Gift className="h-3.5 w-3.5" />
              5.00% Instant Tier-1 Commission
            </span>
            <h3 className="text-xl font-black text-white sm:text-2xl">
              Your Unique Referral Link
            </h3>
            <p className="mt-1 max-w-xl text-xs text-purple-200">
              Every investor who registers through your link is permanently
              bound as your direct downline partner. You automatically earn 5%
              on their deposits.
            </p>
          </div>
        </div>

        {/* Copy Box */}
        <div className="flex flex-col items-stretch gap-2 rounded-2xl border border-purple-700/60 bg-slate-950/80 p-2 sm:flex-row sm:items-center">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full bg-transparent px-3 py-2 font-mono text-xs font-bold text-white select-all focus:outline-none"
          />
          <Button
            variant="primary"
            size="md"
            onClick={copyLink}
            rightIcon={
              copied ? (
                <Check className="h-4 w-4 text-emerald-300" />
              ) : (
                <Copy className="h-4 w-4" />
              )
            }
            className="shrink-0 bg-purple-600 font-bold hover:bg-purple-500"
          >
            {copied ? "Copied Link" : "Copy Link"}
          </Button>
        </div>
      </div>

      {/* Referral Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Total Downline
            </span>
            <Users className="h-5 w-5 text-purple-500" />
          </div>
          <p className="font-mono text-3xl font-black text-slate-900">
            {referrals?.length || 0}
          </p>
          <span className="mt-1 block text-xs text-slate-500">
            Registered Partners
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Total Downline Volume
            </span>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <p className="font-mono text-3xl font-black text-slate-900">
            $
            {(totalDownlineDeposits || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <span className="mt-1 block text-xs text-slate-500">
            Cumulative Principal
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Commissions Paid
            </span>
            <DollarSign className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="font-mono text-3xl font-black text-emerald-600">
            $
            {(currentUser?.referralEarnings || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <span className="mt-1 block text-xs font-semibold text-emerald-600">
            100% Settled to Balance
          </span>
        </div>
      </div>

      {/* Upline Sponsor Card */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 font-bold text-purple-600">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
              Your Upline Sponsor
            </span>
            <p className="text-base font-bold text-slate-900">
              {currentUser.uplineUsername
                ? `@${currentUser.uplineUsername}`
                : "Direct Investor (No Upline)"}
            </p>
            <p className="text-xs text-slate-500">
              {currentUser.uplineUsername
                ? "Verified Active Partner"
                : "Registered directly via platform portal"}
            </p>
          </div>
        </div>

        <div className="text-xs font-medium text-slate-400">
          Permanent Upline Relationship
        </div>
      </div>

      {/* Downline Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4">
          <h3 className="text-base font-bold text-slate-900">
            Downline Investors ({referrals?.length || 0})
          </h3>
        </div>

        {(referrals?.length || 0) === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <p className="text-sm font-bold text-slate-800">
              No downline partners yet
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              Share your referral link with colleagues and partners to begin
              earning instant 5% commission.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={copyLink}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Copy Referral Link
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  <th className="py-3.5 pl-6">Referred Investor</th>
                  <th className="py-3.5">Username</th>
                  <th className="py-3.5">Total Deposits</th>
                  <th className="py-3.5">Commission Generated (5%)</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 pr-6 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {referrals.map((ref) => (
                  <tr
                    key={ref.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="py-4 pl-6 font-bold text-slate-900">
                      {ref.referredFullName}
                    </td>
                    <td className="py-4 font-mono text-slate-600">
                      @{ref.referredUsername}
                    </td>
                    <td className="py-4 font-mono font-bold text-slate-900">
                      $
                      {(ref?.totalDeposits || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 font-mono font-bold text-emerald-600">
                      +$
                      {(ref?.commissionsEarned || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4">
                      <Badge variant="success">{ref.status}</Badge>
                    </td>
                    <td className="py-4 pr-6 text-right font-mono text-[11px] text-slate-500">
                      {new Date(ref.createdAt).toLocaleDateString()}
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
