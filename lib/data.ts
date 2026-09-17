export interface CryptoAsset {
  readonly symbol: string
  readonly name: string
  readonly network: string
  readonly depositFee: string
  readonly confirmationSpeed: string
  readonly iconColor: string
  readonly badge: string
}

export interface DiversifiedCategory {
  readonly title: string
  readonly description: string
  readonly tag: string
  readonly metric: string
}
export interface Testimonial {
  name: string
  role: string
  firm: string
  location: string
  initial: string
  quote: string
  image?: string
}


export interface FaqItem {
  readonly id?: string
  readonly question: string
  readonly answer: string
  readonly category: "General" | "Security" | "Plans" | "Settlement"
}

export const PLATFORM_METRICS = [
  {
    id: "investors",
    label: "Active Investors",
    value: "2,600+",
    numericValue: 2600,
    prefix: "",
    suffix: "+",
    detail: "Verified global portfolios",
    badge: "+14% this month",
  },
  {
    id: "deposits",
    label: "Total Deposits",
    value: "$967K+",
    numericValue: 967,
    prefix: "$",
    suffix: "K+",
    detail: "Secured in structured vaults",
    badge: "100% principal protected",
  },
  {
    id: "withdrawals",
    label: "Withdrawals Processed",
    value: "$3.7M+",
    numericValue: 3.7,
    prefix: "$",
    suffix: "M+",
    detail: "Instant liquidity execution",
    badge: "Avg. dispatch: < 15 mins",
  },
  {
    id: "assets",
    label: "Supported Assets",
    value: "BTC · ETH · USDT",
    numericValue: 3,
    prefix: "",
    suffix: "",
    detail: "Major blockchain networks",
    badge: "Zero deposit fees",
  },
]

export const TRUST_FEATURES = [
  {
    title: "Secure account management",
    desc: "Protected infrastructure & encrypted keys",
  },
  {
    title: "Transparent investment terms",
    desc: "Exact contract maturities & return metrics",
  },
  {
    title: "24/7 account access",
    desc: "Real-time telemetry & balance ledgers",
  },
  {
    title: "Instant crypto settlement",
    desc: "Direct blockchain withdrawal execution",
  },
]

export const WHY_CapitalsFargoFX = [
  {
    title: "Bank-Grade Security",
    subtitle: "Secure Platform",
    description:
      "End-to-end cryptographic encryption, cold vault asset storage, and double-entry accounting logs.",
    tag: "Cold Custody",
  },
  {
    title: "Zero Hidden Fees",
    subtitle: "Transparent Terms",
    description:
      "No hidden fees or ambiguous lockups. Exact return percentages, contract maturities, and principal conditions are established upfront.",
    tag: "0% Surcharge",
  },
  {
    title: "10% to 100% Returns",
    subtitle: "Flexible Investment Plans",
    description:
      "Investment tiers structured around different capital allocations and earning periods.",
    tag: "Structured Yield",
  },
  {
    title: "Instant Crypto Routes",
    subtitle: "Fast Account Management",
    description:
      "Streamlined deposit verification, wallet management and withdrawal processing.",
    tag: "Native Rails",
  },
  {
    title: "Live Alpha Telemetry",
    subtitle: "Portfolio Monitoring",
    description:
      "Dashboard analytics, historical tracking, maturity progress and transaction receipts.",
    tag: "Real-Time Data",
  },
  {
    title: "24/7 Investor Desk",
    subtitle: "Dedicated Support",
    description:
      "24/7 investor assistance through support channels with priority institutional response.",
    tag: "Direct Desk",
  },
]

export const ABOUT_FEATURES = [
  {
    title: "Structured Plans",
    description:
      "Predefined investment terms with structured earning intervals.",
    icon: "Layers",
  },
  {
    title: "Real-Time Monitoring",
    description:
      "Live portfolio performance metrics, maturity counters and balance ledgers.",
    icon: "Activity",
  },
  {
    title: "Cold-Storage Custody",
    description: "Multi-signature protection over supported digital assets.",
    icon: "ShieldCheck",
  },
  {
    title: "5% Affiliate Downline",
    description:
      "Affiliate commission credited on qualifying partner deposits.",
    icon: "Users",
  },
]

export const SUPPORTED_CRYPTOS: readonly CryptoAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin Core / Native SegWit",
    depositFee: "0.00%",
    confirmationSpeed: "Instant / 1 Confirmation",
    iconColor: "from-amber-500 to-orange-500",
    badge: "Primary Store of Value",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    network: "ERC-20 (Ethereum Mainnet)",
    depositFee: "0.00%",
    confirmationSpeed: "Instant / 1 Confirmation",
    iconColor: "from-blue-500 to-indigo-600",
    badge: "Smart Contract Settlement",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    network: "ERC-20 / TRC-20 Compatible",
    depositFee: "0.00%",
    confirmationSpeed: "Instant / 1 Confirmation",
    iconColor: "from-emerald-500 to-teal-600",
    badge: "Stable Value Clearing",
  },
]

export const DIVERSIFIED_CATEGORIES: readonly DiversifiedCategory[] = [
  {
    title: "Cryptocurrency Markets",
    description:
      "Systematic algorithmic yield generated across major liquidity pools in Bitcoin, Ethereum and multi-network stablecoins.",
    tag: "Digital Core",
    metric: "BTC · ETH · USDT Liquidity",
  },
  {
    title: "Global Forex Arbitrage",
    description:
      "Institutional currency execution designed around liquidity and market discrepancies across prime sovereign pairs.",
    tag: "Macro Currency",
    metric: "G10 Currency Pairs",
  },
  {
    title: "Tokenized Digital Assets",
    description:
      "Structured exposure into tokenized treasuries, staking derivatives and computational infrastructure protocols.",
    tag: "Real-World Assets",
    metric: "Tokenized T-Bills & Derivatives",
  },
  {
    title: "Institutional Equities",
    description:
      "Macro-oriented strategies focused on global technology, AI infrastructure and dividend-yielding multinational companies.",
    tag: "Public Markets",
    metric: "Global Tech & Large-Cap",
  },
  {
    title: "Sovereign Bonds & ETFs",
    description:
      "Capital preservation instruments anchored in treasury notes and investment-grade corporate bonds.",
    tag: "Fixed Income",
    metric: "Preservation Allocation",
  },
  {
    title: "Commercial Real Estate",
    description:
      "Fractionalized exposure to yield-producing commercial properties and logistics assets.",
    tag: "Tangible Property",
    metric: "Class-A Industrial & Commercial",
  },
]

export const ALTERNATIVE_ASSETS = [
  {
    title: "Institutional Real Estate Portfolios",
    category: "Asset-Backed Yield",
    description:
      "Fractional exposure into prime multi-family developments and Class-A logistics hubs.",
       image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    highlight:
      "Secured by physical real property contracts with structured tenancy yields.",
    allocationTiers: "Integrated in Level 4 - Level 6 Portfolios",
  },
  {
    title: "Decentralized Compute & AI Infrastructure",
    category: "Strategic Tech",
    description:
      "Capital deployment into decentralized GPU clusters and enterprise zero-knowledge verification infrastructure.",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    highlight:
      "Harnessing global distributed computing demand for generative AI workloads.",
    allocationTiers: "Integrated in Level 5 - Level 6 Portfolios",
  },
]


export const TESTIMONIALS: readonly Testimonial[] = [
  {
    name: "Marcus Sterling",
    role: "Managing Partner",
    firm: "Sterling Capital",
    location: "London, United Kingdom",
    initial: "MS",
    image: "/marcus-sterling.png",
    quote:
      "CapitalsFargoFX provides the rigorous settlement discipline that institutional allocators expect. The automated maturity cycles and unambiguous cold-custody architecture deliver complete operational peace of mind.",
  },

  {
    name: "Elena Rostova",
    role: "Fintech Portfolio Strategist",
    firm: "Global Wealth Advisory",
    location: "Zurich, Switzerland",
    initial: "ER",
    image: "/elena-rostova.png",
    quote:
      "The transparency in yield modeling and the speed of crypto dispatch have consistently outperformed traditional alternatives. The Level 4 and Level 5 plans have become staples in our diversified digital strategies.",
  },

  {
    name: "David K. Henderson",
    role: "Private Asset Allocator",
    firm: "Equitas Holdings",
    location: "Singapore",
    initial: "DH",
    image: "/david-henderson.png",
    quote:
      "In a market crowded with opaque promises, CapitalsFargoFX stands apart for exact contract execution, predictable multi-asset settlement, and a responsive institutional support desk.",
  },
  {
    name: "Rachel K. Fisher",
    role: "Family Office Portfolio Director",
    firm: "Fisher Capital",
    location: "Denver, Colorado, USA",
    initial: "RH",
    image: "/rachel-fisher.png",
    quote:
      "The structured investment tiers and real-time portfolio telemetry have transformed how we manage digital allocations. The platform's clarity and operational rigor are unmatched in the current landscape.",
  },
]

export const FAQS: readonly FaqItem[] = [
  {
    question: "What is CapitalsFargoFX?",
    answer:
      "CapitalsFargoFX is a premier institutional-grade digital asset management and cryptocurrency investment platform. We provide individual and corporate investors with transparent, structured investment plans designed to maximize risk-adjusted digital market returns.",
    category: "General",
  },
  {
    question: "How do I create an account?",
    answer:
      "Information available through the Investor Support Desk. You can initiate registration via the Create Account portal, verify your email credentials, and configure your multi-signature payout wallet addresses.",
    category: "General",
  },
  {
    question: "How do I make a deposit?",
    answer:
      "Deposits are funded directly via supported cryptocurrency settlement rails (BTC, ETH, USDT). Select your target investment plan, generate a dedicated single-use vault deposit address, and send the qualifying amount.",
    category: "Settlement",
  },
  {
    question: "Which cryptocurrencies are supported?",
    answer:
      "We currently support Bitcoin (Native SegWit), Ethereum (ERC-20 Mainnet), and Tether USD (ERC-20 and TRC-20 compatible) for seamless deposits and automated withdrawals with zero platform fees.",
    category: "Settlement",
  },
  {
    question: "How are investment returns calculated?",
    answer:
      "Returns are calculated strictly according to your selected contract tier (10% to 100%) applied to your principal capital over the predefined duration (24 to 168 hours). Upon contract maturity, 100% of the principal is unlocked alongside your accrued yield.",
    category: "Plans",
  },
  {
    question: "How do withdrawals work?",
    answer:
      "At contract maturity, accrued yields and principal become eligible for immediate settlement. Withdrawals are processed to your configured external cryptocurrency wallet address with an average dispatch time of under 15 minutes.",
    category: "Settlement",
  },
  {
    question: "How does the referral system work?",
    answer:
      "CapitalsFargoFX features a 5.00% affiliate downline. When a qualifying partner deposits using your private referral link, a 5% commission is instantly credited to your affiliate ledger balance.",
    category: "Plans",
  },
  {
    question: "Can I change my investment plan?",
    answer:
      "Active contracts run until their configured maturity duration. You can deploy additional capital into different tiers concurrently or re-allocate your matured balance into a new plan tier upon completion.",
    category: "Plans",
  },
  {
    question: "How can I contact support?",
    answer:
      "Our dedicated Investor Desk operates 24/7. Reach our team via email at support@CapitalsFargofx.com, through our verified Telegram channel @CapitalsFargofx_official, or submit a ticket through the Investor Support Desk page.",
    category: "General",
  },
]
