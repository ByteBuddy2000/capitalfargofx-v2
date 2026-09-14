import React from "react"
import { motion } from "motion/react"
import {
  ShieldCheck,
  Layers,
  Activity,
  Lock,
  Cpu,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import { Button } from "../ui/Button"

interface AboutSectionProps {
  onOpenRegister?: () => void
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenRegister,
}) => {
  return (
    <section id="about" className="relative overflow-hidden bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Visual Tech Graphic & System Highlights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-[11px] font-semibold text-blue-400">
                  <Cpu className="h-3.5 w-3.5" />
                  Enterprise Grade Architecture
                </div>

                <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">
                  Autonomous Asset Liquidity & Yield Engine
                </h3>

                <p className="mb-6 text-sm leading-relaxed text-slate-300">
                  Our proprietary financial core orchestrates cross-chain
                  decentralized liquidity pools, automated arbitrage
                  settlements, and collateralized digital strategies to ensure
                  dependable scheduled payouts.
                </p>

                {/* Metrics Pill Grid */}
                <div className="space-y-3 border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/60 p-3">
                    <span className="text-xs text-slate-300">
                      Audited Ledger Architecture
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      100% Immutable
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/60 p-3">
                    <span className="text-xs text-slate-300">
                      Cold-Vault Capital Reserves
                    </span>
                    <span className="text-xs font-bold text-blue-400">
                      Multi-Signature
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/60 p-3">
                    <span className="text-xs text-slate-300">
                      Withdrawal Execution SLA
                    </span>
                    <span className="text-xs font-bold text-white">
                      Instant / Automated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Institutional Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start lg:col-span-7"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              About CapitalsFargoFX
            </div>

            <h2 className="mb-6 text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Built Around Smarter Financial Management
            </h2>

            <p className="mb-6 text-base leading-relaxed text-slate-600">
              CapitalsFargoFX is an international digital asset management and
              cryptocurrency investment firm engineered to deliver structured
              returns. By combining cutting-edge algorithmic market routing with
              institutional transparency, we bridge traditional financial rigor
              and decentralized digital opportunity.
            </p>

            <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <div className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Structured Plans
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Predefined 24h & 72h contract terms with guaranteed
                    principal protection.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <div className="shrink-0 rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Real-Time Monitoring
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Live portfolio performance metrics, maturity counters, and
                    balance ledgers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <div className="shrink-0 rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Cold-Storage Custody
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Institutional multi-sig protection over all Bitcoin,
                    Ethereum, and USDT holdings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <div className="shrink-0 rounded-lg bg-amber-50 p-2 text-amber-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    5% Affiliate Downline
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Instant affiliate commission credited on every qualifying
                    partner deposit.
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={onOpenRegister}
              className="bg-blue-600 px-6 py-3 hover:bg-blue-700"
            >
              Get Started with CapitalsFargoFX
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
