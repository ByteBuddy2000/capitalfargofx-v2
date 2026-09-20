// app/verify/VerifyForm.tsx
'use client'
"use client"

import { useEffect, useState } from "react"
import Logo from "@/components/Logo/Logo"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const RESEND_DELAY = 240 // 4 minutes

const VerifyEmail = () => {
  const params = useSearchParams()

  const email = params.get("email")
  const error = params.get("error")

  const [countdown, setCountdown] = useState(RESEND_DELAY)
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  useEffect(() => {
    if (countdown <= 0) return

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleResend = async () => {
    if (!email || countdown > 0) return

    try {
      setIsResending(true)
      setMessage("")
      setMessageType("")

      const response = await fetch("/api/verify/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend email.")
      }

      setMessage(
        "A new verification email has been sent. Please check your inbox."
      )
      setMessageType("success")

      setCountdown(RESEND_DELAY)
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to resend verification email."
      )
      setMessageType("error")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="z-1 w-full rounded-xl bg-white p-6 shadow-md sm:max-w-md">
        <div className="mb-6">
          <Logo />

          <div>
            <h1 className="mb-1.5 text-2xl font-bold text-slate-900">
              Verify your email
            </h1>

            {error === "invalid" && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                This verification link is invalid or has expired.
              </div>
            )}

            {message && (
              <div
                className={`mb-4 rounded-lg p-3 text-sm ${
                  messageType === "success"
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <p className="text-base text-slate-600">
              An activation link has been sent to your email address:
              <br />
              <b>{email}</b>
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Please check your inbox and spam folder.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button className="w-full">
            <Link href="/login">Continue to Sign In</Link>
          </Button>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-slate-500">
                Resend available in{" "}
                <span className="font-semibold text-blue-600">
                  {formatTime(countdown)}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-blue-600 hover:underline disabled:opacity-50"
              >
                {isResending
                  ? "Sending..."
                  : "Didn't get the email? Resend"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail