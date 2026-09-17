"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { FinalCtaSection } from "@/components/sections/FinalCtaSection"
import {
  Cpu,
  Activity,
  Lock,
  CheckCircle2,
  ArrowRight,
  Database,
} from "lucide-react"

export const AboutPage: React.FC = () => {
  const router = useRouter()
  const onOpenAuth = (mode: "signin" | "signup") =>
    router.push(`/${mode === "signin" ? "login" : "register"}`)
  const onOpenInvestModal = () => router.push("/investment-plans")

  return (
    <div className="bg-slate-950 pt-28 pb-16 text-slate-100">
      {/* Page Hero */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs currentPageTitle="About CapitalsFargoFX" />

          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
              Institutional Digital Asset Management
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
              Bridging Traditional Financial Rigor and Decentralized Digital
              Opportunity
            </h1>

            <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
              CapitalsFargoFX is an international digital asset management and
              cryptocurrency investment firm engineered to deliver structured
              returns. By combining algorithmic market routing with
              institutional transparency, CapitalsFargoFX bridges traditional
              financial rigor and decentralized digital opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl space-y-3 text-center">
            <div className="font-mono text-xs font-bold tracking-wider text-blue-400 uppercase">
              Infrastructure Blueprint
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Architectural Security & Execution Engine
            </h2>
            <p className="text-sm text-slate-400 sm:text-base">
              Engineered with institutional fault tolerance, strict cold
              custody, and automated settlement cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-blue-500/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800 text-blue-400">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Algorithmic Routing
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Systematic liquidity pool deployment across high-volume digital
                asset venues to harvest yield without exposing capital to
                speculative directional volatility.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-blue-500/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800 text-emerald-400">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Cold-Vault Custody
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Client digital assets are deposited directly into offline,
                multi-signature cold storage vaults requiring consensus
                authorizations for any withdrawal dispatch.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-blue-500/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800 text-indigo-400">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Automated Epochs</h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Predefined earning intervals (24h to 168h) compute interest
                accruals deterministically. At contract maturity, 100% of
                principal is unlocked automatically.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-blue-500/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800 text-cyan-400">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Double-Entry Accounting
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Cryptographic double-entry ledger verification ensures that all
                balances, yield disbursements, and affiliate bonuses are
                auditable and reconciled on-chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3 py-1 font-mono text-xs font-bold text-blue-300">
                Transparent Operations
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Designed for Portfolio Predictability
              </h2>
              <p className="text-base leading-relaxed text-slate-300">
                Unlike speculative trading schemes, CapitalsFargoFX structures
                digital asset investments with fixed parameters: predefined
                capital tiers, exact percentage yields, and strict maturity
                windows.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      Predefined Contract Terms
                    </div>
                    <div className="text-xs text-slate-400">
                      Every investment plan specifies exact minimums, duration,
                      and yield percentage before capital deployment.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      Instant Settlement Execution
                    </div>
                    <div className="text-xs text-slate-400">
                      Withdrawals route directly to external Bitcoin, Ethereum,
                      or USDT addresses with an average dispatch time of under
                      15 minutes.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      5.00% Affiliate Downline
                    </div>
                    <div className="text-xs text-slate-400">
                      Credited instantly upon qualifying referral deposits,
                      completely segregated from core contract principal.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenInvestModal()}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500"
                >
                  <span>Explore Structured Plans</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right Card Panel */}
            <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl sm:p-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <span className="font-mono text-xs font-bold text-cyan-400 uppercase">
                  Corporate Governance
                </span>
                <span className="rounded bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300">
                  CF-GOV-2026
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight">
                Cryptographic Accounting & Custody Discipline
              </h3>

              <p className="text-sm leading-relaxed text-slate-400">
                At CapitalsFargoFX, institutional transparency is not an
                abstract ideal—it is enforced through immutable ledger records,
                deterministic yield math, and segregated client vaults.
              </p>

              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Vault Protocol:</span>
                  <span className="font-bold text-slate-200">
                    Multi-Sig Cold Storage
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Deposit Fees:</span>
                  <span className="font-bold text-emerald-400">
                    0.00% Zero Fee Surcharge
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Maturity Range:</span>
                  <span className="font-bold text-cyan-300">
                    24 Hours to 168 Hours
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Support Desk:</span>
                  <span className="font-bold text-slate-200">
                    24/7 Continuous Desk
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Final CTA */}
      <TestimonialsSection />
      <FinalCtaSection onOpenAuth={onOpenAuth} />
    </div>
  )
}
