// Login.tsx
"use client"

import React, { useState } from "react"
import {
  User as UserIcon,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react"
import { getSession, signIn } from "next-auth/react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { useToast } from "../ui/Toast"
import { useRouter } from "next/navigation"
import { isAdminRole } from "@/types"

interface LoginFormProps {
  onSwitchToRegister: () => void
  onForgotPassword: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onForgotPassword,
}) => {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { success, error: toastError } = useToast()

  const getFriendlyLoginError = (rawError?: string | null) => {
    if (!rawError) return "Unable to sign you in. Please try again."

    if (
      rawError === "CredentialsSignin" ||
      rawError.toLowerCase().includes("invalid") ||
      rawError.toLowerCase().includes("incorrect")
    ) {
      return "Incorrect email/username or password. Please try again."
    }

    if (rawError === "Configuration") {
      return "There is a temporary sign-in problem. Please try again in a moment."
    }

    return rawError.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!identifier.trim() || !password) {
      setError("Please enter both your email/username and password.")
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: identifier,
        password,
        redirect: false,
      })

      if (result?.error) {
        const message = getFriendlyLoginError(result.error)
        setError(message)
        toastError("Authentication Failed", message)
        return
      }

      const session = await getSession()
      const role = String(session?.user?.role || "").toUpperCase()

      if (role !== "USER" && !isAdminRole(role)) {
        const message = "Your account role could not be verified. Please try again."
        setError(message)
        toastError("Authentication Failed", message)
        return
      }

      success("Authentication Successful", "Welcome back to CapitalsFargoFX.")
      const callbackUrl = new URLSearchParams(window.location.search).get(
        "callbackUrl"
      )
      const destination =
        callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : isAdminRole(role)
            ? "/admin"
            : "/dashboard"

      router.push(destination)
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? getFriendlyLoginError(requestError.message)
          : "Unable to sign you in."
      setError(message)
      toastError("Authentication Failed", message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: "INVESTOR" | "ADMIN") => {
    setError(
      `Demo access is disabled. Sign in with your ${role === "ADMIN" ? "admin" : "investor"} account.`
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Shortcut Bar */}
      <div className="hidden rounded-2xl border border-blue-200/80 bg-blue-50/80 p-3.5">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-blue-900">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>Quick Demo Access</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin("INVESTOR")}
            className="cursor-pointer rounded-xl border border-blue-200 bg-white p-2 text-left text-xs transition-all hover:border-blue-400 hover:shadow-xs"
          >
            <span className="block truncate font-bold text-slate-900">
              Investor Account
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              john123 ($14.5k vol)
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("ADMIN")}
            className="cursor-pointer rounded-xl border border-amber-200 bg-white p-2 text-left text-xs transition-all hover:border-amber-400 hover:shadow-xs"
          >
            <span className="block truncate font-bold text-amber-900">
              Admin Console
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              Full Security Suite
            </span>
          </button>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-white">Investor Sign In</h2>
        <p className="text-sm text-white/60">
          Securely access your investor account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 shadow-sm"
          >
            {error}
          </div>
        )}

        <Input
          label="Email or Username"
          placeholder="e.g. john.investor@example.com or john123"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value)
            if (error) setError("")
          }}
          leftIcon={<UserIcon className="h-4 w-4" />}
          autoComplete="username"
          required
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError("")
            }}
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="cursor-pointer rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            autoComplete="current-password"
            required
          />
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onForgotPassword}
              className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="mt-2 w-full justify-center bg-blue-600 py-3 shadow-md shadow-blue-600/20 hover:bg-blue-700"
        >
          Sign In to Dashboard
        </Button>
      </form>

      <div className="border-t border-slate-100 pt-4 text-center">
        <p className="text-xs text-slate-600">
          Don&apos;t have an investor profile?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="cursor-pointer font-bold text-blue-600 hover:text-blue-700"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  )
}
