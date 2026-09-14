"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { YieldSimulator } from "@/components/simulator/YieldSimulator"
import { FinalCtaSection } from "@/components/sections/FinalCtaSection"
import {
  UserPlus,
  Layers,
  TrendingUp,
  CheckCircle2,

  Workflow,
} from "lucide-react"

export const HowItWorksPage: React.FC = () => {
  const router = useRouter()
  const onOpenAuth = (mode: "signin" | "signup") =>
    router.push(`/${mode === "signin" ? "login" : "register"}`)
  const onOpenInvestModal = (planSlug?: string, amount?: number) => {
    const params = new URLSearchParams()
    if (planSlug) params.set("plan", planSlug)
    if (amount !== undefined) params.set("amount", String(amount))
    router.push(`/investment-plans${params.toString() ? `?${params}` : ""}`)
  }
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Register securely and configure cryptocurrency receiving wallet addresses for payouts.",
      icon: <UserPlus className="h-6 w-6 text-blue-600" />,
      detail:
        "Quick identity initialization with single-use vault allocation and 2FA authentication layer.",
    },
    {
      number: "02",
      title: "Choose an Investment Plan",
      description:
        "Select your preferred structured investment plan and fund your investment using supported cryptocurrency rails.",
      icon: <Layers className="h-6 w-6 text-indigo-600" />,
      detail:
        "Choose between 6 capital tiers (€500 to €15,000+) funded seamlessly via Bitcoin, Ethereum, or USDT.",
    },
    {
      number: "03",
      title: "Track & Withdraw Earnings",
      description:
        "Monitor contract progress from your investor dashboard. At maturity, manage your available balance according to the applicable contract terms.",
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      detail:
        "Real-time telemetry and automated maturity release. Withdraw principal and yield with zero hidden fees.",
    },
  ]

  return (
    <div className="bg-slate-950 pt-28 pb-16 text-slate-100">
      {/* Hero Header */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs currentPageTitle="How It Works" />

          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
              <Workflow className="h-3.5 w-3.5 text-blue-400" />
              <span>Operational Blueprint</span>
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
              Structured Capital Deployment, Streamlined in Three Steps
            </h1>

            <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
              A structured digital asset deployment workflow designed for
              simplicity, transparency and efficient settlement.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Main Steps with Connected Visual Guide */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-sm transition-all hover:border-blue-500/40 hover:shadow-xl"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800 shadow-xs transition-transform group-hover:scale-105">
                      {step.icon}
                    </div>
                    <span className="font-mono text-4xl font-extrabold text-slate-700 transition-colors group-hover:text-blue-500/30">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed font-medium text-slate-200">
                    {step.description}
                  </p>

                  <p className="text-xs leading-relaxed text-slate-400">
                    {step.detail}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-slate-800 pt-6 text-xs font-semibold text-blue-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Standard Institutional Protocol</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Settlement Flow Lifecycle */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3 py-1 font-mono text-xs font-bold text-blue-300">
              Automated Lifecycle
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Cryptographic Settlement & Maturity Cycle
            </h2>
            <p className="text-base text-slate-400">
              How capital moves securely from client deposit to contract
              maturity and automated distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="font-mono text-xs font-bold text-cyan-400">
                PHASE 01
              </div>
              <h4 className="text-lg font-bold text-white">
                Deposit Ingestion
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                Client transfers BTC, ETH, or USDT to the allocated single-use
                vault. 1 blockchain confirmation activates ledger
                reconciliation.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="font-mono text-xs font-bold text-cyan-400">
                PHASE 02
              </div>
              <h4 className="text-lg font-bold text-white">Epoch Locking</h4>
              <p className="text-xs leading-relaxed text-slate-300">
                Contract enters the active duration cycle (24h to 168h).
                Algorithmic liquidity routing executes in cold-custodied pools.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="font-mono text-xs font-bold text-cyan-400">
                PHASE 03
              </div>
              <h4 className="text-lg font-bold text-white">Yield Accrual</h4>
              <p className="text-xs leading-relaxed text-slate-300">
                Contract yield (10% up to 100%) accrues deterministically.
                Telemetry displays realtime hours remaining to epoch release.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="font-mono text-xs font-bold text-emerald-400">
                PHASE 04
              </div>
              <h4 className="text-lg font-bold text-white">
                Instant Distribution
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                100% of principal plus generated yield is unlocked. Instant
                withdrawal requests dispatch on-chain within 15 minutes.
              </p>
            </div>
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
