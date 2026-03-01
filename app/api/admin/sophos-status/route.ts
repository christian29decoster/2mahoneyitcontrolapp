import { NextRequest, NextResponse } from 'next/server'
import { getActorRole } from '@/lib/auth/session-from-cookie'
import { getSophosAccessToken, getSophosPartnerTenants, getSophosAlertsForTenant } from '@/lib/sophos-central'

export const dynamic = 'force-dynamic'

/** GET /api/admin/sophos-status – Diagnose: Werden Sophos-Tenants und Alerts geladen? Nur Admin/SuperAdmin. */
export async function GET(req: NextRequest) {
  const role = getActorRole(req)
  if (role !== 'admin' && role !== 'superadmin') {
    return NextResponse.json({ error: 'Nur für Admin/SuperAdmin' }, { status: 403 })
  }

  const usePartnerApi = process.env.SOPHOS_USE_PARTNER_API === 'true' || !!process.env.SOPHOS_PARTNER_ID
  const partnerId = process.env.SOPHOS_PARTNER_ID ?? process.env.SOPHOS_TENANT_ID
  const tenantId = process.env.SOPHOS_TENANT_ID
  const clientId = process.env.SOPHOS_CLIENT_ID
  const clientSecret = process.env.SOPHOS_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      ok: false,
      error: 'SOPHOS_CLIENT_ID oder SOPHOS_CLIENT_SECRET fehlt',
      hint: 'In Vercel Environment Variables setzen.',
    })
  }

  const idToUse = usePartnerApi ? partnerId : tenantId
  if (!idToUse) {
    return NextResponse.json({
      ok: false,
      error: usePartnerApi ? 'SOPHOS_PARTNER_ID oder SOPHOS_TENANT_ID fehlt (Partner-Modus)' : 'SOPHOS_TENANT_ID fehlt',
      hint: usePartnerApi ? 'Partner-ID aus Sophos-Profil (Settings) eintragen; SOPHOS_USE_PARTNER_API=true setzen.' : 'Tenant-UUID oder Partner-ID eintragen.',
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
          error: 'Keine Tenants gefunden',
          hint: 'X-Partner-ID wird an Partner-API gesendet. Prüfen Sie, ob die Partner-ID (aus Sophos-Profil) korrekt ist und der API-User Partner-Berechtigung hat. Ggf. SOPHOS_API_BASE für Region setzen (z. B. https://api-eu01.central.sophos.com).',
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
        hint: totalAlerts === 0 ? 'Alerts werden pro Tenant abgefragt. Wenn im Sophos-Dashboard Alerts sichtbar sind, prüfen Sie die Region (SOPHOS_API_BASE) und Berechtigung „Alerts“ Read-only.' : undefined,
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
      hint: result.alerts.length === 0 ? 'X-Tenant-ID wird gesendet. Bei Partner-Account: SOPHOS_USE_PARTNER_API=true setzen und SOPHOS_TENANT_ID = Partner-ID (aus Profil).' : undefined,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({
      ok: false,
      error: message,
      hint: 'Token (client_credentials) oder Alerts-API fehlgeschlagen. Berechtigung „Alerts“ Read-only für den API-User prüfen; bei Partner: X-Partner-ID und regionale API (SOPHOS_API_BASE) prüfen.',
    })
  }
}
