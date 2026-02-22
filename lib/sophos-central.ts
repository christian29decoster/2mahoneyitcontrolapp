/**
 * Sophos Central API – OAuth, Partner Tenants, Alerts, SIEM Events.
 * Docs: https://developer.sophos.com/
 * Partner: X-Partner-ID → GET /partner/v1/tenants → pro Tenant apiHost + X-Tenant-ID für Alerts/Events.
 * SIEM Events: GET /siem/v1/events (cursor-Paginierung, from_date).
 */

const SOPHOS_TOKEN_URL = 'https://id.sophos.com/api/v2/oauth2/token'
const SOPHOS_API_BASE = 'https://api.central.sophos.com'
const SOPHOS_PARTNER_TENANTS_PATH = '/partner/v1/tenants'
const SOPHOS_ALERTS_PATH = '/common/v1/alerts'
const SOPHOS_SIEM_EVENTS_PATH = '/siem/v1/events'
const SOPHOS_ENDPOINTS_PATH = '/endpoint/v1/endpoints'
const SOPHOS_ALERTS_PAGE_SIZE = 50
const SOPHOS_ENDPOINTS_PAGE_SIZE = 100
const SOPHOS_ENDPOINTS_MAX_PAGES = 50
const SOPHOS_ALERTS_MAX_PAGES = 100
const SOPHOS_PARTNER_MAX_TENANTS = 50
const SOPHOS_ALERTS_PAGES_PER_TENANT = 20
const SOPHOS_EVENTS_PAGE_SIZE = 1000
const SOPHOS_EVENTS_MAX_PAGES = 50
const SOPHOS_EVENTS_MAX_PAGES_PER_TENANT = 20

export interface SophosAlertsResult {
  count: number
  capped: boolean
}

/** Einzelnes Event aus der SIEM API (Felder je nach Event-Typ). */
export type SophosSiemEvent = Record<string, unknown>

export interface SophosEventsResult {
  events: SophosSiemEvent[]
  totalFetched: number
  nextCursor: string | null
  hasMore: boolean
  capped: boolean
}

export interface SophosTenant {
  id: string
  name?: string
  apiHost?: string
}

/** EDR-Endpoint aus der Sophos Endpoint API (Auszug). */
export interface SophosEndpointItem {
  id?: string
  type?: string
  hostname?: string
  health?: { overall?: string }
  os?: { name?: string; platform?: string; majorVersion?: number }
  lastSeenAt?: string
  serialNumber?: string
  online?: boolean
  group?: { name?: string }
  associatedPerson?: { name?: string; viaLogin?: string }
}

/** App-Device-Format für EDR (wie RMM: type, name, serial, … + edrData). */
export interface EdrAppDevice {
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
  edrData?: {
    endpointId?: string
    tenantId?: string
    tenantName?: string
    health?: string
    online?: boolean
  }
}

/**
 * OAuth2 client_credentials Token für Sophos Central.
 */
export async function getSophosAccessToken(
  clientId: string,
  clientSecret: string
): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'token',
  })
  const res = await fetch(SOPHOS_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sophos token: ${res.status} ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  const token = data.access_token
  if (!token || typeof token !== 'string') throw new Error('Sophos token: no access_token in response')
  return token
}

/**
 * Partner: Tenants auflisten (X-Partner-ID).
 * Paginiert; gibt Tenant-IDs und apiHost zurück (pro Tenant kann apiHost regional sein).
 */
export async function getSophosPartnerTenants(
  accessToken: string,
  partnerId: string,
  maxTenants: number = SOPHOS_PARTNER_MAX_TENANTS
): Promise<SophosTenant[]> {
  const all: SophosTenant[] = []
  let page = 1
  const pageSize = 50

  while (all.length < maxTenants) {
    const url = new URL(SOPHOS_PARTNER_TENANTS_PATH, SOPHOS_API_BASE)
    url.searchParams.set('page', String(page))
    url.searchParams.set('pageSize', String(pageSize))
    if (page === 1) url.searchParams.set('pageTotal', 'true')

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Partner-ID': partnerId,
      },
      cache: 'no-store',
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Sophos tenants: ${res.status} ${text.slice(0, 200)}`)
    }
    const data = await res.json()
    const items = (data.items ?? []) as Array<{ id: string; name?: string; apiHost?: string }>
    for (const t of items) {
      if (t?.id) all.push({ id: t.id, name: t.name, apiHost: t.apiHost })
      if (all.length >= maxTenants) break
    }
    const pages = data.pages as { total?: number; size?: number } | undefined
    if (!items.length || items.length < pageSize || (pages?.total != null && page >= (pages.total ?? 0))) break
    page += 1
    await new Promise((r) => setTimeout(r, 60))
  }
  return all
}

/**
 * Alerts für einen Tenant abrufen (paginiert, nur Zählung).
 * apiBase = tenant.apiHost oder api.central.sophos.com; Header X-Tenant-ID.
 */
export async function getSophosAlertsCountForTenant(
  accessToken: string,
  tenantId: string,
  apiBase: string = SOPHOS_API_BASE,
  maxPages: number = SOPHOS_ALERTS_PAGES_PER_TENANT
): Promise<SophosAlertsResult> {
  let count = 0
  let page = 1
  const base = apiBase.replace(/\/+$/, '')
  const url = new URL(SOPHOS_ALERTS_PATH, base)
  url.searchParams.set('pageSize', String(SOPHOS_ALERTS_PAGE_SIZE))

  while (page <= maxPages) {
    url.searchParams.set('page', String(page))
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Tenant-ID': tenantId,
      },
      cache: 'no-store',
    })
    if (!res.ok) {
      if (res.status === 403 || res.status === 404) return { count, capped: false }
      const text = await res.text()
      throw new Error(`Sophos alerts: ${res.status} ${text.slice(0, 200)}`)
    }
    const data = await res.json()
    const items = data.items ?? data.alerts ?? []
    count += Array.isArray(items) ? items.length : 0
    const pages = data.pages as { total?: number; current?: number } | undefined
    const total = pages?.total ?? 0
    if (total > 0 && page >= total) break
    if (!Array.isArray(items) || items.length < SOPHOS_ALERTS_PAGE_SIZE) break
    page += 1
    await new Promise((r) => setTimeout(r, 50))
  }
  return { count, capped: page > maxPages }
}

/**
 * Alerts für einen einzelnen Tenant/Organization abrufen (z. B. ohne Partner-Flow).
 * Nutzt globalen API-Host und übergebene tenantId mit X-Tenant-ID.
 */
export async function getSophosAlertsCount(
  accessToken: string,
  tenantId: string,
  maxPages: number = SOPHOS_ALERTS_MAX_PAGES,
  usePartnerFlow: boolean = false
): Promise<SophosAlertsResult> {
  if (usePartnerFlow) {
    const tenants = await getSophosPartnerTenants(accessToken, tenantId, 1)
    if (tenants.length === 0) return { count: 0, capped: false }
    return getSophosAlertsCountForTenant(accessToken, tenants[0].id, tenants[0].apiHost, maxPages)
  }
  return getSophosAlertsCountForTenant(accessToken, tenantId, SOPHOS_API_BASE, maxPages)
}

/**
 * Partner: Alle Tenants durchgehen, Alerts pro Tenant summieren.
 * Entspricht der CSV „account_alerts“ (alle Mandanten).
 */
export async function getSophosPartnerAlertsTotal(
  accessToken: string,
  partnerId: string
): Promise<SophosAlertsResult> {
  const tenants = await getSophosPartnerTenants(accessToken, partnerId, SOPHOS_PARTNER_MAX_TENANTS)
  let total = 0
  let capped = false
  for (const tenant of tenants) {
    const apiHost = tenant.apiHost ?? SOPHOS_API_BASE
    const result = await getSophosAlertsCountForTenant(
      accessToken,
      tenant.id,
      apiHost,
      SOPHOS_ALERTS_PAGES_PER_TENANT
    )
    total += result.count
    if (result.capped) capped = true
    await new Promise((r) => setTimeout(r, 50))
  }
  return { count: total, capped }
}

/**
 * SIEM Events für einen Tenant abrufen (cursor-basiert).
 * Erster Aufruf: from_date (ISO 8601, z. B. letzte 30 Tage). Folgeseiten: cursor aus next_cursor.
 */
export async function getSophosEventsForTenant(
  accessToken: string,
  tenantId: string,
  apiBase: string = SOPHOS_API_BASE,
  options: {
    fromDate?: string
    cursor?: string
    pageSize?: number
    maxPages?: number
  } = {}
): Promise<SophosEventsResult> {
  const { fromDate, cursor, pageSize = SOPHOS_EVENTS_PAGE_SIZE, maxPages = SOPHOS_EVENTS_MAX_PAGES_PER_TENANT } = options
  const base = apiBase.replace(/\/+$/, '')
  const all: SophosSiemEvent[] = []
  let nextCursor: string | null = cursor ?? null
  let page = 0

  while (page < maxPages) {
    const url = new URL(SOPHOS_SIEM_EVENTS_PATH, base)
    url.searchParams.set('pageSize', String(pageSize))
    if (nextCursor) {
      url.searchParams.set('cursor', nextCursor)
    } else if (fromDate) {
      url.searchParams.set('from_date', fromDate)
    } else {
      const defaultFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      url.searchParams.set('from_date', defaultFrom)
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Tenant-ID': tenantId,
      },
      cache: 'no-store',
    })
    if (!res.ok) {
      if (res.status === 403 || res.status === 404) return { events: all, totalFetched: all.length, nextCursor: null, hasMore: false, capped: false }
      const text = await res.text()
      throw new Error(`Sophos SIEM events: ${res.status} ${text.slice(0, 200)}`)
    }
    const data = (await res.json()) as { items?: SophosSiemEvent[]; next_cursor?: string }
    const items = data.items ?? []
    for (const e of items) all.push(e)
    nextCursor = typeof data.next_cursor === 'string' && data.next_cursor ? data.next_cursor : null
    page += 1
    if (!nextCursor || items.length === 0) break
    await new Promise((r) => setTimeout(r, 80))
  }

  return {
    events: all,
    totalFetched: all.length,
    nextCursor,
    hasMore: !!nextCursor,
    capped: page >= maxPages,
  }
}

/**
 * Endpoints (EDR-Geräte) für einen Tenant abrufen – GET /endpoint/v1/endpoints.
 * apiBase = tenant.apiHost (regional, z. B. https://api-eu01.central.sophos.com).
 */
export async function getSophosEndpointsForTenant(
  accessToken: string,
  tenantId: string,
  tenantName: string | undefined,
  apiBase: string,
  maxPages: number = SOPHOS_ENDPOINTS_MAX_PAGES
): Promise<EdrAppDevice[]> {
  const base = apiBase.replace(/\/+$/, '')
  const all: EdrAppDevice[] = []
  let pageFromKey: string | undefined
  let page = 0

  while (page < maxPages) {
    const url = new URL(SOPHOS_ENDPOINTS_PATH, base)
    url.searchParams.set('pageSize', String(SOPHOS_ENDPOINTS_PAGE_SIZE))
    url.searchParams.set('view', 'summary')
    if (pageFromKey) url.searchParams.set('pageFromKey', pageFromKey)

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Tenant-ID': tenantId,
      },
      cache: 'no-store',
    })
    if (!res.ok) {
      if (res.status === 403 || res.status === 404) return all
      const text = await res.text()
      throw new Error(`Sophos endpoints: ${res.status} ${text.slice(0, 200)}`)
    }
    const data = (await res.json()) as { items?: SophosEndpointItem[]; pages?: { nextKey?: string } }
    const items = data.items ?? []
    for (const ep of items) {
      const health = ep.health?.overall ?? 'unknown'
      const online = ep.online === true
      all.push({
        type: (ep.type === 'server' ? 'Server' : ep.type === 'computer' ? 'PC' : 'PC') as string,
        name: ep.hostname ?? ep.id ?? 'Unknown',
        serial: ep.serialNumber ?? ep.id ?? '',
        os: ep.os?.name ?? '–',
        version: ep.os?.majorVersion != null ? String(ep.os.majorVersion) : '–',
        location: ep.group?.name ?? tenantName ?? 'EDR',
        room: ep.associatedPerson?.name ?? '–',
        lastLogin: ep.lastSeenAt ? new Date(ep.lastSeenAt).toLocaleString() : '–',
        status: online ? 'Online' : health === 'bad' ? 'Offline' : health === 'good' ? 'Online' : 'Offline',
        uid: ep.id,
        edrData: {
          endpointId: ep.id,
          tenantId,
          tenantName,
          health,
          online,
        },
      })
    }
    const nextKey = data.pages?.nextKey
    if (!nextKey || items.length === 0) break
    pageFromKey = nextKey
    page += 1
    await new Promise((r) => setTimeout(r, 60))
  }
  return all
}

/**
 * Partner: Alle Tenants durchgehen, EDR-Endpoints sammeln.
 */
export async function getSophosPartnerEndpointsTotal(
  accessToken: string,
  partnerId: string
): Promise<EdrAppDevice[]> {
  const tenants = await getSophosPartnerTenants(accessToken, partnerId, SOPHOS_PARTNER_MAX_TENANTS)
  const all: EdrAppDevice[] = []
  for (const tenant of tenants) {
    const apiHost = tenant.apiHost ?? SOPHOS_API_BASE
    const list = await getSophosEndpointsForTenant(
      accessToken,
      tenant.id,
      tenant.name,
      apiHost,
      SOPHOS_ENDPOINTS_MAX_PAGES
    )
    all.push(...list)
    await new Promise((r) => setTimeout(r, 50))
  }
  return all
}

/**
 * Partner: Alle Tenants durchgehen, SIEM-Events pro Tenant sammeln (bis maxPages pro Tenant).
 * fromDate: optional, ISO 8601 (z. B. Anfang des Monats für MDU-Schätzung).
 */
export async function getSophosPartnerEventsTotal(
  accessToken: string,
  partnerId: string,
  options: { fromDate?: string; maxPagesPerTenant?: number; maxTotalEvents?: number } = {}
): Promise<{ events: SophosSiemEvent[]; totalFetched: number; tenantCount: number; capped: boolean }> {
  const { fromDate, maxPagesPerTenant = SOPHOS_EVENTS_MAX_PAGES_PER_TENANT, maxTotalEvents = 50_000 } = options
  const tenants = await getSophosPartnerTenants(accessToken, partnerId, SOPHOS_PARTNER_MAX_TENANTS)
  const all: SophosSiemEvent[] = []
  let capped = false

  for (const tenant of tenants) {
    if (all.length >= maxTotalEvents) {
      capped = true
      break
    }
    const apiHost = tenant.apiHost ?? SOPHOS_API_BASE
    const result = await getSophosEventsForTenant(accessToken, tenant.id, apiHost, {
      fromDate,
      pageSize: SOPHOS_EVENTS_PAGE_SIZE,
      maxPages: maxPagesPerTenant,
    })
    for (const e of result.events) {
      all.push(e)
      if (all.length >= maxTotalEvents) {
        capped = true
        break
      }
    }
    if (result.capped) capped = true
    await new Promise((r) => setTimeout(r, 60))
  }

  return {
    events: all,
    totalFetched: all.length,
    tenantCount: tenants.length,
    capped,
  }
}
