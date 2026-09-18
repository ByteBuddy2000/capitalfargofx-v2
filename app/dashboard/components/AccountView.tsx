// AccountView.tsx
import React, { useState } from "react"
import {
  User as UserIcon,
  Wallet,
  Lock,
  ShieldCheck,
  Save,
  KeyRound,
  Mail,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/Toast"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { User } from "@/types"
import {
  changeUserPassword,
  updateUserProfile,
} from "@/controller/getUserDashboard.actions"

interface AccountViewProps {
  currentUser: User
  onUpdateUser: (updated: User) => void
}

/* -------------------------------------------------------------------------- */
/* Wallet Address Validators                                                   */
/* -------------------------------------------------------------------------- */

// Bitcoin:
// - Legacy P2PKH: 1...
// - Legacy P2SH: 3...
// - Native SegWit: bc1q...
// - Taproot: bc1p...
const BTC_ADDRESS_REGEX =
  /^(?:[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1q[a-z0-9]{38,59}|bc1p[a-z0-9]{58})$/

// Ethereum / USDT ERC-20:
// 0x + exactly 40 hexadecimal characters
const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

// USDT TRC-20:
// T + 33 Base58 characters
const TRC20_ADDRESS_REGEX = /^T[1-9A-HJ-NP-Za-km-z]{33}$/

const validateBtcAddress = (address: string): boolean => {
  return BTC_ADDRESS_REGEX.test(address.trim())
}

const validateEthAddress = (address: string): boolean => {
  return ETH_ADDRESS_REGEX.test(address.trim())
}

const validateUsdtAddress = (address: string): boolean => {
  const value = address.trim()

  return ETH_ADDRESS_REGEX.test(value) || TRC20_ADDRESS_REGEX.test(value)
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  /* ------------------------------------------------------------------------ */
  /* Wallet State                                                             */
  /* ------------------------------------------------------------------------ */

  const [btcWallet, setBtcWallet] = useState(currentUser.btcWallet || "")
  const [ethWallet, setEthWallet] = useState(currentUser.ethWallet || "")
  const [usdtWallet, setUsdtWallet] = useState(currentUser.usdtWallet || "")

  const [isSavingWallets, setIsSavingWallets] = useState(false)

  const [walletErrors, setWalletErrors] = useState({
    btc: "",
    eth: "",
    usdt: "",
  })

  /* ------------------------------------------------------------------------ */
  /* Password State                                                           */
  /* ------------------------------------------------------------------------ */

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const { success } = useToast()

  /* ------------------------------------------------------------------------ */
  /* Save Wallets                                                             */
  /* ------------------------------------------------------------------------ */

  const handleSaveWallets = async (e: React.FormEvent) => {
    e.preventDefault()

    const btc = btcWallet.trim()
    const eth = ethWallet.trim()
    const usdt = usdtWallet.trim()

    const errors = {
      btc: "",
      eth: "",
      usdt: "",
    }

    // Bitcoin validation
    if (btc && !validateBtcAddress(btc)) {
      errors.btc =
        "Invalid Bitcoin address. Use a valid BTC Legacy, SegWit, or Taproot address."
    }

    // Ethereum validation
    if (eth && !validateEthAddress(eth)) {
      errors.eth =
        "Invalid Ethereum address. Enter a valid 0x... Ethereum mainnet address."
    }

    // USDT validation
    if (usdt && !validateUsdtAddress(usdt)) {
      errors.usdt =
        "Invalid USDT address. Use a valid ERC-20 (0x...) or TRC-20 (T...) address."
    }

    setWalletErrors(errors)

    // Prevent saving when any address is invalid
    if (errors.btc || errors.eth || errors.usdt) {
      return
    }

    setIsSavingWallets(true)
    try {
      const result = await updateUserProfile({
        btcWallet: btc,
        ethWallet: eth,
        usdtWallet: usdt,
      })
      if (!result.success || !result.user)
        throw new Error(result.message || "Unable to update profile.")
      const updatedUser = {
        ...currentUser,
        ...result.user,
        id: String(result.user._id || result.user.id),
      } as User
      success(
        "Wallets Updated",
        "Your receiving crypto addresses have been securely stored."
      )
      onUpdateUser(updatedUser)
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Unable to update profile."
      )
    } finally {
      setIsSavingWallets(false)
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Change Password                                                          */
  /* ------------------------------------------------------------------------ */

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    setPasswordError("")

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.")
      return
    }

    setIsChangingPassword(true)
    try {
      const result = await changeUserPassword({ currentPassword, newPassword })
      if (!result.success)
        throw new Error(result.message || "Unable to update password.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      success("Password Changed", "Your account credentials have been updated.")
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Unable to update password."
      )
    } finally {
      setIsChangingPassword(false)
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Clear Individual Wallet Error                                            */
  /* ------------------------------------------------------------------------ */

  const clearWalletError = (wallet: "btc" | "eth" | "usdt") => {
    if (!walletErrors[wallet]) return

    setWalletErrors((prev) => ({
      ...prev,
      [wallet]: "",
    }))
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900">
            <UserIcon className="h-6 w-6 text-slate-800" />
            Account & Security Settings
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Manage your personal profile, payout destination wallets, and
            security credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* ------------------------------------------------------------------ */}
        {/* Left Column                                                        */}
        {/* ------------------------------------------------------------------ */}

        <div className="space-y-6 lg:col-span-5">
          {/* User Profile Card */}
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-2xl font-black text-white shadow-md">
                {currentUser.fullName.charAt(0)}
              </div>

              <div className="relative pr-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {currentUser.fullName}
                </h3>

                <p className="font-mono text-xs text-slate-500">
                  @{currentUser.username}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <Image
                    src="/verified.png"
                    width={512}
                    height={512}
                    alt="verified badge"
                    priority
                    className="absolute top-0 right-0 h-4 w-4 rounded-full border border-slate-200 bg-slate-100 object-contain"
                  />

                  <span className="hidden rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 capitalize">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
              {/* Email */}
              <div className="flex items-center justify-between gap-4">
                <span className="flex shrink-0 items-center gap-1.5 text-slate-500">
                  <Mail className="h-4 w-4 text-slate-400" />
                  Email
                </span>

                <span className="truncate font-semibold text-slate-900">
                  {currentUser.email}
                </span>
              </div>

              {/* Registration Date */}
              <div className="flex items-center justify-between gap-4">
                <span className="flex shrink-0 items-center gap-1.5 text-slate-500">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Registration Date
                </span>

                <span className="shrink-0 font-mono text-slate-800">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Upline Sponsor */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Upline Sponsor</span>

                <span className="font-bold text-slate-900">
                  {currentUser.uplineUsername
                    ? `@${currentUser.uplineUsername}`
                    : "Direct Investor"}
                </span>
              </div>
            </div>
          </div>

          {/* Security Guarantee Box */}
          <div className="space-y-2 rounded-3xl border border-slate-800 bg-slate-900 p-5 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />

              <span>Multi-Signature Asset Custody</span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-400">
              Your cryptocurrency withdrawals are executed to your verified
              receiving addresses. Changing wallet addresses is logged to the
              system audit trail.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Right Column                                                       */}
        {/* ------------------------------------------------------------------ */}

        <div className="space-y-8 lg:col-span-7">
          {/* Saved Crypto Wallets Form */}
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Wallet className="h-5 w-5 text-emerald-600" />

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Receiving Cryptocurrency Wallets
                </h3>

                <p className="text-xs text-slate-500">
                  Used as prefilled destinations when requesting withdrawals
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveWallets} className="space-y-4" noValidate>
              {/* Bitcoin */}
              <Input
                label="Bitcoin (BTC) Receiving Address"
                placeholder="bc1q..."
                value={btcWallet}
                onChange={(e) => {
                  setBtcWallet(e.target.value)
                  clearWalletError("btc")
                }}
                helperText={
                  walletErrors.btc ||
                  "Supports Legacy, Native SegWit, and Taproot addresses."
                }
                error={walletErrors.btc}
              />

              {/* Ethereum */}
              <Input
                label="Ethereum (ETH) Receiving Address"
                placeholder="0x..."
                value={ethWallet}
                onChange={(e) => {
                  setEthWallet(e.target.value)
                  clearWalletError("eth")
                }}
                helperText={
                  walletErrors.eth ||
                  "ERC-20 compatible Ethereum mainnet address."
                }
                error={walletErrors.eth}
              />

              {/* USDT */}
              <Input
                label="Tether (USDT) Receiving Address"
                placeholder="0x... or T..."
                value={usdtWallet}
                onChange={(e) => {
                  setUsdtWallet(e.target.value)
                  clearWalletError("usdt")
                }}
                helperText={
                  walletErrors.usdt ||
                  "Supports ERC-20 (0x...) and TRC-20 (T...) addresses."
                }
                error={walletErrors.usdt}
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isSavingWallets}
                leftIcon={<Save className="h-4 w-4" />}
                className="bg-emerald-600 font-bold hover:bg-emerald-700"
              >
                Save Payout Wallets
              </Button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <Lock className="h-5 w-5 text-blue-600" />

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Password
                </h3>

                <p className="text-xs text-slate-500">
                  Ensure your account is protected with a strong credentials
                  phrase
                </p>
              </div>
            </div>

            {passwordError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"
              >
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                isLoading={isChangingPassword}
                leftIcon={<KeyRound className="h-4 w-4" />}
                className="font-bold"
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
