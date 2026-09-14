import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { FAQItem } from "../../types"
import { storage } from "../../lib/storage"

interface FaqSectionProps {
  faqs?: FAQItem[]
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const activeFaqs = faqs && faqs.length > 0 ? faqs : storage.getFaqs()
  const [openId, setOpenId] = useState<string | null>(activeFaqs[0]?.id || null)

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Clear Answers to Your Investment Questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Everything you need to know about our investment process,
            cryptocurrency deposits, and security protocols.
          </p>
        </div>

        <div className="space-y-3.5">
          {activeFaqs.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50/50"
                >
                  <span className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 rounded-lg bg-slate-100 p-1.5 text-slate-600 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-slate-100 px-6 pt-1 pb-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
