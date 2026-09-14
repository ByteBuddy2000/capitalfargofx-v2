import React from "react"
import { WHY_CapitalsFargoFX } from "../../lib/data"
import {
  ShieldCheck,
  Percent,
  TrendingUp,
  Zap,
  Activity,
  Headphones,
  Sparkles,
  CheckCircle2,
} from "lucide-react"

export const WhyUsSection: React.FC = () => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <ShieldCheck className="h-5 w-5 text-blue-600" />
      case 1:
        return <Percent className="h-5 w-5 text-emerald-600" />
      case 2:
        return <TrendingUp className="h-5 w-5 text-indigo-600" />
      case 3:
        return <Zap className="h-5 w-5 text-amber-500" />
      case 4:
        return <Activity className="h-5 w-5 text-cyan-600" />
      case 5:
        return <Headphones className="h-5 w-5 text-purple-600" />
      default:
        return <ShieldCheck className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <section
      id="why-CapitalsFargofx-section"
      className="relative overflow-hidden border-t border-slate-800 bg-slate-950/60 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Institutional Advantage</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Why High-Net-Worth Investors Choose CapitalsFargoFX
          </h2>

          <p className="text-base text-slate-300">
            Engineered around predictability, double-entry ledger certainty, and
            transparent execution timelines.
          </p>
        </div>

        {/* 6 Glass Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_CapitalsFargoFX.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl sm:p-7"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800 transition-colors group-hover:bg-blue-950/80">
                    {getIcon(idx)}
                  </div>
                  <span className="rounded-full border border-slate-700/50 bg-slate-800 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-300 transition-colors group-hover:bg-blue-950/80 group-hover:text-blue-300">
                    {item.tag}
                  </span>
                </div>

                <div className="mb-1 text-xs font-bold tracking-wider text-blue-400 uppercase">
                  {item.subtitle}
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1.5 border-t border-slate-800 pt-5 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Verified Protocol Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
