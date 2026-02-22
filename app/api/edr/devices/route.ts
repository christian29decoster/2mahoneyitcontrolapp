import { NextResponse } from 'next/server'
import { getSophosAccessToken, getSophosPartnerEndpointsTotal } from '@/lib/sophos-central'

export const dynamic = 'force-dynamic'

/**
 * GET /api/edr/devices
 * EDR-Geräte (Sophos Endpoints) – Partner: alle Tenants; sonst ein Tenant.
 * Gleiche Env: SOPHOS_CLIENT_ID, SOPHOS_CLIENT_SECRET, SOPHOS_TENANT_ID (Partner-ID oder Tenant-ID).
 */
export async function GET() {
  const clientId = process.env.SOPHOS_CLIENT_ID
  const clientSecret = process.env.SOPHOS_CLIENT_SECRET
  const tenantId = process.env.SOPHOS_TENANT_ID

  if (!clientId || !clientSecret || !tenantId) {
    return NextResponse.json({
      source: 'demo',
      devices: [],
      error: 'EDR/Sophos nicht konfiguriert (SOPHOS_CLIENT_ID, SOPHOS_CLIENT_SECRET, SOPHOS_TENANT_ID).',
    })
  }

  try {
    const token = await getSophosAccessToken(clientId, clientSecret)
    const devices = await getSophosPartnerEndpointsTotal(token, tenantId)
    return NextResponse.json({ source: 'edr', devices, error: null })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'EDR-Anfrage fehlgeschlagen'
    console.error('Sophos EDR devices error:', e)
    return NextResponse.json(
      { source: 'demo', devices: [], error: message },
      { status: 200 }
    )
  }
}
