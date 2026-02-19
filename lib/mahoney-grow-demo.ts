export type GrowMetricKey =
  | 'mttrHours'
  | 'escalationsPer100Alerts'
  | 'patchCompliancePct'
  | 'rmmAutomationPct'
  | 'falsePositivePct'
  | 'riskExposureUSD'
  | 'securitySpendUSD'
  | 'securitySpendPctOfRevenue'
  | 'revenueUSD'
  | 'grossMarginPct'
  | 'servicesUtilizationPct'
  | 'clientChurnPct'

export type GrowDataSource =
  | 'SOC event stream'
  | 'SIEM logs'
  | 'Endpoint telemetry'
  | 'Network monitoring'
  | 'RMM system'
  | 'Incident history'
  | 'Finance KPIs'
  | 'Service utilization'
  | 'Client acquisition'

export type GrowInsightId =
  | 'reduce-mttr'
  | 'cut-false-positives'
  | 'increase-patch-compliance'
  | 'raise-rmm-automation'
  | 'optimize-cost-to-risk'
  | 'reduce-churn-risk'

export type GrowInsight = {
  id: GrowInsightId
  category: 'Technical' | 'Business'
  title: string
  short: string
  whatOptimizes: string[]
  why: string[]
  dataSources: GrowDataSource[]
  primaryMetric: GrowMetricKey
  impact: Array<{
    metric: GrowMetricKey
    label: string
    unit?: 'h' | '%' | '$'
    delta: number
  }>
}

export type GrowScenario = 'Baseline' | 'Optimized'

export type GrowDemoState = {
  applied: Partial<Record<GrowInsightId, boolean>>
}

export type GrowMetrics = Record<GrowMetricKey, number>

export const GROW_DEMO_BASELINE: GrowMetrics = {
  mttrHours: 4.2,
  escalationsPer100Alerts: 18,
  patchCompliancePct: 78,
  rmmAutomationPct: 34,
  falsePositivePct: 26,
  riskExposureUSD: 420_000,
  securitySpendUSD: 195_000,
  securitySpendPctOfRevenue: 6.1,
  revenueUSD: 3_200_000,
  grossMarginPct: 41,
  servicesUtilizationPct: 62,
  clientChurnPct: 3.6,
}

export const GROW_INSIGHTS: GrowInsight[] = [
  {
    id: 'reduce-mttr',
    category: 'Technical',
    title: 'Reduce MTTR with routing + runbooks',
    short: 'Prioritize incidents, shorten handoffs, and standardize response.',
    primaryMetric: 'mttrHours',
    dataSources: ['Incident history', 'SOC event stream', 'SIEM logs', 'RMM system'],
    whatOptimizes: [
      'Incident routing',
      'On-call efficiency',
      'Playbook consistency',
      'Time-to-containment',
    ],
    why: [
      'Current incident response timelines show repeated handoffs between tiers.',
      'Escalations are frequent for the same alert families; runbooks are missing.',
      'MTTR improvements typically compound: fewer escalations → faster containment.',
    ],
    impact: [
      { metric: 'mttrHours', label: 'MTTR', unit: 'h', delta: -1.4 },
      { metric: 'escalationsPer100Alerts', label: 'Escalations', unit: '%', delta: -4 },
      { metric: 'riskExposureUSD', label: 'Risk exposure', unit: '$', delta: -55_000 },
    ],
  },
  {
    id: 'cut-false-positives',
    category: 'Technical',
    title: 'Cut false positives using correlation + tuning',
    short: 'Reduce analyst load by deduplicating noisy alert sources.',
    primaryMetric: 'falsePositivePct',
    dataSources: ['SIEM logs', 'SOC event stream', 'Endpoint telemetry', 'Network monitoring'],
    whatOptimizes: [
      'Alert deduplication',
      'Rule tuning',
      'Correlation across sources',
      'Analyst capacity',
    ],
    why: [
      'Multiple rules fire on the same underlying events within short time windows.',
      'Noisy detections are missing suppressions for known-good service accounts.',
      'Lower noise increases focus on true threats and reduces response fatigue.',
    ],
    impact: [
      { metric: 'falsePositivePct', label: 'False positives', unit: '%', delta: -10 },
      { metric: 'servicesUtilizationPct', label: 'Service utilization', unit: '%', delta: +6 },
      { metric: 'grossMarginPct', label: 'Gross margin', unit: '%', delta: +1.5 },
    ],
  },
  {
    id: 'increase-patch-compliance',
    category: 'Technical',
    title: 'Increase patch compliance to reduce vulnerability pressure',
    short: 'Close exposure windows by tightening patch SLA coverage.',
    primaryMetric: 'patchCompliancePct',
    dataSources: ['Endpoint telemetry', 'RMM system', 'Incident history'],
    whatOptimizes: ['Patch SLA adherence', 'Attack surface reduction', 'Asset hygiene'],
    why: [
      'Patch compliance below target correlates with repeated vulnerability-driven alerts.',
      'A smaller vulnerable footprint lowers triage volume and incident frequency.',
    ],
    impact: [
      { metric: 'patchCompliancePct', label: 'Patch compliance', unit: '%', delta: +14 },
      { metric: 'riskExposureUSD', label: 'Risk exposure', unit: '$', delta: -75_000 },
      { metric: 'mttrHours', label: 'MTTR', unit: 'h', delta: -0.4 },
    ],
  },
  {
    id: 'raise-rmm-automation',
    category: 'Business',
    title: 'Raise RMM automation for repeatable ops',
    short: 'Automate recurring tickets and cross-system workflows, not just IT tasks.',
    primaryMetric: 'rmmAutomationPct',
    dataSources: ['RMM system', 'Service utilization', 'Incident history', 'SOC event stream'],
    whatOptimizes: [
      'Automation coverage',
      'Ops labor across service desk & backoffice',
      'Standardization of onboarding / offboarding',
      'Elimination of repetitive ticket categories',
    ],
    why: [
      'Event and ticket logs show high volumes of repetitive activities (password resets, onboarding checklists, report exports).',
      'These patterns are ideal candidates for runbooks, RMM scripts or workflow automation.',
      'Automation directly improves utilization by reducing effort per ticket and per onboarding.',
    ],
    impact: [
      { metric: 'rmmAutomationPct', label: 'RMM automation', unit: '%', delta: +22 },
      { metric: 'servicesUtilizationPct', label: 'Service utilization', unit: '%', delta: +8 },
      { metric: 'grossMarginPct', label: 'Gross margin', unit: '%', delta: +2.2 },
    ],
  },
  {
    id: 'optimize-cost-to-risk',
    category: 'Business',
    title: 'Optimize cost-to-risk (security spend effectiveness)',
    short: 'Align spend with measured risk drivers and reduce waste.',
    primaryMetric: 'securitySpendPctOfRevenue',
    dataSources: ['Finance KPIs', 'SIEM logs', 'Incident history', 'Service utilization'],
    whatOptimizes: [
      'Security investment prioritization',
      'Tool overlap reduction',
      'Coverage per € spent',
    ],
    why: [
      'Spend is not clearly mapped to top risk drivers identified in incident history.',
      'Duplicated controls increase operational cost without improving outcomes.',
      'Risk-weighted prioritization improves ROI and stabilizes margins.',
    ],
    impact: [
      { metric: 'securitySpendUSD', label: 'Security spend', unit: '$', delta: -25_000 },
      { metric: 'riskExposureUSD', label: 'Risk exposure', unit: '$', delta: -65_000 },
      { metric: 'grossMarginPct', label: 'Gross margin', unit: '%', delta: +1.2 },
    ],
  },
  {
    id: 'reduce-churn-risk',
    category: 'Business',
    title: 'Reduce churn risk via service quality signals',
    short: 'Use operational KPIs to protect recurring revenue.',
    primaryMetric: 'clientChurnPct',
    dataSources: ['Client acquisition', 'Service utilization', 'Incident history', 'SOC event stream'],
    whatOptimizes: ['Retention', 'Service quality', 'Executive forecasting'],
    why: [
      'Churn risk rises when MTTR and escalations remain elevated across quarters.',
      'Visible improvements in response performance correlate with renewals.',
    ],
    impact: [
      { metric: 'clientChurnPct', label: 'Client churn', unit: '%', delta: -0.9 },
      { metric: 'revenueUSD', label: 'Revenue retention', unit: '$', delta: +80_000 },
      { metric: 'servicesUtilizationPct', label: 'Service utilization', unit: '%', delta: +4 },
    ],
  },
]

export function applyInsightEffects(
  baseline: GrowMetrics,
  state: GrowDemoState
): GrowMetrics {
  const out: GrowMetrics = { ...baseline }

  for (const ins of GROW_INSIGHTS) {
    if (!state.applied[ins.id]) continue
    for (const eff of ins.impact) {
      out[eff.metric] = out[eff.metric] + eff.delta
    }
  }

  // Derived metric: security spend % of revenue (keep consistent)
  out.securitySpendPctOfRevenue = (out.securitySpendUSD / Math.max(1, out.revenueUSD)) * 100

  // Clamp sensible bounds for demo
  out.patchCompliancePct = clamp(out.patchCompliancePct, 0, 100)
  out.rmmAutomationPct = clamp(out.rmmAutomationPct, 0, 100)
  out.falsePositivePct = clamp(out.falsePositivePct, 0, 100)
  out.servicesUtilizationPct = clamp(out.servicesUtilizationPct, 0, 100)
  out.grossMarginPct = clamp(out.grossMarginPct, 0, 100)
  out.clientChurnPct = clamp(out.clientChurnPct, 0, 100)
  out.mttrHours = clamp(out.mttrHours, 0.2, 48)
  out.escalationsPer100Alerts = clamp(out.escalationsPer100Alerts, 0, 100)
  out.riskExposureUSD = Math.max(0, out.riskExposureUSD)
  out.securitySpendUSD = Math.max(0, out.securitySpendUSD)

  return out
}

export function growAiScore(metrics: GrowMetrics): { score: number; label: string } {
  // Simple demo scoring: lower MTTR/noise/risk, higher compliance/automation/margin.
  let score = 100

  score -= Math.min(40, metrics.mttrHours * 6) // up to -40
  score -= Math.min(20, metrics.falsePositivePct * 0.5) // up to -20
  score -= Math.min(20, metrics.escalationsPer100Alerts * 0.6) // up to -20
  score -= Math.min(25, metrics.riskExposureUSD / 30_000) // scaled, up to -25

  score += (metrics.patchCompliancePct - 70) * 0.25 // up to +7.5
  score += (metrics.rmmAutomationPct - 30) * 0.2 // up to +14
  score += (metrics.grossMarginPct - 35) * 0.25 // up to +16.25
  score += (70 - metrics.servicesUtilizationPct) * -0.15 // reward >70

  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const label = clamped >= 80 ? 'High' : clamped >= 55 ? 'Balanced' : 'Needs attention'
  return { score: clamped, label }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

