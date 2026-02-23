/**
 * Service Level Management (SLM) – SLA targets by priority and measurement from incidents.
 * See docs/ITIL-AUSBAU-UND-QUALITAET.md
 */

import type { IncidentRecord, IncidentPriority } from '@/lib/data/incidents'

export interface SlaTarget {
  responseMinutes: number
  resolutionMinutes: number
  label: string
}

/** SLA targets per priority (response: first response; resolution: time to resolve). */
export const SLA_TARGETS_BY_PRIORITY: Record<IncidentPriority, SlaTarget> = {
  P1: { responseMinutes: 15, resolutionMinutes: 60, label: 'P1: 15min response, 1h resolve' },
  P2: { responseMinutes: 30, resolutionMinutes: 240, label: 'P2: 30min response, 4h resolve' },
  P3: { responseMinutes: 120, resolutionMinutes: 480, label: 'P3: 2h response, 8h resolve' },
  P4: { responseMinutes: 240, resolutionMinutes: 1440, label: 'P4: 4h response, 24h resolve' },
}

export interface IncidentSlaResult {
  incidentId: string
  priority: IncidentPriority
  responseMinutes: number | null
  resolutionMinutes: number | null
  responseTargetMinutes: number
  resolutionTargetMinutes: number
  responseMet: boolean | null
  resolutionMet: boolean | null
  loggedAtISO: string
  respondedAtISO: string | null
  resolvedAtISO: string | null
}

export function getSlaTarget(priority: IncidentPriority): SlaTarget {
  return SLA_TARGETS_BY_PRIORITY[priority]
}

function minutesBetween(earlierISO: string, laterISO: string): number {
  return (new Date(laterISO).getTime() - new Date(earlierISO).getTime()) / (60 * 1000)
}

/** Compute response/resolution times and whether SLA was met for one incident. */
export function computeIncidentSla(incident: IncidentRecord): IncidentSlaResult {
  const target = getSlaTarget(incident.priority)
  let responseMinutes: number | null = null
  let resolutionMinutes: number | null = null
  let responseMet: boolean | null = null
  let resolutionMet: boolean | null = null

  if (incident.respondedAtISO) {
    responseMinutes = minutesBetween(incident.loggedAtISO, incident.respondedAtISO)
    responseMet = responseMinutes <= target.responseMinutes
  }
  if (incident.resolvedAtISO) {
    resolutionMinutes = minutesBetween(incident.loggedAtISO, incident.resolvedAtISO)
    resolutionMet = resolutionMinutes <= target.resolutionMinutes
  }

  return {
    incidentId: incident.id,
    priority: incident.priority,
    responseMinutes,
    resolutionMinutes,
    responseTargetMinutes: target.responseMinutes,
    resolutionTargetMinutes: target.resolutionMinutes,
    responseMet,
    resolutionMet,
    loggedAtISO: incident.loggedAtISO,
    respondedAtISO: incident.respondedAtISO ?? null,
    resolvedAtISO: incident.resolvedAtISO ?? null,
  }
}

export interface SlaBreach {
  incidentId: string
  title: string
  priority: IncidentPriority
  type: 'response' | 'resolution'
  targetMinutes: number
  actualMinutes: number
  loggedAtISO: string
}

export interface SlaComplianceReport {
  periodStartISO: string
  periodEndISO: string
  /** Incidents that have respondedAt (eligible for response SLA). */
  totalWithResponse: number
  responseMet: number
  responsePct: number
  /** Incidents that have resolvedAt (eligible for resolution SLA). */
  totalResolved: number
  resolutionMet: number
  resolutionPct: number
  /** Per-incident SLA results in period. */
  incidentResults: IncidentSlaResult[]
  breaches: SlaBreach[]
}

/**
 * Build SLA compliance report from a list of incidents, optionally filtered by period.
 */
export function getSlaComplianceReport(
  incidents: IncidentRecord[],
  options?: { sinceISO?: string; untilISO?: string }
): SlaComplianceReport {
  const now = new Date()
  const periodEnd = options?.untilISO ? new Date(options.untilISO) : now
  const periodStart = options?.sinceISO
    ? new Date(options.sinceISO)
    : new Date(periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000)

  const inPeriod = incidents.filter((i) => {
    const t = new Date(i.loggedAtISO).getTime()
    return t >= periodStart.getTime() && t <= periodEnd.getTime()
  })

  const incidentResults = inPeriod.map(computeIncidentSla)
  const withResponse = incidentResults.filter((r) => r.responseMet !== null)
  const responseMet = withResponse.filter((r) => r.responseMet === true).length
  const resolved = incidentResults.filter((r) => r.resolutionMet !== null)
  const resolutionMetCount = resolved.filter((r) => r.resolutionMet === true).length

  const breaches: SlaBreach[] = []
  inPeriod.forEach((inc) => {
    const r = computeIncidentSla(inc)
    if (r.responseMet === false && r.responseMinutes != null) {
      breaches.push({
        incidentId: inc.id,
        title: inc.title,
        priority: inc.priority,
        type: 'response',
        targetMinutes: r.responseTargetMinutes,
        actualMinutes: r.responseMinutes,
        loggedAtISO: inc.loggedAtISO,
      })
    }
    if (r.resolutionMet === false && r.resolutionMinutes != null) {
      breaches.push({
        incidentId: inc.id,
        title: inc.title,
        priority: inc.priority,
        type: 'resolution',
        targetMinutes: r.resolutionTargetMinutes,
        actualMinutes: r.resolutionMinutes,
        loggedAtISO: inc.loggedAtISO,
      })
    }
  })

  return {
    periodStartISO: periodStart.toISOString(),
    periodEndISO: periodEnd.toISOString(),
    totalWithResponse: withResponse.length,
    responseMet,
    responsePct: withResponse.length ? Math.round((responseMet / withResponse.length) * 100) : 100,
    totalResolved: resolved.length,
    resolutionMet: resolutionMetCount,
    resolutionPct: resolved.length ? Math.round((resolutionMetCount / resolved.length) * 100) : 100,
    incidentResults,
    breaches,
  }
}
