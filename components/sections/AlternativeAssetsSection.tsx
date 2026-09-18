"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ALTERNATIVE_ASSETS } from "../../lib/data"
import { Building, Cpu, Sparkles, CheckCircle2, ArrowRight } from "lucide-react"
import Image from "next/image"

export const AlternativeAssetsSection: React.FC = () => {
  const router = useRouter()
  return (
    <section
      id="alternative-assets-section"
      className="border-t border-slate-800 bg-slate-950/60 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/80 px-3 py-1 font-mono text-xs font-bold tracking-wider text-indigo-300 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Alternative Asset Classes</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Explore More Investment Opportunities
            </h2>
            <p className="text-base text-slate-300">
              Expand capital deployment into high-barrier, physical-world yield
              and next-generation decentralized infrastructure.
            </p>
          </div>

          <button
            onClick={() => {
              router.push("/fiat-assets")
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 transition-colors hover:text-blue-300"
          >
            <span>Explore All Supported Assets</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Alternative Cards (Horizontal scroll on mobile, 2-col on desktop) */}
        <div className="no-scrollbar flex snap-x snap-mandatory space-x-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:gap-8 md:space-x-0">
          {ALTERNATIVE_ASSETS.map((asset, idx) => {
            const isRealEstate = idx === 0

            return (
              <div
                key={asset.title}
                className="group flex w-75 shrink-0 snap-center flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-white shadow-xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-500/10 sm:w-90 md:w-auto"
              >
                {/* ---------------------------------------------------------------- */}
                {/* Cinematic Top Visual Card Header                                 */}
                {/* ---------------------------------------------------------------- */}

                <div className="relative min-h-75 overflow-hidden border-b border-slate-800 bg-linear-to-br from-slate-900 to-blue-950 p-6 sm:p-8">
                  {/* Background Image */}
                  <Image
                    src={asset.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 360px, 50vw"
                    className="object-cover opacity-45 transition-all duration-700 group-hover:scale-105 group-hover:opacity-55"
                    aria-hidden="true"
                  />

                  {/* Cinematic Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-slate-950/90 via-slate-900/65 to-blue-950/80" />

                  {/* Bottom Fade */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-slate-900 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-300 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                        {isRealEstate ? (
                          <Building className="h-6 w-6" />
                        ) : (
                          <Cpu className="h-6 w-6" />
                        )}
                      </div>

                      <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-300 backdrop-blur-md">
                        {asset.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-2xl font-bold tracking-tight text-white drop-shadow-lg">
                      {asset.title}
                    </h3>

                    {/* Description */}
                    <p className="max-w-lg text-sm leading-relaxed text-slate-200 drop-shadow-md">
                      {asset.description}
                    </p>
                  </div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* Body Details                                                     */}
                {/* ---------------------------------------------------------------- */}

                <div className="space-y-4 bg-slate-950/90 p-6 sm:p-8">
                  {/* Highlight */}
                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                    <span>{asset.highlight}</span>
                  </div>

                  {/* Allocation */}
                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 font-mono text-xs">
                    <span className="text-[9px] text-slate-400">
                      Target Integration:
                    </span>

                    <span className="font-semibold text-cyan-400">
                      {asset.allocationTiers}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
