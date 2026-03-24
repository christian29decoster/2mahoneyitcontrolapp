/**
 * Mock data for Financials extended sections — replace with API responses later.
 * Monetary values are in USD (display layer applies locale EUR/USD via useFormatCurrency).
 */

export type FinancialsSectionKey =
  | 'trends'
  | 'benchmark'
  | 'compliance'
  | 'cyberInsurance'
  | 'partnerPnL'
  | 'budgetForecast'

/** Per-tenant toggles (future: load from /api/tenant/settings). */
export const defaultFinancialsSectionVisibility: Record<FinancialsSectionKey, boolean> = {
  trends: true,
  benchmark: true,
  compliance: true,
  cyberInsurance: true,
  partnerPnL: true,
  budgetForecast: true,
}

export function getFinancialsSectionVisibility(
  _tenantId: string | null,
  overrides?: Partial<Record<FinancialsSectionKey, boolean>>
): Record<FinancialsSectionKey, boolean> {
  return { ...defaultFinancialsSectionVisibility, ...overrides }
}

export type MonthlyTrendPoint = {
  monthKey: string
  label: string
  securitySpendUsd: number
  costPerIncidentUsd: number
  mttrHours: number
}

/** Last 12 months of synthetic trend data. */
export const monthlyTrendHistory12M: MonthlyTrendPoint[] = [
  { monthKey: '2025-04', label: 'Apr 25', securitySpendUsd: 118000, costPerIncidentUsd: 5100, mttrHours: 4.2 },
  { monthKey: '2025-05', label: 'May 25', securitySpendUsd: 120500, costPerIncidentUsd: 4950, mttrHours: 4.0 },
  { monthKey: '2025-06', label: 'Jun 25', securitySpendUsd: 121200, costPerIncidentUsd: 4800, mttrHours: 3.9 },
  { monthKey: '2025-07', label: 'Jul 25', securitySpendUsd: 122800, costPerIncidentUsd: 4650, mttrHours: 3.8 },
  { monthKey: '2025-08', label: 'Aug 25', securitySpendUsd: 123500, costPerIncidentUsd: 4500, mttrHours: 3.7 },
  { monthKey: '2025-09', label: 'Sep 25', securitySpendUsd: 124000, costPerIncidentUsd: 4400, mttrHours: 3.6 },
  { monthKey: '2025-10', label: 'Oct 25', securitySpendUsd: 124200, costPerIncidentUsd: 4300, mttrHours: 3.5 },
  { monthKey: '2025-11', label: 'Nov 25', securitySpendUsd: 124500, costPerIncidentUsd: 4250, mttrHours: 3.4 },
  { monthKey: '2025-12', label: 'Dec 25', securitySpendUsd: 124800, costPerIncidentUsd: 4220, mttrHours: 3.3 },
  { monthKey: '2026-01', label: 'Jan 26', securitySpendUsd: 125000, costPerIncidentUsd: 4200, mttrHours: 3.2 },
  { monthKey: '2026-02', label: 'Feb 26', securitySpendUsd: 124600, costPerIncidentUsd: 4180, mttrHours: 3.15 },
  { monthKey: '2026-03', label: 'Mar 26', securitySpendUsd: 124000, costPerIncidentUsd: 4150, mttrHours: 3.1 },
]

/** Waterfall: cumulative automation cost reduction (USD) over period — demo steps. */
export type WaterfallStep = { label: string; valueUsd: number; cumulativeUsd: number }

export function buildAutomationWaterfall(months: MonthlyTrendPoint[]): WaterfallStep[] {
  const base = months[0]?.securitySpendUsd ?? 120000
  const last = months[months.length - 1]?.securitySpendUsd ?? base
  const saved = Math.max(0, base - last)
  return [
    { label: 'Baseline spend', valueUsd: base, cumulativeUsd: base },
    { label: 'Automation playbooks', valueUsd: -saved * 0.35, cumulativeUsd: base - saved * 0.35 },
    { label: 'Tuned detections', valueUsd: -saved * 0.25, cumulativeUsd: base - saved * 0.6 },
    { label: 'Orchestration', valueUsd: -saved * 0.4, cumulativeUsd: last },
  ]
}

export type BenchmarkProfileId = 'smb' | 'mid' | 'enterprise' | 'healthcare' | 'finance' | 'manufacturing'

export type BenchmarkRow = {
  metricKey: string
  clientValue: number
  industryMedian: number
  unit: 'usd' | 'hours' | 'percent'
}

/** Static semi-annual updatable config — inspired by DBIR / industry reports (illustrative). */
export const benchmarkProfiles: Record<
  BenchmarkProfileId,
  { label: string; description: string; rows: BenchmarkRow[] }
> = {
  smb: {
    label: 'SMB',
    description: 'Organizations under 250 employees; median benchmarks from composite industry surveys.',
    rows: [
      { metricKey: 'costPerIncident', clientValue: 4200, industryMedian: 3800, unit: 'usd' },
      { metricKey: 'securitySpendPerUser', clientValue: 124, industryMedian: 110, unit: 'usd' },
      { metricKey: 'mttrHours', clientValue: 3.1, industryMedian: 4.5, unit: 'hours' },
      { metricKey: 'automationSavingsPct', clientValue: 18, industryMedian: 12, unit: 'percent' },
    ],
  },
  mid: {
    label: 'Mid-Market',
    description: '250–2000 employees; aligned with mid-market MSSP peer data.',
    rows: [
      { metricKey: 'costPerIncident', clientValue: 4200, industryMedian: 4500, unit: 'usd' },
      { metricKey: 'securitySpendPerUser', clientValue: 124, industryMedian: 135, unit: 'usd' },
      { metricKey: 'mttrHours', clientValue: 3.1, industryMedian: 3.8, unit: 'hours' },
      { metricKey: 'automationSavingsPct', clientValue: 18, industryMedian: 15, unit: 'percent' },
    ],
  },
  enterprise: {
    label: 'Enterprise',
    description: '2000+ employees; higher baseline spend, lower MTTR at maturity.',
    rows: [
      { metricKey: 'costPerIncident', clientValue: 4200, industryMedian: 5200, unit: 'usd' },
      { metricKey: 'securitySpendPerUser', clientValue: 124, industryMedian: 155, unit: 'usd' },
      { metricKey: 'mttrHours', clientValue: 3.1, industryMedian: 3.2, unit: 'hours' },
      { metricKey: 'automationSavingsPct', clientValue: 18, industryMedian: 20, unit: 'percent' },
    ],
  },
  healthcare: {
    label: 'Healthcare',
    description: 'HIPAA-heavy vertical; incident costs often above cross-industry median.',
    rows: [
      { metricKey: 'costPerIncident', clientValue: 4200, industryMedian: 5100, unit: 'usd' },
      { metricKey: 'securitySpendPerUser', clientValue: 124, industryMedian: 140, unit: 'usd' },
      { metricKey: 'mttrHours', clientValue: 3.1, industryMedian: 3.5, unit: 'hours' },
      { metricKey: 'automationSavingsPct', clientValue: 18, industryMedian: 14, unit: 'percent' },
    ],
  },
  finance: {
    label: 'Financial services',
    description: 'Regulated financial sector benchmarks.',
    rows: [
      { metricKey: 'costPerIncident', clientValue: 4200, industryMedian: 4800, unit: 'usd' },
      { metricKey: 'securitySpendPerUser', clientValue: 124, industryMedian: 145, unit: 'usd' },
      { metricKey: 'mttrHours', clientValue: 3.1, industryMedian: 3.3, unit: 'hours' },
      { metricKey: 'automationSavingsPct', clientValue: 18, industryMedian: 16, unit: 'percent' },
    ],
  },
  manufacturing: {
    label: 'Manufacturing',
    description: 'OT/IT blended environments; illustrative medians.',
    rows: [
      { metricKey: 'costPerIncident', clientValue: 4200, industryMedian: 4000, unit: 'usd' },
      { metricKey: 'securitySpendPerUser', clientValue: 124, industryMedian: 105, unit: 'usd' },
      { metricKey: 'mttrHours', clientValue: 3.1, industryMedian: 4.2, unit: 'hours' },
      { metricKey: 'automationSavingsPct', clientValue: 18, industryMedian: 11, unit: 'percent' },
    ],
  },
}

export const BENCHMARK_METHODOLOGY =
  'Medians are illustrative composites informed by public breach-cost studies (e.g. IBM Cost of a Data Breach, Verizon DBIR ranges) and Mahoney MSP benchmarks. Update semi-annually. Not a guarantee of your peer set.'

export type ComplianceFrameworkId = 'iso27001' | 'soc2' | 'nis2' | 'gdpr' | 'nist_csf' | 'hipaa'

export type ComplianceFrameworkMock = {
  id: ComplianceFrameworkId
  label: string
  auditCostAnnualUsd: number
  remediationEstimateUsd: number
  maintenanceMonthlyUsd: number
  maxFineExposureUsd: number
}

export const complianceFrameworksMock: ComplianceFrameworkMock[] = [
  { id: 'iso27001', label: 'ISO 27001', auditCostAnnualUsd: 28000, remediationEstimateUsd: 42000, maintenanceMonthlyUsd: 4500, maxFineExposureUsd: 0 },
  { id: 'soc2', label: 'SOC 2', auditCostAnnualUsd: 22000, remediationEstimateUsd: 18000, maintenanceMonthlyUsd: 3200, maxFineExposureUsd: 0 },
  { id: 'nis2', label: 'NIS2', auditCostAnnualUsd: 35000, remediationEstimateUsd: 55000, maintenanceMonthlyUsd: 5800, maxFineExposureUsd: 2000000 },
  { id: 'gdpr', label: 'GDPR / DSGVO', auditCostAnnualUsd: 15000, remediationEstimateUsd: 65000, maintenanceMonthlyUsd: 4100, maxFineExposureUsd: 20000000 },
  { id: 'nist_csf', label: 'NIST CSF', auditCostAnnualUsd: 12000, remediationEstimateUsd: 22000, maintenanceMonthlyUsd: 2800, maxFineExposureUsd: 0 },
  { id: 'hipaa', label: 'HIPAA', auditCostAnnualUsd: 26000, remediationEstimateUsd: 48000, maintenanceMonthlyUsd: 5200, maxFineExposureUsd: 1500000 },
]

/** Mock open findings from Governance (0 = none). */
export const governanceOpenFindingsByFramework: Partial<Record<ComplianceFrameworkId, number>> = {
  soc2: 3,
  iso27001: 1,
  gdpr: 5,
}

export type PartnerClientPnLRow = {
  tenantId: string
  clientName: string
  mrrUsd: number
  serviceCostUsd: number
  incidentCost30dUsd: number
  automationLevelPct: number
  marginPct: number
  status: 'healthy' | 'at_risk' | 'underserved'
}

export const partnerClientPnLMock: PartnerClientPnLRow[] = [
  { tenantId: 'O-25-001', clientName: 'Acme Corp', mrrUsd: 18500, serviceCostUsd: 11200, incidentCost30dUsd: 2100, automationLevelPct: 72, marginPct: 32, status: 'healthy' },
  { tenantId: 'O-25-002', clientName: 'Beta Logistics', mrrUsd: 12400, serviceCostUsd: 9800, incidentCost30dUsd: 4800, automationLevelPct: 48, marginPct: 18, status: 'at_risk' },
  { tenantId: 'O-25-003', clientName: 'Gamma Health', mrrUsd: 22000, serviceCostUsd: 15100, incidentCost30dUsd: 900, automationLevelPct: 81, marginPct: 28, status: 'healthy' },
  { tenantId: 'O-25-004', clientName: 'Delta Retail', mrrUsd: 8900, serviceCostUsd: 7800, incidentCost30dUsd: 1200, automationLevelPct: 35, marginPct: 12, status: 'underserved' },
]

export type BudgetCategory =
  | 'endpoint'
  | 'cloud'
  | 'iam'
  | 'soc_mdr'
  | 'compliance'
  | 'training'
  | 'ir_reserve'

export const budgetCategoryLabels: Record<BudgetCategory, string> = {
  endpoint: 'Endpoint Security',
  cloud: 'Cloud Security',
  iam: 'IAM',
  soc_mdr: 'SOC / MDR',
  compliance: 'Compliance',
  training: 'Training',
  ir_reserve: 'Incident Response Reserve',
}

export type BudgetScenario = 'status_quo' | 'optimized' | 'expanded'

export type BudgetLine = Record<BudgetCategory, number>

/** Annual budget per scenario (USD) — editable in UI. */
export const defaultBudgetMatrix: Record<BudgetScenario, BudgetLine> = {
  status_quo: {
    endpoint: 180000,
    cloud: 95000,
    iam: 62000,
    soc_mdr: 240000,
    compliance: 80000,
    training: 28000,
    ir_reserve: 45000,
  },
  optimized: {
    endpoint: 165000,
    cloud: 88000,
    iam: 55000,
    soc_mdr: 210000,
    compliance: 72000,
    training: 32000,
    ir_reserve: 52000,
  },
  expanded: {
    endpoint: 210000,
    cloud: 115000,
    iam: 78000,
    soc_mdr: 290000,
    compliance: 95000,
    training: 36000,
    ir_reserve: 60000,
  },
}

export const defaultTotalItBudgetUsd = 1_200_000

export const cyberInsuranceDefaults = {
  premiumReductionMinPct: 15,
  premiumReductionMaxPct: 25,
  defaultPremiumUsd: 48000,
}

/** Shared totals for Compliance section + executive PDF (same formula). */
export function computeComplianceTotals(
  selectedIds: readonly ComplianceFrameworkId[] | Set<ComplianceFrameworkId>
): {
  audit: number
  remediation: number
  monthly: number
  fine: number
  exposure: number
  investment: number
} {
  const ids = Array.from(selectedIds)
  let audit = 0
  let remediation = 0
  let monthly = 0
  let fine = 0
  let investment = 0
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const f = complianceFrameworksMock.find((x) => x.id === id)
    if (!f) continue
    const findings = governanceOpenFindingsByFramework[id] ?? 0
    const rem = f.remediationEstimateUsd * (findings > 0 ? 0.1 + findings * 0.05 : 0.05)
    audit += f.auditCostAnnualUsd
    remediation += rem
    monthly += f.maintenanceMonthlyUsd
    fine += f.maxFineExposureUsd
    investment += f.auditCostAnnualUsd / 12 + f.maintenanceMonthlyUsd
  }
  const exposure = audit + remediation + monthly * 12 + fine * 0.001
  return { audit, remediation, monthly, fine, exposure, investment }
}

/** Default frameworks used when mirroring initial UI selection for PDF exports. */
export const defaultComplianceSelectionForExport: ComplianceFrameworkId[] = ['soc2', 'iso27001']
