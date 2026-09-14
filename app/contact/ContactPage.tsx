"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Headphones,
  Mail,
  Send,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  
  AlertCircle,
} from "lucide-react"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("Investment Plans")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const randomId = `CF-${Math.floor(10000 + Math.random() * 90000)}`
    setTicketId(randomId)
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    setFullName("")
    setEmail("")
    setSubject("")
    setMessage("")
  }

  return (
    <div className="bg-slate-950 pt-28 pb-16 text-slate-100">
      {/* Hero Header */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs currentPageTitle="Investor Support Desk" />

          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
              <Headphones className="h-3.5 w-3.5 text-blue-400" />
              <span>Continuous Operational Inquiries</span>
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
              Investor Support Desk
            </h1>

            <p className="text-lg leading-relaxed text-slate-300 sm:text-xl">
              Direct communication channels for portfolio inquiries,
              cryptocurrency settlement verification, and plan allocations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Form & Channel Details */}
      <section className="border-y border-slate-800 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left 5 Cols: Contact Channels & SLAs */}
            <div className="space-y-6 lg:col-span-5">
              <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-7">
                <h3 className="text-xl font-bold text-white">
                  Official Communication Rails
                </h3>

                <div className="space-y-4">
                  {/* Email Channel */}
                  <a
                    href="mailto:support@CapitalsFargofx.com"
                    className="group block flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 transition-all hover:border-blue-500/50 hover:shadow-xs"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-950/60 text-blue-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Direct Email Desk
                      </div>
                      <div className="font-mono text-sm font-bold text-white transition-colors group-hover:text-blue-400">
                        support@CapitalsFargofx.com
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        Encrypted corporate email routing
                      </div>
                    </div>
                  </a>

                  {/* Telegram Channel */}
                  <a
                    href="https://t.me/CapitalsFargofx_official"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group block flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 transition-all hover:border-blue-500/50 hover:shadow-xs"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-950/60 text-cyan-400">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Official Telegram Channel
                      </div>
                      <div className="font-mono text-sm font-bold text-white transition-colors group-hover:text-cyan-400">
                        @CapitalsFargofx_official
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        Real-time community and operational advisories
                      </div>
                    </div>
                  </a>
                </div>

                {/* Service Level Agreement Metrics */}
                <div className="space-y-3 rounded-2xl border border-blue-800/60 bg-blue-950/50 p-4 font-mono text-xs">
                  <div className="flex items-center justify-between text-blue-200">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Clock className="h-3.5 w-3.5 text-blue-400" />
                      <span>Average Response Time:</span>
                    </span>
                    <span className="font-bold text-white">
                      &lt; 15 Minutes
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-blue-200">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Support Desk Availability:</span>
                    </span>
                    <span className="font-bold text-white">
                      24/7/365 Continuous
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety notice */}
              <div className="flex items-start gap-2.5 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-400">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <p>
                  Security Reminder: CapitalsFargoFX will never contact you
                  requesting your private keys or master wallet seed phrases.
                  All official communications occur through verified domains.
                </p>
              </div>
            </div>

            {/* Right 7 Cols: Ticket Submission Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl sm:p-10">
                {submitted ? (
                  <div className="space-y-5 py-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-950 text-emerald-400">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                      Inquiry Ticket Registered
                    </h3>

                    <div className="inline-block rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 font-mono text-sm font-bold text-slate-200">
                      Reference #{ticketId}
                    </div>

                    <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-300">
                      Thank you for contacting CapitalsFargoFX. Your inquiry has
                      been routed to our dedicated investor support desk. An
                      operational specialist will respond directly to{" "}
                      <span className="font-bold text-white">{email}</span>{" "}
                      within 15 minutes.
                    </p>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-500"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-4 space-y-1">
                      <h3 className="text-xl font-bold text-white">
                        Submit an Operational Inquiry
                      </h3>
                      <p className="text-xs text-slate-400">
                        Please provide detailed information so our team can
                        triage your request immediately.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Full Legal Name
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Eleanor Vance"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Corporate / Investor Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="investor@domain.com"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Inquiry Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm font-semibold text-white transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        >
                          <option
                            value="Investment Plans"
                            className="bg-slate-900 text-white"
                          >
                            Investment Plans & Yield
                          </option>
                          <option
                            value="Deposits"
                            className="bg-slate-900 text-white"
                          >
                            Cryptocurrency Deposits
                          </option>
                          <option
                            value="Withdrawals"
                            className="bg-slate-900 text-white"
                          >
                            Withdrawals & Settlement
                          </option>
                          <option
                            value="Account Support"
                            className="bg-slate-900 text-white"
                          >
                            Account & Authentication
                          </option>
                          <option
                            value="Technical Support"
                            className="bg-slate-900 text-white"
                          >
                            Technical / API Routing
                          </option>
                          <option
                            value="General Inquiry"
                            className="bg-slate-900 text-white"
                          >
                            General Corporate Inquiry
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Allocation inquiry for Level 4"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Detailed Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe your portfolio question, transaction hash, or specific contract tier in detail..."
                        className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-500"
                    >
                      <span>Dispatch Inquiry to Support Desk</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
