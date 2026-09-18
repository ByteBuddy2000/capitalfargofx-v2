"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Mail, Send, ArrowUpRight, Lock, Cpu } from "lucide-react"
import Logo from "../Logo/Logo"

interface FooterProps {
  onOpenLegal?: (type: "terms" | "privacy" | "risk" | "cookies") => void
  onOpenLegalModal?: (title: string, content: string) => void
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onOpenLegalModal,
}) => {
  const router = useRouter()
  const handleLink = (route: string) => {
    router.push(route)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLegalClick = (title: string) => {
    if (onOpenLegal) {
      if (title === "Terms of Service") onOpenLegal("terms")
      else if (title === "Privacy Policy") onOpenLegal("privacy")
      else if (title === "Risk Disclosure") onOpenLegal("risk")
      else onOpenLegal("cookies")
      return
    }

    let body = ""
    if (title === "Terms of Service") {
      body =
        "CapitalsFargoFX terms establish the operational parameters of structured investment plans, client digital vault assignments, and contract maturity cycles. All allocations are subject to configured protocol conditions and verification protocols."
    } else if (title === "Privacy Policy") {
      body =
        "Client privacy is safeguarded through end-to-end cryptographic hashing. CapitalsFargoFX does not sell or distribute user information. Telemetry records are maintained solely for double-entry ledger audits."
    } else if (title === "Risk Disclosure") {
      body =
        "Cryptocurrency and digital asset investments carry significant market volatility. Past contract performance is not indicative of future results. Capital deployment should align with individual investor liquidity requirements and risk tolerance."
    } else {
      body =
        "Cookies and localized browser storage are utilized strictly for authentication tokens, interface theme preferences, and session state persistence."
    }
    if (onOpenLegalModal) {
      onOpenLegalModal(title, body)
    }
  }

  return (
    <footer
      id="platform-footer"
      className="border-t border-slate-800 bg-slate-950 text-slate-300"
    >
      {/* Top Banner / Status Strip */}
      <div className="hidden border-b border-slate-800/80 bg-slate-900/50 py-4 xl:block">
        {/* <div className="border-b border-slate-800/80 bg-slate-900/50 py-4"> */}
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
              <span>Ledger Engine Online</span>
            </div>
            <span className="hidden text-slate-500 md:inline">|</span>
            <span className="hidden text-slate-400 md:inline">
              Double-Entry Cryptographic Verification Protocol
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>EPOCH: ACTIVE</span>
            <span>AVG DISPATCH: &lt;15 MINS</span>
            <span>SETTLEMENT: MULTI-SIG</span>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand Column (spans 2) */}
          <div className="space-y-4 lg:col-span-2">
            <Logo />

            <p className="pr-6 text-sm leading-relaxed text-slate-400">
              An institutional digital asset management platform providing
              structured cryptocurrency yield strategies, automated maturity
              distributions, and transparent double-entry accounting.
            </p>

            <div className="hidden flex-wrap gap-2 pt-2 text-xs">
              {/* <div className="flex flex-wrap gap-2 pt-2 text-xs"> */}
              <div className="flex items-center gap-1.5 rounded border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 font-mono text-slate-300">
                <Lock className="h-3 w-3 text-blue-400" />
                <span>Cold-Vault Custody</span>
              </div>
              <div className="flex items-center gap-1.5 rounded border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 font-mono text-slate-300">
                <Cpu className="h-3 w-3 text-cyan-400" />
                <span>Algorithmic Yield Engine</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleLink("/about")}
                  className="group flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
                >
                  <span>About Us</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("/how-it-works")}
                  className="group flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
                >
                  <span>How It Works</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("/investment-plans")}
                  className="group flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
                >
                  <span>Investment Plans</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("/assets")}
                  className="group flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
                >
                  <span>Supported Crypto</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink("/faq")}
                  className="group flex items-center gap-1 text-slate-400 transition-colors hover:text-white"
                >
                  <span>FAQ</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
              Legal & Compliance
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleLegalClick("Terms of Service")}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick("Privacy Policy")}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick("Risk Disclosure")}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Risk Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalClick("Cookie Policy")}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Investor Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
              Investor Support
            </h3>
            <div className="space-y-2.5 text-sm">
              <a
                href="mailto:support@CapitalsFargofx.com"
                className="flex items-center gap-2 text-slate-300 transition-colors hover:text-cyan-400"
              >
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="font-mono text-xs">
                  support@CapitalsFargofx.com
                </span>
              </a>
              <div className="flex items-center gap-2 text-slate-300">
                <Send className="h-4 w-4 text-blue-400" />
                <span className="font-mono text-xs">
                  Telegram: @CapitalsFargofx_official
                </span>
              </div>
              <button
                onClick={() => handleLink("/contact")}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-600/30 px-3 py-1.5 text-xs font-medium text-blue-300 transition-colors hover:bg-blue-600/50"
              >
                <span>Investor Support Desk</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Regulatory & Risk Warning Notice */}
        <div className="mt-12 hidden border-t border-slate-800 pt-8">
          {/* <div className="mt-12 border-t border-slate-800 pt-8"> */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-400">
            <span className="mr-1.5 font-bold tracking-wide text-slate-300 uppercase">
              Risk Warning & Disclosure:
            </span>
            &quot;Cryptocurrency and digital asset investment carries market
            risk, including potential fluctuations in asset valuation. Past
            performance does not guarantee future results. Platform plans and
            yields are subject to configured contract terms and
            conditions.&quot;
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <div>© 2026 CapitalsFargoFX. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Institutional Digital Finance</span>
            <span>·</span>
            <span>Zero Deposit Fees</span>
            <span>·</span>
            <span>Multi-Signature Custody</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
