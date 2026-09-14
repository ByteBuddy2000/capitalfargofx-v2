import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  Lock,
  ArrowUpRight,

} from "lucide-react"
import { User } from "../../types"
import { Button } from "../ui/Button"
import Logo from "../Logo/Logo"

interface NavbarProps {
  currentUser?: User | null
  onOpenAuth?: (mode: "login" | "register") => void
  onNavigateAuth?: (mode: "login" | "register") => void
  onNavigateDashboard?: () => void
  onNavigateAdmin?: () => void
  onNavigateSection?: (sectionId: string) => void
  onLogout?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onNavigateAuth,
  onNavigateDashboard,
  onNavigateAdmin,
  onNavigateSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleAuth = (mode: "login" | "register") => {
    if (onOpenAuth) {
      onOpenAuth(mode)
    } else if (onNavigateAuth) {
      onNavigateAuth(mode)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Home", target: "hero" },
    { label: "About", target: "about" },
    { label: "How It Works", target: "how-it-works" },
    { label: "Investment Plans", target: "plans" },
    { label: "Assets", target: "assets" },
    { label: "FAQ", target: "faq" },
    { label: "Contact", target: "contact" },
  ]

  const handleLinkClick = (target: string) => {
    setMobileMenuOpen(false)
    if (onNavigateSection) {
      onNavigateSection(target)
    } else {
      const el = document.getElementById(target)
      el?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-800/80 bg-slate-950/90 py-3.5 shadow-lg backdrop-blur-md"
          : "bg-linear-to-b from-slate-950/80 to-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 p-1.5 backdrop-blur-md lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.target)}
              className="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-slate-800/70 hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Action / Auth Buttons */}
        <div className="hidden items-center gap-3 sm:flex">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              {(currentUser.role === "admin" || currentUser.role === "super admin") && (
                <Button
                  size="sm"
                  variant="dark"
                  leftIcon={<Lock className="h-3.5 w-3.5 text-amber-400" />}
                  onClick={onNavigateAdmin}
                  className="border-amber-600/40 bg-amber-950/60 text-amber-200 hover:bg-amber-900/80"
                >
                  Admin Console
                </Button>
              )}
              <Button
                size="sm"
                variant="primary"
                leftIcon={<LayoutDashboard className="h-4 w-4" />}
                rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                onClick={onNavigateDashboard}
                className="hidden shadow-md shadow-blue-600/20"
              >
                Investor Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => handleAuth("login")}
              >
                Login
              </Button>
              <Button
                size="sm"
                variant="primary"
                rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}
                onClick={() => handleAuth("register")}
                className="border-none bg-linear-to-r from-blue-600 to-emerald-600 shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-emerald-700"
              >
                Create Account
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 shadow-2xl lg:hidden"
          >
            <div className="mb-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.target)}
                  className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="hidden flex-col gap-2 border-t border-slate-800/80 pt-3">
              {currentUser ? (
                <>
                  <Button
                    variant="primary"
                    leftIcon={<LayoutDashboard className="h-4 w-4" />}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onNavigateDashboard?.()
                    }}
                    className="w-full justify-center"
                  >
                    Open Investor Dashboard
                  </Button>
                  {(currentUser.role === "admin" || currentUser.role === "super admin") && (
                    <Button
                      variant="secondary"
                      leftIcon={<Lock className="h-4 w-4 text-amber-500" />}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        onNavigateAdmin?.()
                      }}
                      className="w-full justify-center"
                    >
                      Admin Management Console
                    </Button>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleAuth("login")
                    }}
                    className="border-slate-800 bg-slate-900 text-slate-200"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleAuth("register")
                    }}
                    className="border-none bg-linear-to-r from-blue-600 to-emerald-600"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
