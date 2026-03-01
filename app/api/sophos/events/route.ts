import { NextResponse } from 'next/server'
import { getSophosAccessToken, getSophosPartnerEventsTotal } from '@/lib/sophos-central'

export const dynamic = 'force-dynamic'

/**
 * GET /api/sophos/events
 * Holt SIEM-Events aus der Sophos Central API (alle Tenants im Partner-Flow).
 * Query: from_date (ISO 8601, optional), limit (max. Events, default 10000), count_only (1 = nur Zählung).
 */
export async function GET(request: Request) {
  const clientId = process.env.SOPHOS_CLIENT_ID
  const clientSecret = process.env.SOPHOS_CLIENT_SECRET
  const tenantId = process.env.SOPHOS_TENANT_ID

  if (!clientId || !clientSecret || !tenantId) {
    return NextResponse.json(
      { error: 'Sophos not configured (SOPHOS_CLIENT_ID, SOPHOS_CLIENT_SECRET, SOPHOS_TENANT_ID).' },
      { status: 400 }
    )
  }

  const { searchParams } = new URL(request.url)
  const fromDate = searchParams.get('from_date') || undefined
  const limit = Math.min(Number(searchParams.get('limit')) || 10_000, 50_000)
  const countOnly = searchParams.get('count_only') === '1'

  try {
    const token = await getSophosAccessToken(clientId, clientSecret)
    const result = await getSophosPartnerEventsTotal(token, tenantId, {
      fromDate,
      maxPagesPerTenant: 20,
      maxTotalEvents: limit,
    })

    if (countOnly) {
      return NextResponse.json({
        totalFetched: result.totalFetched,
        tenantCount: result.tenantCount,
        capped: result.capped,
      })
    }

    return NextResponse.json({
      events: result.events,
      totalFetched: result.totalFetched,
      tenantCount: result.tenantCount,
      capped: result.capped,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Sophos SIEM events failed'
    console.error('Sophos events error:', e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
