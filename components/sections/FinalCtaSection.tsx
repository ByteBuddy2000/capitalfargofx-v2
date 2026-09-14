"use client"

import React from "react"
import { useRouter } from "next/navigation"
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"

interface FinalCtaSectionProps {
  onOpenAuth: (mode: "signup" | "signin") => void
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onOpenAuth,
}) => {
  const router = useRouter()
  const benefits = [
    "No account opening fees",
    "Zero deposit transaction charges",
    "24/7 account monitoring",
  ]

  return (
    <section
      id="final-cta-section"
      className="relative overflow-hidden border-t border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 py-20 text-white sm:py-24"
    >
      {/* Abstract Background Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-cyan-300 uppercase">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Institutional Capital Deployment</span>
        </div>

        <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
          Start Managing Your Investment Journey Today
        </h2>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-xl">
          Create your verified investor account, explore structured
          cryptocurrency investment plans, and experience dependable digital
          market liquidity.
        </p>

        {/* Benefits checklist */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 sm:gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-sm font-medium text-slate-200"
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <button
            id="final-cta-create-account-btn"
            onClick={() => onOpenAuth("signup")}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-blue-500/25 transition-all hover:from-cyan-300 hover:to-indigo-500 sm:w-auto"
          >
            <span>Create Investor Account</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            id="final-cta-explore-plans-btn"
            onClick={() => {
              router.push("/investment-plans")
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
          >
            <span>Explore Plans</span>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <div className="hidden pt-4 font-mono text-xs text-slate-400">
          Cold-Vault Cryptographic Security · Automated Maturity Epochs · 24/7
          Support Desk
        </div>
      </div>
    </section>
  )
}
