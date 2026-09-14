"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { SupportedCryptoSection } from "@/components/sections/SupportedCryptoSection"
import { DiversifiedCategoriesSection } from "@/components/sections/DiversifiedCategoriesSection"
import { AlternativeAssetsSection } from "@/components/sections/AlternativeAssetsSection"
import { FinalCtaSection } from "@/components/sections/FinalCtaSection"
import {
  ShieldCheck,
  Lock,
  Layers,
  ArrowRight,
  Database,
  Key,
} from "lucide-react"

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
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
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
      <section className="relative overflow-hidden border-y border-slate-800 bg-slate-950/90 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
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

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                  <Key className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      3-of-5 Quorum Consensus
                    </div>
                    <div className="text-xs text-slate-400">
                      Withdrawals require independent cryptographic key signing
                      across geographically distributed custodians.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                  <Database className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      Segregated Portfolio Balances
                    </div>
                    <div className="text-xs text-slate-400">
                      Digital assets are reconciled against double-entry ledgers
                      with zero commingling of platform operational liquidity.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      Zero Network Surcharges on Deposits
                    </div>
                    <div className="text-xs text-slate-400">
                      CapitalsFargoFX absorbs all protocol ingestion costs for
                      Bitcoin, Ethereum, and USDT transfers.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Vault Diagram */}
            <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="font-mono text-xs text-slate-400 uppercase">
                  Custody Protocol Matrix
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                  <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                  <span>Vaults Online</span>
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <span className="text-slate-400">Bitcoin Core (BTC):</span>
                  <span className="font-bold text-white">
                    Native SegWit (Bech32)
                  </span>
                </div>

                <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <span className="text-slate-400">
                    Ethereum Mainnet (ETH):
                  </span>
                  <span className="font-bold text-white">
                    ERC-20 Smart Contract Vault
                  </span>
                </div>

                <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <span className="text-slate-400">Tether USD (USDT):</span>
                  <span className="font-bold text-white">
                    Dual-Rail ERC-20 / TRC-20
                  </span>
                </div>

                <div className="flex justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <span className="text-slate-400">Maturity Execution:</span>
                  <span className="font-bold text-cyan-300">
                    Deterministic Epoch Release
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenInvestModal()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all"
                >
                  <span>Open Capital Allocation Terminal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
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
