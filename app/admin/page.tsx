import AdminPage, { type AdminPageState } from "./AdminPage"
import { getAdminOverview } from "./controllers/overview.action"
import { getAdminDeposits } from "./controllers/deposit.actions"
import { getAdminWithdrawals } from "./controllers/withdrawal.action"
import { getAdminUsers } from "./controllers/users.action"
import { getAdminPlans } from "./controllers/plans.action"
import { getAdminReferrals } from "./controllers/referrals.action"
import { getAdminWallets } from "./controllers/wallet.action"
import { getAdminSettings } from "./controllers/settings.action"
import { getAdminAuditLogs } from "./controllers/audit.action"

const emptyAdminState: AdminPageState = {
  overview: null,
  deposits: [],
  withdrawals: [],
  users: [],
  plans: [],
  referrals: [],
  wallets: [],
  settings: null,
  auditLogs: [],
}

type AdminActionResult = PromiseSettledResult<{
  success: boolean
  [key: string]: unknown
}>

const getRecords = <T,>(result: AdminActionResult, key: string): T[] => {
  if (result.status !== "fulfilled" || !result.value.success) return []

  const records = result.value[key]
  return Array.isArray(records) ? (records as T[]) : []
}

export default async function AdminRoute() {
  const [
    overview,
    deposits,
    withdrawals,
    users,
    plans,
    referrals,
    wallets,
    settings,
    auditLogs,
  ] = await Promise.allSettled([
    getAdminOverview(),
    getAdminDeposits(),
    getAdminWithdrawals(),
    getAdminUsers(),
    getAdminPlans(),
    getAdminReferrals(),
    getAdminWallets(),
    getAdminSettings(),
    getAdminAuditLogs(),
  ])

  const initialData: AdminPageState = {
    ...emptyAdminState,
    overview:
      overview.status === "fulfilled" && overview.value.success
        ? {
            users: getRecords(overview, "users"),
            deposits: getRecords(overview, "deposits"),
            withdrawals: getRecords(overview, "withdrawals"),
            investments: getRecords(overview, "investments"),
          }
        : null,
    deposits: getRecords(deposits, "deposits"),
    withdrawals: getRecords(withdrawals, "withdrawals"),
    users: getRecords(users, "users"),
    plans: getRecords(plans, "plans"),
    referrals: getRecords(referrals, "referrals"),
    wallets: getRecords(wallets, "wallets"),
    settings:
      settings.status === "fulfilled" && settings.value.success
        ? (settings.value.settings as unknown as AdminPageState["settings"])
        : null,
    auditLogs: getRecords(auditLogs, "logs"),
  }

  return <AdminPage initialData={initialData} />
}
