/**
 * Incidents aus RMM (Datto) und Sophos (Alerts/Events) – Mapping + Event-Logs für Vergoldung.
 * Siehe docs/ITIL-AUSBAU-UND-QUALITAET.md
 */

import type { IncidentRecord, IncidentPriority, IncidentCategory, IncidentStatus } from '@/lib/data/incidents'
import type { IncidentEventLogEntry } from '@/lib/data/incidents'
import {
  getDattoRmmAccessToken,
  getDattoRmmAccountAlertsOpenList,
  getDattoRmmAccountAlertsResolvedList,
} from '@/lib/rmm-datto'
import {
  getSophosAccessToken,
  getSophosPartnerAlertsList,
  getSophosAlertsForTenant,
} from '@/lib/sophos-central'

function rmmSeverityToPriority(severity: unknown): IncidentPriority {
  if (severity == null) return 'P4'
  const s = String(severity).toLowerCase()
  if (s.includes('critical') || s === '3') return 'P1'
  if (s.includes('high') || s === '2') return 'P2'
  if (s.includes('medium') || s === '1') return 'P3'
  return 'P4'
}

function sophosSeverityToPriority(severity: unknown): IncidentPriority {
  if (severity == null) return 'P4'
  const s = String(severity).toLowerCase()
  if (s.includes('critical') || s === 'high') return 'P1'
  if (s.includes('high')) return 'P2'
  if (s.includes('medium')) return 'P3'
  return 'P4'
}

function toISO(t: unknown): string {
  if (typeof t === 'string') {
    const d = new Date(t)
    if (!Number.isNaN(d.getTime())) return d.toISOString()
    return t
  }
  if (typeof t === 'number') return new Date(t).toISOString()
  return new Date().toISOString()
}

function mapRmmAlertToIncident(alert: Record<string, unknown>, index: number, status: IncidentStatus = 'New'): IncidentRecord {
  const uid = alert.uid ?? alert.id ?? `rmm-${index}`
  const id = `rmm-${uid}`
  const name = (alert.name ?? alert.message ?? 'RMM Alert') as string
  const message = (alert.message ?? alert.description ?? name) as string
  const created = toISO(alert.createdTime ?? alert.createdDate ?? alert.created ?? alert.raisedAt)
  const deviceUid = (alert.deviceUid ?? alert.deviceId ?? '') as string
  const sourceRef = deviceUid ? `rmm:${deviceUid}:${uid}` : `rmm:${uid}`
  const eventLog: IncidentEventLogEntry[] = [
    { atISO: created, message: message || name, source: 'rmm', raw: alert },
  ]
  return {
    id,
    title: name,
    description: message || `Alert from RMM${deviceUid ? ` (device ${deviceUid})` : ''}.`,
    category: 'Other' as IncidentCategory,
    priority: rmmSeverityToPriority(alert.severity ?? alert.priority),
    status,
    loggedAtISO: created,
    source: 'rmm',
    sourceRef,
    timeline: [{ atISO: created, text: message || 'RMM alert opened' }],
    eventLog,
    extra: { rmm: { deviceUid, alertUid: uid } },
  }
}

function mapSophosAlertToIncident(
  alert: Record<string, unknown>,
  index: number,
  tenantId?: string,
  tenantName?: string
): IncidentRecord {
  const aid = alert.id ?? alert.alertId ?? `sophos-${index}`
  const id = `sophos-${aid}`
  const description = (alert.description ?? alert.message ?? alert.name ?? 'Sophos Alert') as string
  const created = toISO(alert.created_at ?? alert.createdAt ?? alert.when ?? alert.timestamp)
  const eventLog: IncidentEventLogEntry[] = [
    { atISO: created, message: description, source: 'sophos', raw: alert },
  ]
  return {
    id,
    title: (alert.name ?? alert.description ?? description) as string,
    description,
    category: 'Security' as IncidentCategory,
    priority: sophosSeverityToPriority(alert.severity ?? alert.riskLevel),
    status: 'New',
    loggedAtISO: created,
    source: 'edr',
    sourceRef: tenantId ? `sophos:${tenantId}:${aid}` : `sophos:${aid}`,
    timeline: [{ atISO: created, text: description || 'Sophos alert' }],
    eventLog,
    extra: { sophos: { tenantId, tenantName, alertId: aid } },
  }
}

/** Optional: RMM-Config aus Tenant-Konnektor (apiUrl); Key/Secret weiter aus Env. */
export type RmmIncidentsConfig = { apiUrl: string } | null

/** Incidents aus Datto RMM (offene + gelöste Account-Alerts). Nutzt optional tenantConfig.apiUrl, sonst Env. */
export async function fetchIncidentsFromRmm(tenantConfig: RmmIncidentsConfig = null): Promise<IncidentRecord[]> {
  const apiUrl = tenantConfig?.apiUrl ?? process.env.DATTO_RMM_API_URL
  const apiKey = process.env.DATTO_RMM_API_KEY
  const apiSecret = process.env.DATTO_RMM_API_SECRET
  if (!apiUrl || !apiKey || !apiSecret) return []

  try {
    const token = await getDattoRmmAccessToken(apiUrl, apiKey, apiSecret)
    const [open, resolved] = await Promise.all([
      getDattoRmmAccountAlertsOpenList(apiUrl, token, 200),
      getDattoRmmAccountAlertsResolvedList(apiUrl, token, 200, 15),
    ])
    const openIncidents = open.alerts.map((a, i) => mapRmmAlertToIncident(a, i, 'New'))
    const resolvedIncidents = resolved.alerts.map((a, i) => mapRmmAlertToIncident(a, i + open.alerts.length, 'Resolved'))
    return [...openIncidents, ...resolvedIncidents]
  } catch (e) {
    console.error('RMM incidents fetch error:', e)
    return []
  }
}

/** Optional: Sophos Tenant- oder Partner-ID aus Tenant-Konnektor. */
export type SophosIncidentsConfig = { tenantOrPartnerId: string } | null

/** Incidents aus Sophos (Alerts). Nutzt optional tenantConfig.tenantOrPartnerId, sonst Env SOPHOS_TENANT_ID. */
export async function fetchIncidentsFromSophos(tenantConfig: SophosIncidentsConfig = null): Promise<IncidentRecord[]> {
  const clientId = process.env.SOPHOS_CLIENT_ID
  const clientSecret = process.env.SOPHOS_CLIENT_SECRET
  const tenantId = tenantConfig?.tenantOrPartnerId ?? process.env.SOPHOS_TENANT_ID
  if (!clientId || !clientSecret || !tenantId) return []

  try {
    const token = await getSophosAccessToken(clientId, clientSecret)
    const isPartner = tenantId.length > 0 && !tenantId.includes('-')
    const incidents: IncidentRecord[] = []
    if (isPartner) {
      const { alerts } = await getSophosPartnerAlertsList(token, tenantId, 150)
      alerts.forEach((a, i) => {
        const tenantIdA = (a as { _tenantId?: string })._tenantId
        const tenantNameA = (a as { _tenantName?: string })._tenantName
        const clean = { ...a }
        delete (clean as { _tenantId?: string })._tenantId
        delete (clean as { _tenantName?: string })._tenantName
        incidents.push(mapSophosAlertToIncident(clean, i, tenantIdA, tenantNameA))
      })
    } else {
      const result = await getSophosAlertsForTenant(token, tenantId, undefined, { maxAlerts: 150 })
      result.alerts.forEach((a, i) => {
        incidents.push(mapSophosAlertToIncident(a, i, result.tenantId, result.tenantName))
      })
    }
    return incidents
  } catch (e) {
    console.error('Sophos incidents fetch error:', e)
    return []
  }
}
