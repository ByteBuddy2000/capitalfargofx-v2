// HowItWorksPage.tsx
"use client"

import React from "react"
import { motion, useReducedMotion } from "framer-motion"
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

const easing = [0.22, 1, 0.36, 1] as const

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easing,
    },
  },
}

const stepVariants = {
  hidden: {
    opacity: 0,
    y: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easing,
    },
  },
}

const lifecycleVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.12,
      ease: easing,
    },
  }),
}

export const HowItWorksPage: React.FC = () => {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

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

  const lifecyclePhases = [
    {
      phase: "PHASE 01",
      title: "Deposit Ingestion",
      description:
        "Client transfers BTC, ETH, or USDT to the allocated single-use vault. 1 blockchain confirmation activates ledger reconciliation.",
      color: "text-cyan-400",
    },
    {
      phase: "PHASE 02",
      title: "Epoch Locking",
      description:
        "Contract enters the active duration cycle (24h to 168h). Algorithmic liquidity routing executes in cold-custodied pools.",
      color: "text-cyan-400",
    },
    {
      phase: "PHASE 03",
      title: "Yield Accrual",
      description:
        "Contract yield (10% up to 100%) accrues deterministically. Telemetry displays realtime hours remaining to epoch release.",
      color: "text-cyan-400",
    },
    {
      phase: "PHASE 04",
      title: "Instant Distribution",
      description:
        "100% of principal plus generated yield is unlocked. Instant withdrawal requests dispatch on-chain within 15 minutes.",
      color: "text-emerald-400",
    },
  ]

  const reveal = (variants: typeof fadeUpVariants) =>
    shouldReduceMotion
      ? { initial: false as const }
      : {
          variants,
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, amount: 0.15 },
        }

  return (
    <div className="bg-slate-950 pt-28 pb-16 text-slate-100">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(fadeUpVariants)} className="space-y-6">
            <Breadcrumbs currentPageTitle="How It Works" />

            <div className="max-w-3xl space-y-6 text-left">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: easing }}
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 text-[8px] font-bold tracking-wider text-blue-300 uppercase lg:text-xs"
              >
                <Workflow className="h-3.5 w-3.5 text-blue-400" />
                <span>Operational Blueprint</span>
              </motion.div>

              <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
                Structured Capital Deployment, Streamlined in Three Steps
              </h1>

              <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
                A structured digital asset deployment workflow designed for
                simplicity, transparency and efficient settlement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three Main Steps */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView={shouldReduceMotion ? undefined : "visible"}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.15 }}
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-blue-500/40 hover:shadow-xl"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <motion.div
                      whileHover={
                        shouldReduceMotion
                          ? undefined
                          : { scale: 1.08, rotate: 3 }
                      }
                      transition={{ duration: 0.25 }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800 shadow-xs"
                    >
                      {step.icon}
                    </motion.div>

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

                  <p className="hidden text-xs leading-relaxed text-slate-400">
                    {step.detail}
                  </p>
                </div>

                <div className="mt-6 hidden items-center gap-2 border-t border-slate-800 pt-6 text-xs font-semibold text-blue-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Standard Institutional Protocol</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Settlement Lifecycle */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            {...reveal(fadeUpVariants)}
            className="mx-auto mb-14 max-w-3xl space-y-3 text-center"
          >
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
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {lifecyclePhases.map((phase, idx) => (
              <motion.div
                key={phase.phase}
                custom={idx}
                variants={lifecycleVariants}
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView={shouldReduceMotion ? undefined : "visible"}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={shouldReduceMotion ? undefined : { y: -5 }}
                className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-colors duration-300 hover:border-blue-500/40"
              >
                <div className={`font-mono text-xs font-bold ${phase.color}`}>
                  {phase.phase}
                </div>

                <h4 className="text-lg font-bold text-white">{phase.title}</h4>

                <p className="text-xs leading-relaxed text-slate-300">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded Yield Simulator */}
      <motion.div {...reveal(fadeUpVariants)}>
        <YieldSimulator onOpenInvest={onOpenInvestModal} />
      </motion.div>

      {/* Final CTA */}
      <motion.div {...reveal(fadeUpVariants)}>
        <FinalCtaSection onOpenAuth={onOpenAuth} />
      </motion.div>
    </div>
  )
}
