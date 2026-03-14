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

