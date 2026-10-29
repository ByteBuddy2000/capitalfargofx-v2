// components/sections/TestimonialsSection.tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { TESTIMONIALS } from "../../lib/data"
import { Quote, MessageSquare } from "lucide-react"

const CARD_GAP = 24
const SCROLL_SPEED = 35 // Pixels per second

const fadeInUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -45 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export const TestimonialsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)
  const halfWidthRef = useRef(0)
  const isPausedRef = useRef(false)

  const [isPaused, setIsPaused] = useState(false)

  // Duplicate the cards to create a seamless, continuous marquee.
  const testimonials = [...TESTIMONIALS, ...TESTIMONIALS]

  useEffect(() => {
    const container = scrollRef.current
    const track = trackRef.current

    if (!container || !track || TESTIMONIALS.length === 0) return

    let resizeObserver: ResizeObserver | undefined

    const measureTrack = () => {
      // Each duplicated set occupies half of the complete track.
      halfWidthRef.current = track.scrollWidth / 2

      if (halfWidthRef.current > 0) {
        container.scrollLeft %= halfWidthRef.current
      }
    }

    measureTrack()

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(measureTrack)
      resizeObserver.observe(track)
    }

    const animate = (time: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time
      }

      const deltaTime = Math.min(time - previousTimeRef.current, 50)
      previousTimeRef.current = time

      const halfwayPoint = halfWidthRef.current

      if (
        !isPausedRef.current &&
        halfwayPoint > 0 &&
        container.scrollWidth > container.clientWidth
      ) {
        container.scrollLeft += (SCROLL_SPEED * deltaTime) / 1000

        // Wrap seamlessly to the beginning of the duplicated sequence.
        if (container.scrollLeft >= halfwayPoint) {
          container.scrollLeft %= halfwayPoint
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }

      resizeObserver?.disconnect()
      previousTimeRef.current = null
    }
  }, [])

  const pauseScrolling = () => {
    isPausedRef.current = true
    setIsPaused(true)
  }

  const resumeScrolling = () => {
    isPausedRef.current = false
    setIsPaused(false)
  }

  return (
    <section
      id="testimonials-section"
      className="overflow-hidden border-y border-slate-800 bg-slate-900/40 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-14 max-w-3xl space-y-4 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 text-[10px] font-bold tracking-wider text-blue-300 uppercase sm:text-xs">
            <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
            <span>Investor Perspectives</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Institutional & Private Asset Allocators
          </h2>

          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            Platform feedback from portfolio directors and family office asset
            managers deploying capital on CapitalsFargoFX.
          </p>
        </motion.div>

        {/* Auto-Scrolling Testimonial Track */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative"
        >
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-slate-950/80 to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-slate-950/80 to-transparent sm:w-16" />

          <div
            ref={scrollRef}
            className="no-scrollbar overflow-x-auto overscroll-x-contain"
            onMouseEnter={pauseScrolling}
            onMouseLeave={resumeScrolling}
            onFocusCapture={pauseScrolling}
            onBlurCapture={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              ) {
                resumeScrolling()
              }
            }}
            onTouchStart={pauseScrolling}
            onTouchEnd={resumeScrolling}
            tabIndex={0}
            role="region"
            aria-label="Auto-scrolling investor testimonials"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <motion.div
              ref={trackRef}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="flex w-max gap-6 pb-4"
              style={{ paddingRight: CARD_GAP }}
            >
              {testimonials.map((testimonial, idx) => {
                const isDuplicate = idx >= TESTIMONIALS.length

                return (
                  <motion.article
                    key={`${testimonial.name}-${idx}`}
                    variants={fadeInUp}
                    aria-hidden={isDuplicate ? true : undefined}
                    className="group flex w-72.5 shrink-0 flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm transition-colors duration-300 hover:border-blue-500/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-950/20 sm:w-[330px] sm:p-8"
                  >
                    <div>
                      {/* Quote Icon */}
                      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-950/80 text-blue-400 transition-colors duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-900/80">
                        <Quote className="h-5 w-5" />
                      </div>

                      {/* Testimonial */}
                      <p className="mb-8 text-sm leading-relaxed text-slate-300 italic sm:text-base">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                    </div>

                    {/* Investor Profile */}
                    <div className="flex items-center gap-3.5 border-t border-slate-800 pt-6">
                      <div
                        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-700 bg-linear-to-br from-blue-600 to-indigo-700 shadow-sm"
                        onContextMenu={(event) => event.preventDefault()}
                        onDragStart={(event) => event.preventDefault()}
                      >
                        {testimonial.image ? (
                          <Image
                            src={testimonial.image}
                            alt={isDuplicate ? "" : testimonial.name}
                            fill
                            sizes="48px"
                            draggable={false}
                            className="pointer-events-none object-cover select-none"
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none flex h-full w-full items-center justify-center font-mono text-sm font-bold text-white"
                          >
                            {testimonial.initial}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-white">
                          {testimonial.name}
                        </div>

                        <div className="truncate text-xs font-medium text-slate-400">
                          {testimonial.role}, {testimonial.firm}
                        </div>

                        <div className="truncate font-mono text-[10px] text-slate-500">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* Auto-Scroll Status */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPaused ? "bg-slate-600" : "animate-pulse bg-emerald-400"
            }`}
          />

          <span>
            {isPaused
              ? "Auto-scroll paused · Interacting with testimonials"
              : "Investor perspectives · Auto-scrolling"}
          </span>
        </motion.div>

        {/* Disclaimer */}
        <p className="mt-5 hidden text-center text-xs leading-relaxed text-slate-500">
          *Supplied testimonials reflect individual investor experiences. Verify
          testimonial authenticity and any stated investment outcomes before
          publication.
        </p>
      </div>
    </section>
  )
}

export default TestimonialsSection
