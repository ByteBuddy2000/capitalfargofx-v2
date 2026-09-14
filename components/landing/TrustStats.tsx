import React from "react"
import { motion } from "motion/react"
import { Users, ArrowDownToLine, ArrowUpFromLine, Coins } from "lucide-react"
import { PlatformSettings } from "../../types"
import { storage } from "../../lib/storage"

interface TrustStatsProps {
  settings?: PlatformSettings
}

export const TrustStats: React.FC<TrustStatsProps> = ({ settings }) => {
  const currentSettings = settings || storage.getSettings() || {}

  const stats = [
    {
      label: "Active Investors",
      value: currentSettings.activeInvestorsDisplay || "2,600+",
      description: "Verified global portfolios",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      change: "+14% this month",
    },
    {
      label: "Total Deposits",
      value: currentSettings.totalDepositsDisplay || "$967K+",
      description: "Secured in structured vaults",
      icon: <ArrowDownToLine className="h-5 w-5 text-emerald-500" />,
      change: "100% principal protected",
    },
    {
      label: "Withdrawals Processed",
      value: currentSettings.totalWithdrawalsDisplay || "$3.7M+",
      description: "Instant liquidity execution",
      icon: <ArrowUpFromLine className="h-5 w-5 text-amber-500" />,
      change: "Avg. dispatch: < 15 mins",
    },
    {
      label: "Supported Assets",
      value: currentSettings.supportedAssetsDisplay || "BTC · ETH · USDT",
      description: "Major blockchain networks",
      icon: <Coins className="h-5 w-5 text-indigo-500" />,
      change: "Zero deposit fees",
    },
  ]

  return (
    <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-900/5 transition-all hover:translate-y-[-2px] hover:border-slate-300"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                {stat.label}
              </span>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2">
                {stat.icon}
              </div>
            </div>

            <div className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {stat.value}
            </div>

            <p className="mt-1 text-xs text-slate-500">{stat.description}</p>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-emerald-600">
              <span>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
