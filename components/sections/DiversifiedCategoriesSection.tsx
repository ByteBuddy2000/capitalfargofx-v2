"use client"

import React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { DIVERSIFIED_CATEGORIES } from "../../lib/data"
import {
  Coins,
  Globe2,
  FileCode2,
  LineChart,
  Building2,
  Scale,
  Sparkles,
} from "lucide-react"

interface DiversifiedCategory {
  readonly title: string
  readonly description: string
  readonly tag: string
  readonly metric: string
}

const categoryIcons = [
  Coins,
  Globe2,
  FileCode2,
  LineChart,
  Scale,
  Building2,
] as const

const iconColors = [
  "text-blue-600",
  "text-indigo-600",
  "text-cyan-600",
  "text-emerald-600",
  "text-amber-600",
  "text-purple-600",
] as const

const cardVariants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: index % 2 === 0 ? -60 : 60,
    y: 20,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export const DiversifiedCategoriesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="diversified-categories-section"
      className="overflow-hidden border-t border-slate-800 bg-slate-900/40 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading animation */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 30 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mb-14 max-w-3xl space-y-3 text-center"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Multi-Asset Portfolio Reach</span>
          </motion.div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Diversified Investment Categories
          </h2>

          <p className="text-base text-slate-300">
            Systematic exposure across high-liquidity digital assets,
            tokenized instruments, and macroeconomic capital markets.
          </p>
        </motion.div>

        {/* Animated category cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DIVERSIFIED_CATEGORIES.map((category, idx) => {
            const Icon = categoryIcons[idx % categoryIcons.length]
            const iconColor = iconColors[idx % iconColors.length]

            return (
              <motion.div
                key={category.title}
                custom={idx}
                variants={
                  shouldReduceMotion
                    ? undefined
                    : cardVariants
                }
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView={
                  shouldReduceMotion
                    ? undefined
                    : "visible"
                }
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  delay: (idx % 3) * 0.12,
                }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-7 shadow-xs transition-[border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg"
              >
                <div className="border-b border-slate-800">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800 transition-colors duration-300 group-hover:bg-blue-950/80">
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>

                    <span className="rounded-full border border-slate-700/50 bg-slate-800 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-300 transition-colors group-hover:bg-blue-950/80 group-hover:text-blue-300">
                      {category.tag}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                    {category.title}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-slate-400">
                    {category.description}
                  </p>
                </div>

                <div className="hidden items-center justify-between border-t border-slate-800 pt-4 font-mono text-xs">
                {/* <div className="flex items-center justify-between border-t border-slate-800 pt-4 font-mono text-xs"> */}
                  <span className="text-slate-400">
                    Allocation Target:
                  </span>

                  <span className="text-[9px] font-semibold text-slate-200 lg:text-sm">
                    {category.metric}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}