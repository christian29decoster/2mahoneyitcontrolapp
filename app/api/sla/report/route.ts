import { NextRequest, NextResponse } from 'next/server'
import { listIncidents } from '@/lib/data/incidents'
import { getSlaComplianceReport } from '@/lib/sla'

export const dynamic = 'force-dynamic'

/** GET /api/sla/report – SLA compliance from incidents. Optional: ?since=ISO&until=ISO&tenantId= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const since = searchParams.get('since') ?? undefined
  const until = searchParams.get('until') ?? undefined
  const tenantId = searchParams.get('tenantId') ?? undefined

  const incidents = listIncidents(tenantId ? { tenantId } : undefined)
  const report = getSlaComplianceReport(incidents, {
    sinceISO: since,
    untilISO: until,
  })

  return NextResponse.json(report)
}
