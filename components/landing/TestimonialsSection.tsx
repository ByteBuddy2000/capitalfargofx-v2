"use client"

import React from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Star, CheckCircle2, Quote, MapPin } from "lucide-react"
import { Testimonial } from "@/types"
import { storage } from "@/lib/storage"

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const activeTestimonials = testimonials || storage.getTestimonials()

  return (
    <section className="border-b border-slate-200/80 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Section Header                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold tracking-wider text-slate-700 uppercase">
            Investor Sentiment
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by Global Capital Allocators
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Read perspectives from individual and institutional portfolio
            managers deploying capital through CapitalsFargoFX.
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Testimonials Grid                                                */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {activeTestimonials.map((test, idx) => (
            <motion.article
              key={test.id}
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.45,
                delay: idx * 0.1,
                ease: "easeOut",
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60"
            >
              {/* Subtle Decorative Gradient */}

              <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-opacity duration-300 group-hover:bg-emerald-500/10" />

              <div className="relative">
                {/* -------------------------------------------------------- */}
                {/* Top Row                                                   */}
                {/* -------------------------------------------------------- */}

                <div className="mb-6 flex items-center justify-between gap-4">
                  {/* Rating */}

                  <div
                    className="flex items-center gap-1"
                    aria-label={`${test.rating} out of 5 stars`}
                  >
                    {Array.from({
                      length: test.rating,
                    }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Investment Plan */}

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {test.investmentPlan}
                  </span>
                </div>

                {/* -------------------------------------------------------- */}
                {/* Quote Icon                                                */}
                {/* -------------------------------------------------------- */}

                <div className="mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80">
                    <Quote className="h-4 w-4 fill-blue-600" />
                  </div>
                </div>

                {/* -------------------------------------------------------- */}
                {/* Testimonial Message                                       */}
                {/* -------------------------------------------------------- */}

                <p className="mb-8 text-sm leading-7 text-slate-700">
                  &quot;{test.message}&quot;
                </p>
              </div>

              {/* ---------------------------------------------------------------- */}
              {/* Investor Profile                                                   */}
              {/* ---------------------------------------------------------------- */}

              <div className="relative flex items-center gap-4 border-t border-slate-200/70 pt-5">
                {/* Avatar */}

                <div className="relative shrink-0">
                  {/* Gradient Ring */}

                  <div className="rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 p-[2px]">
                    <div className="rounded-full bg-white p-[2px]">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                        {test.avatar ? (
                          <Image
                            src={test.avatar}
                            alt={`${test.name} profile`}
                            fill
                            sizes="48px"
                            priority={idx === 0}
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm font-bold text-slate-500">
                            {test.name
                              .split(" ")
                              .slice(0, 2)
                              .map((name) => name[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Verified Badge */}

                  {test.verified && (
                    <span
                      className="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-50 bg-emerald-500 text-white shadow-sm"
                      title="Verified investor"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                  )}
                </div>

                {/* Investor Details */}

                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-slate-900">
                    {test.name}
                  </h4>

                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    {test.role}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <MapPin className="h-3 w-3" />
                    <span>{test.location}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
