// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { User as UserModel } from "@/models/User"
import DashboardClient from "./DashboardClient"
import type {
  Investment,
  InvestmentPlan,
  Transaction,
  User,
  UserAsset,
  Withdrawal,
  CryptoWalletConfig,
  PlatformSettings,
  Referral,
  SupportTicket,
} from "@/types"
import { connectToDB } from "@/lib/connectToDB"
import { getUserAssets } from "@/controller/getUserAssets.actions"
import { getUserDeposits } from "@/controller/getUserDesposit.actions"
import { getUserInvestments } from "@/controller/getUserInvestments.actions"
import { getUserLedger } from "@/controller/getUserLedger.action"
import { getUserNotifications } from "@/controller/getUserNotifications.action"
import { getUserTransactions } from "@/controller/getUserTransactions.action"
import { getUserWithdrawals } from "@/controller/getUserWithdrawals.action"
import { getActivePlans } from "@/controller/investmentplans.actions"
import { getCryptoWallets } from "@/controller/getCryptoWallets.actions"
import {
  getUserPlatformSettings,
  getUserReferrals,
  getUserSupportTickets,
} from "@/controller/getUserDashboard.actions"

type DashboardRecord = Record<string, unknown>

export type DashboardInitialData = {
  assets: UserAsset[]
  deposits: DashboardRecord[]
  investments: Investment[]
  ledgerEntries: DashboardRecord[]
  notifications: DashboardRecord[]
  plans: InvestmentPlan[]
  transactions: Transaction[]
  withdrawals: Withdrawal[]
  wallets: CryptoWalletConfig[]
  referrals: Referral[]
  settings: PlatformSettings | null
  supportTickets: SupportTicket[]
}

const normalizeRecord = (record: DashboardRecord): DashboardRecord => ({
  ...record,
  id: String(record.id ?? record._id ?? ""),
})

const getFulfilledRecords = <T,>(
  result: PromiseSettledResult<{ success: boolean; [key: string]: unknown }>,
  key: string
): T[] => {
  if (result.status !== "fulfilled" || !result.value.success) return []

  const records = result.value[key]
  return Array.isArray(records)
    ? (records.map((record) =>
        normalizeRecord(record as DashboardRecord)
      ) as T[])
    : []
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  await connectToDB()
  const storedUser = await UserModel.findById(session.user.id)
    .select("-passwordHash")
    .lean()

  if (!storedUser) redirect("/login")

  const [
    assetsResult,
    depositsResult,
    investmentsResult,
    ledgerResult,
    notificationsResult,
    plansResult,
    transactionsResult,
    withdrawalsResult,
    walletsResult,
    referralsResult,
    settingsResult,
    supportTicketsResult,
  ] = await Promise.allSettled([
    getUserAssets(),
    getUserDeposits(),
    getUserInvestments(),
    getUserLedger(),
    getUserNotifications(),
    getActivePlans(),
    getUserTransactions(),
    getUserWithdrawals(),
    getCryptoWallets(),
    getUserReferrals(),
    getUserPlatformSettings(),
    getUserSupportTickets(),
  ])

  const assets = getFulfilledRecords<UserAsset>(assetsResult, "assets")

  const user: User = {
    id: storedUser._id.toString(),
    fullName: storedUser.fullName,
    username: storedUser.username,
    email: storedUser.email,
    role: storedUser.role,
    status: storedUser.status,
    btcWallet: storedUser.btcWallet,
    ethWallet: storedUser.ethWallet,
    usdtWallet: storedUser.usdtWallet,
    uplineId: storedUser.uplineId?.toString() || null,
    uplineUsername: storedUser.uplineUsername,
    availableBalance: storedUser.availableBalance,
    earningBalance: storedUser.earningBalance,
    totalDeposits: storedUser.totalDeposits,
    totalWithdrawals: storedUser.totalWithdrawals,
    referralEarnings: storedUser.referralEarnings,
    kycStatus: storedUser.kycStatus,
    createdAt: storedUser.createdAt.toISOString(),
    updatedAt: storedUser.updatedAt.toISOString(),
    assets,
  }

  const dashboardData: DashboardInitialData = {
    assets,
    deposits: getFulfilledRecords<DashboardRecord>(depositsResult, "deposits"),
    investments: getFulfilledRecords<Investment>(
      investmentsResult,
      "investments"
    ),
    ledgerEntries: getFulfilledRecords<DashboardRecord>(
      ledgerResult,
      "entries"
    ),
    notifications: getFulfilledRecords<DashboardRecord>(
      notificationsResult,
      "notifications"
    ),
    plans: getFulfilledRecords<InvestmentPlan>(plansResult, "plans"),
    transactions: getFulfilledRecords<Transaction>(
      transactionsResult,
      "transactions"
    ),
    withdrawals: getFulfilledRecords<Withdrawal>(
      withdrawalsResult,
      "withdrawals"
    ),
    wallets: getFulfilledRecords<CryptoWalletConfig>(walletsResult, "wallets"),
    referrals: getFulfilledRecords<Referral>(referralsResult, "referrals"),
    settings:
      settingsResult.status === "fulfilled" && settingsResult.value.success
        ? (settingsResult.value.settings as PlatformSettings | null)
        : null,
    supportTickets: getFulfilledRecords<SupportTicket>(
      supportTicketsResult,
      "tickets"
    ),
  }

  return <DashboardClient currentUser={user} initialData={dashboardData} />
}
