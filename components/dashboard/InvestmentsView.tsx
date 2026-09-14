import React, { useState } from "react"
import { Layers, ArrowRight, Play, ShieldCheck } from "lucide-react"
import { User, Investment } from "../../types"
import { authApi } from "../../lib/api"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { useToast } from "../ui/Toast"
import { settleInvestmentAction } from "../../app/actions"

interface InvestmentsViewProps {
  currentUser: User
  onNavigateDeposit: () => void
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({
  onNavigateDeposit,
}) => {
  const [currentTime] = useState(() => Date.now())
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL")
  const [allInvestments, setAllInvestments] = useState<Investment[]>([])
  const { success, info } = useToast()

  React.useEffect(() => {
    authApi
      .investments()
      .then(setAllInvestments)
      .catch((error) =>
        info(
          "Unable to load investments",
          error instanceof Error ? error.message : "Please try again."
        )
      )
  }, [info])
  const filtered = allInvestments.filter((i) => {
    if (!i) return false
    if (filter === "ACTIVE") return i.status === "ACTIVE"
    if (filter === "COMPLETED") return i.status === "COMPLETED"
    return true
  })

  const totalActiveCapital = allInvestments
    .filter((i) => i && i.status === "ACTIVE")
    .reduce((sum, i) => sum + (i?.amount || 0), 0)

  const totalCompletedProfits = allInvestments
    .filter((i) => i && i.status === "COMPLETED")
    .reduce((sum, i) => sum + (i?.expectedProfit || 0), 0)

  const handleSettle = async (invId: string) => {
    try {
      const actionResult = await settleInvestmentAction(invId)
      if (!actionResult.success) {
        throw new Error(actionResult.error)
      }
      setAllInvestments((investments) =>
        investments.map((investment) =>
          investment.id === actionResult.data.investment.id
            ? actionResult.data.investment
            : investment
        )
      )
      success(
        "Contract Matured & Settled",
        `Principal and $${actionResult.data.investment.expectedProfit.toLocaleString()} profit deposited!`
      )
    } catch (error) {
      info(
        "Notice",
        error instanceof Error ? error.message : "Unable to settle investment."
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900">
            <Layers className="h-6 w-6 text-blue-600" />
            My Investment Portfolio
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Active and historical yield-generating cryptocurrency contracts.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onNavigateDeposit}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="bg-blue-600 hover:bg-blue-700"
        >
          New Investment Contract
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
            Active Capital in Contracts
          </span>
          <p className="mt-1 font-mono text-2xl font-black text-slate-900">
            $
            {(totalActiveCapital || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <span className="mt-1 block text-[11px] font-semibold text-blue-600">
            {
              (allInvestments || []).filter((i) => i && i.status === "ACTIVE")
                .length
            }{" "}
            active cycle(s)
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
            Realized Historical Profits
          </span>
          <p className="mt-1 font-mono text-2xl font-black text-emerald-600">
            +$
            {(totalCompletedProfits || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <span className="mt-1 block text-[11px] font-semibold text-emerald-600">
            {
              (allInvestments || []).filter(
                (i) => i && i.status === "COMPLETED"
              ).length
            }{" "}
            settled contract(s)
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
            Accounting Security
          </span>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Double-Entry Verified
          </p>
          <span className="mt-1 block text-[11px] text-slate-500">
            100% Principal Protection Guarantee
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {(["ALL", "ACTIVE", "COMPLETED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              filter === tab
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab} Contracts (
            {tab === "ALL"
              ? allInvestments?.length || 0
              : tab === "ACTIVE"
                ? (allInvestments || []).filter(
                    (i) => i && i.status === "ACTIVE"
                  ).length
                : (allInvestments || []).filter(
                    (i) => i && i.status === "COMPLETED"
                  ).length}
            )
          </button>
        ))}
      </div>

      {/* Investments List */}
      {(filtered?.length || 0) === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Layers className="mx-auto mb-3 h-10 w-10 text-slate-400" />
          <h3 className="text-base font-bold text-slate-800">
            No {filter.toLowerCase()} contracts found
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            Fund your desired plan to start compounding returns under
            institutional liquidity parameters.
          </p>
          <Button
            variant="primary"
            onClick={onNavigateDeposit}
            className="mt-5"
          >
            Choose an Investment Plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((inv) => {
            const start = new Date(inv.startDate).getTime()
            const end = new Date(inv.maturityDate).getTime()
            const now = currentTime
            const progress =
              inv.status === "COMPLETED"
                ? 100
                : Math.min(
                    100,
                    Math.max(
                      0,
                      Math.round(((now - start) / (end - start)) * 100)
                    )
                  )

            return (
              <div
                key={inv.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {inv.planName} Plan
                      </h3>
                      <p className="font-mono text-[11px] text-slate-400">
                        Ref #{inv.id.substring(0, 14)}
                      </p>
                    </div>
                    <Badge
                      variant={inv.status === "ACTIVE" ? "success" : "neutral"}
                    >
                      {inv.status} (+{inv.returnPercentage}%)
                    </Badge>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3.5 text-xs">
                    <div>
                      <span className="block text-[10px] text-slate-500">
                        Invested Principal
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        ${(inv?.amount || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500">
                        Yield Profit
                      </span>
                      <span className="font-mono font-bold text-emerald-600">
                        +{inv?.returnPercentage || 0}% ($
                        {(inv?.expectedProfit || 0).toLocaleString()})
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500">
                        Total Maturity
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        ${(inv?.totalReturn || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Maturity Progress</span>
                      <span className="font-mono font-bold text-slate-900">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full transition-all duration-500 ${
                          inv.status === "COMPLETED"
                            ? "bg-emerald-500"
                            : "bg-gradient-to-r from-blue-600 to-emerald-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-4 space-y-1 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>Contract Activated:</span>
                      <span className="font-mono text-slate-700">
                        {new Date(inv.startDate).toLocaleDateString()}{" "}
                        {new Date(inv.startDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scheduled Maturity:</span>
                      <span className="font-mono text-slate-700">
                        {new Date(inv.maturityDate).toLocaleDateString()}{" "}
                        {new Date(inv.maturityDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-bold text-slate-800">
                        {inv.durationHours} Hours Cycle
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="text-[11px] font-semibold text-slate-500">
                    {inv.status === "ACTIVE"
                      ? "Status: Compounding In Progress"
                      : "Status: Contract Settled"}
                  </div>

                  {inv.status === "ACTIVE" && (
                    <button
                      onClick={() => handleSettle(inv.id)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100"
                      title="Simulate contract maturity for testing"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Simulate Settlement
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
