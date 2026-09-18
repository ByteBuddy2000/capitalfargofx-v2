import React, { useState } from "react"
import {
  ShieldCheck,
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Layers,
  Wallet,
  Settings,
  ScrollText,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { User } from "@/types"

export type AdminTab =
  | "overview"
  | "deposits"
  | "withdrawals"
  | "users"
  | "plans"
  | "referrals"
  | "wallets"
  | "settings"
  | "audit"

interface AdminLayoutProps {
  currentUser: User
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
  onNavigateDashboard: () => void
  onLogout: () => void
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onNavigateDashboard,
  onLogout,
  children,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const adminNavItems = [
    {
      id: "overview" as AdminTab,
      label: "Control Center",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "deposits" as AdminTab,
      label: "Deposit Approvals",
      icon: <ArrowDownToLine className="h-4 w-4 text-emerald-400" />,
    },
    {
      id: "withdrawals" as AdminTab,
      label: "Withdrawal Orders",
      icon: <ArrowUpFromLine className="h-4 w-4 text-amber-400" />,
    },
    {
      id: "users" as AdminTab,
      label: "User Directory",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "plans" as AdminTab,
      label: "Investment Plans",
      icon: <Layers className="h-4 w-4 text-blue-400" />,
    },
    {
      id: "referrals" as AdminTab,
      label: "Affiliate Network",
      icon: <Users className="h-4 w-4 text-purple-400" />,
    },
    {
      id: "wallets" as AdminTab,
      label: "Receiving Wallets",
      icon: <Wallet className="h-4 w-4 text-teal-400" />,
    },
    {
      id: "settings" as AdminTab,
      label: "Platform Settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: "audit" as AdminTab,
      label: "Audit Trail Logs",
      icon: <ScrollText className="h-4 w-4" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900 shadow-md">
        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-black text-slate-950">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-white">
                  CapitalsFargoFX<span className="text-amber-400">Admin</span>
                </span>
                <span className="ml-2 hidden rounded-md border border-amber-800 bg-amber-950 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-300 uppercase ">
                  Institutional Security Suite
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <Button
              size="sm"
              variant="outline"
              leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              onClick={onNavigateDashboard}
              className="hidden border-slate-700 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700"
            >
              Switch to Investor Dashboard
            </Button> */}

            <div className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span>Admin: @{currentUser.username}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto grid w-full max-w-full flex-1 grid-cols-1 items-start gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8">
        {/* Desktop Admin Sidebar */}
        <aside className="sticky top-24 hidden rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-sm lg:col-span-3 lg:block">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-bold text-slate-950">
              👑
            </div>
            <div>
              <p className="truncate text-xs font-bold text-white">
                {currentUser.fullName}
              </p>
              <p className="font-mono text-[10px] text-amber-400">
                Super Administrator
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={isActive ? "text-slate-950" : "text-slate-400"}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                    {/* Badge rendering removed */}
                </button>
              )
            })}
          </nav>

          <div className="mt-8 space-y-1 border-t border-slate-800 pt-4">
            <button
              onClick={onNavigateDashboard}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2 text-left text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Investor Portal
            </button>
            <button
              onClick={onLogout}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2 text-left text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-950/40"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-950/80"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative z-10 flex h-full w-72 flex-col justify-between border-r border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div>
                <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-amber-400" />
                    <span className="font-black text-white">Admin Suite</span>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="rounded-lg p-1 text-slate-300 hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {adminNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id)
                        setMobileDrawerOpen(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-bold transition-colors ${
                        activeTab === item.id
                          ? "bg-amber-500 text-slate-950"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Admin Content */}
        <main className="w-full lg:col-span-9">{children}</main>
      </div>
    </div>
  )
}
