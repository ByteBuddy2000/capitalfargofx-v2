import React, { useState } from "react"
import {
  ArrowDownToLine,
  Check,
  Copy,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { User, InvestmentPlan, Deposit, CryptoWalletConfig } from "@/types"
import { createUserDeposit } from "@/controller/userMutations.actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { CryptoQRCode } from "@/components/ui/CryptoQRCode"
import { useToast } from "@/components/ui/Toast"
import Image from "next/image"

interface DepositViewProps {
  currentUser: User
  initialPlans: InvestmentPlan[]
  initialWallets: CryptoWalletConfig[]
  preselectedPlan?: InvestmentPlan | null
  onDepositSuccess: () => void
  onNavigateTransactions: () => void
}

export const DepositView: React.FC<DepositViewProps> = ({
  currentUser,
  initialPlans,
  initialWallets,
  preselectedPlan,
  onDepositSuccess,
  onNavigateTransactions,
}) => {
  const [plans] = useState<InvestmentPlan[]>(initialPlans)
  const wallets = initialWallets
  const { success, error: toastError } = useToast()

  const [step, setStep] = useState<"CONFIGURE" | "PAYMENT" | "SUCCESS">(
    "CONFIGURE"
  )

  // Selection States
  const initialPlan = initialPlans[0]
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    () =>
      preselectedPlan?.id ||
      initialPlans[1]?.id ||
      initialPlan?.id ||
      "plan-gold"
  )
  const selectedPlan =
    plans.find((p) => p.id === selectedPlanId) ||
    plans[0]

  const [amount, setAmount] = useState<number>(() =>
    preselectedPlan
      ? preselectedPlan.minimumAmount
      : selectedPlan?.minimumAmount || 10000
  )
  const [selectedCrypto, setSelectedCrypto] = useState<"BTC" | "ETH" | "USDT">(
    "USDT"
  )
  const prices = { BTC: 64000, ETH: 3400, USDT: 1 }

  // Confirmation state
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedDeposit, setSubmittedDeposit] = useState<Deposit | null>(null)

  const [copiedWallet, setCopiedWallet] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Selected wallet from admin config
  const activeWalletConfig =
    wallets.find((w) => w.symbol === selectedCrypto) || wallets[0]

  // Calculations
  const calculatedProfit =
    ((amount || 0) * (selectedPlan?.returnPercentage || 0)) / 100
  const calculatedTotal = (amount || 0) + calculatedProfit

  // Crypto conversion estimates (approximate for display)
  const getEstimatedCryptoAmount = () => {
    if (selectedCrypto === "USDT") return `${amount.toFixed(2)} USDT`
    if (selectedCrypto === "BTC")
      return `${(amount / prices.BTC).toFixed(6)} BTC`
    if (selectedCrypto === "ETH")
      return `${(amount / prices.ETH).toFixed(4)} ETH`
    return `${amount} USD`
  }

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!amount || amount < (selectedPlan?.minimumAmount || 0)) {
      setErrorMsg(
        `Minimum investment amount for ${selectedPlan?.name || "this plan"} is $${(selectedPlan?.minimumAmount || 0).toLocaleString()}`
      )
      return
    }

    if (
      (selectedPlan?.maximumAmount || 0) > 0 &&
      amount > selectedPlan.maximumAmount
    ) {
      setErrorMsg(
        `Maximum investment amount for ${selectedPlan?.name || "this plan"} is $${(selectedPlan?.maximumAmount || 0).toLocaleString()}`
      )
      return
    }

    setStep("PAYMENT")
  }

  const handleCopyWallet = () => {
    if (activeWalletConfig) {
      navigator.clipboard.writeText(activeWalletConfig.address)
      setCopiedWallet(true)
      success(
        "Wallet Address Copied",
        "Paste into your cryptocurrency exchange or hardware wallet"
      )
      setTimeout(() => setCopiedWallet(false), 2500)
    }
  }

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlan) {
      setErrorMsg("Please select a valid investment plan before submitting.")
      setStep("CONFIGURE")
      return
    }

    if (!activeWalletConfig) {
      setErrorMsg("No wallet configuration is available for this asset.")
      return
    }

    const trimmedHash = transactionHash.trim()
    if (trimmedHash.length < 10) {
      setErrorMsg(
        "The blockchain transaction hash must be at least 10 characters long."
      )
      return
    }

    if (
      !activeWalletConfig.network ||
      activeWalletConfig.network.trim().length < 2
    ) {
      setErrorMsg(
        "The selected asset does not have a valid network configured."
      )
      return
    }

    if (
      !activeWalletConfig.address ||
      activeWalletConfig.address.trim().length < 10
    ) {
      setErrorMsg(
        "The selected asset does not have a valid receiving address configured."
      )
      return
    }

    setErrorMsg("")
    setIsSubmitting(true)
    try {
      const result = await createUserDeposit({
        planId: selectedPlan.id || selectedPlan.slug,
        amount: Number(amount),
        asset: selectedCrypto,
        network: activeWalletConfig.network,
        receivingAddress: activeWalletConfig.address,
        txHash: trimmedHash,
      })
      if (!result.success || !result.deposit) throw new Error(result.message || "Unable to submit deposit.")
      setSubmittedDeposit({
        ...result.deposit,
        id: String(result.deposit._id || result.deposit.id),
        planName: selectedPlan.name,
        userId: currentUser.id,
        userFullName: currentUser.fullName,
        userEmail: currentUser.email,
      } as Deposit)
      setStep("SUCCESS")
      success(
        "Deposit Submitted",
        "Your deposit verification request is pending administrative review."
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not register deposit"
      setErrorMsg(message)
      toastError("Submission Error", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900">
            <ArrowDownToLine className="h-6 w-6 text-emerald-600" />
            Make a Cryptocurrency Deposit
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Deploy capital into structured investment contracts with instant
            blockchain routing.
          </p>
        </div>

        {/* Stepper Pill */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span
            className={`rounded-full px-3 py-1 ${step === "CONFIGURE" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}`}
          >
            1. Configure
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`rounded-full px-3 py-1 ${step === "PAYMENT" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}`}
          >
            2. Payment
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`rounded-full px-3 py-1 ${step === "SUCCESS" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}
          >
            3. Confirmation
          </span>
        </div>
      </div>

      {/* STEP 1: CONFIGURE PLAN & AMOUNT */}
      {step === "CONFIGURE" && (
        <form onSubmit={handleProceedToPayment} className="space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Plan Selection Cards */}
          <div>
            <label className="mb-3 block text-xs font-bold tracking-wider text-slate-700 uppercase">
              1. Select Structured Investment Plan
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {plans.map((p) => {
                const isSelected = selectedPlanId === p.id
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPlanId(p.id)
                      if (amount < p.minimumAmount) {
                        setAmount(p.minimumAmount)
                      }
                    }}
                    className={`flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-5 transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/40 shadow-md ring-1 ring-blue-600"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-base font-extrabold text-slate-900">
                          {p.name}
                        </h4>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                          {p.durationHours}h Cycle
                        </span>
                      </div>
                      <div className="mb-2 font-mono text-2xl font-black text-emerald-600">
                        +{p.returnPercentage}% ROI
                      </div>
                      <p className="mb-4 text-xs leading-relaxed text-slate-500">
                        {p.description}
                      </p>
                    </div>

                    <div className="space-y-1 border-t border-slate-100 pt-3 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Min Deposit:</span>
                        <span className="font-mono font-bold text-slate-900">
                          ${(p?.minimumAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Max Deposit:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {(p?.maximumAmount || 0) > 0
                            ? `$${(p?.maximumAmount || 0).toLocaleString()}`
                            : "Unlimited"}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Amount Input & Currency Selection */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Amount Field */}
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase">
                2. Deposit Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-xl font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min={selectedPlan?.minimumAmount || 100}
                  max={
                    (selectedPlan?.maximumAmount || 0) > 0
                      ? selectedPlan.maximumAmount
                      : undefined
                  }
                  step={50}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pr-4 pl-9 font-mono text-xl font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>
                  Min: ${(selectedPlan?.minimumAmount || 0).toLocaleString()}
                </span>
                <span>
                  Max:{" "}
                  {(selectedPlan?.maximumAmount || 0) > 0
                    ? `$${(selectedPlan?.maximumAmount || 0).toLocaleString()}`
                    : "Unlimited"}
                </span>
              </div>
            </div>

            {/* Cryptocurrency Selector */}
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <label className="block text-xs font-bold tracking-wider text-slate-700 uppercase">
                3. Select Settlement Asset
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    symbol: "USDT" as const,
                    image: "/usdt.png",
                    alt: "USDT",
                    color:
                      "border-emerald-500 text-emerald-600 bg-emerald-50/30",
                  },
                  {
                    symbol: "BTC" as const,
                    image: "/bitcoin.png",
                    alt: "Bitcoin",
                    color: "border-amber-500 text-amber-600 bg-amber-50/30",
                  },
                  {
                    symbol: "ETH" as const,
                    image: "/ethereum.png",
                    alt: "Ethereum",
                    color: "border-blue-500 text-blue-600 bg-blue-50/30",
                  },
                ].map((c) => (
                  <button
                    key={c.symbol}
                    type="button"
                    onClick={() => setSelectedCrypto(c.symbol)}
                    className={`cursor-pointer rounded-2xl border-2 p-3 text-center transition-all ${
                      selectedCrypto === c.symbol
                        ? `${c.color} font-black shadow-xs ring-1`
                        : "border-slate-200 bg-slate-50 font-semibold text-slate-700 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Image
                        src={c.image}
                        alt={c.alt}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-[11px] leading-tight text-slate-500">
                Network: <strong>{activeWalletConfig?.network}</strong>. Zero
                deposit fee.
              </p>
            </div>
          </div>

          {/* Investment Yield Summary Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl sm:p-7">
            <h4 className="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
              Contract Yield & Maturity Breakdown
            </h4>

            <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-700/60 bg-slate-800/80 p-3.5">
                <span className="block text-[11px] text-slate-400">
                  Principal Capital
                </span>
                <span className="mt-1 block font-mono text-lg font-black text-white">
                  ${(amount || 0).toLocaleString()}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-700/60 bg-slate-800/80 p-3.5">
                <span className="block text-[11px] text-slate-400">
                  Contract Yield ({selectedPlan?.returnPercentage || 0}%)
                </span>
                <span className="mt-1 block font-mono text-lg font-black text-emerald-400">
                  +$
                  {(calculatedProfit || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-700/60 bg-slate-800/80 p-3.5">
                <span className="block text-[11px] text-slate-400">
                  Lock Duration
                </span>
                <span className="mt-1 block font-mono text-lg font-black text-blue-400">
                  {selectedPlan?.durationHours || 24} Hours
                </span>
              </div>

              <div className="rounded-2xl border border-slate-700/60 bg-slate-800/80 p-3.5">
                <span className="block text-[11px] text-slate-400">
                  Total Payout at Maturity
                </span>
                <span className="mt-1 block font-mono text-lg font-black text-emerald-300">
                  $
                  {(calculatedTotal || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-800 pt-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>100% Principal Protection Guarantee</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="border-none bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-600"
              >
                Proceed to Payment Details →
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* STEP 2: PAYMENT & QR CODE DETAILS */}
      {step === "PAYMENT" && (
        <form onSubmit={handleSubmitPayment} className="space-y-6">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Payment Order Summary
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedPlan?.name || "Investment"} Plan ($
                  {(amount || 0).toLocaleString()} USD)
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
                onClick={() => setStep("CONFIGURE")}
              >
                Modify Order
              </Button>
            </div>

            {/* QR Code & Wallet Address Display Box */}
            <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 md:grid-cols-12">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center md:col-span-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <CryptoQRCode
                    address={activeWalletConfig?.address || ""}
                    asset={selectedCrypto as "BTC" | "ETH" | "USDT"}
                  />
                </div>
                <span className="mt-2 text-[11px] font-semibold text-slate-500">
                  Scan to Pay in Wallet App
                </span>
              </div>

              {/* Address & Instructions */}
              <div className="space-y-4 md:col-span-8">
                <div>
                  <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Send Exact Cryptocurrency Amount:
                  </label>
                  <div className="font-mono text-2xl font-black text-blue-600">
                    {getEstimatedCryptoAmount()}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Rate pegged at standard market index for {selectedCrypto}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Deposit Receiving Address ({activeWalletConfig?.symbol} -{" "}
                    {activeWalletConfig?.network})
                  </label>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white p-3">
                    <span className="flex-1 font-mono text-xs font-bold break-all text-slate-900 select-all">
                      {activeWalletConfig?.address}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyWallet}
                      className="shrink-0 cursor-pointer rounded-xl bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
                      title="Copy Address"
                    >
                      {copiedWallet ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                  <strong>Important:</strong> Please ensure you send funds over
                  the <strong>{activeWalletConfig?.network}</strong> network.
                  Sending via incorrect blockchain networks may lead to
                  irreversible loss of funds.
                </div>
              </div>
            </div>

            {/* Transaction Hash Input */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold tracking-wider text-slate-800 uppercase">
                Submit Blockchain Transaction Hash / TXID
              </label>
              <Input
                placeholder="e.g. 0x4f89d31b2... or Bitcoin Tx Hash"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                helperText="Paste the transaction ID or transaction hash provided by your wallet or exchange."
                required
              />
            </div>

            {/* Submit Action */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>
                  Verification typically settles within 5-15 minutes after
                  blockchain confirmation.
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<CheckCircle2 className="h-4 w-4" />}
                className="w-full border-none bg-linear-to-r from-blue-600 to-emerald-600 font-bold hover:from-blue-700 hover:to-emerald-700 sm:w-auto"
              >
                I Have Sent Payment
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* STEP 3: SUCCESS NOTIFICATION */}
      {step === "SUCCESS" && submittedDeposit && (
        <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
              Deposit Successfully Registered
            </span>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Deposit Order #{submittedDeposit?.id?.substring(0, 10) || ""}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              Your deposit of{" "}
              <strong className="text-slate-900">
                ${(submittedDeposit?.amount || 0).toLocaleString()} USD
              </strong>{" "}
              ({submittedDeposit?.asset || "Crypto"}) has been recorded into the
              platform verification queue.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Target Plan:</span>
              <span className="font-bold text-slate-900">
                {submittedDeposit.planName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Asset & Network:</span>
              <span className="font-semibold text-slate-800">
                {submittedDeposit.asset} ({submittedDeposit.network})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction TXID:</span>
              <span className="max-w-50 truncate font-mono text-slate-800">
                {submittedDeposit.txHash}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <Badge variant="warning">PENDING VERIFICATION</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="primary" onClick={onNavigateTransactions}>
              View in Transaction Ledger
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setStep("CONFIGURE")
                setTransactionHash("")
                onDepositSuccess()
              }}
            >
              Create Another Deposit
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
