/**
 * Mission Briefing – risk scoring.
 * Weighted Customer Risk Index and component scores (0–100, higher = worse).
 */

import type { RawMetrics, PerCustomerRisk, BriefingAutoSummary } from './types'
import { RISK_INDEX_WEIGHTS, scoreToLevel } from './types'

export interface AggregationInput {
  tenantId: string
  /** Per-customer metrics (from RMM, Autotask, Sophos, SIEM by customer). */
  customers: {
    customerId: string
    customerName: string
    threat: number
    patchGap: number
    backupRisk: number
    slaPressure: number
    capacityRisk: number
  }[]
  /** Global/tenant-level raw counts for snapshot. */
  raw: RawMetrics
}

/**
 * Customer Risk Index (weighted).
 * (Threat × 30%) + (Patch Gap × 20%) + (Backup Risk × 15%) + (SLA Pressure × 20%) + (Capacity Risk × 15%)
 */
export function computeCustomerRiskIndex(c: AggregationInput['customers'][0]): number {
  const w = RISK_INDEX_WEIGHTS
  const v =
    c.threat * w.threat +
    c.patchGap * w.patchGap +
    c.backupRisk * w.backupRisk +
    c.slaPressure * w.slaPressure +
    c.capacityRisk * w.capacityRisk
  return Math.min(100, Math.round(v * 100) / 100)
}

export function computePerCustomerRisks(input: AggregationInput): PerCustomerRisk[] {
  return input.customers.map((c) => {
    const riskIndex = computeCustomerRiskIndex(c)
    return {
      customerId: c.customerId,
      customerName: c.customerName,
      threat: c.threat,
      patchGap: c.patchGap,
      backupRisk: c.backupRisk,
      slaPressure: c.slaPressure,
      capacityRisk: c.capacityRisk,
      riskIndex,
      level: scoreToLevel(riskIndex),
    }
  })
}

/** Global tenant-level scores (0–100) from raw metrics. Normalize counts into 0–100 scale with caps. */
export function computeGlobalScores(raw: RawMetrics): {
  threatLandscapeScore: number
  infrastructureHealthScore: number
  operationalLoadScore: number
  complianceExposureScore: number
  customerRiskIndex: number
} {
  const clamp = (v: number) => Math.min(100, Math.max(0, v))

  const threatLandscapeScore = clamp(
    Math.min(100, (raw.highSeveritySiemAlerts24h * 10) + (raw.activeSophosIncidents * 5))
  )
  const offlinePct = raw.devicesTotal > 0 ? (raw.devicesOfflineOver12h / raw.devicesTotal) * 100 : 0
  const patchGap = Math.max(0, 100 - raw.patchCompliancePercent)
  const infrastructureHealthScore = clamp(
    offlinePct * 2 + patchGap * 0.5 + Math.min(50, raw.backupFailures * 10) + Math.min(30, raw.agentDisconnectCount)
  )
  const operationalLoadScore = clamp(
    Math.min(100, (raw.openP1Tickets * 8) + (raw.openP2Tickets * 2) + (raw.slaBreachesPending * 15) + raw.resourceUtilizationPercent * 0.5)
  )
  const complianceExposureScore = clamp(
    Math.min(100, raw.kritisClientsWithActiveRisks * 25 + raw.nis2OpenIssues * 10)
  )

  const customerRiskIndex = threatLandscapeScore * 0.3 +
    Math.min(100, patchGap + raw.backupFailures * 5) * 0.2 +
    Math.min(100, raw.backupFailures * 25) * 0.15 +
    operationalLoadScore * 0.2 +
    Math.min(100, raw.resourceUtilizationPercent) * 0.15

  return {
    threatLandscapeScore: Math.round(threatLandscapeScore * 100) / 100,
    infrastructureHealthScore: Math.round(Math.min(100, infrastructureHealthScore) * 100) / 100,
    operationalLoadScore: Math.round(Math.min(100, operationalLoadScore) * 100) / 100,
    complianceExposureScore: Math.round(Math.min(100, complianceExposureScore) * 100) / 100,
    customerRiskIndex: Math.round(Math.min(100, customerRiskIndex) * 100) / 100,
  }
}

export function buildBriefingAutoSummary(input: AggregationInput): BriefingAutoSummary {
  const perCustomer = computePerCustomerRisks(input)
  const global = computeGlobalScores(input.raw)
  const avgRisk = perCustomer.length
    ? perCustomer.reduce((s, c) => s + c.riskIndex, 0) / perCustomer.length
    : global.customerRiskIndex

  return {
    threatLandscapeScore: global.threatLandscapeScore,
    infrastructureHealthScore: global.infrastructureHealthScore,
    operationalLoadScore: global.operationalLoadScore,
    complianceExposureScore: global.complianceExposureScore,
    customerRiskIndex: Math.round(avgRisk * 100) / 100,
    perCustomer: perCustomer.sort((a, b) => b.riskIndex - a.riskIndex),
    rawMetrics: input.raw,
    generatedAtISO: new Date().toISOString(),
  }
}
