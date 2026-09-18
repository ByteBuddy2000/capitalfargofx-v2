// /dashboard/DashboardClient.tsx
"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ToastProvider } from "@/components/ui/Toast"
import type { User } from "@/types"
import type { DashboardInitialData } from "./page"
import { DashboardLayout, DashboardTab } from "./components/DashboardLayout"
import { DashboardOverview } from "./components/DashboardOverview"
import { DepositView } from "./components/DepositView"
import { WithdrawView } from "./components/WithdrawView"
import { InvestmentsView } from "./components/InvestmentsView"
import { TransactionsView } from "./components/TransactionsView"
import { ReferralsView } from "./components/ReferralsView"
import { AccountView } from "./components/AccountView"
import { SupportView } from "./components/SupportView"

interface DashboardClientProps {
  currentUser: User
  initialData: DashboardInitialData
}

export default function DashboardClient({
  currentUser: initialUser,
  initialData,
}: DashboardClientProps) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(initialUser)
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview")

  const refreshUser = () => {
    router.refresh()
  }

  const logout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <ToastProvider>
      <DashboardLayout
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
        onNavigateAdmin={() => window.location.assign("/admin")}
        onNavigateLanding={() => window.location.assign("/")}
        notifications={initialData.notifications}
      >
        {activeTab === "overview" && (
          <DashboardOverview
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            initialInvestments={initialData.investments}
            initialTransactions={initialData.transactions}
            initialWithdrawals={initialData.withdrawals}
          />
        )}
        {activeTab === "deposit" && (
          <DepositView
            currentUser={currentUser}
            initialPlans={initialData.plans}
            initialWallets={initialData.wallets}
            onDepositSuccess={refreshUser}
            onNavigateTransactions={() => setActiveTab("transactions")}
          />
        )}
        {activeTab === "withdraw" && (
          <WithdrawView
            currentUser={currentUser}
            onWithdrawSuccess={refreshUser}
            onNavigateAccount={() => setActiveTab("account")}
            onNavigateTransactions={() => setActiveTab("transactions")}
          />
        )}
        {activeTab === "investments" && (
          <InvestmentsView
            currentUser={currentUser}
            initialInvestments={initialData.investments}
            onNavigateDeposit={() => setActiveTab("deposit")}
          />
        )}
        {activeTab === "transactions" && (
          <TransactionsView
            currentUser={currentUser}
            initialTransactions={initialData.transactions}
          />
        )}
        {activeTab === "referrals" && (
          <ReferralsView
            currentUser={currentUser}
            initialReferrals={initialData.referrals}
          />
        )}
        {activeTab === "account" && (
          <AccountView
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
          />
        )}
        {activeTab === "support" && (
          <SupportView
            currentUser={currentUser}
            initialSettings={initialData.settings}
            initialTickets={initialData.supportTickets}
          />
        )}
      </DashboardLayout>
    </ToastProvider>
  )
}
