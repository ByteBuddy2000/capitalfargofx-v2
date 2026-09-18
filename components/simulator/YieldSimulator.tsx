import React, { useState } from "react"
import { CURRENT_PLANS, formatCurrency, calculateYield } from "../../lib/plans"
import { Calculator, Users, ArrowRight, Info, AlertCircle } from "lucide-react"

interface YieldSimulatorProps {
  initialPlanSlug?: string
  onOpenInvest?: (planSlug: string, amount: number) => void
}
interface InvestmentPlan {
  readonly name: string
  readonly slug: string
  readonly minimumAmount: number
  readonly maximumAmount: number // 0 means unlimited
  readonly returnPercentage: number
  readonly durationHours: number
  readonly referralPercentage: number
  readonly principalReturn: boolean
  readonly description: string
  readonly status: "ACTIVE"
  readonly featured: boolean
}
export const YieldSimulator: React.FC<YieldSimulatorProps> = ({
  initialPlanSlug = "level-4",
  onOpenInvest,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan>(() => {
    return (
      CURRENT_PLANS.find((p) => p.slug === initialPlanSlug) || CURRENT_PLANS[3]
    )
  })

  // Calculate default amount within bounds
  const getInitialAmount = (plan: InvestmentPlan) => {
    if (plan.maximumAmount === 0) {
      return 25000
    }
    return Math.round((plan.minimumAmount + plan.maximumAmount) / 2)
  }

  const [investmentAmount, setInvestmentAmount] = useState<number>(() => {
    return getInitialAmount(selectedPlan)
  })

  // When plan changes, adjust the investmentAmount if it is out of bounds
  const handlePlanChange = (plan: InvestmentPlan) => {
    setSelectedPlan(plan)
    const min = plan.minimumAmount
    const max = plan.maximumAmount === 0 ? 100000 : plan.maximumAmount

    if (investmentAmount < min) {
      setInvestmentAmount(min)
    } else if (
      plan.maximumAmount > 0 &&
      investmentAmount > plan.maximumAmount
    ) {
      setInvestmentAmount(plan.maximumAmount)
    }
  }

  const minRange = selectedPlan.minimumAmount
  const maxRange =
    selectedPlan.maximumAmount === 0 ? 100000 : selectedPlan.maximumAmount

  // Handle amount change with clamping for slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestmentAmount(Number(e.target.value))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/[^0-9]/g, ""))
    setInvestmentAmount(val)
  }

  const calculations = calculateYield(selectedPlan, investmentAmount)

  // Quick preset chips that are valid for current plan
  const presets = [
    500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 25000, 50000,
  ].filter((p) => {
    if (selectedPlan.maximumAmount === 0) {
      return p >= selectedPlan.minimumAmount
    }
    return p >= selectedPlan.minimumAmount && p <= selectedPlan.maximumAmount
  })

  return (
    <section
      id="yield-simulator-section"
      className="relative overflow-hidden bg-slate-950 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
            <Calculator className="h-3.5 w-3.5 text-blue-400" />
            <span>Live Yield Simulator</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Calculate Your Projected Return
          </h2>

          <p className="text-base text-slate-300">
            Model the projected maturity value of an investment based on the
            selected CapitalsFargoFX investment plan.
          </p>
        </div>

        {/* Simulator Master Glass Card */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Controls Pane (7 Cols) */}
            <div className="space-y-7 border-b border-slate-800 p-6 sm:p-8 lg:col-span-7 lg:border-r lg:border-b-0">
              {/* Step 1: Select Plan Tier */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                    <span>1. Select Investment Plan</span>
                  </label>
                  <span className="font-mono text-xs font-semibold text-blue-400">
                    {selectedPlan.durationHours}h Cycle ·{" "}
                    {selectedPlan.returnPercentage}% Yield
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {CURRENT_PLANS.map((plan) => {
                    const isSelected = selectedPlan.slug === plan.slug
                    return (
                      <button
                        key={plan.slug}
                        type="button"
                        id={`simulator-select-${plan.slug}`}
                        onClick={() => handlePlanChange(plan)}
                        className={`relative rounded-xl border p-2.5 text-center transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-600 font-bold text-white shadow-md shadow-blue-600/30"
                            : "border-slate-800 bg-slate-950 font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                        }`}
                      >
                        {plan.featured && (
                          <span className="py-0.2 absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-1.5 text-[8px] font-black tracking-wider text-slate-900 uppercase shadow-xs">
                            Top
                          </span>
                        )}
                        <div className="text-[11px] tracking-wide uppercase">
                          {plan.name.replace(" Plan", "")}
                        </div>
                        <div
                          className={`mt-0.5 font-mono text-xs font-bold ${isSelected ? "text-white" : "text-blue-400"}`}
                        >
                          {plan.returnPercentage}%
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 2: Capital Allocation Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="simulator-amount-input"
                    className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase"
                  >
                    2. Principal Investment Capital (USD)
                  </label>
                  <span className="font-mono text-xs text-slate-400">
                    Tier Range: {formatCurrency(selectedPlan.minimumAmount)} –{" "}
                    {selectedPlan.maximumAmount === 0
                      ? "Unlimited"
                      : formatCurrency(selectedPlan.maximumAmount)}
                  </span>
                </div>

                {/* Number Input Box */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-mono text-lg font-bold text-slate-500">
                    $
                  </div>
                  <input
                    id="simulator-amount-input"
                    type="number"
                    min={selectedPlan.minimumAmount}
                    max={
                      selectedPlan.maximumAmount === 0
                        ? 500000
                        : selectedPlan.maximumAmount
                    }
                    step={100}
                    value={investmentAmount || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3.5 pr-4 pl-9 font-mono text-xl font-bold text-white transition-all focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 font-mono text-xs font-semibold text-slate-500">
                    USD
                  </div>
                </div>

                {/* Range Slider */}
                <div className="pt-2">
                  <input
                    type="range"
                    min={minRange}
                    max={maxRange}
                    step={minRange >= 5000 ? 500 : 100}
                    value={Math.min(
                      Math.max(investmentAmount, minRange),
                      maxRange
                    )}
                    onChange={handleSliderChange}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-blue-600"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400">
                    <span>Min: {formatCurrency(minRange)}</span>
                    <span>
                      Max:{" "}
                      {selectedPlan.maximumAmount === 0
                        ? "$15,000+"
                        : formatCurrency(maxRange)}
                    </span>
                  </div>
                </div>

                {/* Preset Chips */}
                {presets.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="mr-1 font-mono text-[10px] font-bold text-slate-400 uppercase">
                      Presets:
                    </span>
                    {presets.slice(0, 5).map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setInvestmentAmount(amount)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-colors ${
                          investmentAmount === amount
                            ? "border border-blue-500/50 bg-blue-950 text-blue-300"
                            : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Plan Description & Terms Snippet */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs leading-relaxed text-slate-400">
                <div className="mb-1 flex items-center gap-1.5 font-semibold text-slate-200">
                  <Info className="h-3.5 w-3.5 text-blue-400" />
                  <span>{selectedPlan.name} Term Specifications</span>
                </div>
                <p>{selectedPlan.description}</p>
                <div className="mt-2 font-mono text-[11px] text-slate-500">
                  Calculated under {selectedPlan.name} •{" "}
                  {selectedPlan.durationHours}-hour investment cycle
                </div>
              </div>
            </div>

            {/* Right Output Display Pane (5 Cols) */}
            <div className="flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white sm:p-8 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Projected Settlement Breakdown
                  </div>
                  <span className="rounded border border-emerald-500/30 bg-emerald-950 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                    ACTIVE TIER
                  </span>
                </div>

                {/* Line Items */}
                <div className="space-y-4 py-6">
                  {/* Principal Investment */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">
                        Principal Investment
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Allocated capital deposit
                      </div>
                    </div>
                    <div className="text-right font-mono text-lg font-bold text-white">
                      {formatCurrency(investmentAmount)}
                    </div>
                  </div>

                  {/* Configured Yield */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>Configured Yield</span>
                        <span className="py-0.2 rounded bg-blue-900/60 px-1.5 font-mono text-[10px] text-cyan-300">
                          +{selectedPlan.returnPercentage}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {selectedPlan.durationHours}-hour maturity epoch
                      </div>
                    </div>
                    <div className="text-right font-mono text-lg font-bold text-emerald-400">
                      +{formatCurrency(calculations.projectedProfit)}
                    </div>
                  </div>

                  {/* Principal Return */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">
                        Principal Return
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Unlocks at contract maturity
                      </div>
                    </div>
                    <div className="rounded bg-slate-800/80 px-2 py-1 text-right font-mono text-xs font-semibold text-slate-300">
                      100% Unlocked
                    </div>
                  </div>

                  {/* Affiliate Downline Bonus (Clearly Distinguishable) */}
                  <div className="rounded-xl border border-blue-800/50 bg-blue-950/60 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                          <Users className="h-3.5 w-3.5" />
                          <span>Affiliate Bonus (5.00%)</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Credited to referring partner balance
                        </div>
                      </div>
                      <div className="text-right font-mono text-sm font-bold text-cyan-300">
                        +{formatCurrency(calculations.affiliateBonus)}
                      </div>
                    </div>
                  </div>

                  {/* Total Projected Payout */}
                  <div className="border-t border-slate-800 pt-4">
                    <div className="mb-1 text-xs font-semibold text-slate-400">
                      Total Projected Maturity Payout
                    </div>
                    <div className="font-mono text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {formatCurrency(calculations.projectedPayout)}
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-slate-400">
                      (Principal {formatCurrency(investmentAmount)} + Profit{" "}
                      {formatCurrency(calculations.projectedProfit)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  type="button"
                  id="simulator-deploy-btn"
                  onClick={() => {
                    if (onOpenInvest) {
                      onOpenInvest(selectedPlan.slug, investmentAmount)
                    }
                  }}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-900/30 transition-all hover:from-blue-500 hover:to-cyan-500"
                >
                  <span>
                    Deploy {formatCurrency(investmentAmount)} in{" "}
                    {selectedPlan.name}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Mandatory Disclaimers Strip */}
          <div className="space-y-1.5 border-t border-slate-800 bg-slate-950 p-4 text-xs text-slate-400 sm:p-5">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
              <p className="leading-relaxed">
                <span className="font-semibold text-slate-200">
                  Contract Notice:
                </span>{" "}
                Investment returns and payouts are strictly determined
                server-side based on configured contract terms, active
                operational liquidity, and applicable terms of service.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
              <p className="leading-relaxed">
                <span className="font-semibold text-slate-200">
                  Risk Disclosure:
                </span>{" "}
                Cryptocurrency and digital asset investment carries market risk.
                Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
