import React from "react"
import { motion } from "motion/react"
import {
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Zap,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "../ui/Button"

interface HeroProps {
  onOpenRegister: () => void
  onExplorePlans: () => void
}

export const Hero: React.FC<HeroProps> = ({
  onOpenRegister,
  onExplorePlans,
}) => {
  return (
    <section
      id="hero"
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-slate-950 pt-32 pb-20 text-white"
    >
      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-600/15 via-emerald-500/10 to-transparent blur-3xl" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            {/* Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 text-xs font-medium text-slate-300 shadow-xs backdrop-blur-md"
            >
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="font-semibold text-emerald-400">
                Institutional Yield Engine
              </span>
              <span className="text-slate-600">•</span>
              <span>Audited Multi-Asset Settlement</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 text-4xl leading-[1.1] font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Build Your Financial Future With{" "}
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Smarter Digital Investing
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 max-w-2xl text-base leading-relaxed font-normal text-slate-300 sm:text-lg"
            >
              Access structured investment opportunities and manage your
              portfolio from one secure platform. Engineered for institutional
              transparency, automated yield compounding, and instantaneous
              cryptocurrency withdrawals.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-10 flex w-full flex-wrap items-center gap-4 sm:w-auto"
            >
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={onOpenRegister}
                className="w-full border-none bg-gradient-to-r from-blue-600 to-emerald-600 px-7 py-3.5 shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-emerald-700 sm:w-auto"
              >
                Start Investing
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onExplorePlans}
                className="w-full border-slate-700 bg-slate-900/80 px-6 py-3.5 text-white hover:bg-slate-800 sm:w-auto"
              >
                Explore Plans
              </Button>
            </motion.div>

            {/* Trust Microcopy Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid w-full grid-cols-1 gap-4 border-t border-slate-800/80 pt-6 sm:grid-cols-3"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Secure account management</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Transparent investment terms</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>24/7 account access</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Sharp Financial Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:col-span-5"
          >
            {/* Glowing Backdrop Frame */}
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl shadow-blue-950/40 lg:max-w-none">
              {/* Card Header with Live Ticker */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-600/20 text-blue-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-white">
                      Portfolio Alpha Tracker
                    </h3>
                    <p className="font-mono text-[11px] text-slate-400">
                      Live Node Status: Operational
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-800 bg-emerald-950/60 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                  +55.0% APY
                </div>
              </div>

              {/* Stat Metric Grid */}
              <div className="my-5 grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
                  <p className="text-[11px] font-medium text-slate-400">
                    Gold Plan Benchmark
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-white">
                    $15,500.00
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <ArrowUpRight className="h-3 w-3" />
                    +$5,500 Profit (72h)
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
                  <p className="text-[11px] font-medium text-slate-400">
                    Affiliate Downline Yield
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-white">
                    5.00%
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-blue-400">
                    <Zap className="h-3 w-3" />
                    Instant Settlement
                  </p>
                </div>
              </div>

              {/* Mini Simulated Yield Chart Visual */}
              <div className="mb-5 rounded-2xl border border-slate-800/80 bg-slate-950 p-4">
                <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">
                    Continuous Growth Curve
                  </span>
                  <span className="rounded-md border border-emerald-800 bg-emerald-950/80 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                    24h / 72h Epochs
                  </span>
                </div>
                {/* SVG Trend Wave */}
                <div className="relative flex h-20 w-full items-end">
                  <svg
                    className="h-full w-full overflow-visible"
                    viewBox="0 0 300 80"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="heroGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10B981"
                          stopOpacity="0.4"
                        />
                        <stop
                          offset="100%"
                          stopColor="#10B981"
                          stopOpacity="0.0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,70 Q40,65 80,45 T160,35 T240,15 T300,5"
                      fill="none"
                      stroke="var(--landing-cyan)"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M0,70 Q40,65 80,45 T160,35 T240,15 T300,5 L300,80 L0,80 Z"
                      fill="url(#heroGradient)"
                    />
                  </svg>
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-500">
                  <span>Allocation ($10k)</span>
                  <span>Maturity ($15.5k)</span>
                </div>
              </div>

              {/* Supported Multi-Crypto Bar */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-bold text-amber-400">
                    ₿
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-xs font-bold text-blue-400">
                    Ξ
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-xs font-bold text-emerald-400">
                    ₮
                  </div>
                  <span className="ml-1 text-xs font-medium text-slate-400">
                    BTC · ETH · USDT
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-400">
                  Zero Deposit Fees
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
