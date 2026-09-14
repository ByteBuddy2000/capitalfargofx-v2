import React, { useState } from "react"
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signin" | "signup"
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "signin",
}) => {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-mono text-xs font-bold text-white shadow-sm">
              CF
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                CapitalsFargoFX Portal
              </h3>
              <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Multi-Sig Client Ledger
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Demo Mode Notice */}
        <div className="flex items-center gap-2 border-b border-blue-500/30 bg-blue-950/80 px-6 py-2.5 text-xs font-medium text-blue-300">
          <ShieldCheck className="h-4 w-4 flex-shrink-0 text-blue-400" />
          <span>Demo Authentication Portal · Sandbox Preview</span>
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="space-y-4 py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-950 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {mode === "signup"
                  ? "Investor Account Initiated"
                  : "Access Authenticated"}
              </h4>
              <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-300">
                Welcome to the CapitalsFargoFX portfolio management interface.
                Your test session token has been initialized.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-500"
                >
                  Enter Investor Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tab Switcher */}
              <div className="mb-4 grid grid-cols-2 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`rounded-lg py-2 transition-all ${
                    mode === "signin"
                      ? "bg-slate-800 font-bold text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-lg py-2 transition-all ${
                    mode === "signup"
                      ? "bg-slate-800 font-bold text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="mb-1 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pr-3 pl-9 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Corporate / Investor Email
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@domain.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pr-3 pl-9 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Master Access Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pr-3 pl-9 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="mb-1 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Affiliate Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="5% Downline Partner Code"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 font-mono text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:from-blue-500 hover:to-indigo-500"
              >
                <span>
                  {mode === "signin"
                    ? "Authenticate Investor"
                    : "Register Portfolio Vault"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-slate-800 bg-slate-950 p-4 text-center text-[11px] text-slate-400">
          Cryptographic security standards compliant with double-entry ledger
          audits.
        </div>
      </div>
    </div>
  )
}
