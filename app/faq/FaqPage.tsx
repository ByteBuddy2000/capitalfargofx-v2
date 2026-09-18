"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { FAQS } from "../../lib/data"
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react"

export const FaqPage: React.FC = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const categories = [
    { key: "All", label: "All Questions" },
    { key: "General", label: "Platform Overview" },
    { key: "Plans", label: "Investment Plans" },
    { key: "Settlement", label: "Deposits & Settlement" },
  ]

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="bg-slate-950 pt-28 pb-16 text-slate-100">
      {/* Hero Header */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs currentPageTitle="Frequently Asked Questions" />

          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
              <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
              <span>Knowledge Base & Support</span>
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
              Frequently Asked Questions
            </h1>

            <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
              Clear answers to your investment questions regarding contract
              maturities, deposit rails, cold storage custody, and referral
              mechanics.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-8">
        <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. deposit, returns, referral, security)..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-3.5 pr-4 pl-12 text-sm text-white placeholder-slate-500 shadow-xs transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat.key
                    ? "bg-blue-600 font-bold text-white shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="bg-slate-950 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center text-slate-400">
              No matching questions found. Try adjusting your search query or
              category filter.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx
                return (
                  <div
                    key={faq.id || `faq-${idx}`}
                    id={`faq-item-${idx}`}
                    className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-sm transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-slate-800/60 sm:p-6"
                    >
                      <span className="text-base font-bold text-white sm:text-lg">
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0 rounded-lg bg-slate-800 p-1 text-slate-400">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-800 bg-slate-950/40 px-5 pt-2 pb-6 text-sm leading-relaxed text-slate-300 sm:px-6 sm:text-base">
                        <p>{faq.answer}</p>
                        <div className="mt-4 inline-block rounded border border-blue-500/30 bg-blue-950/80 px-2.5 py-0.5 font-mono text-xs font-semibold text-blue-300">
                          Category: {faq.category}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Need More Assistance Banner */}
          <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-xl sm:flex-row">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold">
                Have a specific question about your portfolio?
              </h3>
              <p className="text-sm text-slate-300">
                Our investor support desk is available 24/7 with average
                response times under 15 minutes.
              </p>
            </div>
            <button
              onClick={() => {
                router.push("/contact")
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-blue-500"
            >
              <span>Contact Support Desk</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
