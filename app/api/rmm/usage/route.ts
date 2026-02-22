import { NextResponse } from 'next/server'
import { getDattoRmmAccessToken, getDattoRmmDevices } from '@/lib/rmm-datto'
import { estimateMonthlyEvents } from '@/lib/mdu-pricing'

export const dynamic = 'force-dynamic'

const DEFAULT_DEMO_DEVICE_COUNT = 25

/**
 * GET /api/rmm/usage
 * Returns device count and estimated monthly events for MDU/cost display.
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
    })
  }

  try {
    const token = await getDattoRmmAccessToken(apiUrl, apiKey, apiSecret)
    const devices = await getDattoRmmDevices(apiUrl, token)
    const deviceCount = devices.length
    return NextResponse.json({
      source: 'rmm',
      deviceCount,
      estimatedEventsPerMonth: estimateMonthlyEvents(deviceCount),
    })
  } catch (e) {
    console.error('RMM usage error:', e)
    const deviceCount = DEFAULT_DEMO_DEVICE_COUNT
    return NextResponse.json({
      source: 'demo',
      deviceCount,
      estimatedEventsPerMonth: estimateMonthlyEvents(deviceCount),
    })
  }
}
