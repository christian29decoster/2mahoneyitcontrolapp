import { NextResponse } from 'next/server'
import {
  getDattoRmmAccessToken,
  getDattoRmmDeviceByUid,
  getDattoRmmDeviceAudit,
  getDattoRmmDeviceAlertsOpen,
  getDattoRmmDeviceSoftware,
} from '@/lib/rmm-datto'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ uid: string }> }

/**
 * GET /api/rmm/device/[uid]
 * Liefert erweiterte Gerätedaten aus Datto RMM: Einzelgerät, Audit (Hardware/Software), offene Alerts.
 */
export async function GET(_request: Request, { params }: Params) {
  const { uid } = await params
  if (!uid) return NextResponse.json({ error: 'uid required' }, { status: 400 })

  const apiUrl = process.env.DATTO_RMM_API_URL
  const apiKey = process.env.DATTO_RMM_API_KEY
  const apiSecret = process.env.DATTO_RMM_API_SECRET
  if (!apiUrl || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'RMM not configured' }, { status: 503 })
  }

  try {
    const token = await getDattoRmmAccessToken(apiUrl, apiKey, apiSecret)
    const [device, audit, alertsData, softwareData] = await Promise.all([
      getDattoRmmDeviceByUid(apiUrl, token, uid).catch(() => null),
      getDattoRmmDeviceAudit(apiUrl, token, uid).catch(() => null),
      getDattoRmmDeviceAlertsOpen(apiUrl, token, uid).catch(() => ({ alerts: [] })),
      getDattoRmmDeviceSoftware(apiUrl, token, uid).catch(() => ({ software: [] })),
    ])
    return NextResponse.json({
      device,
      audit,
      alerts: alertsData?.alerts ?? [],
      software: softwareData?.software ?? [],
    })
  } catch (e) {
    console.error('Datto RMM device details error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Request failed' },
      { status: 500 }
    )
  }
}
