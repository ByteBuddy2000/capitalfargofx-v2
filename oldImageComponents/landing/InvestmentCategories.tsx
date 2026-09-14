import React from "react"
import { motion } from "motion/react"
import {
  Coins,
  Globe2,
  Database,
  TrendingUp,
  Building2,
  Landmark,
  ArrowRight,
} from "lucide-react"

interface InvestmentCategoriesProps {
  onSelectCategory?: (category: string) => void
}

export const InvestmentCategories: React.FC<InvestmentCategoriesProps> = ({
  onSelectCategory,
}) => {
  const categories = [
    {
      id: "crypto",
      title: "Cryptocurrency Markets",
      description:
        "Systematic algorithmic yield generated across major liquidity pools in Bitcoin, Ethereum, and multi-network stablecoins.",
      icon: <Coins className="h-6 w-6 text-amber-500" />,
      yieldTag: "Primary Allocation",
      popular: true,
    },
    {
      id: "forex",
      title: "Global Forex Arbitrage",
      description:
        "Sub-millisecond institutional currency execution capitalizing on micro-discrepancies across Tier-1 interbank exchange nodes.",
      icon: <Globe2 className="h-6 w-6 text-blue-500" />,
      yieldTag: "High Liquidity",
    },
    {
      id: "digital-assets",
      title: "Tokenized Digital Assets",
      description:
        "Structured exposures into tokenized treasuries, staking derivatives, and high-velocity computational infrastructure.",
      icon: <Database className="h-6 w-6 text-indigo-500" />,
      yieldTag: "Emerging Sector",
    },
    {
      id: "stocks",
      title: "Institutional Equities",
      description:
        "Macro hedge strategies focused on global technology, artificial intelligence infrastructure, and dividend-yielding multinationals.",
      icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
      yieldTag: "Growth Capital",
    },
    {
      id: "bonds",
      title: "Sovereign Bonds & ETFs",
      description:
        "Conservative capital preservation instruments anchored in short-duration treasury notes and investment-grade corporate bonds.",
      icon: <Landmark className="h-6 w-6 text-slate-700" />,
      yieldTag: "Fixed Income",
    },
    {
      id: "real-estate",
      title: "Commercial Real Estate",
      description:
        "Fractionalized, yield-producing commercial properties and prime logistics hubs providing steady quarterly capital distributions.",
      icon: <Building2 className="h-6 w-6 text-teal-600" />,
      yieldTag: "Asset-Backed",
    },
  ]

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
              Multi-Asset Capabilities
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Diversified Investment Categories
            </h2>
            <p className="mt-2 max-w-xl text-base text-slate-600">
              Access comprehensive multi-market asset classes managed by
              CapitalsFargoFX&apos;s automated portfolio algorithms.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`relative flex flex-col justify-between rounded-2xl border bg-white p-7 transition-all hover:shadow-lg ${
                cat.popular
                  ? "border-blue-300 ring-1 ring-blue-500/20"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    {cat.icon}
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                    {cat.yieldTag}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-900">
                  {cat.title}
                </h3>

                <p className="mb-6 text-xs leading-relaxed text-slate-600">
                  {cat.description}
                </p>
              </div>

              <button
                onClick={() => onSelectCategory?.(cat.title)}
                className="group inline-flex cursor-pointer items-center gap-1.5 border-t border-slate-100 pt-4 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700"
              >
                <span>Learn More</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
