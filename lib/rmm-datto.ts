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
  pageDetails?: { nextPageUrl?: string | null; count?: number; totalCount?: number }
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

export async function getDattoRmmAccessToken(apiUrl: string, apiKey: string, apiSecret: string): Promise<string> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  const url = `${base}${DATTO_RMM_TOKEN_PATH}`
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: apiKey,
    client_secret: apiSecret,
  })
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const fallback = new URLSearchParams({
      grant_type: 'password',
      username: apiKey,
      password: apiSecret,
      client_id: 'public-client',
      client_secret: 'public',
    })
    const res2 = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: fallback.toString(),
    })
    if (!res2.ok) {
      const err = await res2.text()
      throw new Error(`Datto RMM token failed: ${res2.status} ${err}`)
    }
    const data = await res2.json()
    return data.access_token
  }
  const data = await res.json()
  return data.access_token
}

export async function getDattoRmmDevices(
  apiUrl: string,
  accessToken: string
): Promise<AppDevice[]> {
  const base = apiUrl.replace(/\/api\/?$/, '')
  const all: AppDevice[] = []
  let nextUrl: string | null = `${base}${DATTO_RMM_DEVICES_PATH}?max=${MAX_PAGE_SIZE}&page=1`

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) throw new Error(`Datto RMM devices: ${res.status}`)
    const data: DattoDevicesPage = await res.json()
    const devices = data.devices || []
    for (const d of devices) {
      all.push(mapDattoDeviceToApp(d))
    }
    nextUrl = data.pageDetails?.nextPageUrl ?? null
  }

  return all
}
