"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal"
import { ToastProvider } from "@/components/ui/Toast"
import Logo from "@/components/Logo/Logo"

export default function LoginPage() {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col justify-between bg-slate-950 text-slate-100">
        <header className="p-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Brand Logo */}
        <Logo />

            {/* <Link
              href="/"
              className="invisible text-xs font-semibold text-slate-400 hover:text-white"
            >
              Back to Home
            </Link> */}
          </div>
        </header>

        <main className="flex items-center justify-center px-4 py-8">
          <LoginForm
            onSwitchToRegister={() => window.location.assign("/register")}
            onForgotPassword={() => setForgotPasswordOpen(true)}
          />
        </main>

        <footer className="p-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} CapitalsFargoFX. Institutional
          Cryptocurrency Investment Infrastructure.
        </footer>

        <ForgotPasswordModal
          isOpen={forgotPasswordOpen}
          onClose={() => setForgotPasswordOpen(false)}
        />
      </div>
    </ToastProvider>
  )
}
