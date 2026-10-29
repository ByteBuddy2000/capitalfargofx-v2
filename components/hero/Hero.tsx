// Hero.tsx
"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronRight, CheckCircle, RocketIcon, PlayIcon } from "lucide-react"
import { TRUST_FEATURES } from "@/lib/data"
import { AnimatePresence, motion } from "motion/react"

interface HeroProps {
  onOpenInvestModal: (planSlug?: string) => void
}

interface AnimatedHeadlineProps {
  children: React.ReactNode
  className?: string
}

const AnimatedHeadline: React.FC<AnimatedHeadlineProps> = ({
  children,
  className = "",
}) => {
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.h1>
  )
}

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

function AnimatedWord({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.span
      variants={wordVariants}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  )
}

export const Hero: React.FC<HeroProps> = ({ onOpenInvestModal }) => {
  const router = useRouter()
  const [headlineIndex, setHeadlineIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((current) => (current === 0 ? 1 : 0))
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="hero-section"
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      {/* Dynamic Background linears */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-150 w-full max-w-7xl -translate-x-1/2">
        <div className="absolute top-12 left-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute top-20 right-1/4 h-112.5 w-112.5 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute top-36 left-1/2 h-100 w-150 -translate-x-1/2 rounded-full bg-indigo-300/15 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center">
          {/* <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8"> */}
          {/* Left Column: Editorial Copy */}
          <div className="space-y-6 flex items-center flex-col text-center justify-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-3.5 py-1.5 text-[9px] shadow-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></span>
              <span className="font-mono font-bold tracking-wider text-blue-300 uppercase">
                Your Financial Goals
                <span className="mx-1 text-blue-500">•</span>
                Powered by Digital Assets
              </span>
            </div>


            {/* Main Headline */}
            <div className="mx-auto max-w-5xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {headlineIndex === 0 ? (
                    <AnimatedHeadline
                      className="text-4xl leading-[1.12] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
                    >
                      <AnimatedWord>Build</AnimatedWord>{" "}
                      <AnimatedWord>Your</AnimatedWord>{" "}
                      <AnimatedWord>Financial</AnimatedWord>{" "}
                      <AnimatedWord>Future</AnimatedWord>{" "}
                      <AnimatedWord>With</AnimatedWord>{" "}
                      <AnimatedWord className="bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                        Smarter Digital Investing
                      </AnimatedWord>
                    </AnimatedHeadline>
                  ) : (
                    <AnimatedHeadline
                      className="text-4xl leading-[1.12] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
                    >
                      <AnimatedWord>Invest</AnimatedWord>{" "}
                      <AnimatedWord>With</AnimatedWord>{" "}
                      <AnimatedWord className="bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                        Clarity
                      </AnimatedWord>{" "}
                      <AnimatedWord className="bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                        Build Your Financial Future
                      </AnimatedWord>
                    </AnimatedHeadline>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Supporting copy */}
            <p className="max-w-2xl text-lg leading-relaxed font-normal text-slate-300 sm:text-xl">
              Explore structured digital investment opportunities through a secure platform designed to help you manage your portfolio, monitor performance, and access cryptocurrency transactions with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-center">
              <button
                id="hero-primary-cta"
                onClick={() => onOpenInvestModal()}
                className="group flex items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 px-7 py-4 text-base font-bold text-white shadow-lg shadow-blue-900/40 transition-all hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-600 hover:shadow-xl hover:shadow-blue-600/40"
              >
                <span>Start Investing</span>
                <RocketIcon size={32}  className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => {
                  router.push("/investment-plans")
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="group flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-7 py-4 text-base font-bold text-slate-200 shadow-sm transition-all hover:border-slate-600 hover:bg-slate-800 hover:shadow-md"
              >
                <span>Explore Investment Plans</span>
                <PlayIcon size={32} className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-200" />
              </button>
            </div>

            {/* Trust Badges - 4 compact glass badges */}
            <div className="hidden border-t border-slate-800 pt-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TRUST_FEATURES.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 shadow-xs backdrop-blur-md transition-colors hover:border-blue-500/40"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                      <span className="truncate">{item.title}</span>
                    </div>
                    <div className="mt-0.5 truncate pl-5 text-[10px] text-slate-400">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
