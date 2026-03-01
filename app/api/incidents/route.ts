import { NextRequest, NextResponse } from 'next/server'
import { createIncident, getIncidentById } from '@/lib/data/incidents'
import type { IncidentCategory, IncidentPriority } from '@/lib/data/incidents'
import { getMergedIncidents } from '@/lib/incidents-merged'
import { getActorRole, getActorTenantId } from '@/lib/auth/session-from-cookie'

export const dynamic = 'force-dynamic'

/** GET /api/incidents – list; merges local + Autotask + alle RMM + alle EDR (offen + gelöst). ?lastDays=30 (default) nur letzte 30 Tage, lastDays=0 = alle. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as import('@/lib/data/incidents').IncidentStatus | null
  const category = searchParams.get('category') as IncidentCategory | null
  const priority = searchParams.get('priority') as IncidentPriority | null
  const lastDaysParam = searchParams.get('lastDays')
  const lastDays = lastDaysParam === '0' || lastDaysParam === 'all' ? 0 : Math.max(0, parseInt(lastDaysParam ?? '30', 10) || 30)
  const queryTenantId = searchParams.get('tenantId') ?? undefined
  const sessionTenantId = getActorTenantId(req)
  const role = getActorRole(req)

  if (queryTenantId && role === 'tenant_user' && queryTenantId !== sessionTenantId) {
    return NextResponse.json(
      { items: [], source: 'local', integrations: { autotask: { configured: false, count: 0 }, rmm: { configured: false, count: 0 }, sophos: { configured: false, count: 0 } } },
      { status: 403 }
    )
  }

  const { items, integrations } = await getMergedIncidents({
    lastDays,
    status,
    category,
    priority,
    queryTenantId: queryTenantId ?? null,
    sessionTenantId,
    role,
  })

  const source =
    items.some((i) => i.id.startsWith('autotask-')) || items.some((i) => i.id.startsWith('rmm-')) || items.some((i) => i.id.startsWith('sophos-'))
      ? 'mixed'
      : 'local'

  return NextResponse.json({ items, source, integrations })
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
