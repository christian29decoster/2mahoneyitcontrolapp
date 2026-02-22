/**
 * Sophos Central API – OAuth, Partner Tenants, Alerts.
 * Docs: https://developer.sophos.com/
 * Partner: X-Partner-ID → GET /partner/v1/tenants → pro Tenant apiHost + X-Tenant-ID für Alerts.
 */

const SOPHOS_TOKEN_URL = 'https://id.sophos.com/api/v2/oauth2/token'
const SOPHOS_API_BASE = 'https://api.central.sophos.com'
const SOPHOS_PARTNER_TENANTS_PATH = '/partner/v1/tenants'
const SOPHOS_ALERTS_PATH = '/common/v1/alerts'
const SOPHOS_ALERTS_PAGE_SIZE = 50
const SOPHOS_ALERTS_MAX_PAGES = 100
const SOPHOS_PARTNER_MAX_TENANTS = 50
const SOPHOS_ALERTS_PAGES_PER_TENANT = 20

export interface SophosAlertsResult {
  count: number
  capped: boolean
}

export interface SophosTenant {
  id: string
  name?: string
  apiHost?: string
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
