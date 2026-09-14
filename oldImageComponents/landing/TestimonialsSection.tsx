import React from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Star, CheckCircle2 } from "lucide-react"
import { Testimonial } from "../../types"
import { storage } from "../../lib/storage"

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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {activeTestimonials.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50 p-8 transition-all hover:border-slate-300 hover:shadow-xl"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {test.investmentPlan}
                  </span>
                </div>

                <p className="mb-8 text-xs leading-relaxed text-slate-700 italic sm:text-sm">
                  &quot;{test.message}&quot;
                </p>
              </div>

              <div className="flex items-center gap-3.5 border-t border-slate-200/60 pt-4">
                <Image
                  src={test.avatar}
                  alt={test.name}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {test.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {test.role} • {test.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
