// InvestmentPlansSection.tsx
"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { formatCurrency } from "../../lib/plans"
import type { IPlan } from "@/models/Plan"
import {
  Sparkles,
  Clock,

  ArrowRight,
  Check,
  Layers,
} from "lucide-react"

interface InvestmentPlansSectionProps {
  plans: IPlan[]
  onOpenInvestModal: (planSlug: string) => void
  showAllHeading?: boolean
}

export const InvestmentPlansSection: React.FC<
  InvestmentPlansSectionProps
> = ({
  plans,
  onOpenInvestModal,
  showAllHeading = true,
}) => {
    const router = useRouter()
    return (
      <section
        id="investment-plans-container"
        className="bg-slate-950/40 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {showAllHeading && (
            <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl space-y-3 text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  <span>Structured Yield Architecture</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Institutional Investment Plans
                </h2>
                <p className="text-base text-slate-300">
                  Predefined earning intervals, transparent capital minimums, and
                  automated maturity distributions powered by multi-signature
                  vaults.
                </p>
              </div>

              <button
                onClick={() => {
                  router.push("/investment-plans")
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 transition-colors hover:text-blue-300"
              >
                <span>View Full Plan Specifications</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Mobile Horizontal Scroll container / Desktop Responsive Grid */}
          {/* On mobile: display: flex; overflow-x: auto; scroll-snap-type: x mandatory */}
          {/* On desktop: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 */}
          <div
            id="investment-plans-scroll-grid"
            className="no-scrollbar flex snap-x snap-mandatory space-x-5 overflow-x-auto px-1 pt-3 pb-6 sm:space-x-6 md:grid md:grid-cols-2 md:gap-6 md:space-x-0 lg:grid-cols-3"
          >
            {plans.map((plan) => {
              const isFeatured = plan.featured
              const maxLabel =
                plan.maximumAmount === 0
                  ? "Unlimited"
                  : formatCurrency(plan.maximumAmount)

              return (
                <div
                  key={plan.slug}
                  id={`plan-card-${plan.slug}`}
                  className={`relative flex w-72.5 shrink-0 snap-center flex-col justify-between rounded-3xl p-6 transition-all duration-300 sm:w-[320px] sm:p-7 md:w-auto ${isFeatured
                    ? "border-2 border-blue-500/60 bg-linear-to-b from-blue-950 via-slate-900 to-slate-950 text-white shadow-2xl md:-translate-y-2"
                    : "border border-slate-800 bg-slate-900/85 text-slate-100 shadow-sm backdrop-blur-md hover:border-blue-500/50 hover:shadow-xl"
                    }`}
                >
                  {/* Featured Badge */}
                  {isFeatured && (
                    <div className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-blue-400/40 bg-linear-to-r from-blue-600 to-indigo-600 px-3.5 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-md">
                      <Sparkles className="h-3 w-3 text-cyan-300" />
                      <span>Featured Tier</span>
                    </div>
                  )}

                  <div>
                    {/* Top Meta Bar */}
                    <div className="mb-4 flex items-center justify-between">
                      <span
                        className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold tracking-wider uppercase ${isFeatured
                          ? "border border-blue-700/50 bg-blue-900/60 text-cyan-300"
                          : "border border-slate-700 bg-slate-800 text-slate-300"
                          }`}
                      >
                        {plan.name.toUpperCase()}
                      </span>

                      <span
                        className={`flex items-center gap-1 font-mono text-xs font-semibold ${isFeatured ? "text-slate-300" : "text-slate-400"
                          }`}
                      >
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        <span>{plan.durationHours} Hour Cycle</span>
                      </span>
                    </div>

                    {/* Return Percentage Display */}
                    <div className="my-4">
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`font-mono text-4xl font-extrabold tracking-tight sm:text-5xl ${isFeatured ? "text-cyan-300" : "text-blue-400"
                            }`}
                        >
                          {plan.returnPercentage}%
                        </span>
                      </div>
                      <div
                        className={`text-xs font-semibold tracking-wider uppercase ${isFeatured ? "text-slate-300" : "text-slate-400"
                          }`}
                      >
                        Projected Contract Yield
                      </div>
                    </div>

                    {/* Capital Range & Core Metrics Grid */}
                    <div
                      className={`my-4 space-y-2.5 rounded-2xl p-4 ${isFeatured
                        ? "border border-slate-700 bg-slate-800/80"
                        : "border border-slate-800 bg-slate-950/80"
                        }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={
                            isFeatured ? "text-slate-400" : "text-slate-400"
                          }
                        >
                          Capital Range
                        </span>
                        <span className="font-mono font-bold text-white">
                          {formatCurrency(plan.minimumAmount)} – {maxLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={
                            isFeatured ? "text-slate-400" : "text-slate-400"
                          }
                        >
                          Principal Return
                        </span>
                        <span className="flex items-center gap-1 font-mono font-bold text-emerald-400">
                          <Check className="h-3.5 w-3.5" />
                          <span>100% Return</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={
                            isFeatured ? "text-slate-400" : "text-slate-400"
                          }
                        >
                          Affiliate Downline
                        </span>
                        <span className="font-mono font-bold text-blue-400">
                          {plan.referralPercentage}% Commission
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      className={`my-4 text-xs leading-relaxed ${isFeatured ? "text-slate-300" : "text-slate-400"
                        }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {/* Card CTA */}
                  <div className="border-t border-slate-800 pt-4">
                    <button
                      id={`btn-invest-${plan.slug}`}
                      onClick={() => onOpenInvestModal(plan.slug)}
                      className={`group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${isFeatured
                        ? "bg-linear-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:from-cyan-400 hover:to-indigo-500"
                        : "bg-blue-600 text-white shadow-sm hover:bg-blue-500"
                        }`}
                    >
                      <span>Invest in {plan.name.replace(" Plan", "")}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile Swipe Guidance indicator */}
          <div className="mt-2 flex items-center justify-center gap-1.5 font-mono text-xs text-slate-400 md:hidden">
            <span>Swipe horizontally for all 6 tiers</span>
            <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
          </div>
        </div>
      </section>
    )
  }
