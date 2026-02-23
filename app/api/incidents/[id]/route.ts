import { NextRequest, NextResponse } from 'next/server'
import { getIncidentById, updateIncident } from '@/lib/data/incidents'

export const dynamic = 'force-dynamic'

/** GET /api/incidents/[id] */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const incident = getIncidentById(params.id)
  if (!incident) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ item: incident })
}

/** PATCH /api/incidents/[id] – status transition, assign, times, timeline append */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const incident = getIncidentById(params.id)
  if (!incident) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const body = await req.json()
  const updated = updateIncident(params.id, {
    status: body.status,
    assignedTo: body.assignedTo,
    respondedAtISO: body.respondedAtISO,
    resolvedAtISO: body.resolvedAtISO,
    closedAtISO: body.closedAtISO,
    dueByISO: body.dueByISO,
    title: body.title,
    description: body.description,
    category: body.category,
    priority: body.priority,
    timelineAppend: body.timelineAppend,
  })
  if (!updated) {
    return NextResponse.json({ error: 'Invalid status transition or update.' }, { status: 400 })
  }
  return NextResponse.json({ item: updated })
}
