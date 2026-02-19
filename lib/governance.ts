/**
 * Governance & Compliance data and derived metrics.
 * Normalized metric layer for governance dashboards.
 */

export const GOVERNANCE_FRAMEWORKS = [
  { id: 'iso27001', name: 'ISO 27001' },
  { id: 'nist_csf', name: 'NIST CSF' },
  { id: 'bsi_grundschutz', name: 'BSI Grundschutz' },
  { id: 'nis2', name: 'NIS2' },
  { id: 'soc2', name: 'SOC 2' },
] as const

export type FrameworkId = (typeof GOVERNANCE_FRAMEWORKS)[number]['id']

export type ControlStatus = 'compliant' | 'partially_compliant' | 'non_compliant'

export interface GovernanceControl {
  id: string
  frameworkId: FrameworkId
  controlId: string
  name: string
  domain: string
  status: ControlStatus
  coveragePct: number
  linkedAssets: number
  openGaps: number
  description: string
  evidenceSources: string[]
  remediationRecommendations: string[]
}

/** Inputs for compliance score (from raw ops data). */
export interface GovernanceMetricInputs {
  protectedDevicesPct: number
  patchCompliancePct: number
  backupCoveragePct: number
  mfaCoveragePct: number
  edrDeploymentPct: number
  openCriticalFindings: number
  unresolvedHighIncidents: number
}

/** Default/derived inputs for demo. In production, aggregate from devices, cloud, incidents. */
export function getDefaultGovernanceInputs(): GovernanceMetricInputs {
  return {
    protectedDevicesPct: 85,
    patchCompliancePct: 78,
    backupCoveragePct: 92,
    mfaCoveragePct: 88,
    edrDeploymentPct: 82,
    openCriticalFindings: 2,
    unresolvedHighIncidents: 1,
  }
}

/**
 * Compliance Score 0–100% from metric inputs.
 * Weights: devices, patch, backup, MFA, EDR; penalties for critical findings and high incidents.
 */
export function computeComplianceScore(inputs: GovernanceMetricInputs): number {
  const weighted =
    inputs.protectedDevicesPct * 0.2 +
    inputs.patchCompliancePct * 0.2 +
    inputs.backupCoveragePct * 0.15 +
    inputs.mfaCoveragePct * 0.2 +
    inputs.edrDeploymentPct * 0.15
  const penalty = inputs.openCriticalFindings * 4 + inputs.unresolvedHighIncidents * 3
  return Math.max(0, Math.min(100, Math.round(weighted - penalty)))
}

export type RiskLevel = 'low' | 'medium' | 'high'

/** Risk Index: numeric 0–100 and level. */
export function computeRiskIndex(inputs: GovernanceMetricInputs): { value: number; level: RiskLevel } {
  const gaps =
    (100 - inputs.protectedDevicesPct) * 0.15 +
    (100 - inputs.patchCompliancePct) * 0.2 +
    (100 - inputs.mfaCoveragePct) * 0.15 +
    inputs.openCriticalFindings * 12 +
    inputs.unresolvedHighIncidents * 10
  const value = Math.min(100, Math.round(gaps))
  let level: RiskLevel = 'low'
  if (value >= 50) level = 'high'
  else if (value >= 25) level = 'medium'
  return { value, level }
}

export type AuditReadiness = 'ready' | 'at_risk' | 'not_ready'

export function getAuditReadiness(complianceScore: number, riskLevel: RiskLevel): AuditReadiness {
  if (complianceScore >= 80 && riskLevel === 'low') return 'ready'
  if (complianceScore >= 60 && riskLevel !== 'high') return 'at_risk'
  return 'not_ready'
}

/** Trend for last 30 days (delta). */
export const governanceTrend = { complianceDelta: 3, riskDelta: -2 }

/** Control mapping demo data for selected framework. */
export function getControlsForFramework(frameworkId: FrameworkId): GovernanceControl[] {
  const domainByFramework: Record<FrameworkId, string[]> = {
    iso27001: ['A.5 Organizational', 'A.6 People', 'A.7 Physical', 'A.8 Technological'],
    nist_csf: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'],
    bsi_grundschutz: ['ORG', 'INF', 'DER', 'CON'],
    nis2: ['Risk Management', 'Operational Security', 'Supply Chain'],
    soc2: ['Security', 'Availability', 'Processing Integrity', 'Confidentiality', 'Privacy'],
  }
  const domains = domainByFramework[frameworkId] ?? ['General']
  const controls: GovernanceControl[] = []
  domains.forEach((domain, di) => {
    ;[1, 2, 3].forEach((i) => {
      const cid = `${frameworkId.slice(0, 4).toUpperCase()}-${domain.slice(0, 2).toUpperCase()}-${di * 3 + i}`
      const statuses: ControlStatus[] = ['compliant', 'partially_compliant', 'non_compliant']
      const status = statuses[(di + i) % 3]
      controls.push({
        id: `${frameworkId}-${cid}`,
        frameworkId,
        controlId: cid,
        name: `Control ${cid}`,
        domain,
        status,
        coveragePct: status === 'compliant' ? 95 + (i % 5) : status === 'partially_compliant' ? 50 + i * 10 : 20 + i * 5,
        linkedAssets: 5 + (di + i) * 2,
        openGaps: status === 'non_compliant' ? 2 : status === 'partially_compliant' ? 1 : 0,
        description: `Requirements and implementation guidance for ${cid} within ${domain}.`,
        evidenceSources: ['SIEM logs', 'RMM inventory', 'Identity provider'],
        remediationRecommendations: status !== 'compliant' ? ['Update policy documentation', 'Run compliance scan'] : [],
      })
    })
  })
  return controls
}

/** Heatmap: domains x severity. severity = low | medium | high. */
export type HeatmapSeverity = 'low' | 'medium' | 'high'

export interface HeatmapCell {
  domain: string
  severity: HeatmapSeverity
  status: 'healthy' | 'attention' | 'critical'
  count: number
}

export function getGovernanceHeatmap(frameworkId: FrameworkId): HeatmapCell[] {
  const controls = getControlsForFramework(frameworkId)
  const byDomain = new Map<string, { low: number; medium: number; high: number }>()
  controls.forEach((c) => {
    const key = c.domain
    if (!byDomain.has(key)) byDomain.set(key, { low: 0, medium: 0, high: 0 })
    const cell = byDomain.get(key)!
    if (c.status === 'non_compliant') cell.high += 1
    else if (c.status === 'partially_compliant') cell.medium += 1
    else cell.low += 1
  })
  const cells: HeatmapCell[] = []
  byDomain.forEach((val, domain) => {
    ;(['high', 'medium', 'low'] as const).forEach((severity) => {
      const count = val[severity]
      let status: 'healthy' | 'attention' | 'critical' = 'healthy'
      if (severity === 'high' && count > 0) status = 'critical'
      else if (severity === 'medium' && count > 1) status = 'attention'
      else if (severity === 'medium' && count === 1) status = 'attention'
      cells.push({ domain, severity, status, count })
    })
  })
  return cells
}
