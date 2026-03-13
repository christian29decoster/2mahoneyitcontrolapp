/**
 * Mission Briefing – demo briefing content and AI coordinator (aviation-oriented).
 * Shows added value, integrates Grow findings (Business / Technical).
 */

export type BriefingSection = {
  title: string
  subtitle?: string
  items: string[]
}

/** Demo Situation Report (SITREP) – what the briefing delivers as value. */
export const BRIEFING_DEMO_SITREP: BriefingSection[] = [
  {
    title: 'Situation',
    subtitle: 'Current operational picture',
    items: [
      'Threat landscape and infrastructure health aggregated from RMM, EDR, SIEM and PSA.',
      'Critical clients ranked by risk index; SLA threat board and resource utilization visible at a glance.',
      'Single source of truth before shift handover or leadership sync – no scattered dashboards.',
    ],
  },
  {
    title: 'Mission value',
    subtitle: 'What this briefing enables',
    items: [
      'Coordinated prioritization: team and resources aligned on the same risk picture (aviation-style shared mental model).',
      'Red-flag round ensures no silent participation; risks and near-misses are captured before they escalate.',
      'Closed-loop readback and digital sign-off create an audit trail and accountability for in-house IT and MSP teams.',
    ],
  },
  {
    title: 'Resources & recommendations',
    subtitle: 'Where we add improvement',
    items: [
      'Resource capacity and utilization feed into capacity planning; overload is visible before burnout.',
      'Findings from Mahoney Grow (technical and business) are reflected below so security-to-growth actions stay in the briefing loop.',
      'AI Mission Coordinator (demo) suggests prioritized actions and links briefing data with Grow insights for coordinated planning.',
    ],
  },
]

/** AI Mission Coordinator – demo recommendations (aviation-style: coordinate, prioritize, improve). */
export type AICoordinatorRecommendation = {
  id: string
  priority: 'high' | 'medium' | 'low'
  category: 'technical' | 'business' | 'resources'
  title: string
  summary: string
  /** Link to Grow insight id or briefing metric */
  source: string
}

export const AI_COORDINATOR_DEMO: AICoordinatorRecommendation[] = [
  {
    id: 'ai-1',
    priority: 'high',
    category: 'technical',
    title: 'Prioritize patch compliance and MTTR',
    summary: 'Briefing shows patch gap and threat scores elevated. Align with Grow: reduce MTTR via routing and runbooks; raise patch compliance to cut vulnerability pressure. Same data, one coordinated plan.',
    source: 'Mission Briefing Risk Radar + Grow (Technical)',
  },
  {
    id: 'ai-2',
    priority: 'high',
    category: 'business',
    title: 'Align resources with critical clients',
    summary: 'Critical Clients list and SLA Threat Board show where capacity is under pressure. Grow cost-to-risk and churn insights support where to invest next. Use briefing readback to confirm ownership.',
    source: 'Critical Clients + Grow (Business)',
  },
  {
    id: 'ai-3',
    priority: 'medium',
    category: 'resources',
    title: 'Reduce false positives to free capacity',
    summary: 'High alert volume in Operational Notices increases load. Grow suggests correlation and tuning to cut false positives; same analysts can focus on real threats and in-house IT tasks.',
    source: 'Operational Notices + Grow (Technical)',
  },
  {
    id: 'ai-4',
    priority: 'medium',
    category: 'business',
    title: 'RMM automation for repeatable ops',
    summary: 'Resource utilization and ticket counts from briefing align with Grow RMM automation opportunity. Automate repeatable tickets to improve utilization and margin without adding headcount.',
    source: 'Resource Capacity + Grow (Business)',
  },
]

/** Short AI "coordination summary" for the banner. */
export const AI_COORDINATOR_SUMMARY =
  'AI Mission Coordinator (demo): Uses briefing data and Mahoney Grow findings to suggest prioritized actions. Aims at coordinated planning for your team, resources, and in-house IT—one shared picture.'

/** Demo dashboard summary when no tenant or API data is available (so Mission Briefing always shows content). */
export const DEMO_MISSION_SUMMARY = {
  threatLandscapeScore: 28,
  infrastructureHealthScore: 35,
  operationalLoadScore: 42,
  complianceExposureScore: 22,
  customerRiskIndex: 32,
  perCustomer: [
    { customerId: 'O-25-001', customerName: 'Acme Engineering Inc.', riskIndex: 38, level: 'yellow' as const },
    { customerId: 'tenant-2', customerName: 'Contoso Ltd.', riskIndex: 29, level: 'green' as const },
    { customerId: 'tenant-3', customerName: 'Fabrikam Solutions', riskIndex: 45, level: 'yellow' as const },
  ],
  rawMetrics: {
    highSeveritySiemAlerts24h: 2,
    activeSophosIncidents: 0,
    devicesOfflineOver12h: 3,
    devicesTotal: 127,
    patchCompliancePercent: 82,
    openP1Tickets: 0,
    openP2Tickets: 4,
    slaBreachesPending: 0,
    resourceUtilizationPercent: 68,
  },
  generatedAtISO: new Date().toISOString(),
}
