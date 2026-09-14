import React from "react"
import { DIVERSIFIED_CATEGORIES } from "../../lib/data"
import {
  Coins,
  Globe2,
  FileCode2,
  LineChart,
  Building2,
  Scale,
  Sparkles,
  ArrowUpRight,
} from "lucide-react"

interface DiversifiedCategory {
  readonly title: string
  readonly description: string
  readonly tag: string
  readonly metric: string
}

export const DiversifiedCategoriesSection: React.FC = () => {
  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Coins className="h-5 w-5 text-blue-600" />
      case 1:
        return <Globe2 className="h-5 w-5 text-indigo-600" />
      case 2:
        return <FileCode2 className="h-5 w-5 text-cyan-600" />
      case 3:
        return <LineChart className="h-5 w-5 text-emerald-600" />
      case 4:
        return <Scale className="h-5 w-5 text-amber-600" />
      case 5:
        return <Building2 className="h-5 w-5 text-purple-600" />
      default:
        return <Coins className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <section
      id="diversified-categories-section"
      className="border-t border-slate-800 bg-slate-900/40 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Multi-Asset Portfolio Reach</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Diversified Investment Categories
          </h2>

          <p className="text-base text-slate-300">
            Systematic exposure across high-liquidity digital assets, tokenized
            instruments, and macroeconomic capital markets.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DIVERSIFIED_CATEGORIES.map((category, idx) => (
            <div
              key={category.title}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800 transition-colors group-hover:bg-blue-950/80">
                    {getCategoryIcon(idx)}
                  </div>
                  <span className="rounded-full border border-slate-700/50 bg-slate-800 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-300 transition-colors group-hover:bg-blue-950/80 group-hover:text-blue-300">
                    {category.tag}
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                  {category.title}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-slate-400">
                  {category.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-4 font-mono text-xs">
                <span className="text-slate-400">Allocation Target:</span>
                <span className="text-[9px] lg:text-sm font-semibold text-slate-200">
                  {category.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
