import { NextRequest, NextResponse } from 'next/server'
import {
  getDattoRmmAccessToken,
  getDattoRmmDevices,
  getDattoRmmAccountAlertsOpen,
  getDattoRmmAccountAlertsResolved,
} from '@/lib/rmm-datto'
import { getSophosAccessToken, getSophosPartnerAlertsTotal, getSophosPartnerEventsCount } from '@/lib/sophos-central'
import { estimateMonthlyEvents } from '@/lib/mdu-pricing'
import { getTenantById } from '@/lib/data/tenants'

export const dynamic = 'force-dynamic'

/** Demo-Werte angeglichen an reale Kennzahlen (z. B. 130 Geräte, 39k Events, RMM/Sophos Alerts). */
const DEMO_DEVICE_COUNT = 130
const DEMO_ESTIMATED_EVENTS_PER_MONTH = 39_000
const DEMO_OPEN_ALERTS_RMM = 0
const DEMO_RESOLVED_ALERTS_RMM = 5_000
const DEMO_RESOLVED_CAPPED = true
const DEMO_SOPHOS_ALERTS = 116

/**
 * GET /api/usage
 * Aggregierte Nutzung: RMM (Geräte, Events, Alerts) + Sophos EDR (Alerts).
 * Dashboard und Finanzen rufen diese Route auf.
 *
 * Wirtschaftlichkeit:
 * - MDU-Kosten (Layer 3): bei Sophos SIEM echte Event-Anzahl (Monat), sonst Schätzung.
 * - RMM- und Sophos-Alarme werden nur für die Anzeige gezogen.
 * - Events für MDU: wenn Sophos SIEM konfiguriert ist, echte Event-Anzahl (aktueller Monat);
 *   sonst Schätzung (Geräte × 10 × 30).
 */
function startOfMonthISO(): string {
  const d = new Date()
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

export async function GET(req: NextRequest) {
  const rmmUrl = process.env.DATTO_RMM_API_URL
  const rmmKey = process.env.DATTO_RMM_API_KEY
  const rmmSecret = process.env.DATTO_RMM_API_SECRET
  const sophosClientId = process.env.SOPHOS_CLIENT_ID
  const sophosClientSecret = process.env.SOPHOS_CLIENT_SECRET
  const sophosTenantId = process.env.SOPHOS_TENANT_ID

  let source: 'rmm' | 'demo' = 'demo'
  let deviceCount = DEMO_DEVICE_COUNT
  let estimatedEventsPerMonth = DEMO_ESTIMATED_EVENTS_PER_MONTH
  let realEventsPerMonth: number | null = null
  let realEventsCapped = false
  let realOpenAlertsCount: number | null = DEMO_OPEN_ALERTS_RMM
  let realResolvedAlertsCount: number | null = DEMO_RESOLVED_ALERTS_RMM
  let realResolvedCapped = DEMO_RESOLVED_CAPPED
  let sophosAlertsCount: number | null = null
  let sophosAlertsCapped = false

  const rmmPromise =
    rmmUrl && rmmKey && rmmSecret
      ? (async () => {
          try {
            const token = await getDattoRmmAccessToken(rmmUrl, rmmKey, rmmSecret)
            const [devices, openResult, resolvedResult] = await Promise.all([
              getDattoRmmDevices(rmmUrl, token),
              getDattoRmmAccountAlertsOpen(rmmUrl, token).catch(() => ({ count: 0 })),
              getDattoRmmAccountAlertsResolved(rmmUrl, token).catch(() => ({ count: 0, capped: false })),
            ])
            return {
              source: 'rmm' as const,
              deviceCount: devices.length,
              estimatedEventsPerMonth: estimateMonthlyEvents(devices.length),
              realOpenAlertsCount: openResult.count,
              realResolvedAlertsCount: resolvedResult.count,
              realResolvedCapped: resolvedResult.capped ?? false,
            }
          } catch (e) {
            console.error('RMM usage error:', e)
            return null
          }
        })()
      : Promise.resolve(null)

  const sophosPromise =
    sophosClientId && sophosClientSecret && sophosTenantId
      ? (async () => {
          try {
            const sophosToken = await getSophosAccessToken(sophosClientId, sophosClientSecret)
            const [alertsResult, eventsResult] = await Promise.all([
              getSophosPartnerAlertsTotal(sophosToken, sophosTenantId),
              getSophosPartnerEventsCount(sophosToken, sophosTenantId, {
                fromDate: startOfMonthISO(),
                maxPagesPerTenant: 30,
              }).catch(() => ({ count: 0, capped: false })),
            ])
            return {
              alertsCount: alertsResult.count,
              alertsCapped: alertsResult.capped,
              eventsCount: eventsResult.count,
              eventsCapped: eventsResult.capped,
            }
          } catch (e) {
            console.error('Sophos usage error:', e)
            return null
          }
        })()
      : Promise.resolve(null)

  const [rmmResult, sophosResult] = await Promise.all([rmmPromise, sophosPromise])

  if (rmmResult) {
    source = rmmResult.source
    deviceCount = rmmResult.deviceCount
    estimatedEventsPerMonth = rmmResult.estimatedEventsPerMonth
    realOpenAlertsCount = rmmResult.realOpenAlertsCount
    realResolvedAlertsCount = rmmResult.realResolvedAlertsCount
    realResolvedCapped = rmmResult.realResolvedCapped
  }
  if (sophosResult) {
    sophosAlertsCount = sophosResult.alertsCount
    sophosAlertsCapped = sophosResult.alertsCapped
    if (sophosResult.eventsCount > 0) {
      realEventsPerMonth = sophosResult.eventsCount
      realEventsCapped = sophosResult.eventsCapped
    }
  }

  const sophosConfigured = !!(sophosClientId && sophosClientSecret && sophosTenantId)
  const eventsPerMonth = realEventsPerMonth ?? estimatedEventsPerMonth

  const tenantId = req.nextUrl.searchParams.get('tenantId')
  const tenant = tenantId ? getTenantById(tenantId) : null
  const mduBudgetUsd = tenant?.billing?.mduBudgetUsd

  return NextResponse.json({
    source,
    deviceCount,
    estimatedEventsPerMonth,
    realEventsPerMonth,
    realEventsCapped,
    eventsPerMonth,
    eventsSource: realEventsPerMonth != null ? 'siem' : 'estimate',
    realOpenAlertsCount,
    realResolvedAlertsCount,
    realResolvedCapped,
    sophosConfigured,
    sophosAlertsCount,
    sophosAlertsCapped,
    ...(mduBudgetUsd != null && mduBudgetUsd >= 1000 ? { mduBudgetUsd } : {}),
  })
}
