"use client"

import React, { useState } from "react"
import { CURRENT_PLANS, formatCurrency, calculateYield } from "../../lib/plans"
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"

interface InvestModalProps {
  isOpen: boolean
  onClose: () => void
  initialPlanSlug?: string
  initialAmount?: number
}

interface InvestmentPlan {
  readonly name: string
  readonly slug: string
  readonly minimumAmount: number
  readonly maximumAmount: number // 0 means unlimited
  readonly returnPercentage: number
  readonly durationHours: number
  readonly referralPercentage: number
  readonly principalReturn: boolean
  readonly description: string
  readonly status: "ACTIVE"
  readonly featured: boolean
}

export const InvestModal: React.FC<InvestModalProps> = ({
  isOpen,
  onClose,
  initialPlanSlug = "level-4",
  initialAmount,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan>(() => {
    return (
      CURRENT_PLANS.find((p) => p.slug === initialPlanSlug) || CURRENT_PLANS[3]
    )
  })

  const [depositAmount, setDepositAmount] = useState<number>(() => {
    return initialAmount ?? selectedPlan.minimumAmount
  })

  const [selectedAsset, setSelectedAsset] = useState<"BTC" | "ETH" | "USDT">(
    "USDT"
  )
  const [step, setStep] = useState<"configure" | "deposit" | "confirmed">(
    "configure"
  )
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const calculations = calculateYield(selectedPlan, depositAmount)

  const mockVaultAddresses = {
    BTC: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    ETH: "0x71C...4e7b89B663a8630A6bA34B2",
    USDT: "0x38B...881fF9c40B0B7C62E48A857",
  }

  const currentAddress = mockVaultAddresses[selectedAsset]

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setStep("configure")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 p-6">
          <div>
            <div className="font-mono text-[10px] font-bold text-blue-400 uppercase">
              Capital Deployment Terminal
            </div>
            <h3 className="text-base font-bold text-white">
              {step === "configure" && `Configure ${selectedPlan.name}`}
              {step === "deposit" &&
                `Fund ${selectedPlan.name} via ${selectedAsset}`}
              {step === "confirmed" && `Allocation Queued`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: CONFIGURE ALLOCATION */}
        {step === "configure" && (
          <div className="space-y-5 p-6 sm:p-8">
            {/* Plan Selector */}
            <div>
              <label className="mb-2 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                Selected Plan Tier
              </label>
              <select
                value={selectedPlan.slug}
                onChange={(e) => {
                  const match = CURRENT_PLANS.find(
                    (p) => p.slug === e.target.value
                  )
                  if (match) {
                    setSelectedPlan(match)
                    setDepositAmount(match.minimumAmount)
                  }
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm font-semibold text-white transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CURRENT_PLANS.map((p) => (
                  <option
                    key={p.slug}
                    value={p.slug}
                    className="bg-slate-900 text-white"
                  >
                    {p.name} — {p.returnPercentage}% Yield ({p.durationHours}h
                    Cycle)
                  </option>
                ))}
              </select>
            </div>

            {/* Deposit Amount */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Investment Capital (USD)
                </label>
                <span className="font-mono text-[11px] text-slate-400">
                  Min: {formatCurrency(selectedPlan.minimumAmount)}
                </span>
              </div>
              <input
                type="number"
                min={selectedPlan.minimumAmount}
                max={
                  selectedPlan.maximumAmount === 0
                    ? 1000000
                    : selectedPlan.maximumAmount
                }
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-lg font-bold text-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cryptocurrency Settlement Rail Choice */}
            <div>
              <label className="mb-2 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                Settlement Rail
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(["USDT", "BTC", "ETH"] as const).map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => setSelectedAsset(asset)}
                    className={`rounded-xl border p-2.5 text-center transition-all ${
                      selectedAsset === asset
                        ? "border-blue-500 bg-blue-950 font-bold text-blue-200 shadow-sm"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <div className="font-mono text-sm">{asset}</div>
                    <div className="text-[10px] font-semibold text-slate-400">
                      0% Fee
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Yield Summary Box */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Contract Duration:</span>
                <span className="font-bold text-slate-200">
                  {selectedPlan.durationHours} Hours
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>
                  Configured Yield (+{selectedPlan.returnPercentage}%):
                </span>
                <span className="font-bold text-emerald-400">
                  +{formatCurrency(calculations.projectedProfit)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Principal Return:</span>
                <span className="font-bold text-slate-200">100% Unlocked</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold text-white">
                <span>Total Maturity Payout:</span>
                <span className="font-extrabold text-cyan-400">
                  {formatCurrency(calculations.projectedPayout)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep("deposit")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:from-blue-500 hover:to-cyan-500"
            >
              <span>Generate Single-Use {selectedAsset} Vault</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STEP 2: DISPLAY DEPOSIT ADDRESS */}
        {step === "deposit" && (
          <div className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between rounded-2xl border border-blue-500/40 bg-blue-950/60 p-4">
              <div>
                <div className="text-xs font-semibold text-blue-300">
                  Deposit Target
                </div>
                <div className="font-mono text-xl font-bold text-white">
                  {formatCurrency(depositAmount)} in {selectedAsset}
                </div>
              </div>
              <span className="rounded-full bg-blue-600 px-2.5 py-1 font-mono text-xs font-bold text-white">
                {selectedPlan.durationHours}h Cycle
              </span>
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                Single-Use Cold Storage Deposit Address ({selectedAsset})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentAddress}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-shrink-0 rounded-xl bg-slate-800 p-3 text-white transition-colors hover:bg-slate-700"
                  title="Copy Vault Address"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              {copied && (
                <div className="mt-1 text-[11px] font-semibold text-emerald-400">
                  Address copied to clipboard!
                </div>
              )}
            </div>

            <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span>Multi-Signature Ledger Verification</span>
              </div>
              <p>
                Send only {selectedAsset} to this allocated vault address.
                Deposit confirmations require 1 network confirmation before
                automatic epoch commencement.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("configure")}
                className="hover:bg-slate-750 w-1/3 rounded-xl bg-slate-800 py-3 text-xs font-bold text-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep("confirmed")}
                className="flex w-2/3 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-bold text-white shadow-md transition-colors hover:from-emerald-500 hover:to-teal-500"
              >
                <span>Confirm Mock Transfer</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION RECEIPT */}
        {step === "confirmed" && (
          <div className="space-y-4 p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-950 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h4 className="text-xl font-bold text-white">
              Allocation Successfully Queued
            </h4>

            <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-300">
              Your test allocation of {formatCurrency(depositAmount)} under{" "}
              {selectedPlan.name} is synchronized with the double-entry ledger.
            </p>

            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-left font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="font-bold text-slate-200">
                  {selectedPlan.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Epoch:</span>
                <span className="font-bold text-slate-200">
                  {selectedPlan.durationHours} Hours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Projected Maturity:</span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(calculations.projectedPayout)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-500"
            >
              Return to Platform Overview
            </button>
          </div>
        )}

        <div className="border-t border-slate-800 bg-slate-950 p-4 text-center text-[10px] text-slate-400">
          Illustrative simulator interface. Live investment yields are governed
          by active contract terms.
        </div>
      </div>
    </div>
  )
}
