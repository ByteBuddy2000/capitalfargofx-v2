import React from "react"
import { ShieldCheck, Mail, Send, Lock, ArrowUpRight } from "lucide-react"
import { PlatformSettings } from "../../types"
import { storage } from "../../lib/storage"

interface FooterProps {
  settings?: PlatformSettings
  onNavigateSection?: (sectionId: string) => void
  onOpenLegal?: (type: "terms" | "privacy" | "risk" | "cookies") => void
  onOpenAuth?: (mode: "login" | "register") => void
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigateSection,
  onOpenLegal,
  onOpenAuth,
}) => {
  const currentSettings = settings || storage.getSettings()
  return (
    <footer className="border-t border-slate-900 bg-slate-950 pt-16 pb-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-slate-850 grid grid-cols-1 gap-10 border-b pb-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white shadow-md">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                CapitalsFargo<span className="text-emerald-400">FX</span>
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              An institutional digital asset management platform providing
              structured cryptocurrency yield strategies, automated maturity
              distributions, and transparent double-entry accounting.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800 bg-emerald-950/60 px-3 py-1 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Ledger Engine Online
              </span>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection?.("about")}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.("how-it-works")}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.("plans")}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  Investment Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.("assets")}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  Supported Crypto
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.("faq")}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
              Legal & Compliance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegal?.("terms")}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.("privacy")}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.("risk")}
                  className="cursor-pointer font-medium text-amber-400/90 transition-colors hover:text-amber-300"
                >
                  Risk Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal?.("cookies")}
                  className="cursor-pointer transition-colors hover:text-white"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
              Investor Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <a
                  href={`mailto:${currentSettings.supportEmail || "support@CapitalsFargofx.com"}`}
                  className="transition-colors hover:text-white"
                >
                  {currentSettings.supportEmail || "support@CapitalsFargofx.com"}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Send className="h-3.5 w-3.5 text-slate-500" />
                <a
                  href={currentSettings.telegramChannel || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-white"
                >
                  Telegram Channel <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onOpenAuth?.("login")}
                  className="cursor-pointer font-semibold text-blue-400 hover:text-blue-300"
                >
                  Investor Support Desk →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Risk Warning & Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[11px] text-slate-500 md:flex-row">
          <p className="max-w-3xl text-left leading-relaxed">
            High-Risk Investment Warning: Cryptocurrency and digital asset
            investment carries market risk, including potential fluctuations in
            asset valuation. Past performance does not guarantee future results.
            Platform plans and yields are subject to configured contract terms
            and conditions.
          </p>
          <p className="shrink-0 font-medium text-slate-400">
            © {new Date().getFullYear()} CapitalsFargoFX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
