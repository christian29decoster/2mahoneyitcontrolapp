import { NextResponse } from 'next/server'
import { getDattoRmmAccessToken, getDattoRmmDevices } from '@/lib/rmm-datto'

export const dynamic = 'force-dynamic'

/**
 * GET /api/rmm/devices
 * Returns devices from Datto RMM when DATTO_RMM_API_URL, DATTO_RMM_API_KEY, DATTO_RMM_API_SECRET are set.
 * Otherwise returns { source: 'demo', devices: [] } so the frontend can fall back to demo data.
 */
export async function GET() {
  const apiUrl = process.env.DATTO_RMM_API_URL
  const apiKey = process.env.DATTO_RMM_API_KEY
  const apiSecret = process.env.DATTO_RMM_API_SECRET

  if (!apiUrl || !apiKey || !apiSecret) {
    return NextResponse.json({ source: 'demo', devices: [] })
  }

  try {
    const token = await getDattoRmmAccessToken(apiUrl, apiKey, apiSecret)
    const devices = await getDattoRmmDevices(apiUrl, token)
    return NextResponse.json({ source: 'rmm', devices })
  } catch (e) {
    console.error('Datto RMM devices error:', e)
    return NextResponse.json(
      { source: 'demo', devices: [], error: e instanceof Error ? e.message : 'RMM request failed' },
      { status: 200 }
    )
  }
}
