import React from "react"
import { X, ShieldAlert, Check } from "lucide-react"

interface LegalModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-950 text-blue-400">
              <ShieldAlert className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6 text-sm leading-relaxed text-slate-300 sm:p-8">
          <p>{content}</p>

          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-400">
            <div className="font-mono text-[10px] font-semibold tracking-wider text-slate-200 uppercase">
              Statutory Platform Notice
            </div>
            <p>
              CapitalsFargoFX operates on double-entry accounting ledgers. All
              investment allocations, maturity distributions, and affiliate
              commissions are strictly bound by the configured terms of the
              active plan tier.
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-800 bg-slate-950 p-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-500"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  )
}
