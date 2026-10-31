// components/SupportedCryptoSection.tsx
"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { SUPPORTED_CRYPTOS } from "../../lib/data"
import { ShieldCheck, Lock, ArrowUpRight } from "lucide-react"

const cryptoImages: Record<string, string> = {
  BTC: "/bitcoin.png",
  ETH: "/ethereum.png",
  USDT: "/usdt.png",
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export const SupportedCryptoSection: React.FC = () => {
  return (
    <section
      id="crypto-settlement-rails-section"
      className="overflow-hidden border-b border-slate-800 bg-slate-950/80 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Introduction */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-12 max-w-3xl space-y-4 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3.5 py-1 text-[10px] font-bold tracking-wider text-emerald-300 uppercase sm:text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Cryptocurrency Settlement Rails</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Supported Digital Assets
          </h2>

          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            Explore the digital assets supported by our settlement
            infrastructure, with network details and transaction information
            presented for clarity.
          </p>
        </motion.div>

        {/* Cryptocurrency Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 py-4 pb-5 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3"
        >
          {SUPPORTED_CRYPTOS.map((crypto) => (
            <motion.article
              key={crypto.symbol}
              id={`crypto-rail-${crypto.symbol.toLowerCase()}`}
              variants={fadeInUp}
              className="group relative flex w-[min(85vw,340px)] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20 sm:w-85 sm:p-7 md:w-auto md:min-w-0"
            >
              {/* Decorative Background */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-emerald-500/5 blur-3xl transition-colors duration-300 group-hover:bg-emerald-500/10" />

              {/* Asset Header */}
              <div className="relative mb-7 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800 shadow-sm transition-colors duration-300 group-hover:border-emerald-500/30">
                    <Image
                      src={cryptoImages[crypto.symbol] ?? "/bitcoin.png"}
                      alt={`${crypto.name} icon`}
                      fill
                      sizes="56px"
                      className="object-contain p-2.5"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-white sm:text-xl">
                      {crypto.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs font-semibold tracking-wider text-slate-400">
                      {crypto.symbol}
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-400" />
              </div>

              {/* Network Information */}
              <div className="relative flex-1 space-y-4 border-y border-slate-800 py-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-400">
                    Settlement Network
                  </span>
                  <span className="max-w-[60%] text-right text-xs leading-relaxed font-semibold text-slate-200">
                    {crypto.network}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-400">Deposit Fee</span>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                    {crypto.depositFee}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs text-slate-400">
                    Confirmation Speed
                  </span>
                  <span className="max-w-[60%] text-right text-xs leading-relaxed font-semibold text-blue-400">
                    {crypto.confirmationSpeed}
                  </span>
                </div>
              </div>

              {/* Security Footer */}
              <div className="relative mt-5 flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Lock className="h-4 w-4 text-emerald-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Security Infrastructure
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Multi-signature cold storage protocol
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Transaction Disclaimer */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-6 hidden text-center text-xs leading-relaxed text-slate-500"
        >
          Digital asset transactions may require on-chain verification.
          Supported networks, fees, and confirmation times may vary.
        </motion.p>
      </div>
    </section>
  )
}

export default SupportedCryptoSection
