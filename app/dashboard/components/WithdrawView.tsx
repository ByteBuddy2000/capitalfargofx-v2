// WithdrawView.tsx
import React, { useState } from "react"
import {
  ArrowUpFromLine,
  Wallet,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { User, Withdrawal } from "@/types"
import { createUserWithdrawal } from "@/controller/userMutations.actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toast"
import Image from "next/image"

interface WithdrawViewProps {
  currentUser: User
  onWithdrawSuccess: () => void
  onNavigateAccount: () => void
  onNavigateTransactions: () => void
}

export const WithdrawView: React.FC<WithdrawViewProps> = ({
  currentUser,
  onWithdrawSuccess,
  onNavigateAccount,
  onNavigateTransactions,
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<"BTC" | "ETH" | "USDT">(
    "USDT"
  )
  const [amount, setAmount] = useState<number>(100)
  const [destinationAddress, setDestinationAddress] = useState<string>(
    currentUser.usdtWallet ||
      currentUser.btcWallet ||
      currentUser.ethWallet ||
      ""
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [submittedWithdrawal, setSubmittedWithdrawal] =
    useState<Withdrawal | null>(null)
  const prices = { BTC: 64000, ETH: 3400, USDT: 1 }

  const { success, error: toastError } = useToast()

  const minWithdrawal = 50

  const selectedPrice = prices[selectedCrypto]
  const cryptoAmount = amount > 0 ? amount / selectedPrice : 0
  const selectedAsset = currentUser.assets?.find(
    (asset) => asset.symbol === selectedCrypto
  )
  const selectedAssetUsdBalance = selectedAsset
    ? Number(selectedAsset.availableBalance || 0) * selectedPrice
    : Number(currentUser.availableBalance || 0)

  // Sync wallet address when selectedCrypto changes
  const handleCryptoChange = (symbol: "BTC" | "ETH" | "USDT") => {
    setSelectedCrypto(symbol)
    if (symbol === "BTC") setDestinationAddress(currentUser.btcWallet || "")
    if (symbol === "ETH") setDestinationAddress(currentUser.ethWallet || "")
    if (symbol === "USDT") setDestinationAddress(currentUser.usdtWallet || "")
  }

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!amount || amount < minWithdrawal) {
      setErrorMsg(
        `Minimum withdrawal amount is $${minWithdrawal.toFixed(2)} USD.`
      )
      return
    }

    if (amount > selectedAssetUsdBalance) {
      setErrorMsg(
        `Insufficient ${selectedCrypto} balance ($${selectedAssetUsdBalance.toFixed(2)} USD available).`
      )
      return
    }

    if (!destinationAddress.trim()) {
      setErrorMsg(
        `Please specify a valid destination ${selectedCrypto} address.`
      )
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createUserWithdrawal({
        amount: Number(amount),
        asset: selectedCrypto,
        network:
          selectedCrypto === "BTC"
            ? "Bitcoin Native"
            : selectedCrypto === "ETH"
              ? "ERC-20"
              : "ERC-20 / TRC-20",
        destinationAddress: destinationAddress.trim(),
      })
      if (!result.success || !result.withdrawal)
        throw new Error(result.message || "Unable to submit withdrawal.")
      setSubmittedWithdrawal({
        ...result.withdrawal,
        id: String(result.withdrawal._id || result.withdrawal.id),
        userId: currentUser.id,
        userFullName: currentUser.fullName,
        userEmail: currentUser.email,
        cryptoCurrency: selectedCrypto,
      } as Withdrawal)
      success(
        "Withdrawal Request Submitted",
        `$${amount.toLocaleString()} scheduled for blockchain broadcast.`
      )
      onWithdrawSuccess()
    } catch (err) {
      toastError(
        "Withdrawal Failed",
        err instanceof Error
          ? err.message
          : "Error processing withdrawal request"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900">
            <ArrowUpFromLine className="h-6 w-6 text-amber-600" />
            Withdraw Available Funds
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Liquidate your available principal and contract earnings directly to
            your cryptocurrency wallet.
          </p>
        </div>
      </div>

      {submittedWithdrawal ? (
        <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
              Withdrawal Order Placed
            </span>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Order #{submittedWithdrawal.id.substring(0, 10)}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              Your withdrawal of{" "}
              <strong className="text-slate-900">
                ${(submittedWithdrawal?.amount || 0).toLocaleString()} USD
              </strong>{" "}
              ({submittedWithdrawal?.cryptoCurrency || "Crypto"}) is queued for
              automated liquidity dispatch.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Destination Address:</span>
              <span className="max-w-50 truncate font-mono font-bold text-slate-900">
                {submittedWithdrawal.destinationAddress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Asset & Network:</span>
              <span className="font-semibold text-slate-800">
                {submittedWithdrawal.cryptoCurrency} (
                {submittedWithdrawal.network})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Processing Fee:</span>
              <span className="font-bold text-emerald-600">$0.00 (0.00%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <Badge variant="warning">PENDING EXECUTION</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="primary" onClick={onNavigateTransactions}>
              View Transaction History
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSubmittedWithdrawal(null)
                setAmount(100)
              }}
            >
              New Withdrawal
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column (8 cols): Withdrawal Form */}
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-8">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-6">
              {/* Asset Selection */}
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  1. Select Payout Asset
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
                      onClick={() => handleCryptoChange(c.symbol)}
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
              </div>

              {/* Amount Field */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                    2. Withdrawal Amount (USD)
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(selectedAssetUsdBalance)}
                    className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Max ($
                    {selectedAssetUsdBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                    )
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 text-xl font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min={minWithdrawal}
                    max={selectedAssetUsdBalance}
                    step={10}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pr-4 pl-9 font-mono text-xl font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>Minimum: ${minWithdrawal.toFixed(2)}</span>
                  <span>
                    Available: $
                    {selectedAssetUsdBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="text-xs font-semibold text-blue-600">
                  Estimated:{" "}
                  {cryptoAmount.toFixed(selectedCrypto === "BTC" ? 6 : 4)}{" "}
                  {selectedCrypto} at ${selectedPrice.toLocaleString()} USD
                </div>
              </div>

              {/* Destination Address Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                    3. Destination {selectedCrypto} Address
                  </label>
                  <button
                    type="button"
                    onClick={onNavigateAccount}
                    className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <Wallet className="h-3.5 w-3.5" />
                    Manage Saved Wallets
                  </button>
                </div>

                <Input
                  placeholder={`Paste destination ${selectedCrypto} wallet address`}
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  helperText="Ensure the recipient address is compatible with the selected blockchain network."
                  required
                />
              </div>

              {/* Calculation Summary Box */}
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Requested Amount:</span>
                  <span className="font-mono font-bold text-slate-900">
                    $
                    {(amount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Execution Fee:</span>
                  <span className="font-bold text-emerald-600">
                    $0.00 (0.00%)
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                  <span>Net Capital Dispatched:</span>
                  <span className="font-mono text-sm font-black text-emerald-600">
                    $
                    {(amount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={selectedAssetUsdBalance < minWithdrawal}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full justify-center bg-amber-600 font-bold shadow-md shadow-amber-600/20 hover:bg-amber-700"
              >
                Submit Withdrawal Request
              </Button>
            </form>
          </div>

          {/* Right Column (4 cols): Balances & Security Policies */}
          <div className="space-y-6 lg:col-span-4">
            {/* Balance Card */}
            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-sm">
              <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                Liquidity Snapshot
              </span>

              <div>
                <p className="text-xs text-slate-400">Available Balance</p>
                <p className="mt-0.5 font-mono text-2xl font-black text-emerald-400">
                  $
                  {(currentUser?.availableBalance || 0).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}
                </p>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-400">Locked in Active Plans</p>
                <p className="mt-0.5 font-mono text-sm font-bold text-slate-300">
                  $
                  {(currentUser?.earningBalance || 0).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2 }
                  )}
                </p>
              </div>
            </div>

            {/* Configured Wallets Overview */}
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                  Saved Payout Wallets
                </span>
                <button
                  onClick={onNavigateAccount}
                  className="cursor-pointer text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">
                    Bitcoin (BTC)
                  </span>
                  <span className="block truncate font-mono text-[11px] text-slate-800">
                    {currentUser.btcWallet || "Not configured"}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">
                    Ethereum (ETH)
                  </span>
                  <span className="block truncate font-mono text-[11px] text-slate-800">
                    {currentUser.ethWallet || "Not configured"}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">
                    Tether (USDT)
                  </span>
                  <span className="block truncate font-mono text-[11px] text-slate-800">
                    {currentUser.usdtWallet || "Not configured"}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="leading-relaxed">
                Withdrawals are audited against your ledger balance and
                broadcast securely to standard cryptocurrency network nodes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
