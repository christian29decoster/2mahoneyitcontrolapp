import { NextRequest, NextResponse } from 'next/server'
import {
  getDattoRmmAccessToken,
  getDattoRmmDevices,
  DATTO_RMM_DEVICES_PATH,
  DATTO_RMM_MAX_PAGE_SIZE,
} from '@/lib/rmm-datto'
import { getTenantById } from '@/lib/data/tenants'
import { getActorRole, getActorTenantId } from '@/lib/auth/session-from-cookie'

export const dynamic = 'force-dynamic'

/**
 * GET /api/rmm/devices
 * Returns devices from Datto RMM. Optional ?tenantId= – dann RMM-Konnektor des Tenants (sonst Env).
 * ?debug=1: returns raw first-page API response for pagination troubleshooting.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const debug = searchParams.get('debug') === '1'
  const queryTenantId = searchParams.get('tenantId')
  const sessionTenantId = getActorTenantId(request)
  const role = getActorRole(request)

  let apiUrl = process.env.DATTO_RMM_API_URL
  if (queryTenantId || sessionTenantId) {
    const tenant = getTenantById(queryTenantId ?? sessionTenantId ?? '')
    if (tenant?.connectors?.rmm?.apiUrl) apiUrl = tenant.connectors.rmm.apiUrl
  }
  const apiKey = process.env.DATTO_RMM_API_KEY
  const apiSecret = process.env.DATTO_RMM_API_SECRET

  if (!apiUrl || !apiKey || !apiSecret) {
    return NextResponse.json({
      source: 'demo',
      devices: [],
      error: 'RMM nicht konfiguriert. Bitte DATTO_RMM_API_URL, DATTO_RMM_API_KEY und DATTO_RMM_API_SECRET in den Vercel-Einstellungen setzen.',
    })
  }

  if (queryTenantId && role === 'tenant_user' && queryTenantId !== sessionTenantId) {
    return NextResponse.json({ source: 'demo', devices: [], error: 'forbidden' }, { status: 403 })
  }

  try {
    const token = await getDattoRmmAccessToken(apiUrl, apiKey, apiSecret)

    if (debug) {
      const base = apiUrl.replace(/\/api\/?$/, '')
      const url1 = `${base}${DATTO_RMM_DEVICES_PATH}?max=${DATTO_RMM_MAX_PAGE_SIZE}&page=1`
      const res = await fetch(url1, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      const raw = await res.json()
      const linkHeader = res.headers.get('Link')
      const pageDetails = typeof raw === 'object' && raw !== null ? (raw as { pageDetails?: Record<string, unknown> }).pageDetails : undefined
      const deviceCountPage1 = Array.isArray((raw as { devices?: unknown[] }).devices) ? (raw as { devices: unknown[] }).devices.length : 0

      /** Seite 2 anfragen, um zu prüfen ob ?page=2 weitere Geräte liefert oder 0 */
      const url2 = `${base}${DATTO_RMM_DEVICES_PATH}?max=${DATTO_RMM_MAX_PAGE_SIZE}&page=2`
      let page2Status: number | null = null
      let page2DeviceCount = 0
      let page2NextPageUrl: string | null = null
      let page2TotalCount: number | undefined
      try {
        const res2 = await fetch(url2, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        })
        page2Status = res2.status
        if (res2.ok) {
          const raw2 = await res2.json()
          const devices2 = (raw2 as { devices?: unknown[] }).devices
          page2DeviceCount = Array.isArray(devices2) ? devices2.length : 0
          const pd2 = (raw2 as { pageDetails?: { nextPageUrl?: string | null; totalCount?: number } }).pageDetails
          if (pd2) {
            page2NextPageUrl = pd2.nextPageUrl ?? null
            page2TotalCount = pd2.totalCount
          }
        }
      } catch {
        // ignore
      }

      return NextResponse.json({
        source: 'rmm',
        devices: [],
        error: null,
        debug: {
          firstPageUrl: url1,
          status: res.status,
          linkHeader: linkHeader ?? undefined,
          /** Vollständiges pageDetails der ersten Seite (nextPageUrl, totalCount, …). */
          pageDetails: pageDetails ?? null,
          pageDetailsKeys: pageDetails ? Object.keys(pageDetails) : [],
          pageDetailsTotalCount: pageDetails?.totalCount ?? pageDetails?.total,
          pageDetailsNextPageUrl: pageDetails?.nextPageUrl ?? pageDetails?.nextPageURL ?? null,
          deviceCountPage1,
          /** Zweite Seite: ob ?page=2 weitere Geräte liefert (wenn 0 → API nutzt evtl. nur nextPageUrl). */
          page2: {
            url: url2,
            status: page2Status,
            deviceCount: page2DeviceCount,
            nextPageUrl: page2NextPageUrl,
            totalCount: page2TotalCount,
          },
          topLevelKeys: typeof raw === 'object' && raw !== null ? Object.keys(raw) : [],
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
