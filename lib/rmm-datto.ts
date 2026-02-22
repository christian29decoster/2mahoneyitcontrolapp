/**
 * Datto RMM API v2 – OAuth and device list.
 * Docs: Setup > Global Settings > Access Control > Enable API Access;
 *       Setup > Users > Generate API Keys.
 * Base URL per platform: e.g. https://pinotage-api.centrastage.net (no /api suffix for auth).
 */

const DATTO_RMM_TOKEN_PATH = '/auth/oauth/token'
const DATTO_RMM_DEVICES_PATH = '/api/v2/account/devices'
const MAX_PAGE_SIZE = 250

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
  }
  devices?: DattoRmmDevice[]
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
  if (nextPageUrl.startsWith('http://') || nextPageUrl.startsWith('https://')) return nextPageUrl
  const baseClean = base.replace(/\/+$/, '')
  const path = nextPageUrl.startsWith('/') ? nextPageUrl : `/${nextPageUrl}`
  try {
    const u = new URL(baseClean)
    return `${u.origin}${path}`
  } catch {
    return `${baseClean}${path}`
  }
}

export async function getDattoRmmDevices(
  apiUrl: string,
  accessToken: string
): Promise<AppDevice[]> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  const all: AppDevice[] = []
  let nextUrl: string | null = `${base}${DATTO_RMM_DEVICES_PATH}?max=${MAX_PAGE_SIZE}&page=1`
  let pageNum = 1
  const maxPages = 100

  while (nextUrl && pageNum <= maxPages) {
    const res = await fetch(nextUrl, {
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
      if (d && typeof d === 'object' && d.uid) all.push(mapDattoDeviceToApp(d))
    }

    const pageDetails = data.pageDetails
    const nextPageUrlRaw =
      pageDetails?.nextPageUrl ??
      pageDetails?.nextPageURL ??
      (raw as Record<string, unknown>).nextPageUrl ??
      (raw as Record<string, unknown>).nextPageURL
    nextUrl = resolveNextPageUrl(base, typeof nextPageUrlRaw === 'string' ? nextPageUrlRaw : null)

    if (!nextUrl) {
      const count = devices.length
      // Keine nextPageUrl: trotzdem nächste Seite versuchen, wenn diese Seite Geräte hatte (Stopp, wenn nächste Seite 0 liefert)
      if (count > 0) {
        pageNum += 1
        nextUrl = `${base}${DATTO_RMM_DEVICES_PATH}?max=${MAX_PAGE_SIZE}&page=${pageNum}`
      }
    } else {
      pageNum += 1
    }
  }

  return all
}

const DATTO_RMM_DEVICE_PATH = '/api/v2/device'
const DATTO_RMM_AUDIT_DEVICE_PATH = '/api/v2/audit/device'
const DATTO_RMM_ALERTS_OPEN_PATH = '/api/v2/device'

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
