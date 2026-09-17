// lib/plans.ts
interface InvestmentPlan {
  readonly name: string
  readonly slug: string
  readonly minimumAmount: number
  readonly maximumAmount: number // 0 means unlimited
  readonly returnPercentage: number
  readonly durationHours: number
  readonly referralPercentage: number
  readonly principalReturn: boolean
  readonly description: string
  readonly status: "ACTIVE"
  readonly featured: boolean
}
export const CURRENT_PLANS = [
  {
    name: "Level 1 Plan",
    slug: "level-1",
    minimumAmount: 1500,
    maximumAmount: 3000,
    returnPercentage: 10,
    durationHours: 24,
    referralPercentage: 5,
    principalReturn: true,
    description:
      "Entry-level investment plan designed for accessible asset allocation with a standard 24-hour earning interval.",
    status: "ACTIVE" as const,
    featured: false,
  },
  {
    name: "Level 2 Plan",
    slug: "level-2",
    minimumAmount: 3000,
    maximumAmount: 7000,
    returnPercentage: 25,
    durationHours: 48,
    referralPercentage: 5,
    principalReturn: true,
    description:
      "Enhanced earning plan providing increased returns over a structured 48-hour investment cycle.",
    status: "ACTIVE" as const,
    featured: false,
  },
  {
    name: "Level 3 Plan",
    slug: "level-3",
    minimumAmount: 7000,
    maximumAmount: 10000,
    returnPercentage: 30,
    durationHours: 72,
    referralPercentage: 5,
    principalReturn: true,
    description:
      "Growth-focused plan offering enhanced earning potential across a structured 72-hour cycle.",
    status: "ACTIVE" as const,
    featured: false,
  },
  {
    name: "Level 4 Plan",
    slug: "level-4",
    minimumAmount: 10000,
    maximumAmount: 15000,
    returnPercentage: 45,
    durationHours: 98,
    referralPercentage: 5,
    principalReturn: true,
    description:
      "Advanced allocation plan designed for higher-value investments with a 98-hour earning interval.",
    status: "ACTIVE" as const,
    featured: true,
  },
  {
    name: "Level 5 Plan",
    slug: "level-5",
    minimumAmount: 15000,
    maximumAmount: 25000,
    returnPercentage: 50,
    durationHours: 120,
    referralPercentage: 5,
    principalReturn: true,
    description:
      "Premium investment plan providing elevated earning potential over a structured five-day cycle.",
    status: "ACTIVE" as const,
    featured: false,
  },
  {
    name: "Level 6 Plan",
    slug: "level-6",
    minimumAmount: 25000,
    maximumAmount: 0,
    returnPercentage: 100,
    durationHours: 168,
    referralPercentage: 5,
    principalReturn: true,
    description:
      "Highest-tier investment plan for allocations of £15,000 and above with a seven-day earning cycle.",
    status: "ACTIVE" as const,
    featured: false,
  },
] as const

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyWithDecimals(amount: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateYield(plan: InvestmentPlan, amount: number) {
  const projectedProfit = amount * (plan.returnPercentage / 100)
  const principalReturn = plan.principalReturn ? amount : 0
  const projectedPayout = amount + projectedProfit
  const affiliateBonus = amount * (plan.referralPercentage / 100)

  return {
    investmentCapital: amount,
    projectedProfit,
    principalReturn,
    projectedPayout,
    affiliateBonus,
  }
}
