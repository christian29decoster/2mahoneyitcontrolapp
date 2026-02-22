import { NextResponse } from 'next/server'
import {
  getDattoRmmAccessToken,
  getDattoRmmDevices,
  getDattoRmmAccountAlertsOpen,
  getDattoRmmAccountAlertsResolved,
} from '@/lib/rmm-datto'
import { getSophosAccessToken, getSophosPartnerAlertsTotal } from '@/lib/sophos-central'
import { estimateMonthlyEvents } from '@/lib/mdu-pricing'

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
 * - MDU-Kosten (Layer 3) basieren ausschließlich auf estimatedEventsPerMonth
 *   (Schätzung: Geräte × 10 Events/Gerät/Tag × 30). Echte Event-Logs werden
 *   derzeit nicht von einer API gezogen.
 * - RMM- und Sophos-Alarme werden nur für die Anzeige gezogen und fließen
 *   bewusst nicht in die Event-Zahl ein (Alarme ≠ Abrechnungs-Events).
 */
export async function GET() {
  const rmmUrl = process.env.DATTO_RMM_API_URL
  const rmmKey = process.env.DATTO_RMM_API_KEY
  const rmmSecret = process.env.DATTO_RMM_API_SECRET
  const sophosClientId = process.env.SOPHOS_CLIENT_ID
  const sophosClientSecret = process.env.SOPHOS_CLIENT_SECRET
  const sophosTenantId = process.env.SOPHOS_TENANT_ID

  let source: 'rmm' | 'demo' = 'demo'
  let deviceCount = DEMO_DEVICE_COUNT
  let estimatedEventsPerMonth = DEMO_ESTIMATED_EVENTS_PER_MONTH
  let realOpenAlertsCount: number | null = DEMO_OPEN_ALERTS_RMM
  let realResolvedAlertsCount: number | null = DEMO_RESOLVED_ALERTS_RMM
  let realResolvedCapped = DEMO_RESOLVED_CAPPED
  let sophosAlertsCount: number | null = null
  let sophosAlertsCapped = false

  if (rmmUrl && rmmKey && rmmSecret) {
    try {
      const token = await getDattoRmmAccessToken(rmmUrl, rmmKey, rmmSecret)
      const [devices, openResult, resolvedResult] = await Promise.all([
        getDattoRmmDevices(rmmUrl, token),
        getDattoRmmAccountAlertsOpen(rmmUrl, token).catch(() => ({ count: 0 })),
        getDattoRmmAccountAlertsResolved(rmmUrl, token).catch(() => ({ count: 0, capped: false })),
      ])
      source = 'rmm'
      deviceCount = devices.length
      estimatedEventsPerMonth = estimateMonthlyEvents(deviceCount)
      realOpenAlertsCount = openResult.count
      realResolvedAlertsCount = resolvedResult.count
      realResolvedCapped = resolvedResult.capped ?? false
  } catch (e) {
    console.error('RMM usage error:', e)
  }
  }

  if (sophosClientId && sophosClientSecret && sophosTenantId) {
    try {
      const sophosToken = await getSophosAccessToken(sophosClientId, sophosClientSecret)
      const sophosResult = await getSophosPartnerAlertsTotal(sophosToken, sophosTenantId)
      sophosAlertsCount = sophosResult.count
      sophosAlertsCapped = sophosResult.capped
    } catch (e) {
      console.error('Sophos usage error:', e)
    }
  }

  const sophosConfigured = !!(sophosClientId && sophosClientSecret && sophosTenantId)

  return NextResponse.json({
    source,
    deviceCount,
    estimatedEventsPerMonth,
    realOpenAlertsCount,
    realResolvedAlertsCount,
    realResolvedCapped,
    sophosConfigured,
    sophosAlertsCount,
    sophosAlertsCapped,
  })
}
