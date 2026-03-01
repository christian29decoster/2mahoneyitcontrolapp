import { NextRequest, NextResponse } from 'next/server'
import { getActorRole } from '@/lib/auth/session-from-cookie'
import { getSophosAccessToken, getSophosPartnerTenants, getSophosAlertsForTenant } from '@/lib/sophos-central'

export const dynamic = 'force-dynamic'

/** GET /api/admin/sophos-status – Diagnose: Werden Sophos-Tenants und Alerts geladen? Nur Admin/SuperAdmin. */
export async function GET(req: NextRequest) {
  const role = getActorRole(req)
  if (role !== 'admin' && role !== 'superadmin') {
    return NextResponse.json({ error: 'Admin/SuperAdmin only' }, { status: 403 })
  }

  const usePartnerApi = process.env.SOPHOS_USE_PARTNER_API === 'true' || !!process.env.SOPHOS_PARTNER_ID
  const partnerId = process.env.SOPHOS_PARTNER_ID ?? process.env.SOPHOS_TENANT_ID
  const tenantId = process.env.SOPHOS_TENANT_ID
  const clientId = process.env.SOPHOS_CLIENT_ID
  const clientSecret = process.env.SOPHOS_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      ok: false,
      error: 'SOPHOS_CLIENT_ID or SOPHOS_CLIENT_SECRET missing',
      hint: 'Set in Vercel Environment Variables.',
    })
  }

  const idToUse = usePartnerApi ? partnerId : tenantId
  if (!idToUse) {
    return NextResponse.json({
      ok: false,
      error: usePartnerApi ? 'SOPHOS_PARTNER_ID or SOPHOS_TENANT_ID missing (partner mode)' : 'SOPHOS_TENANT_ID missing',
      hint: usePartnerApi ? 'Enter Partner ID from Sophos profile (Settings); set SOPHOS_USE_PARTNER_API=true.' : 'Enter tenant UUID or Partner ID.',
    })
  }

  try {
    const token = await getSophosAccessToken(clientId, clientSecret)
    const sampleIds: string[] = []

    if (usePartnerApi) {
      const tenants = await getSophosPartnerTenants(token, idToUse, 20)
      if (tenants.length === 0) {
        return NextResponse.json({
          ok: false,
          mode: 'partner',
          tenantsCount: 0,
          alertsCount: 0,
          error: 'No tenants found',
          hint: 'X-Partner-ID is sent to Partner API. Check that Partner ID (from Sophos profile) is correct and the API user has partner permission. Optionally set SOPHOS_API_BASE for region (e.g. https://api-eu01.central.sophos.com).',
        })
      }
      let totalAlerts = 0
      for (const tenant of tenants.slice(0, 5)) {
        const apiHost = tenant.apiHost ?? process.env.SOPHOS_API_BASE ?? 'https://api.central.sophos.com'
        const result = await getSophosAlertsForTenant(token, tenant.id, apiHost, { maxAlerts: 50, maxPages: 3 })
        totalAlerts += result.alerts.length
        for (const a of result.alerts.slice(0, 2)) {
          const aid = (a as { id?: string }).id ?? (a as { alertId?: string }).alertId ?? (a as { uuid?: string }).uuid
          if (aid) sampleIds.push(String(aid))
        }
        await new Promise((r) => setTimeout(r, 80))
      }
      return NextResponse.json({
        ok: true,
        mode: 'partner',
        tenantsCount: tenants.length,
        alertsCount: totalAlerts,
        sampleAlertIds: sampleIds.slice(0, 10),
        hint: totalAlerts === 0 ? 'Alerts are queried per tenant. If alerts are visible in Sophos dashboard, check region (SOPHOS_API_BASE) and "Alerts" read-only permission.' : undefined,
      })
    }

    const apiBase = process.env.SOPHOS_API_BASE || 'https://api.central.sophos.com'
    const result = await getSophosAlertsForTenant(token, idToUse, apiBase, { maxAlerts: 100, maxPages: 5 })
    for (const a of result.alerts.slice(0, 5)) {
      const aid = (a as { id?: string }).id ?? (a as { alertId?: string }).alertId ?? (a as { uuid?: string }).uuid
      if (aid) sampleIds.push(String(aid))
    }
    return NextResponse.json({
      ok: true,
      mode: 'tenant',
      tenantsCount: 1,
      alertsCount: result.alerts.length,
      sampleAlertIds: sampleIds,
      hint: result.alerts.length === 0 ? 'X-Tenant-ID is sent. For partner account: set SOPHOS_USE_PARTNER_API=true and SOPHOS_TENANT_ID = Partner ID (from profile).' : undefined,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({
      ok: false,
      error: message,
      hint: 'Token (client_credentials) or Alerts API failed. Check "Alerts" read-only permission for API user; for partner: check X-Partner-ID and regional API (SOPHOS_API_BASE).',
    })
  }
}
