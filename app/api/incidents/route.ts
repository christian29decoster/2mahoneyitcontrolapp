import { NextRequest, NextResponse } from 'next/server'
import { listIncidents, createIncident, getIncidentById } from '@/lib/data/incidents'
import type { IncidentCategory, IncidentPriority, IncidentStatus } from '@/lib/data/incidents'
import { fetchIncidentsFromAutotask, getAutotaskConfig } from '@/lib/autotask'
import { fetchIncidentsFromRmm, fetchIncidentsFromSophos } from '@/lib/incidents-sources'
import type { IncidentRecord } from '@/lib/data/incidents'

export const dynamic = 'force-dynamic'

/** GET /api/incidents – list; when Autotask PSA is configured, merges tickets from Autotask. Optional ?status=&category=&priority=&tenantId= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as IncidentStatus | null
  const category = searchParams.get('category') as IncidentCategory | null
  const priority = searchParams.get('priority') as IncidentPriority | null
  const tenantId = searchParams.get('tenantId') ?? undefined

  const local = listIncidents({
    ...(status && { status }),
    ...(category && { category }),
    ...(priority && { priority }),
    ...(tenantId && { tenantId }),
  })

  const byId = new Map<string, IncidentRecord>()
  local.forEach((i) => byId.set(i.id, i))

  const hasAutotask = getAutotaskConfig()
  const [fromAutotask, fromRmm, fromSophos] = await Promise.all([
    hasAutotask ? fetchIncidentsFromAutotask({ sinceDays: 90 }).catch((e) => (console.error('Autotask fetch failed:', e), [] as IncidentRecord[])) : Promise.resolve([]),
    fetchIncidentsFromRmm().catch((e) => (console.error('RMM incidents fetch failed:', e), [] as IncidentRecord[])),
    fetchIncidentsFromSophos().catch((e) => (console.error('Sophos incidents fetch failed:', e), [] as IncidentRecord[])),
  ])
  fromAutotask.forEach((i) => byId.set(i.id, i))
  fromRmm.forEach((i) => byId.set(i.id, i))
  fromSophos.forEach((i) => byId.set(i.id, i))

  let items = Array.from(byId.values()).sort(
    (a, b) => new Date(b.loggedAtISO).getTime() - new Date(a.loggedAtISO).getTime()
  )
  if (status) items = items.filter((i) => i.status === status)
  if (category) items = items.filter((i) => i.category === category)
  if (priority) items = items.filter((i) => i.priority === priority)
  if (tenantId != null) items = items.filter((i) => i.tenantId === tenantId)

  const source =
    items.some((i) => i.id.startsWith('autotask-')) || items.some((i) => i.id.startsWith('rmm-')) || items.some((i) => i.id.startsWith('sophos-'))
      ? 'mixed'
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
