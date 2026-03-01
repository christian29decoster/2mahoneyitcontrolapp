import { NextRequest, NextResponse } from 'next/server'
import { getSophosAccessToken, getSophosPartnerEndpointsTotal } from '@/lib/sophos-central'
import { getTenantById } from '@/lib/data/tenants'
import { getActorRole, getActorTenantId } from '@/lib/auth/session-from-cookie'

export const dynamic = 'force-dynamic'

/**
 * GET /api/edr/devices
 * EDR-Geräte (Sophos Endpoints). Optional ?tenantId= – dann Sophos-Konnektor des Tenants (sonst Env).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const queryTenantId = searchParams.get('tenantId')
  const role = getActorRole(req)
  const sessionTenantId = getActorTenantId(req)

  const tenantId = queryTenantId ?? sessionTenantId ?? process.env.SOPHOS_TENANT_ID
  let sophosTenantOrPartnerId = process.env.SOPHOS_TENANT_ID
  if (queryTenantId || sessionTenantId) {
    const tenant = getTenantById(queryTenantId ?? sessionTenantId ?? '')
    if (tenant?.connectors?.sophos?.tenantId) sophosTenantOrPartnerId = tenant.connectors.sophos.tenantId
    else if (tenant?.connectors?.sophos?.partnerId) sophosTenantOrPartnerId = tenant.connectors.sophos.partnerId
  }

  const clientId = process.env.SOPHOS_CLIENT_ID
  const clientSecret = process.env.SOPHOS_CLIENT_SECRET

  if (!clientId || !clientSecret || !sophosTenantOrPartnerId) {
    return NextResponse.json({
      source: 'demo',
      devices: [],
      error: 'EDR/Sophos not configured (SOPHOS_CLIENT_ID, SOPHOS_CLIENT_SECRET, SOPHOS_TENANT_ID or tenant connector).',
    })
  }

  if (queryTenantId && role === 'tenant_user' && queryTenantId !== sessionTenantId) {
    return NextResponse.json({ source: 'demo', devices: [], error: 'forbidden' }, { status: 403 })
  }

  try {
    const token = await getSophosAccessToken(clientId, clientSecret)
    const devices = await getSophosPartnerEndpointsTotal(token, sophosTenantOrPartnerId)
    return NextResponse.json({ source: 'edr', devices, error: null, tenantId: queryTenantId ?? sessionTenantId ?? undefined })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'EDR request failed'
    console.error('Sophos EDR devices error:', e)
    return NextResponse.json(
      { source: 'demo', devices: [], error: message },
      { status: 200 }
    )
  }
}
