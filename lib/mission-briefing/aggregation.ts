/**
 * Mission Briefing – data aggregation from Autotask, RMM, Sophos, SIEM (stubs).
 * All inputs are tenant-scoped. In production, wire to real APIs with rate limiting and caching.
 */

import type { RawMetrics, BriefingAutoSummary } from './types'
import { buildBriefingAutoSummary } from './risk-scoring'
import type { AggregationInput } from './risk-scoring'
import { listTenants } from '@/lib/data/tenants'
import { listIncidents } from '@/lib/data/incidents'

const DEFAULT_RAW: RawMetrics = {
  highSeveritySiemAlerts24h: 0,
  activeSophosIncidents: 0,
  devicesOfflineOver12h: 0,
  devicesTotal: 0,
  patchCompliancePercent: 100,
  backupFailures: 0,
  agentDisconnectCount: 0,
  openP1Tickets: 0,
  openP2Tickets: 0,
  slaBreachesPending: 0,
  resourceUtilizationPercent: 0,
  kritisClientsWithActiveRisks: 0,
  nis2OpenIssues: 0,
}

/**
 * Fetch high-severity SIEM (Splunk) alerts for last 24h.
 * Stub: integrate with Splunk API; return count.
 */
export async function fetchSiemHighSeverityCount(_tenantId: string): Promise<number> {
  return 0
}

/**
 * Fetch active Sophos endpoint threat / incident count.
 * Stub: use Sophos API or existing Sophos events.
 */
export async function fetchSophosActiveIncidentCount(_tenantId: string): Promise<number> {
  return 0
}

/**
 * Fetch RMM device health: offline > 12h, patch %, backup failures, agent disconnects.
 * Stub: use /api/rmm/devices and compute; or RMM usage API.
 */
export async function fetchRmmHealthMetrics(tenantId: string): Promise<Pick<RawMetrics, 'devicesOfflineOver12h' | 'devicesTotal' | 'patchCompliancePercent' | 'backupFailures' | 'agentDisconnectCount'>> {
  try {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/rmm/devices${tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : ''}`
    )
    const data = await r.json()
    const devices = Array.isArray(data.devices) ? data.devices : []
    const total = devices.length
    const offline = devices.filter((d: { lastSeen?: string; status?: string }) => {
      const last = d.lastSeen ? new Date(d.lastSeen).getTime() : 0
      return Date.now() - last > 12 * 60 * 60 * 1000
    }).length
    return {
      devicesTotal: total,
      devicesOfflineOver12h: offline,
      patchCompliancePercent: total ? 85 : 100,
      backupFailures: 0,
      agentDisconnectCount: 0,
    }
  } catch {
    return {
      devicesTotal: 0,
      devicesOfflineOver12h: 0,
      patchCompliancePercent: 100,
      backupFailures: 0,
      agentDisconnectCount: 0,
    }
  }
}

/**
 * Fetch Autotask (or PSA) open P1/P2, SLA breaches, resource utilization.
 * Stub: use /api/incidents or Autotask API.
 */
export async function fetchOperationalLoad(tenantId: string | null): Promise<Pick<RawMetrics, 'openP1Tickets' | 'openP2Tickets' | 'slaBreachesPending' | 'resourceUtilizationPercent'>> {
  const incidents = listIncidents({ tenantId: tenantId ?? undefined })
  const open = incidents.filter((i) => i.status !== 'Resolved' && i.status !== 'Closed')
  const p1 = open.filter((i) => i.priority === 'P1').length
  const p2 = open.filter((i) => i.priority === 'P2').length
  return {
    openP1Tickets: p1,
    openP2Tickets: p2,
    slaBreachesPending: 0,
    resourceUtilizationPercent: Math.min(100, open.length * 2),
  }
}

/**
 * Compliance: KRITIS-tagged clients with active risks, NIS-2 open issues.
 * Stub: from tenant/certificate data or governance store.
 */
export async function fetchComplianceExposure(tenantId: string): Promise<Pick<RawMetrics, 'kritisClientsWithActiveRisks' | 'nis2OpenIssues'>> {
  return {
    kritisClientsWithActiveRisks: 0,
    nis2OpenIssues: 0,
  }
}

/**
 * Build full aggregation input for a tenant. Calls all data sources (with stubs where needed).
 */
export async function aggregateForTenant(tenantId: string): Promise<AggregationInput> {
  const [siem, sophos, rmm, load, compliance] = await Promise.all([
    fetchSiemHighSeverityCount(tenantId),
    fetchSophosActiveIncidentCount(tenantId),
    fetchRmmHealthMetrics(tenantId),
    fetchOperationalLoad(tenantId),
    fetchComplianceExposure(tenantId),
  ])

  const raw: RawMetrics = {
    ...DEFAULT_RAW,
    highSeveritySiemAlerts24h: siem,
    activeSophosIncidents: sophos,
    ...rmm,
    ...load,
    ...compliance,
  }

  const tenants = listTenants()
  const threatNum = Math.min(100, raw.highSeveritySiemAlerts24h * 10 + raw.activeSophosIncidents * 5)
  const patchGap = Math.max(0, 100 - raw.patchCompliancePercent)
  const backupRisk = Math.min(100, raw.backupFailures * 25)
  const slaPressure = Math.min(100, (raw.openP1Tickets * 20) + (raw.openP2Tickets * 5) + (raw.slaBreachesPending * 15))
  const capacityRisk = Math.min(100, raw.resourceUtilizationPercent)
  const customers = tenants
    .filter((t) => t.id === tenantId)
    .map((t) => ({
      customerId: t.id,
      customerName: t.name,
      threat: threatNum,
      patchGap,
      backupRisk,
      slaPressure,
      capacityRisk,
    }))

  if (customers.length === 0) {
    customers.push({
      customerId: tenantId,
      customerName: 'Current tenant',
      threat: threatNum,
      patchGap: Math.max(0, 100 - raw.patchCompliancePercent),
      backupRisk: Math.min(100, raw.backupFailures * 25),
      slaPressure: Math.min(100, (raw.openP1Tickets * 20) + (raw.openP2Tickets * 5)),
      capacityRisk: raw.resourceUtilizationPercent,
    })
  }

  return {
    tenantId,
    customers,
    raw,
  }
}

/**
 * Generate auto-summary for briefing start. Used by "Start Briefing" and by scheduler.
 */
export async function generateAutoSummary(tenantId: string): Promise<BriefingAutoSummary> {
  const input = await aggregateForTenant(tenantId)
  return buildBriefingAutoSummary(input)
}
