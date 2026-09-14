import React from "react"
import { motion } from "motion/react"
import { UserPlus, Layers, TrendingUp, ArrowRight } from "lucide-react"

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Create Your Account",
      description:
        "Register securely in under two minutes. Configure your multi-chain cryptocurrency receiving wallet addresses for automated payouts.",
      icon: <UserPlus className="h-6 w-6 text-blue-600" />,
      badge: "Identity & Wallet Setup",
    },
    {
      step: "02",
      title: "Choose an Investment Plan",
      description:
        "Select your preferred structured yield contract (Basic, Gold, or Ultimate) and transfer your investment capital via Bitcoin, Ethereum, or USDT.",
      icon: <Layers className="h-6 w-6 text-emerald-600" />,
      badge: "Deposit Verification",
    },
    {
      step: "03",
      title: "Track & Withdraw Earnings",
      description:
        "Watch real-time contract progress on your live investor dashboard. Upon maturity, request instant withdrawals or compound your profits.",
      icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
      badge: "Instant Liquidity Payouts",
    },
  ]

  return (
    <section
      id="how-it-works"
      className="border-b border-slate-200/80 bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold tracking-wider text-slate-700 uppercase">
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            How CapitalsFargoFX Works
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            A frictionless digital asset deployment workflow engineered for
            simplicity, verifiable transparency, and high performance.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/80 p-8 transition-all hover:border-slate-300 hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-slate-300 transition-colors group-hover:text-blue-600">
                    {item.step}
                  </span>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                </div>

                <span className="mb-3 inline-block rounded-full border border-blue-200/60 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                  {item.badge}
                </span>

                <h3 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                  {item.title}
                </h3>

                <p className="text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>

              {idx < 2 && (
                <div className="absolute top-1/2 -right-4 z-10 hidden -translate-y-1/2 text-slate-300 md:block">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
