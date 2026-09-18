// app/admin/AdminPage.tsx
"use client"

import { useMemo, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { ToastProvider } from "@/components/ui/Toast"
import type {
  AuditLog,
  CryptoWalletConfig,
  Deposit,
  InvestmentPlan,
  PlatformSettings,
  Referral,
  User,
  Withdrawal,
} from "@/types"
import { AdminLayout, AdminTab } from "./components/AdminLayout"
import { AdminDeposits } from "./components/AdminDeposits"
import { AdminWithdrawals } from "./components/AdminWithdrawals"
import { AdminUsers } from "./components/AdminUsers"
import { AdminPlans } from "./components/AdminPlans"
import { AdminReferrals } from "./components/AdminReferrals"
import { AdminWallets } from "./components/AdminWallets"
import { AdminSettings } from "./components/AdminSettings"
import { AdminOverview } from "./components/AdminOverview"
import { AdminAuditLogs } from "./components/AdminAuditLogs"

const emptyAdminUser: User = {
  id: "admin",
  fullName: "Administrator",
  username: "admin",
  email: "",
  role: "admin",
  status: "ACTIVE",
  btcWallet: "",
  ethWallet: "",
  usdtWallet: "",
  uplineId: null,
  availableBalance: 0,
  earningBalance: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  referralEarnings: 0,
  createdAt: "",
  updatedAt: "",
}

export type AdminPageState = {
  overview: {
    users: User[]
    deposits: Deposit[]
    withdrawals: Withdrawal[]
    investments: Array<{ amount: number; status: string }>
  } | null
  deposits: Deposit[]
  withdrawals: Withdrawal[]
  users: User[]
  plans: InvestmentPlan[]
  referrals: Referral[]
  wallets: CryptoWalletConfig[]
  settings: PlatformSettings | null
  auditLogs: AuditLog[]
}

interface AdminPageProps {
  initialData: AdminPageState
}

export default function AdminPage({ initialData }: AdminPageProps) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const adminData = initialData

  const adminUser = useMemo(() => {
    const sessionUser = session?.user as Partial<User> | undefined
    if (!sessionUser) return emptyAdminUser

    return {
      ...emptyAdminUser,
      id: String(sessionUser.id || emptyAdminUser.id),
      fullName: String(sessionUser.fullName || emptyAdminUser.fullName),
      username: String(sessionUser.username || emptyAdminUser.username),
      email: String(sessionUser.email || emptyAdminUser.email),
      role: (sessionUser.role as User["role"]) || "admin",
    }
  }, [session])

  const logout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const renderTab = () => {
    switch (activeTab) {
      case "deposits":
        return (
          <AdminDeposits
            currentUser={adminUser}
            initialDeposits={adminData.deposits}
          />
        )
      case "withdrawals":
        return (
          <AdminWithdrawals
            currentUser={adminUser}
            initialWithdrawals={adminData.withdrawals}
          />
        )
      case "users":
        return (
          <AdminUsers currentUser={adminUser} initialUsers={adminData.users} />
        )
      case "plans":
        return (
          <AdminPlans currentUser={adminUser} initialPlans={adminData.plans} />
        )
      case "referrals":
        return (
          <AdminReferrals
            currentUser={adminUser}
            initialReferrals={adminData.referrals}
          />
        )
      case "wallets":
        return (
          <AdminWallets
            currentUser={adminUser}
            initialWallets={adminData.wallets}
          />
        )
      case "settings":
        return (
          <AdminSettings
            currentUser={adminUser}
            initialSettings={adminData.settings}
          />
        )
      case "audit":
        return (
          <AdminAuditLogs
            currentUser={adminUser}
            initialLogs={adminData.auditLogs}
          />
        )
      default:
        return (
          <AdminOverview
            currentUser={adminUser}
            onNavigateTab={setActiveTab}
            overview={adminData.overview}
          />
        )
    }
  }

  return (
    <ToastProvider>
      <AdminLayout
        currentUser={adminUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNavigateDashboard={() => window.location.assign("/dashboard")}
        onLogout={logout}
      >
        {renderTab()}
      </AdminLayout>
    </ToastProvider>
  )
}
