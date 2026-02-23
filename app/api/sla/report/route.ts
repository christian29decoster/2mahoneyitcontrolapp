import { NextRequest, NextResponse } from 'next/server'
import { listIncidents } from '@/lib/data/incidents'
import { getSlaComplianceReport } from '@/lib/sla'
import { fetchIncidentsFromAutotask, getAutotaskConfig } from '@/lib/autotask'

export const dynamic = 'force-dynamic'

/** GET /api/sla/report – SLA compliance from incidents (incl. Autotask PSA when configured). Optional: ?since=ISO&until=ISO&tenantId= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const since = searchParams.get('since') ?? undefined
  const until = searchParams.get('until') ?? undefined
  const tenantId = searchParams.get('tenantId') ?? undefined

  let incidents = listIncidents(tenantId ? { tenantId } : undefined)

  if (getAutotaskConfig()) {
    try {
      const fromAutotask = await fetchIncidentsFromAutotask({ sinceDays: 90 })
      const byId = new Map(fromAutotask.map((i) => [i.id, i]))
      incidents.forEach((i) => byId.set(i.id, i))
      incidents = Array.from(byId.values())
      if (tenantId != null) incidents = incidents.filter((i) => i.tenantId === tenantId)
    } catch (e) {
      console.error('Autotask fetch failed for SLA report:', e)
    }
  }

  const report = getSlaComplianceReport(incidents, {
    sinceISO: since,
    untilISO: until,
  })

  return NextResponse.json(report)
}
