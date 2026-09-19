"use client"

import React, { useState } from "react"
import {
  User as UserIcon,
  Mail,
  Lock,
  ArrowRight,
  Wallet,
  Users,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react"
import { User } from "@/types"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { useToast } from "../ui/Toast"

interface RegisterFormProps {
  initialReferralCode?: string
  onSuccess: (user: User) => void
  onSwitchToLogin: () => void
  onOpenTerms: () => void
}

const getReferralCodeFromURL = (initial?: string): string => {
  if (initial) return initial
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("ref") || ""
  }
  return ""
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  initialReferralCode,
  onSuccess,
  onSwitchToLogin,
  onOpenTerms,
}) => {
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [btcWallet, setBtcWallet] = useState("")
  const [ethWallet, setEthWallet] = useState("")
  const [usdtWallet, setUsdtWallet] = useState("")
  const [agreedTerms, setAgreedTerms] = useState(false)

  const [referralCode] = useState(() =>
    getReferralCodeFromURL(initialReferralCode)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { success, error: toastError } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validations
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setError(
        "Please fill in all mandatory fields marked with an asterisk (*)."
      )
      return
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 alphanumeric characters.")
      return
    }

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setError("Email addresses do not match.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (!agreedTerms) {
      setError(
        "You must accept the Terms of Service and Risk Disclosure to proceed."
      )
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          btcWallet: btcWallet.trim(),
          ethWallet: ethWallet.trim(),
          usdtWallet: usdtWallet.trim(),
          referralCode: referralCode.trim(),
        }),
      })

      const result = (await response.json().catch(() => ({}))) as {
        user?: User
        message?: string
      }

      if (!response.ok || !result.user) {
        throw new Error(result.message || "Unable to create your account.")
      }

      success(
        "Account Created Successfully",
        "Check your email to verify your account before signing in."
      )
      onSuccess(result.user)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create your account."
      )
      toastError(
        "Registration Failed",
        "Please review your details and try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      className="max-h-[75vh] space-y-4 overflow-y-auto pr-1"
    >
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Upline Card */}
      <div className="hidden items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-3">
      {/* <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-3"> */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-700">
            Your Upline Sponsor:
          </span>
        </div>
        <div className="text-xs font-bold">
          {referralCode.trim() ? (
            <span className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />@{referralCode.trim()}
            </span>
          ) : (
            <span className="font-mono text-slate-500">
              None (Direct Registration)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Input
          label="Full Legal Name"
          placeholder="e.g. Alexander Hamilton"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          leftIcon={<UserIcon className="h-4 w-4" />}
          required
        />

        <Input
          label="Desired Username"
          placeholder="e.g. alexander88"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          leftIcon={<UserIcon className="h-4 w-4" />}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Input
          label="Email Address"
          type="email"
          placeholder="alex@investor.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          label="Confirm Email Address"
          type="email"
          placeholder="alex@investor.com"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
              aria-pressed={showConfirmPassword}
              className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          autoComplete="new-password"
          required
        />
      </div>

      {/* Wallet Addresses (Optional at registration, configurable later) */}
      <div className="space-y-3 border-t border-slate-100 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Wallet className="h-4 w-4 text-emerald-600" />
          <span>
            Payout Receiving Wallets (Optional - Can be set in Account)
          </span>
        </div>

        <Input
          label="Bitcoin Receiving Address"
          placeholder="bc1q..."
          value={btcWallet}
          onChange={(e) => setBtcWallet(e.target.value)}
        />

        <Input
          label="Ethereum Receiving Address"
          placeholder="0x..."
          value={ethWallet}
          onChange={(e) => setEthWallet(e.target.value)}
        />

        <Input
          label="USDT (ERC-20 / TRC-20) Receiving Address"
          placeholder="0x... or T..."
          value={usdtWallet}
          onChange={(e) => setUsdtWallet(e.target.value)}
        />
      </div>

      {/* Terms & Conditions Acceptance */}
      <div className="pt-2">
        <label className="flex cursor-pointer items-start gap-2.5 select-none">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 cursor-pointer rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs leading-tight text-slate-600">
            I certify that I am at least 18 years old and agree to the{" "}
            <button
              type="button"
              onClick={onOpenTerms}
              className="font-bold text-blue-600 hover:underline"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={onOpenTerms}
              className="font-bold text-blue-600 hover:underline"
            >
              Risk Disclosure
            </button>
            .
          </span>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="h-4 w-4" />}
        className="mt-3 w-full justify-center border-none bg-linear-to-r from-blue-600 to-emerald-600 py-3 shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-emerald-700"
      >
        Complete Registration
      </Button>

      <div className="border-t border-slate-100 pt-3 text-center">
        <p className="text-xs text-slate-600">
          Already registered?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="cursor-pointer font-bold text-blue-600 hover:text-blue-700"
          >
            Sign In Here
          </button>
        </p>
      </div>
    </form>
  )
}
