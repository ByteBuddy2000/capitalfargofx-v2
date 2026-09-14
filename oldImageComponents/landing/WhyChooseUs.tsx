import React from "react"
import { motion } from "motion/react"
import {
  ShieldCheck,
  FileText,
  Layers,
  Zap,
  PieChart,
  Headphones,
} from "lucide-react"

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      title: "Secure Platform",
      description:
        "End-to-end cryptographic encryption, cold vault asset storage, and double-entry immutable accounting logs for complete capital protection.",
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      tag: "Bank-Grade Security",
    },
    {
      title: "Transparent Terms",
      description:
        "No hidden fees or ambiguous lockups. Exact return percentages, contract maturities, and principal conditions are established upfront.",
      icon: <FileText className="h-6 w-6 text-emerald-600" />,
      tag: "Zero Hidden Fees",
    },
    {
      title: "Flexible Investment Plans",
      description:
        "Tailored investment tiers ranging from the 24-hour Basic plan to the high-yield 72-hour Gold & Ultimate institutional allocations.",
      icon: <Layers className="h-6 w-6 text-indigo-600" />,
      tag: "10% to 100% Returns",
    },
    {
      title: "Fast Account Management",
      description:
        "Streamlined deposit verification, live crypto wallet address generation, and automated withdrawal processing on BTC, ETH, and USDT.",
      icon: <Zap className="h-6 w-6 text-amber-600" />,
      tag: "Instant Crypto Routes",
    },
    {
      title: "Portfolio Monitoring",
      description:
        "Comprehensive dashboard analytics, historical chart tracking, real-time yield maturity progress, and itemized transaction receipts.",
      icon: <PieChart className="h-6 w-6 text-sky-600" />,
      tag: "Live Alpha Telemetry",
    },
    {
      title: "Dedicated Support",
      description:
        "24/7 dedicated institutional investor assistance via prioritized in-app ticketing, email support, and verified VIP communication channels.",
      icon: <Headphones className="h-6 w-6 text-teal-600" />,
      tag: "24/7 Investor Desk",
    },
  ]

  return (
    <section className="border-y border-slate-200/80 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold tracking-wider text-slate-700 uppercase">
            Fintech Excellence
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Why High-Net-Worth Investors Choose CapitalsFargoFX
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Our technology stack is purpose-built to eliminate volatility
            friction, deliver predictable yield schedules, and safeguard
            investor liquidity across all market conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group rounded-2xl border border-slate-200/80 bg-slate-50/80 p-7 transition-all hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <span className="rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  {feature.tag}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                {feature.title}
              </h3>

              <p className="text-xs leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
