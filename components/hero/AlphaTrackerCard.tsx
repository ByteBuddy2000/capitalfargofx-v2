import React, { useState } from "react"
import {
  TrendingUp,
  Activity,
} from "lucide-react"

export const AlphaTrackerCard: React.FC = () => {
  const [activeEpoch, setActiveEpoch] = useState<"24h" | "72h">("72h")

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-6 -left-6 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-6 -bottom-8 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-emerald-400/15 blur-2xl" />

      {/* Floating Crypto Badges */}
      <div
        className="absolute -top-4 -right-2 z-20 flex animate-bounce items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/95 px-3 py-1.5 font-mono text-xs shadow-xl backdrop-blur-md"
        style={{ animationDuration: "4s" }}
      >
        <span className="h-2 w-2 rounded-full bg-amber-400"></span>
        <span className="font-bold text-slate-100">BTC</span>
        <span className="text-[10px] text-slate-400">Native</span>
      </div>

      <div
        className="absolute top-1/3 -left-5 z-20 hidden animate-bounce items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/95 px-3 py-1.5 font-mono text-xs shadow-xl backdrop-blur-md sm:flex"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      >
        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
        <span className="font-bold text-slate-100">ETH</span>
        <span className="text-[10px] font-semibold text-emerald-400">
          ERC-20
        </span>
      </div>

      <div className="absolute right-8 -bottom-3 z-20 flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/95 px-3 py-1.5 font-mono text-xs shadow-xl backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
        <span className="font-bold text-slate-100">USDT</span>
        <span className="text-[10px] text-slate-400">0% Fees</span>
      </div>

      {/* Main Glass Panel Card */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-600/40 bg-blue-950/80 text-blue-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Portfolio Alpha Tracker
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span>
                  Live Node Status:{" "}
                  <span className="font-bold text-emerald-400">
                    Operational
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 font-mono text-xs font-bold text-emerald-400">
              +55.0% APY
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              Gold Plan Benchmark
            </div>
          </div>
        </div>

        {/* Value Display */}
        <div className="pt-4 pb-2">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400">
                Total Projected Valuation
              </div>
              <div className="font-mono text-3xl font-extrabold tracking-tight text-white">
                €15,500.00
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-950/50 px-2 py-1 text-sm font-bold text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                +€5,500 Profit
              </span>
              <div className="mt-1 font-mono text-[10px] text-slate-400">
                {activeEpoch === "72h"
                  ? "72h Structured Cycle"
                  : "24h Fast Epoch"}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Growth Curve SVG Visual */}
        <div className="relative my-3 pt-2">
          <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span>Continuous Growth Curve</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveEpoch("24h")}
                className={`rounded px-2 py-0.5 text-[10px] font-bold transition-all ${
                  activeEpoch === "24h"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                24h
              </button>
              <button
                type="button"
                onClick={() => setActiveEpoch("72h")}
                className={`rounded px-2 py-0.5 text-[10px] font-bold transition-all ${
                  activeEpoch === "72h"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                72h Epochs
              </button>
            </div>
          </div>

          <div className="relative h-28 w-full">
            <svg
              viewBox="0 0 400 110"
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1="0"
                y1="20"
                x2="400"
                y2="20"
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="55"
                x2="400"
                y2="55"
                stroke="#334155"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="90"
                x2="400"
                y2="90"
                stroke="#334155"
                strokeDasharray="3 3"
              />

              {/* Area */}
              <path
                d="M 0 95 Q 120 85, 200 50 T 400 15 L 400 110 L 0 110 Z"
                fill="url(#curveGradient)"
              />

              {/* Line */}
              <path
                d="M 0 95 Q 120 85, 200 50 T 400 15"
                fill="none"
                stroke="url(#strokeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Glowing data points */}
              <circle
                cx="200"
                cy="50"
                r="4"
                fill="#3b82f6"
                className="animate-ping"
                style={{
                  transformOrigin: "200px 50px",
                  animationDuration: "3s",
                }}
              />
              <circle cx="200" cy="50" r="4" fill="#3b82f6" />
              <circle cx="400" cy="15" r="5" fill="#10b981" />
            </svg>

            {/* Float tag on current endpoint */}
            <div className="absolute top-1 right-0 translate-y-[-50%] rounded bg-emerald-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm">
              Maturity: €15,500
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Allocation
            </div>
            <div className="font-mono text-base font-bold text-white">
              €10,000
            </div>
            <div className="text-[10px] text-slate-400">
              100% Principal Return
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/30 bg-blue-950/50 p-2.5">
            <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-blue-300 uppercase">
              <span>Affiliate Downline</span>
              <span className="font-mono font-bold text-blue-400">5.00%</span>
            </div>
            <div className="font-mono text-base font-bold text-blue-100">
              +€500.00
            </div>
            <div className="text-[10px] text-blue-400">Instant Settlement</div>
          </div>
        </div>
      </div>
    </div>
  )
}
