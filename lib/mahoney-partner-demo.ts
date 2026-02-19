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
  },
]

export const partnerSummary = (() => {
  const totalCustomers = partnerCustomers.length
  const totalMRR = partnerCustomers.reduce((acc, c) => acc + c.monthlyRecurringRevenueUSD, 0)
  const avgGrowScore =
    partnerCustomers.reduce((acc, c) => acc + c.growScore, 0) / Math.max(1, totalCustomers)
  const avgChurnRisk =
    partnerCustomers.reduce((acc, c) => acc + c.churnRiskPct, 0) / Math.max(1, totalCustomers)

  return {
    totalCustomers,
    totalMRR,
    avgGrowScore: Math.round(avgGrowScore),
    avgChurnRisk: Number(avgChurnRisk.toFixed(1)),
  }
})()

