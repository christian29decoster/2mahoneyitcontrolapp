import { NextResponse } from 'next/server'
import {
  getDattoRmmAccessToken,
  getDattoRmmDevices,
  getDattoRmmAccountAlertsOpen,
  getDattoRmmAccountAlertsResolved,
} from '@/lib/rmm-datto'
import { getSophosAccessToken, getSophosAlertsCount } from '@/lib/sophos-central'
import { estimateMonthlyEvents } from '@/lib/mdu-pricing'

export const dynamic = 'force-dynamic'

const DEFAULT_DEMO_DEVICE_COUNT = 25

/**
 * GET /api/usage
 * Aggregierte Nutzung: RMM (Geräte, Events, Alerts) + Sophos EDR (Alerts).
 * Dashboard und Finanzen rufen diese Route auf.
 */
export async function GET() {
  const rmmUrl = process.env.DATTO_RMM_API_URL
  const rmmKey = process.env.DATTO_RMM_API_KEY
  const rmmSecret = process.env.DATTO_RMM_API_SECRET
  const sophosClientId = process.env.SOPHOS_CLIENT_ID
  const sophosClientSecret = process.env.SOPHOS_CLIENT_SECRET
  const sophosTenantId = process.env.SOPHOS_TENANT_ID

  let source: 'rmm' | 'demo' = 'demo'
  let deviceCount = DEFAULT_DEMO_DEVICE_COUNT
  let estimatedEventsPerMonth = estimateMonthlyEvents(deviceCount)
  let realOpenAlertsCount: number | null = null
  let realResolvedAlertsCount: number | null = null
  let realResolvedCapped = false
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
      const sophosResult = await getSophosAlertsCount(sophosToken, sophosTenantId)
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
