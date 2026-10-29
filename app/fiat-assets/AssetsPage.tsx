// AssetsPage.tsx
"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { SupportedCryptoSection } from "@/components/sections/SupportedCryptoSection"
import { DiversifiedCategoriesSection } from "@/components/sections/DiversifiedCategoriesSection"
import { AlternativeAssetsSection } from "@/components/sections/AlternativeAssetsSection"
import { FinalCtaSection } from "@/components/sections/FinalCtaSection"
import { ShieldCheck, Lock, Layers, Database, Key } from "lucide-react"
import { motion } from "framer-motion"

export const AssetsPage: React.FC = () => {
  const router = useRouter()
  const onOpenAuth = (mode: "signin" | "signup") =>
    router.push(`/${mode === "signin" ? "login" : "register"}`)
  const onOpenInvestModal = () => router.push("/investment-plans")
  return (
    <div className="bg-slate-950 pt-28 pb-16 text-slate-100">
      {/* Hero Header */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs currentPageTitle="Supported & Alternative Assets" />

          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 text-[8px] font-bold tracking-wider text-blue-300 uppercase lg:text-xs">
              <Layers className="h-3.5 w-3.5 text-blue-400" />
              <span>Multi-Chain & Physical Assets</span>
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
              Cryptocurrency Settlement Rails & Alternative Asset Classes
            </h1>

            <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
              Explore the cryptographic rails powering instant portfolio
              deposits and withdrawals, alongside high-barrier alternative asset
              classes engineered for institutional stability.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Crypto Rails */}
      <SupportedCryptoSection />

      {/* Custody Architecture Section */}
      <section className="relative overflow-hidden border-y border-slate-800 bg-slate-950/90 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12">
            <div className="space-y-6">
              {/* Section Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3 py-1 font-mono text-xs font-bold text-cyan-300">
                  <Lock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Cold-Storage Security Architecture</span>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Offline Multi-Signature Cold Custody
                </h2>

                <p className="text-base leading-relaxed text-slate-300">
                  Client digital assets are never maintained in persistent hot
                  wallets. Every deposit is routed into segregated, air-gapped
                  cryptographic vaults protected by multi-party computation and
                  quorum approvals.
                </p>
              </motion.div>

              {/* Security Feature Cards */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.18,
                    },
                  },
                }}
                className="space-y-3 pt-2"
              >
                {/* Multi-Signature Consensus */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 45 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.65,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-colors duration-300 hover:border-cyan-500/40 hover:bg-slate-900"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                    <Key className="h-5 w-5 text-cyan-400" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white">
                      3-of-5 Quorum Consensus
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-400">
                      Withdrawals require independent cryptographic key signing
                      across geographically distributed custodians.
                    </div>
                  </div>
                </motion.div>

                {/* Segregated Portfolio Balances */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 45 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.65,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-colors duration-300 hover:border-emerald-500/40 hover:bg-slate-900"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                    <Database className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white">
                      Segregated Portfolio Balances
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-400">
                      Digital assets are reconciled against double-entry ledgers
                      with zero commingling of platform operational liquidity.
                    </div>
                  </div>
                </motion.div>

                {/* Deposit Network Surcharges */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 45 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.65,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition-colors duration-300 hover:border-blue-500/40 hover:bg-slate-900"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white">
                      Zero Network Surcharges on Deposits
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-slate-400">
                      CapitalsFargoFX absorbs all protocol ingestion costs for
                      Bitcoin, Ethereum, and USDT transfers.
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      {/* Diversified Categories */}
      <DiversifiedCategoriesSection />

      {/* Alternative Assets */}
      <AlternativeAssetsSection />

      {/* Final CTA */}
      <FinalCtaSection onOpenAuth={onOpenAuth} />
    </div>
  )
}
