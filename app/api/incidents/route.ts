import { NextRequest, NextResponse } from 'next/server'
import { listIncidents, createIncident, getIncidentById } from '@/lib/data/incidents'
import type { IncidentCategory, IncidentPriority, IncidentStatus } from '@/lib/data/incidents'
import { fetchIncidentsFromAutotask, getAutotaskConfig } from '@/lib/autotask'
import type { IncidentRecord } from '@/lib/data/incidents'

export const dynamic = 'force-dynamic'

/** GET /api/incidents – list; when Autotask PSA is configured, merges tickets from Autotask. Optional ?status=&category=&priority=&tenantId= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as IncidentStatus | null
  const category = searchParams.get('category') as IncidentCategory | null
  const priority = searchParams.get('priority') as IncidentPriority | null
  const tenantId = searchParams.get('tenantId') ?? undefined

  let items: IncidentRecord[]

  if (getAutotaskConfig()) {
    try {
      const fromAutotask = await fetchIncidentsFromAutotask({ sinceDays: 90 })
      const local = listIncidents({
        ...(status && { status }),
        ...(category && { category }),
        ...(priority && { priority }),
        ...(tenantId && { tenantId }),
      })
      const byId = new Map<string, IncidentRecord>()
      fromAutotask.forEach((i) => byId.set(i.id, i))
      local.forEach((i) => byId.set(i.id, i))
      items = Array.from(byId.values()).sort(
        (a, b) => new Date(b.loggedAtISO).getTime() - new Date(a.loggedAtISO).getTime()
      )
      if (status) items = items.filter((i) => i.status === status)
      if (category) items = items.filter((i) => i.category === category)
      if (priority) items = items.filter((i) => i.priority === priority)
      if (tenantId != null) items = items.filter((i) => i.tenantId === tenantId)
    } catch (e) {
      console.error('Autotask fetch failed, using local only:', e)
      items = listIncidents({
        ...(status && { status }),
        ...(category && { category }),
        ...(priority && { priority }),
        ...(tenantId && { tenantId }),
      })
    }
  } else {
    items = listIncidents({
      ...(status && { status }),
      ...(category && { category }),
      ...(priority && { priority }),
      ...(tenantId && { tenantId }),
    })
  }

  const source = getAutotaskConfig()
    ? (items.some((i) => i.id.startsWith('autotask-')) ? 'mixed' : 'autotask')
    : 'local'
  return NextResponse.json({ items, source })
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
