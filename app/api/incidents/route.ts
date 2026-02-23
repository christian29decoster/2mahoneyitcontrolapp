import { NextRequest, NextResponse } from 'next/server'
import { listIncidents, createIncident, getIncidentById } from '@/lib/data/incidents'
import type { IncidentCategory, IncidentPriority, IncidentStatus } from '@/lib/data/incidents'

export const dynamic = 'force-dynamic'

/** GET /api/incidents – list with optional ?status=&category=&priority=&tenantId= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as IncidentStatus | null
  const category = searchParams.get('category') as IncidentCategory | null
  const priority = searchParams.get('priority') as IncidentPriority | null
  const tenantId = searchParams.get('tenantId') ?? undefined
  const items = listIncidents({
    ...(status && { status }),
    ...(category && { category }),
    ...(priority && { priority }),
    ...(tenantId && { tenantId }),
  })
  return NextResponse.json({ items })
}

/** POST /api/incidents – create new incident */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const id = body.id ?? undefined
  if (id && getIncidentById(id)) {
    return NextResponse.json({ error: 'Incident ID already exists.' }, { status: 400 })
  }
  const record = createIncident({
    id,
    title: body.title ?? 'Untitled incident',
    description: body.description ?? '',
    category: body.category ?? 'Other',
    priority: body.priority ?? 'P4',
    status: 'New',
    assignedTo: body.assignedTo,
    source: body.source ?? 'manual',
    sourceRef: body.sourceRef,
    tenantId: body.tenantId,
    timeline: body.timeline ?? [],
    extra: body.extra,
    dueByISO: body.dueByISO,
  })
  return NextResponse.json({ item: record })
}
