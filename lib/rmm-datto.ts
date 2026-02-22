/**
 * Datto RMM API v2 – OAuth and device list.
 * Docs: Setup > Global Settings > Access Control > Enable API Access;
 *       Setup > Users > Generate API Keys.
 * Base URL per platform: e.g. https://pinotage-api.centrastage.net (no /api suffix for auth).
 */

const DATTO_RMM_TOKEN_PATH = '/auth/oauth/token'
export const DATTO_RMM_DEVICES_PATH = '/api/v2/account/devices'
export const DATTO_RMM_MAX_PAGE_SIZE = 250
const MAX_PAGE_SIZE = DATTO_RMM_MAX_PAGE_SIZE

export interface DattoRmmDevice {
  id?: number
  uid: string
  siteId?: number
  siteUid?: string
  siteName?: string
  deviceType?: { category?: string; type?: string }
  hostname?: string
  intIpAddress?: string
  operatingSystem?: string
  lastLoggedInUser?: string
  domain?: string
  displayVersion?: string
  online?: boolean
  lastSeen?: string
  deviceClass?: string
  description?: string
}

export interface DattoDevicesPage {
  pageDetails?: {
    nextPageUrl?: string | null
    nextPageURL?: string | null
    count?: number
    totalCount?: number
    total?: number
  }
  devices?: DattoRmmDevice[]
  /** Manche APIs liefern totalCount auf Top-Level */
  totalCount?: number
  total?: number
}

/** Zusätzliche Datto-RMM-Felder für Detailansicht. */
export interface RmmDeviceData {
  uid: string
  ipAddress?: string
  domain?: string
  description?: string
  lastSeen?: string
  deviceClass?: string
  siteName?: string
  siteId?: number
  siteUid?: string
  lastLoggedInUser?: string
}

/** App device shape (matches DeviceRow / demo). Bei RMM-Geräten ist rmmData gesetzt. */
export interface AppDevice {
  type: string
  name: string
  serial: string
  os: string
  version: string
  location: string | { name: string; lat: number; lng: number }
  room: string
  lastLogin: string
  status: string
  uid?: string
  /** Nur bei Geräten aus Datto RMM – alle RMM-spezifischen Infos für die Detailansicht. */
  rmmData?: RmmDeviceData
}

function mapDeviceClassToType(deviceClass?: string, deviceType?: { category?: string; type?: string }): string {
  const c = (deviceClass || '').toLowerCase()
  const t = deviceType?.type?.toLowerCase() || ''
  if (c === 'esxihost' || t.includes('server')) return 'Server'
  if (c === 'printer') return 'PC'
  if (c === 'rmmnetworkdevice') return 'Server'
  if (t.includes('laptop') || t.includes('notebook')) return 'Laptop'
  if (t.includes('phone') || t.includes('mobile')) return 'Phone'
  if (t.includes('workstation') || t.includes('desktop')) return 'PC'
  return 'PC'
}

export function mapDattoDeviceToApp(d: DattoRmmDevice): AppDevice {
  const type = mapDeviceClassToType(d.deviceClass, d.deviceType)
  const name = d.hostname || d.uid || 'Unknown'
  const lastSeen = d.lastSeen ? new Date(d.lastSeen).toLocaleString() : ''
  const lastLogin = d.lastLoggedInUser ? `${d.lastLoggedInUser} • ${lastSeen}` : lastSeen || '–'
  const serial = d.uid || String(d.id ?? '')
  return {
    type,
    name,
    serial,
    os: d.operatingSystem || '–',
    version: d.displayVersion || '–',
    location: d.siteName || 'RMM',
    room: '–',
    lastLogin,
    status: d.online ? 'Online' : 'Offline',
    uid: d.uid,
    rmmData: {
      uid: d.uid,
      ipAddress: d.intIpAddress,
      domain: d.domain,
      description: d.description,
      lastSeen: d.lastSeen,
      deviceClass: d.deviceClass,
      siteName: d.siteName,
      siteId: d.siteId,
      siteUid: d.siteUid,
      lastLoggedInUser: d.lastLoggedInUser,
    },
  }
}

// Laut offizieller Datto RMM Doku: Client Authentication = "Send as Basic Auth header", Client ID = public-client, Client Secret = public
const DATTO_OAUTH_CLIENT_BASIC = Buffer.from('public-client:public').toString('base64')

export async function getDattoRmmAccessToken(apiUrl: string, apiKey: string, apiSecret: string): Promise<string> {
  const base = apiUrl.replace(/\/api\/?$/, '').trim()
  const key = String(apiKey ?? '').trim()
  const secret = String(apiSecret ?? '').trim()
  const url = `${base}${DATTO_RMM_TOKEN_PATH}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${DATTO_OAUTH_CLIENT_BASIC}`,
  }

  // Password Grant mit API Key = username, API Secret = password (laut Postman-Anleitung)
  const passwordGrant = new URLSearchParams({
    grant_type: 'password',
    username: key,
    password: secret,
  })
  const resPassword = await fetch(url, {
    method: 'POST',
    headers,
    body: passwordGrant.toString(),
    cache: 'no-store',
  })
  if (resPassword.ok) {
    const data = await resPassword.json()
    return data.access_token
  }

  // Fallback: client_credentials mit Key/Secret als OAuth-Client (ohne Basic Auth)
  const clientCredentials = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: key,
    client_secret: secret,
  })
  const resClient = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: clientCredentials.toString(),
    cache: 'no-store',
  })
  if (resClient.ok) {
    const data = await resClient.json()
    return data.access_token
  }

  const err = await resPassword.text()
  throw new Error(`Datto RMM token failed: ${resPassword.status} ${err}`)
}

function resolveNextPageUrl(base: string, nextPageUrl: string | null | undefined): string | null {
  if (!nextPageUrl || typeof nextPageUrl !== 'string') return null
  const s = nextPageUrl.trim()
  if (!s) return null
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  const baseClean = base.replace(/\/+$/, '')
  const path = s.startsWith('/') ? s : `/${s}`
  try {
    const u = new URL(baseClean)
    return `${u.origin}${path}`
  } catch {
    return `${baseClean}${path}`
  }
}

/** Liest nextPageUrl aus API-Antwort (alle gängigen Varianten + Durchsuchen von pageDetails). */
function extractNextPageUrl(raw: unknown, base: string): string | null {
  if (raw == null || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const candidates = [
    o.nextPageUrl,
    o.nextPageURL,
    o.next_page_url,
    o.nextPage,
    (o.pageDetails as Record<string, unknown> | undefined)?.nextPageUrl,
    (o.pageDetails as Record<string, unknown> | undefined)?.nextPageURL,
    (o.pageDetails as Record<string, unknown> | undefined)?.next_page_url,
  ]
  for (const v of candidates) {
    if (typeof v === 'string' && v.trim()) {
      const resolved = resolveNextPageUrl(base, v)
      if (resolved) return resolved
    }
  }
  const pd = o.pageDetails as Record<string, unknown> | undefined
  if (pd && typeof pd === 'object') {
    for (const v of Object.values(pd)) {
      if (typeof v === 'string' && v.trim() && (v.startsWith('http') || v.startsWith('/'))) {
        const resolved = resolveNextPageUrl(base, v)
        if (resolved) return resolved
      }
    }
  }
  return null
}

export async function getDattoRmmDevices(
  apiUrl: string,
  accessToken: string
): Promise<AppDevice[]> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  const all: AppDevice[] = []
  const seenUids = new Set<string>()
  let nextUrl: string | null = `${base}${DATTO_RMM_DEVICES_PATH}?max=${MAX_PAGE_SIZE}&page=1`
  let pageNum = 1
  const maxPages = 100
  let totalCount: number | null = null
  const requestedUrls = new Set<string>()

  while (nextUrl && pageNum <= maxPages) {
    const urlToFetch = nextUrl
    if (requestedUrls.has(urlToFetch)) break
    requestedUrls.add(urlToFetch)
    nextUrl = null

    const res: Response = await fetch(urlToFetch, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Datto RMM devices: ${res.status} ${body.slice(0, 200)}`)
    }
    const raw = await res.json()
    const data = raw as DattoDevicesPage
    const devices =
      data.devices ??
      (raw as { result?: { devices?: DattoRmmDevice[] } }).result?.devices ??
      (raw as { data?: { devices?: DattoRmmDevice[] } }).data?.devices ??
      []
    for (const d of devices) {
      if (d && typeof d === 'object' && d.uid && !seenUids.has(d.uid)) {
        seenUids.add(d.uid)
        all.push(mapDattoDeviceToApp(d))
      }
    }

    if (totalCount == null) {
      const rawObj = raw as Record<string, unknown>
      const pageDetails = data.pageDetails as Record<string, unknown> | undefined
      const tc =
        pageDetails?.totalCount ??
        pageDetails?.total ??
        data.totalCount ??
        data.total ??
        rawObj.totalCount ??
        rawObj.total
      if (typeof tc === 'number' && tc > 0) totalCount = tc
    }

    if (totalCount != null && all.length >= totalCount) break

    const linkHeader = res.headers.get('Link')
    const nextFromLink = linkHeader?.match(/<([^>]+)>;\s*rel=["']?next["']?/i)?.[1]
    const apiNext = extractNextPageUrl(raw, base)
    const nextFromLinkResolved = nextFromLink ? resolveNextPageUrl(base, nextFromLink) : null
    nextUrl = apiNext ?? nextFromLinkResolved ?? (nextFromLink ? (resolveNextPageUrl(base, nextFromLink) || nextFromLink) : null)

    const gotFullPage = devices.length >= MAX_PAGE_SIZE
    const needMore = totalCount != null && all.length < totalCount
    if (!nextUrl && (gotFullPage || needMore || devices.length > 0)) {
      pageNum += 1
      const fallbackUrl = `${base}${DATTO_RMM_DEVICES_PATH}?max=${MAX_PAGE_SIZE}&page=${pageNum}`
      if (!requestedUrls.has(fallbackUrl)) nextUrl = fallbackUrl
    } else if (nextUrl) {
      pageNum += 1
    }

    if (nextUrl) await new Promise((r) => setTimeout(r, 80))
  }

  return all
}

const DATTO_RMM_DEVICE_PATH = '/api/v2/device'
const DATTO_RMM_AUDIT_DEVICE_PATH = '/api/v2/audit/device'
const DATTO_RMM_ALERTS_OPEN_PATH = '/api/v2/device'
const DATTO_RMM_ACCOUNT_ALERTS_OPEN_PATH = '/api/v2/account/alerts/open'
const DATTO_RMM_ACCOUNT_ALERTS_RESOLVED_PATH = '/api/v2/account/alerts/resolved'
const ACCOUNT_ALERTS_PAGE_SIZE = 250
const ACCOUNT_ALERTS_RESOLVED_MAX_PAGES = 20

/** Einzelgerät-Details (GET /v2/device/{uid}) – mehr Felder als in der Liste. */
export async function getDattoRmmDeviceByUid(
  apiUrl: string,
  accessToken: string,
  deviceUid: string
): Promise<Record<string, unknown>> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  const url = `${base}${DATTO_RMM_DEVICE_PATH}/${encodeURIComponent(deviceUid)}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Device details: ${res.status}`)
  return res.json()
}

/** Audit-Daten für Gerät (Hardware, etc.) – GET /v2/audit/device/{uid}. */
export async function getDattoRmmDeviceAudit(
  apiUrl: string,
  accessToken: string,
  deviceUid: string
): Promise<Record<string, unknown>> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  const url = `${base}${DATTO_RMM_AUDIT_DEVICE_PATH}/${encodeURIComponent(deviceUid)}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Device audit: ${res.status}`)
  return res.json()
}

/** Offene Alerts für Gerät – GET /v2/device/{uid}/alerts/open. */
export async function getDattoRmmDeviceAlertsOpen(
  apiUrl: string,
  accessToken: string,
  deviceUid: string
): Promise<{ alerts?: unknown[]; pageDetails?: { nextPageUrl?: string | null } }> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  const all: unknown[] = []
  let nextUrl: string | null = `${base}${DATTO_RMM_ALERTS_OPEN_PATH}/${encodeURIComponent(deviceUid)}/alerts/open?max=50&page=1`
  while (nextUrl) {
    const alertRes: Response = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    if (!alertRes.ok) throw new Error(`Device alerts: ${alertRes.status}`)
    const data = await alertRes.json()
    const alerts = data.alerts ?? []
    for (const a of alerts) all.push(a)
    nextUrl = data.pageDetails?.nextPageUrl ? resolveNextPageUrl(base, data.pageDetails.nextPageUrl) : null
  }
  return { alerts: all }
}

/** Account-weite offene Alerts – GET /v2/account/alerts/open (alle Seiten). */
export async function getDattoRmmAccountAlertsOpen(
  apiUrl: string,
  accessToken: string
): Promise<{ count: number }> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  let count = 0
  let pageNum = 1
  let nextUrl: string | null = `${base}${DATTO_RMM_ACCOUNT_ALERTS_OPEN_PATH}?max=${ACCOUNT_ALERTS_PAGE_SIZE}&page=1`
  while (nextUrl) {
    const res: Response = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Account alerts open: ${res.status}`)
    const data = await res.json()
    const alerts = data.alerts ?? []
    count += alerts.length
    const pageDetails = data.pageDetails as Record<string, unknown> | undefined
    const nextPageStr = (pageDetails?.nextPageUrl ?? pageDetails?.nextPageURL ?? data.nextPageUrl) as string | null | undefined
    nextUrl = resolveNextPageUrl(base, nextPageStr ?? null)
    if (!nextUrl && alerts.length === ACCOUNT_ALERTS_PAGE_SIZE) {
      pageNum += 1
      nextUrl = `${base}${DATTO_RMM_ACCOUNT_ALERTS_OPEN_PATH}?max=${ACCOUNT_ALERTS_PAGE_SIZE}&page=${pageNum}`
    } else if (nextUrl) {
      pageNum += 1
    }
    if (nextUrl) await new Promise((r) => setTimeout(r, 100))
  }
  return { count }
}

/** Account-weite gelöste Alerts – GET /v2/account/alerts/resolved (max. N Seiten, um API zu schonen). */
export async function getDattoRmmAccountAlertsResolved(
  apiUrl: string,
  accessToken: string,
  maxPages: number = ACCOUNT_ALERTS_RESOLVED_MAX_PAGES
): Promise<{ count: number; capped: boolean }> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  let count = 0
  let pageNum = 1
  let nextUrl: string | null = `${base}${DATTO_RMM_ACCOUNT_ALERTS_RESOLVED_PATH}?max=${ACCOUNT_ALERTS_PAGE_SIZE}&page=1`
  while (nextUrl && pageNum <= maxPages) {
    const res: Response = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Account alerts resolved: ${res.status}`)
    const data = await res.json()
    const alerts = data.alerts ?? []
    count += alerts.length
    const pageDetails = data.pageDetails as Record<string, unknown> | undefined
    const nextPageStr = (pageDetails?.nextPageUrl ?? pageDetails?.nextPageURL ?? data.nextPageUrl) as string | null | undefined
    nextUrl = resolveNextPageUrl(base, nextPageStr ?? null)
    if (!nextUrl && alerts.length === ACCOUNT_ALERTS_PAGE_SIZE) {
      pageNum += 1
      nextUrl = `${base}${DATTO_RMM_ACCOUNT_ALERTS_RESOLVED_PATH}?max=${ACCOUNT_ALERTS_PAGE_SIZE}&page=${pageNum}`
    } else if (nextUrl) {
      pageNum += 1
    }
    if (nextUrl) await new Promise((r) => setTimeout(r, 60))
  }
  const capped = !!nextUrl && pageNum > maxPages
  return { count, capped }
}

/** Installierte Software – GET /v2/audit/device/{uid}/software. */
export async function getDattoRmmDeviceSoftware(
  apiUrl: string,
  accessToken: string,
  deviceUid: string
): Promise<{ software?: unknown[]; pageDetails?: { nextPageUrl?: string | null } }> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  const all: unknown[] = []
  let nextUrl: string | null = `${base}${DATTO_RMM_AUDIT_DEVICE_PATH}/${encodeURIComponent(deviceUid)}/software?max=100&page=1`
  while (nextUrl) {
    const res: Response = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Device software: ${res.status}`)
    const data = await res.json()
    const list = data.software ?? data.result ?? []
    for (const s of list) all.push(s)
    nextUrl = data.pageDetails?.nextPageUrl ? resolveNextPageUrl(base, data.pageDetails.nextPageUrl) : null
  }
  return { software: all }
}
