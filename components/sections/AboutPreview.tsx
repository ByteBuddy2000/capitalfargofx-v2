"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ABOUT_FEATURES } from "../../lib/data"
import { Layers, Activity, ShieldCheck, Users, ArrowRight } from "lucide-react"

export const AboutPreview: React.FC = () => {
  const router = useRouter()
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Layers":
        return <Layers className="h-5 w-5 text-blue-600" />
      case "Activity":
        return <Activity className="h-5 w-5 text-cyan-600" />
      case "ShieldCheck":
        return <ShieldCheck className="h-5 w-5 text-emerald-600" />
      case "Users":
        return <Users className="h-5 w-5 text-indigo-600" />
      default:
        return <Layers className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <section
      id="about-preview-section"
      className="border-b border-slate-800 bg-slate-900/40 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl space-y-4 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
            About CapitalsFargoFX
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Built Around Smarter Financial Management
          </h2>

          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            CapitalsFargoFX is an international digital asset management and
            cryptocurrency investment firm engineered to deliver structured
            returns. By combining algorithmic market routing with institutional
            transparency, CapitalsFargoFX bridges traditional financial rigor and
            decentralized digital opportunity.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800 transition-colors group-hover:bg-blue-950/80">
                {getIcon(feature.icon)}
              </div>
              <h3 className="mb-2 text-base font-bold text-white">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-start">
          <button
            onClick={() => {
              router.push("/about")
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-950/50 transition-all hover:bg-blue-500"
          >
            <span>Learn More About CapitalsFargoFX</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  )
}
