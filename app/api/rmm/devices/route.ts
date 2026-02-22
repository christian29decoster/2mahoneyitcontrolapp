import { NextResponse } from 'next/server'
import {
  getDattoRmmAccessToken,
  getDattoRmmDevices,
  DATTO_RMM_DEVICES_PATH,
  DATTO_RMM_MAX_PAGE_SIZE,
} from '@/lib/rmm-datto'

export const dynamic = 'force-dynamic'

/**
 * GET /api/rmm/devices
 * Returns devices from Datto RMM when DATTO_RMM_API_URL, DATTO_RMM_API_KEY, DATTO_RMM_API_SECRET are set.
 * Otherwise returns { source: 'demo', devices: [] } so the frontend can fall back to demo data.
 * ?debug=1: returns raw first-page API response + Link header for pagination troubleshooting.
 */
export async function GET(request: Request) {
  const apiUrl = process.env.DATTO_RMM_API_URL
  const apiKey = process.env.DATTO_RMM_API_KEY
  const apiSecret = process.env.DATTO_RMM_API_SECRET
  const { searchParams } = new URL(request.url)
  const debug = searchParams.get('debug') === '1'

  if (!apiUrl || !apiKey || !apiSecret) {
    return NextResponse.json({
      source: 'demo',
      devices: [],
      error: 'RMM nicht konfiguriert. Bitte DATTO_RMM_API_URL, DATTO_RMM_API_KEY und DATTO_RMM_API_SECRET in den Vercel-Einstellungen setzen.',
    })
  }

  try {
    const token = await getDattoRmmAccessToken(apiUrl, apiKey, apiSecret)

    if (debug) {
      const base = apiUrl.replace(/\/api\/?$/, '')
      const url = `${base}${DATTO_RMM_DEVICES_PATH}?max=${DATTO_RMM_MAX_PAGE_SIZE}&page=1`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      const raw = await res.json()
      const linkHeader = res.headers.get('Link')
      const pageDetails = typeof raw === 'object' && raw !== null ? (raw as { pageDetails?: Record<string, unknown> }).pageDetails : undefined
      return NextResponse.json({
        source: 'rmm',
        devices: [],
        error: null,
        debug: {
          firstPageUrl: url,
          status: res.status,
          linkHeader: linkHeader ?? undefined,
          /** totalCount / total aus Antwort (für Paginierung). */
          totalCount: typeof raw === 'object' && raw !== null ? (raw as { totalCount?: number; total?: number }).totalCount ?? (raw as { totalCount?: number; total?: number }).total : undefined,
          pageDetailsKeys: pageDetails ? Object.keys(pageDetails) : [],
          pageDetailsTotalCount: pageDetails?.totalCount ?? pageDetails?.total,
          /** Alle Top-Level-Keys der API-Antwort (für Paginierung: pageDetails, nextPageUrl, etc.). */
          topLevelKeys: typeof raw === 'object' && raw !== null ? Object.keys(raw) : [],
          /** Roh-JSON der ersten Seite (devices-Array ggf. gekürzt). */
          firstPageRaw:
            typeof raw === 'object' && raw !== null
              ? {
                  ...raw,
                  devices: Array.isArray(raw.devices)
                    ? `[${raw.devices.length} items]`
                    : raw.devices,
                }
              : raw,
        },
      })
    }

    const devices = await getDattoRmmDevices(apiUrl, token)
    return NextResponse.json({ source: 'rmm', devices, error: null })
  } catch (e) {
    let message = e instanceof Error ? e.message : 'RMM-Anfrage fehlgeschlagen'
    if (message.includes('401')) {
      message += ' API Key/Secret prüfen (Vercel: keine Leerzeichen), in RMM: Setup → API Access aktiviert?'
    }
    console.error('Datto RMM devices error:', e)
    return NextResponse.json(
      { source: 'demo', devices: [], error: message },
      { status: 200 }
    )
  }
}
