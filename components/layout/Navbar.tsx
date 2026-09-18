// Navbar.tsx
"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronRight, Lock, ArrowUpRight } from "lucide-react"
import Logo from "../Logo/Logo"
import Link from "next/link"

export const Navbar: React.FC = () => {
  const currentPage = usePathname()

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navItems: { label: string; route: string }[] = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "How It Works", route: "/how-it-works" },
    { label: "Investment Plans", route: "/investment-plans" },
    { label: "Assets", route: "/fiat-assets" },
    { label: "FAQ", route: "/faq" },
    { label: "Contact", route: "/contact" },
  ]

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-800/80 bg-slate-950/90 py-3.5 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-linear-to-b from-slate-950/80 to-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Brand Logo                                                       */}
        {/* ---------------------------------------------------------------- */}
        <Logo />

        {/* ---------------------------------------------------------------- */}
        {/* Desktop Navigation                                               */}
        {/* ---------------------------------------------------------------- */}

        <nav
          id="desktop-navigation"
          aria-label="Main navigation"
          className="hidden items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 p-1.5 backdrop-blur-md lg:flex"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.route

            return (
              <Link
                key={item.route}
                href={item.route}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-slate-800/80 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* ---------------------------------------------------------------- */}
        {/* Desktop Right Actions                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="hidden items-center gap-3 sm:flex">
          <div className="hidden items-center gap-2 lg:flex">
            {/* Login */}

            <Link
              id="nav-signin-btn"
              href="/login"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Login</span>
            </Link>

            {/* Create Account */}

            <Link
              id="nav-create-account-btn"
              href="/register"
              className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent bg-linear-to-r from-blue-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-emerald-700 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <span>Sign Up</span>

              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Mobile Menu Toggle                                                */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center gap-2 lg:hidden">
          <div className="hidden items-center gap-2">
            {/* Login */}

            <Link
              id="nav-signin-btn"
              href="/login"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Login</span>
            </Link>

            {/* Create Account */}

            <Link
              id="nav-create-account-btn"
              href="/register"
              className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-transparent bg-linear-to-r from-blue-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-emerald-700 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <span>Sign Up</span>

              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 transition-colors hover:text-white"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Drawer Menu                                                 */}
      {/* ------------------------------------------------------------------ */}

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 shadow-2xl lg:hidden"
        >
          <div className="mx-auto max-w-7xl">
            {/* Mobile Navigation Links */}

            <div className="mb-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.route

                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>

                    <ChevronRight
                      className={`h-4 w-4 ${
                        isActive ? "text-emerald-400" : "text-slate-600"
                      }`}
                    />
                  </Link>
                )
              })}
            </div>

            {/* Mobile Authentication */}

            <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-4">
              <Link
                id="mobile-signin-btn"
                href="/login"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800"
              >
                <Lock className="h-4 w-4 text-slate-400" />
                <span>Login</span>
              </Link>

              <Link
                id="mobile-register-btn"
                href="/register"
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-emerald-700"
              >
                <span>Register</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mobile Trust Statement */}

            <div className="pt-4 text-center text-[10px] font-medium tracking-wider text-slate-600 uppercase">
              Audited Multi-Asset Settlement Engine
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
