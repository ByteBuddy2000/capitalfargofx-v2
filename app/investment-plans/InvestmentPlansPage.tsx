"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { formatCurrency } from "@/lib/plans"
import { InvestmentPlansSection } from "@/components/sections/InvestmentPlansSection"
import { YieldSimulator } from "@/components/simulator/YieldSimulator"
import { FinalCtaSection } from "@/components/sections/FinalCtaSection"
import {
  Layers,
  Check,
  ArrowRight,
  Info,
} from "lucide-react"
import { CURRENT_PLANS } from "@/lib/defaultPlans"

export const InvestmentPlansPage: React.FC = () => {
  const router = useRouter()
  const onOpenAuth = (mode: "signin" | "signup") =>
    router.push(`/${mode === "signin" ? "login" : "register"}`)
  const onOpenInvestModal = (planSlug?: string, amount?: number) => {
    const params = new URLSearchParams()
    if (planSlug) params.set("plan", planSlug)
    if (amount !== undefined) params.set("amount", String(amount))
    router.push(`/investment-plans${params.toString() ? `?${params}` : ""}`)
  }
  return (
    <div className="bg-slate-950 pt-28 pb-16 text-slate-100">
      {/* Hero Header */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs currentPageTitle="Investment Plans" />

          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
              <Layers className="h-3.5 w-3.5 text-blue-400" />
              <span>Institutional Portfolio Architecture</span>
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
              Structured Digital Asset Yield & Contract Tiers
            </h1>

            <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
              Explore our complete suite of structured investment contracts.
              Each tier features predefined earning intervals, principal
              preservation protocols, and automated distribution at maturity.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Plans Cards Section (Includes Mobile Horizontal Scroll) */}
      <InvestmentPlansSection
        onOpenInvestModal={onOpenInvestModal}
        showAllHeading={false}
      />

      {/* Comprehensive Plan Matrix / Comparison Table */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl space-y-2">
            <div className="font-mono text-xs font-bold tracking-wider text-blue-400 uppercase">
              Contract Specifications
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Plan Parameter Comparison Matrix
            </h2>
            <p className="text-sm text-slate-400">
              Review side-by-side contract durations, minimum allocation sizes,
              and affiliate payouts.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                  <th className="p-4 sm:p-5">Tier Name</th>
                  <th className="p-4 sm:p-5">Capital Range</th>
                  <th className="p-4 sm:p-5">Contract Yield</th>
                  <th className="p-4 sm:p-5">Duration Cycle</th>
                  <th className="p-4 sm:p-5">Principal Return</th>
                  <th className="p-4 sm:p-5">Affiliate Bonus</th>
                  <th className="p-4 text-right sm:p-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {CURRENT_PLANS.map((plan) => {
                  const isFeatured = plan.featured
                  const maxLabel =
                    plan.maximumAmount === 0
                      ? "Unlimited"
                      : formatCurrency(plan.maximumAmount)

                  return (
                    <tr
                      key={plan.slug}
                      className={`transition-colors hover:bg-slate-800/60 ${
                        isFeatured ? "bg-blue-950/40 font-semibold" : ""
                      }`}
                    >
                      <td className="flex items-center gap-2 p-4 font-bold text-white sm:p-5">
                        <span>{plan.name}</span>
                        {isFeatured && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 font-mono text-[9px] font-black text-white uppercase">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-slate-300 sm:p-5">
                        {formatCurrency(plan.minimumAmount)} – {maxLabel}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400 sm:p-5">
                        +{plan.returnPercentage}%
                      </td>
                      <td className="p-4 font-mono text-slate-400 sm:p-5">
                        {plan.durationHours} Hours
                      </td>
                      <td className="p-4 text-slate-300 sm:p-5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                          <Check className="h-3.5 w-3.5" />
                          <span>100% Unlocked</span>
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-300 sm:p-5">
                        {plan.referralPercentage}% Referral
                      </td>
                      <td className="p-4 text-right sm:p-5">
                        <button
                          onClick={() => onOpenInvestModal(plan.slug)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-blue-500"
                        >
                          <span>Deploy</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <p>
              Capital ranges reflect active investment minimums. High-net-worth
              institutional allocations exceeding standard limits are
              accommodated via Level 6 Unlimited.
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Live Yield Simulator */}
      <YieldSimulator onOpenInvest={onOpenInvestModal} />

      {/* Final CTA */}
      <FinalCtaSection onOpenAuth={onOpenAuth} />
    </div>
  )
}
