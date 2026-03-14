import { PLATFORM_LIST_PRICES, PARTNER_TIERS, PARTNER_MDU_MARGIN_PER_1K_EVENTS_USD } from '@/lib/partner-pricing'

export type PartnerCustomer = {
  id: string
  name: string
  segment: 'SMB' | 'Mid-Market' | 'Enterprise'
  country: string
  activeAlerts: number
  mttrHours: number
  growScore: number
  monthlyRecurringRevenueUSD: number
  churnRiskPct: number
  automationScorePct: number
  /** Demo: contract renewal in days from now */
  renewalInDays?: number
  /** Demo: MRR change vs last month in percent */
  mrrChangePct?: number
}

export const partnerCustomers: PartnerCustomer[] = [
  {
    id: 'c-acme',
    name: 'Acme Engineering Inc.',
    segment: 'Mid-Market',
    country: 'DE',
    activeAlerts: 3,
    mttrHours: 2.3,
    growScore: 78,
    monthlyRecurringRevenueUSD: 32000,
    churnRiskPct: 3.1,
    automationScorePct: 42,
    renewalInDays: 45,
    mrrChangePct: 5.2,
  },
  {
    id: 'c-contoso',
    name: 'Contoso Retail Group',
    segment: 'Enterprise',
    country: 'US',
    activeAlerts: 7,
    mttrHours: 3.8,
    growScore: 68,
    monthlyRecurringRevenueUSD: 87000,
    churnRiskPct: 4.4,
    automationScorePct: 36,
    renewalInDays: 12,
    mrrChangePct: -0.8,
  },
  {
    id: 'c-fabrikam',
    name: 'Fabrikam Logistics',
    segment: 'SMB',
    country: 'NL',
    activeAlerts: 1,
    mttrHours: 1.9,
    growScore: 83,
    monthlyRecurringRevenueUSD: 14500,
    churnRiskPct: 2.2,
    automationScorePct: 55,
    renewalInDays: 90,
    mrrChangePct: 12.1,
  },
  {
    id: 'c-northwind',
    name: 'Northwind Traders',
    segment: 'Mid-Market',
    country: 'UK',
    activeAlerts: 5,
    mttrHours: 4.1,
    growScore: 71,
    monthlyRecurringRevenueUSD: 28000,
    churnRiskPct: 5.8,
    automationScorePct: 38,
    renewalInDays: 28,
    mrrChangePct: 2.0,
  },
  {
    id: 'c-tailspin',
    name: 'Tailspin Toys',
    segment: 'SMB',
    country: 'US',
    activeAlerts: 2,
    mttrHours: 2.0,
    growScore: 82,
    monthlyRecurringRevenueUSD: 18500,
    churnRiskPct: 1.9,
    automationScorePct: 58,
    renewalInDays: 60,
    mrrChangePct: 8.5,
  },
]

/** Demo: upsell attributed to the Control app (recommendations, in-app prompts, Mahoney Grow) */
export type PartnerAppUpsell = {
  id: string
  customerId: string
  customerName: string
  product: string
  mrrAddedUSD: number
  source: 'app_recommendation' | 'in_app_prompt' | 'grow_insight' | 'security_audit'
  sourceLabel: string
  month: string
}

export const partnerAppUpsells: PartnerAppUpsell[] = [
  {
    id: 'u1',
    customerId: 'c-fabrikam',
    customerName: 'Fabrikam Logistics',
    product: 'Mahoney Grow',
    mrrAddedUSD: 1200,
    source: 'grow_insight',
    sourceLabel: 'Grow insight in app',
    month: 'Feb',
  },
  {
    id: 'u2',
    customerId: 'c-contoso',
    customerName: 'Contoso Retail Group',
    product: 'Virtual CISO (vCISO)',
    mrrAddedUSD: 4500,
    source: 'app_recommendation',
    sourceLabel: 'Dashboard recommendation',
    month: 'Jan',
  },
  {
    id: 'u3',
    customerId: 'c-acme',
    customerName: 'Acme Engineering Inc.',
    product: 'Compliance Package',
    mrrAddedUSD: 2200,
    source: 'security_audit',
    sourceLabel: 'Security audit finding',
    month: 'Feb',
  },
  {
    id: 'u4',
    customerId: 'c-tailspin',
    customerName: 'Tailspin Toys',
    product: 'EDR extension',
    mrrAddedUSD: 800,
    source: 'in_app_prompt',
    sourceLabel: 'In-app upsell prompt',
    month: 'Feb',
  },
]

/** Demo: automation impact for the MSP (RMM, scripts, dashboards – time & cost saved) */
export type PartnerAutomationImpact = {
  id: string
  type: 'rmm' | 'script' | 'dashboard' | 'integration'
  typeLabel: string
  title: string
  description: string
  timeSavedHoursPerMonth: number
  costSavedUsdPerMonth: number
}

export const partnerAutomationImpacts: PartnerAutomationImpact[] = [
  {
    id: 'a1',
    type: 'rmm',
    typeLabel: 'RMM automation',
    title: 'Auto-remediate offline agents',
    description: 'RMM policy triggers script when agent is offline >15 min; reduced manual checks across portfolio.',
    timeSavedHoursPerMonth: 22,
    costSavedUsdPerMonth: 1100,
  },
  {
    id: 'a2',
    type: 'script',
    typeLabel: 'MSP script',
    title: 'Bulk patch compliance check',
    description: 'MSP script from Control library: one-click compliance status across all tenants.',
    timeSavedHoursPerMonth: 14,
    costSavedUsdPerMonth: 700,
  },
  {
    id: 'a3',
    type: 'dashboard',
    typeLabel: 'Dashboard',
    title: 'Unified alerts view',
    description: 'Single dashboard for all customers – no switching RMM/portals; faster triage.',
    timeSavedHoursPerMonth: 18,
    costSavedUsdPerMonth: 900,
  },
  {
    id: 'a4',
    type: 'integration',
    typeLabel: 'Integration',
    title: 'SIEM → ticket automation',
    description: 'Critical alerts auto-create tickets and assign; less manual handoff.',
    timeSavedHoursPerMonth: 12,
    costSavedUsdPerMonth: 600,
  },
]

export const partnerUpsellSummary = (() => {
  const totalMrrFromUpsell = partnerAppUpsells.reduce((acc, u) => acc + u.mrrAddedUSD, 0)
  const count = partnerAppUpsells.length
  return { totalMrrFromUpsell, count }
})()

export const partnerAutomationSummary = (() => {
  const timeSavedHoursPerMonth = partnerAutomationImpacts.reduce(
    (acc, a) => acc + a.timeSavedHoursPerMonth,
    0
  )
  const costSavedUsdPerMonth = partnerAutomationImpacts.reduce(
    (acc, a) => acc + a.costSavedUsdPerMonth,
    0
  )
  return { timeSavedHoursPerMonth, costSavedUsdPerMonth }
})()

/** Demo: last 6 months MRR for partner portfolio (for trend chart/summary) */
export const partnerMRRTrendMonths: { month: string; mrr: number }[] = [
  { month: 'Sep', mrr: 118_000 },
  { month: 'Oct', mrr: 121_500 },
  { month: 'Nov', mrr: 125_200 },
  { month: 'Dec', mrr: 128_100 },
  { month: 'Jan', mrr: 130_800 },
  { month: 'Feb', mrr: 133_500 },
]

export const partnerSummary = (() => {
  const totalCustomers = partnerCustomers.length
  const totalMRR = partnerCustomers.reduce((acc, c) => acc + c.monthlyRecurringRevenueUSD, 0)
  const totalOpenAlerts = partnerCustomers.reduce((acc, c) => acc + c.activeAlerts, 0)
  const avgGrowScore =
    partnerCustomers.reduce((acc, c) => acc + c.growScore, 0) / Math.max(1, totalCustomers)
  const avgChurnRisk =
    partnerCustomers.reduce((acc, c) => acc + c.churnRiskPct, 0) / Math.max(1, totalCustomers)
  const avgMttr =
    partnerCustomers.reduce((acc, c) => acc + c.mttrHours, 0) / Math.max(1, totalCustomers)
  const atRiskCount = partnerCustomers.filter((c) => c.churnRiskPct >= 4).length
  const renewalsThisMonth = partnerCustomers.filter(
    (c) => c.renewalInDays != null && c.renewalInDays <= 30
  ).length
  const prevMRR = partnerMRRTrendMonths[partnerMRRTrendMonths.length - 2]?.mrr ?? totalMRR
  const mrrGrowthPct = prevMRR ? ((totalMRR - prevMRR) / prevMRR) * 100 : 0

  return {
    totalCustomers,
    totalMRR,
    totalOpenAlerts,
    avgGrowScore: Math.round(avgGrowScore),
    avgChurnRisk: Number(avgChurnRisk.toFixed(1)),
    avgMttr: Number(avgMttr.toFixed(1)),
    atRiskCount,
    renewalsThisMonth,
    mrrGrowthPct: Number(mrrGrowthPct.toFixed(1)),
  }
})()

/** Marketplace plan (Essential = $799). Aligned with Partner Pricing page. */
export const MARKETPLACE_PLAN = {
  name: 'Essential',
  priceUsdPerMonth: PLATFORM_LIST_PRICES.essential,
} as const

/** Demo tier for dashboard (Advanced = 30%). Real tier comes from session on Partner Pricing page. */
const DEMO_PARTNER_TIER_DISCOUNT_PCT = PARTNER_TIERS.advanced.discountPct

/** Partner pricing & margin for dashboard. You sell at list; margin = tier discount (20–40%). */
export const PARTNER_PRICING = {
  /** Tier discount range (Authorized / Advanced / Elite) */
  tierDiscountRangePct: '20–40',
  /** Demo: discount used for P/L (Advanced tier) */
  demoDiscountPct: DEMO_PARTNER_TIER_DISCOUNT_PCT,
  /** MDU: partner margin per 1k events (from partner-pricing) */
  mduMarginPerUnitUSD: PARTNER_MDU_MARGIN_PER_1K_EVENTS_USD,
} as const

/** Partner cost for Essential at demo tier (list × (1 − discount)). */
export const PARTNER_APP_PRICE_USD = Math.round(PLATFORM_LIST_PRICES.essential * (1 - DEMO_PARTNER_TIER_DISCOUNT_PCT / 100) * 100) / 100

/** Demo: P/L from platform (you sell at list; margin = tier discount on portfolio MRR). */
export const PARTNER_PL_APP_DEMO = (() => {
  const listTotalUsd = partnerSummary.totalMRR
  const marginUsd = Math.round((listTotalUsd * DEMO_PARTNER_TIER_DISCOUNT_PCT) / 100 * 100) / 100
  const costUsd = Math.round((listTotalUsd * (100 - DEMO_PARTNER_TIER_DISCOUNT_PCT)) / 100 * 100) / 100
  return {
    revenueFromPlatformShareUsd: marginUsd,
    appCostUsd: costUsd,
    netUsd: marginUsd,
  }
})()

/** Demo: MDU volume and P/L for partner (enough events so partner makes profit from margin) */
export const PARTNER_MDU_DEMO = (() => {
  const eventsPerDay = 85_000
  const eventsPerMonth = eventsPerDay * 30
  const unitsThousand = eventsPerMonth / 1_000
  const baseCostPerThousandUsd = 0.03
  const partnerMarginPerThousandUsd = PARTNER_PRICING.mduMarginPerUnitUSD
  const costToPartnerUsd = Math.round(unitsThousand * baseCostPerThousandUsd * 100) / 100
  const partnerMarginRevenueUsd = Math.round(unitsThousand * partnerMarginPerThousandUsd * 100) / 100
  const customerChargePerThousandUsd = baseCostPerThousandUsd + partnerMarginPerThousandUsd
  const revenueFromCustomersUsd = Math.round(unitsThousand * customerChargePerThousandUsd * 100) / 100
  return {
    eventsPerDay,
    eventsPerMonth,
    unitsThousand: Math.round(unitsThousand * 10) / 10,
    baseCostPerThousandUsd,
    partnerMarginPerThousandUsd,
    costToPartnerUsd,
    partnerMarginRevenueUsd,
    customerChargePerThousandUsd,
    revenueFromCustomersUsd,
    netMduUsd: partnerMarginRevenueUsd,
  }
})()

