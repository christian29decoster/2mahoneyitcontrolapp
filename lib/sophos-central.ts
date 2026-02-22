/**
 * Sophos Central API – OAuth und Alerts.
 * Docs: https://developer.sophos.com/
 * Token: id.sophos.com, API: api.central.sophos.com
 */

const SOPHOS_TOKEN_URL = 'https://id.sophos.com/api/v2/oauth2/token'
const SOPHOS_API_BASE = 'https://api.central.sophos.com'
const SOPHOS_ALERTS_PATH = '/common/v1/alerts'
const SOPHOS_ALERTS_PAGE_SIZE = 50
const SOPHOS_ALERTS_MAX_PAGES = 100

export interface SophosAlertsResult {
  count: number
  capped: boolean
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
 * Alerts für Tenant/Organization abrufen (paginiert, nur Zählung).
 * tenantId = Tenant-UUID oder Partner/Organization-UUID.
 * Bei Partnern: X-Organization-ID; sonst X-Tenant-ID.
 */
export async function getSophosAlertsCount(
  accessToken: string,
  tenantId: string,
  maxPages: number = SOPHOS_ALERTS_MAX_PAGES,
  useOrganizationHeader: boolean = true
): Promise<SophosAlertsResult> {
  let count = 0
  let page = 1
  const url = new URL(SOPHOS_ALERTS_PATH, SOPHOS_API_BASE)
  url.searchParams.set('pageSize', String(SOPHOS_ALERTS_PAGE_SIZE))
  const tenantHeader = useOrganizationHeader ? 'X-Organization-ID' : 'X-Tenant-ID'

  while (page <= maxPages) {
    url.searchParams.set('page', String(page))
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        [tenantHeader]: tenantId,
      },
      cache: 'no-store',
    })
    if (!res.ok) {
      if (res.status === 403 || res.status === 404) {
        return { count, capped: false }
      }
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
    await new Promise((r) => setTimeout(r, 80))
  }

  const capped = page > maxPages
  return { count, capped }
}
