// MetricsSection.tsx

"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { PLATFORM_METRICS } from "../../lib/data"
import { Users, Vault, ArrowDownRight, Info } from "lucide-react"

type MetricCounterProps = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}

const MetricCounter: React.FC<MetricCounterProps> = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
  })
  const [displayValue, setDisplayValue] = useState("0")

  useEffect(() => {
    if (!isInView) return

    motionValue.set(value)

    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(
        latest.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }),
      )
    })

    return () => unsubscribe()
  }, [isInView, value, decimals, motionValue, springValue])

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

const metricIcons: Record<string, React.ReactNode> = {
  investors: <Users className="h-5 w-5 text-blue-600" />,
  deposits: <Vault className="h-5 w-5 text-emerald-600" />,
  withdrawals: <ArrowDownRight className="h-5 w-5 text-indigo-600" />,
}

const assetImages = [
  { src: "/bitcoin.png", alt: "Bitcoin", name: "BTC" },
  { src: "/ethereum.png", alt: "Ethereum", name: "ETH" },
  { src: "/usdt.png", alt: "Tether USD", name: "USDT" },
]

export const MetricsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.15,
  })

  return (
    <section
      ref={sectionRef}
      id="platform-metrics-section"
      className="relative border-y border-slate-800 bg-slate-900/60 py-12 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <div>
            <div className="font-mono text-xs font-bold tracking-wider text-blue-400 uppercase">
              Platform Liquidity &amp; Execution
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Verified Operational Metrics
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-400">
            <Info className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span>
              Platform-reported telemetry based on active settlement ledgers
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_METRICS.map((metric, index) => (
            <motion.div
              key={metric.id}
              id={`metric-card-${metric.id}`}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 32, scale: 0.97 }
              }
              transition={{
                duration: 0.55,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              whileHover={{ y: -5 }}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition-colors hover:border-blue-500/40 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="rounded-xl border border-slate-700/60 bg-slate-800/80 p-2.5 transition-colors group-hover:bg-blue-950/60">
                  {metricIcons[metric.id] ?? (
                    <Users className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                <span className="rounded-full border border-slate-700/50 bg-slate-800 px-2.5 py-0.5 text-right font-mono text-xs font-semibold text-slate-300 transition-colors group-hover:bg-blue-950/80 group-hover:text-blue-300">
                  {metric.badge}
                </span>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-3xl font-extrabold tracking-tight text-white transition-colors group-hover:text-blue-400">
                  {metric.id === "investors" && (
                    <MetricCounter
                      value={metric.numericValue}
                      suffix={metric.suffix}
                    />
                  )}

                  {metric.id === "deposits" && (
                    <MetricCounter
                      value={metric.numericValue}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                    />
                  )}

                  {metric.id === "withdrawals" && (
                    <MetricCounter
                      value={metric.numericValue}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      decimals={1}
                    />
                  )}

                  {metric.id === "assets" && (
                    <div
                      className="flex items-center gap-3 pt-1"
                      aria-label="Bitcoin, Ethereum and Tether"
                    >
                      {assetImages.map((asset) => (
                        <div
                          key={asset.name}
                          title={asset.alt}
                          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800 p-1.5"
                        >
                          <Image
                            src={asset.src}
                            alt={asset.alt}
                            width={32}
                            height={32}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-sm font-bold text-slate-200">
                  {metric.label}
                </div>

                <div className="text-xs text-slate-400">
                  {metric.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
