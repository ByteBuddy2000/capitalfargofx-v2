import React, { useState } from "react"
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  Layers,
  ReceiptText,
  Users,
  User as UserIcon,
  Headphones,
  LogOut,
  Bell,
  Lock,
  X,
  Menu,
  ChevronRight,
} from "lucide-react"
import { isAdminRole, User } from "../../types"
import { storage } from "../../lib/storage"
import { Button } from "../ui/Button"
import Image from "next/image"

export type DashboardTab =
  | "overview"
  | "deposit"
  | "withdraw"
  | "investments"
  | "transactions"
  | "referrals"
  | "account"
  | "support"

interface DashboardLayoutProps {
  currentUser: User
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  onLogout: () => void
  onNavigateAdmin: () => void
  onNavigateLanding: () => void
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  onNavigateAdmin,
  onNavigateLanding,
  children,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const notifications = (storage.getNotifications() || []).filter(
    (n) => n && currentUser && n.userId === currentUser.id
  )
  const unreadCount = (notifications || []).filter((n) => n && !n.read).length

  const markNotificationAsRead = (id: string) => {
    const notifs = storage.getNotifications() || []
    const target = notifs.find((n) => n && n.id === id)
    if (target) {
      target.read = true
      storage.saveNotifications([...notifs])
    }
  }

  const markAllAsRead = () => {
    const notifs = (storage.getNotifications() || []).map((n) =>
      n && currentUser && n.userId === currentUser.id ? { ...n, read: true } : n
    )
    storage.saveNotifications(notifs)
  }

  const navigationItems = [
    {
      id: "overview" as DashboardTab,
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      id: "deposit" as DashboardTab,
      label: "Make Deposit",
      icon: <ArrowDownToLine className="h-5 w-5" />,
    },
    {
      id: "withdraw" as DashboardTab,
      label: "Withdrawals",
      icon: <ArrowUpFromLine className="h-5 w-5" />,
    },
    {
      id: "investments" as DashboardTab,
      label: "My Investments",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      id: "transactions" as DashboardTab,
      label: "Transactions",
      icon: <ReceiptText className="h-5 w-5" />,
    },
    {
      id: "referrals" as DashboardTab,
      label: "Referrals",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "account" as DashboardTab,
      label: "Account Profile",
      icon: <UserIcon className="h-5 w-5" />,
    },
    {
      id: "support" as DashboardTab,
      label: "Investor Support",
      icon: <Headphones className="h-5 w-5" />,
    },
  ]

  const getPageTitle = () => {
    switch (activeTab) {
      case "overview":
        return {
          title: "Investor Overview",
          subtitle: `Welcome back, ${currentUser.fullName}`,
        }
      case "deposit":
        return {
          title: "Make Deposit",
          subtitle:
            "Select an institutional investment plan and fund with cryptocurrency",
        }
      case "withdraw":
        return {
          title: "Withdraw Funds",
          subtitle:
            "Liquidate your available balance to your verified crypto address",
        }
      case "investments":
        return {
          title: "My Investments",
          subtitle: "Monitor active yield contracts and maturity schedules",
        }
      case "transactions":
        return {
          title: "Financial Activity",
          subtitle: "Immutable ledger audit receipts and transaction history",
        }
      case "referrals":
        return {
          title: "Referral Network",
          subtitle: "Earn instant 5% commission on qualifying partner deposits",
        }
      case "account":
        return {
          title: "Account Settings",
          subtitle: "Manage verified wallet addresses and security credentials",
        }
      case "support":
        return {
          title: "Investor Support",
          subtitle: "24/7 priority concierge and technical inquiries",
        }
      default:
        return {
          title: "Dashboard",
          subtitle: "CapitalsFargoFX Portfolio Portal",
        }
    }
  }

  const pageInfo = getPageTitle()

  return (
    <div className="dashboard-shell flex min-h-screen w-full font-sans text-slate-100">
      {/* Desktop Glassmorphic Sidebar */}
      <aside className="sticky top-0 z-20 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#0b0f19]/80 backdrop-blur-xl lg:flex">
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <button
            onClick={onNavigateLanding}
            className="group flex cursor-pointer items-center gap-3 text-left focus:outline-none"
          >
            {/* <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105">
              <div className="h-4 w-4 rotate-45 transform rounded-xs border-2 border-white" />
            </div> */}
            <span className="text-xl font-bold tracking-tight text-white">
              CapitalFargo<span className="text-[#2563EB]">FX</span>
            </span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="dashboard-sidebar-nav flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${isActive
                  ? "rounded-r-md border-l-4 border-[#2563EB] bg-[#2563EB]/10 text-white"
                  : "rounded-md text-[#64748B] hover:bg-white/[0.03] hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      isActive ? "text-blue-400" : "text-slate-400"
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-blue-400 opacity-75" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom Sidebar: Investment Health Widget */}
        <div className="mt-auto space-y-3 border-t border-white/10 p-5">
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Investment Health
              </p>
              <span className="text-[10px] font-extrabold text-emerald-400">
                Level 2
              </span>
            </div>
            <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm transition-all duration-500" />
            </div>
            <p className="text-[11px] text-slate-400">75% Progress to VIP Gold</p>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={onNavigateLanding}
              className="cursor-pointer text-[11px] font-medium text-slate-400 transition-colors hover:text-white"
            >
              Public Portal
            </button>
            <button
              onClick={onLogout}
              className="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-rose-400 transition-colors hover:text-rose-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {/* Glassmorphic Dark Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#0b0f19]/70 px-6 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="cursor-pointer rounded-xl border border-white/10 bg-slate-800/60 p-2 text-slate-200 transition-colors hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-sm lg:text-lg font-bold tracking-tight text-[#0F172A]">
                {pageInfo.title}
              </h1>
              <p className="text-xs text-slate-400 sm:text-sm">
                {pageInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Market Live Status Pill */}
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur-sm lg:flex">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span>Market Live</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative cursor-pointer rounded-xl border border-white/10 bg-slate-800/50 p-2.5 text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-white/10 bg-[#0f172a] p-4 text-slate-100 shadow-2xl backdrop-blur-2xl sm:w-96">
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="cursor-pointer text-[11px] font-semibold text-blue-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                    {(notifications?.length || 0) === 0 ? (
                      <p className="py-8 text-center text-xs text-slate-500">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`cursor-pointer rounded-xl border p-2.5 text-xs transition-colors ${notif.read
                            ? "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]"
                            : "border-blue-200 bg-blue-50/60 font-medium text-[#0F172A]"
                            }`}
                        >
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-bold text-white">
                              {notif.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {new Date(notif.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-300">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Switcher */}
            {isAdminRole(currentUser.role) && (
              <Button
                size="sm"
                variant="dark"
                leftIcon={<Lock className="h-3.5 w-3.5 text-amber-400" />}
                onClick={onNavigateAdmin}
                className="hidden rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 hover:bg-amber-500/20 sm:inline-flex"
              >
                Admin Suite
              </Button>
            )}

            {/* User Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex cursor-pointer items-center gap-2 transition-transform active:scale-95"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#2563EB] font-bold text-white shadow-sm">
                  {currentUser ? (
                    <Image
                      src="/profile.png"
                      alt={currentUser.fullName || "User Profile"}
                      width={512}
                      height={512}
                      className="h-full w-full object-cover"
                      priority
                    />
                  ) : null}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 z-50 mt-3 w-60 rounded-2xl border border-white/10 bg-[#0f172a] p-2 text-slate-100 shadow-2xl backdrop-blur-2xl">
                  <div className="mb-1 border-b border-white/10 px-3 py-2.5">
                    <p className="text-xs font-bold text-white">
                      {currentUser.fullName}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {currentUser.email}
                    </p>
                  </div>
 
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false)
                      onTabChange("account")
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    Account Settings
                  </button>

                  {isAdminRole(currentUser.role) && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false)
                        onNavigateAdmin()
                      }}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/10"
                    >
                      <Lock className="h-4 w-4 text-amber-400" />
                      Admin Suite
                    </button>
                  )}

                  <div className="mt-1 border-t border-white/10 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false)
                        onLogout()
                      }}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="flex-1 space-y-6 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative z-10 flex h-full w-72 flex-col justify-between border-r border-white/10 bg-[#0b0f19] p-6 text-white shadow-2xl">
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600">
                    <div className="h-3.5 w-3.5 rotate-45 transform rounded-xs border-2 border-white" />
                  </div>
                  <span className="text-lg font-bold text-white">
                    CapitalsFargoFX
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id)
                      setMobileDrawerOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-xs font-medium transition-colors ${activeTab === item.id
                      ? "border-l-4 border-[#2563EB] bg-[#2563EB]/10 text-white"
                      : "text-[#64748B] hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="border-t border-white/10 pt-4">
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="hidden fixed right-0 bottom-0 left-0 z-30 items-center justify-around border-t border-[#E2E8F0] bg-white px-3 py-2 shadow-lg lg:hidden">
      {/* <div className="hidden fixed right-0 bottom-0 left-0 z-30 flex items-center justify-around border-t border-[#E2E8F0] bg-white px-3 py-2 shadow-lg lg:hidden"> */}
        <button
          onClick={() => onTabChange("overview")}
          className={`flex cursor-pointer flex-col items-center gap-1 p-1 text-[10px] font-medium ${activeTab === "overview"
            ? "font-bold text-[#2563EB]"
            : "text-[#64748B]"
            }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange("deposit")}
          className={`flex cursor-pointer flex-col items-center gap-1 p-1 text-[10px] font-medium ${activeTab === "deposit"
            ? "font-bold text-[#2563EB]"
            : "text-[#64748B]"
            }`}
        >
          <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
          <span>Deposit</span>
        </button>

        <button
          onClick={() => onTabChange("withdraw")}
          className={`flex cursor-pointer flex-col items-center gap-1 p-1 text-[10px] font-medium ${activeTab === "withdraw"
            ? "font-bold text-[#2563EB]"
            : "text-[#64748B]"
            }`}
        >
          <ArrowUpFromLine className="h-5 w-5" />
          <span>Withdraw</span>
        </button>

        <button
          onClick={() => onTabChange("investments")}
          className={`flex cursor-pointer flex-col items-center gap-1 p-1 text-[10px] font-medium ${activeTab === "investments"
            ? "font-bold text-[#2563EB]"
            : "text-[#64748B]"
            }`}
        >
          <Layers className="h-5 w-5" />
          <span>Invest</span>
        </button>

        <button
          onClick={() => onTabChange("account")}
          className={`flex cursor-pointer flex-col items-center gap-1 p-1 text-[10px] font-medium ${activeTab === "account"
            ? "font-bold text-[#2563EB]"
            : "text-[#64748B]"
            }`}
        >
          <UserIcon className="h-5 w-5" />
          <span>Account</span>
        </button>
      </div>
    </div>
  )
}