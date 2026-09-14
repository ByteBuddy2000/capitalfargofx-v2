import React, { useEffect, useState } from "react"
import { PLATFORM_METRICS } from "../../lib/data"
import { Users, Vault, ArrowDownRight, Layers, Info } from "lucide-react"

export const MetricsSection: React.FC = () => {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true)
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  const getMetricIcon = (id: string) => {
    switch (id) {
      case "investors":
        return <Users className="h-5 w-5 text-blue-600" />
      case "deposits":
        return <Vault className="h-5 w-5 text-emerald-600" />
      case "withdrawals":
        return <ArrowDownRight className="h-5 w-5 text-indigo-600" />
      case "assets":
        return <Layers className="h-5 w-5 text-amber-600" />
      default:
        return <Users className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <section
      id="platform-metrics-section"
      className="relative border-y border-slate-800 bg-slate-900/60 py-12 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="font-mono text-xs font-bold tracking-wider text-blue-400 uppercase">
              Platform Liquidity & Execution
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Verified Operational Metrics
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400">
            <Info className="h-3.5 w-3.5 text-slate-500" />
            <span>
              Platform-reported telemetry based on active settlement ledgers
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_METRICS.map((metric) => (
            <div
              key={metric.id}
              id={`metric-card-${metric.id}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition-all hover:border-blue-500/40 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-2.5 transition-colors group-hover:bg-blue-950/60">
                  {getMetricIcon(metric.id)}
                </div>
                <span className="rounded-full border border-slate-700/50 bg-slate-800 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-300 transition-colors group-hover:bg-blue-950/80 group-hover:text-blue-300">
                  {metric.badge}
                </span>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-3xl font-extrabold tracking-tight text-white transition-colors group-hover:text-blue-400">
                  {metric.value}
                </div>
                <div className="text-sm font-bold text-slate-200">
                  {metric.label}
                </div>
                <div className="text-xs text-slate-400">{metric.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
