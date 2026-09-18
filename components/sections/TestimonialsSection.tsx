// TestimonialsSection.tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { TESTIMONIALS } from "../../lib/data"
import { Quote, MessageSquare } from "lucide-react"

export const TestimonialsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  /*
   * Duplicate the testimonials so the second set can follow the first
   * continuously, creating a seamless marquee effect.
   */
  const testimonials = [...TESTIMONIALS, ...TESTIMONIALS]

  useEffect(() => {
    const container = scrollRef.current

    if (!container) return

    const speed = 0.45

    const animate = () => {
      if (!isPaused && container) {
        container.scrollLeft += speed

        /*
         * Reset after reaching approximately half of the duplicated
         * content. This keeps the transition visually seamless.
         */
        const halfwayPoint = container.scrollWidth / 2

        if (container.scrollLeft >= halfwayPoint) {
          container.scrollLeft -= halfwayPoint
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused])

  return (
    <section
      id="testimonials-section"
      className="border-y border-slate-800 bg-slate-900/40 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ------------------------------------------------------------------ */}
        {/* Section Header                                                     */}
        {/* ------------------------------------------------------------------ */}

        <div className="mx-auto mb-14 max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
            <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
            <span>Investor Perspectives</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Institutional & Private Asset Allocators
          </h2>

          <p className="text-base text-slate-300">
            Platform feedback from portfolio directors and family office asset
            managers deploying capital on CapitalsFargoFX.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Auto-Scrolling Testimonials                                         */}
        {/* ------------------------------------------------------------------ */}

        <div
          ref={scrollRef}
          className="no-scrollbar flex overflow-x-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsPaused(false)
            }
          }}
          aria-label="Investor testimonials"
        >
          <div className="flex shrink-0 gap-6 pr-6 md:gap-8 md:pr-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={`${testimonial.name}-${idx}`}
                className="group flex w-72.5 shrink-0 snap-center flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-950/20 sm:w-82.5 sm:p-8"
              >
                {/* ---------------------------------------------------------- */}
                {/* Testimonial Content                                         */}
                {/* ---------------------------------------------------------- */}

                <div>
                  {/* Quote Icon */}
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-950/80 text-blue-400 transition-colors group-hover:border-blue-400/40 group-hover:bg-blue-900/80">
                    <Quote className="h-5 w-5" />
                  </div>

                  {/* Quote */}
                  <p className="mb-8 text-sm leading-relaxed text-slate-300 italic sm:text-base">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                {/* ---------------------------------------------------------- */}
                {/* Investor Profile                                            */}
                {/* ---------------------------------------------------------- */}

                <div className="flex items-center gap-3.5 border-t border-slate-800 pt-6">
                  {/* Avatar */}
                  <div
                    className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-700 bg-linear-to-br from-blue-600 to-indigo-700 shadow-sm select-none"
                    onContextMenu={(event) => event.preventDefault()}
                    onDragStart={(event) => event.preventDefault()}
                  >
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        sizes="48px"
                        draggable={false}
                        className="pointer-events-none object-cover select-none"
                      />
                    ) : (
                      <div className="pointer-events-none flex h-full w-full items-center justify-center font-mono text-sm font-bold text-white select-none">
                        {testimonial.initial}
                      </div>
                    )}
                  </div>

                  {/* Details */}
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
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Auto Scroll Status                                                 */}
        {/* ------------------------------------------------------------------ */}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isPaused ? "bg-slate-600" : "animate-pulse bg-emerald-400"
            }`}
          />

          <span>
            {isPaused
              ? "Scroll paused"
              : "Investor perspectives · Auto scrolling"}
          </span>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Disclaimer                                                         */}
        {/* ------------------------------------------------------------------ */}

        <div className="mt-5 text-center text-xs text-slate-400">
          <span>
            *Supplied testimonials reflect individual investor operational
            experiences with configured contract maturities.
          </span>
        </div>
      </div>
    </section>
  )
}
