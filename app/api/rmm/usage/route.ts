import { NextResponse } from 'next/server'
import {
  getDattoRmmAccessToken,
  getDattoRmmDevices,
  getDattoRmmAccountAlertsOpen,
  getDattoRmmAccountAlertsResolved,
} from '@/lib/rmm-datto'
import { estimateMonthlyEvents } from '@/lib/mdu-pricing'

export const dynamic = 'force-dynamic'

const DEFAULT_DEMO_DEVICE_COUNT = 25

/**
 * GET /api/rmm/usage
 * Returns device count, estimated monthly events, and real alert counts from Datto RMM.
 * Used by Dashboard and Financials.
 */
export async function GET() {
  const apiUrl = process.env.DATTO_RMM_API_URL
  const apiKey = process.env.DATTO_RMM_API_KEY
  const apiSecret = process.env.DATTO_RMM_API_SECRET

  if (!apiUrl || !apiKey || !apiSecret) {
    const deviceCount = DEFAULT_DEMO_DEVICE_COUNT
    return NextResponse.json({
      source: 'demo',
      deviceCount,
      estimatedEventsPerMonth: estimateMonthlyEvents(deviceCount),
      realOpenAlertsCount: null,
      realResolvedAlertsCount: null,
      realResolvedCapped: false,
    })
  }

  try {
    const token = await getDattoRmmAccessToken(apiUrl, apiKey, apiSecret)
    const [devices, openResult, resolvedResult] = await Promise.all([
      getDattoRmmDevices(apiUrl, token),
      getDattoRmmAccountAlertsOpen(apiUrl, token).catch(() => ({ count: 0 })),
      getDattoRmmAccountAlertsResolved(apiUrl, token).catch(() => ({ count: 0, capped: false })),
    ])
    const deviceCount = devices.length
    return NextResponse.json({
      source: 'rmm',
      deviceCount,
      estimatedEventsPerMonth: estimateMonthlyEvents(deviceCount),
      realOpenAlertsCount: openResult.count,
      realResolvedAlertsCount: resolvedResult.count,
      realResolvedCapped: resolvedResult.capped ?? false,
    })
  } catch (e) {
    console.error('RMM usage error:', e)
    const deviceCount = DEFAULT_DEMO_DEVICE_COUNT
    return NextResponse.json({
      source: 'demo',
      deviceCount,
      estimatedEventsPerMonth: estimateMonthlyEvents(deviceCount),
      realOpenAlertsCount: null,
      realResolvedAlertsCount: null,
      realResolvedCapped: false,
    })
  }
}
