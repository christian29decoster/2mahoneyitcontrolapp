import { NextRequest, NextResponse } from 'next/server'
import { listIncidents, createIncident, getIncidentById } from '@/lib/data/incidents'
import type { IncidentCategory, IncidentPriority, IncidentStatus } from '@/lib/data/incidents'
import { fetchIncidentsFromAutotask, getAutotaskConfig } from '@/lib/autotask'
import { fetchIncidentsFromRmm, fetchIncidentsFromSophos } from '@/lib/incidents-sources'
import type { IncidentRecord } from '@/lib/data/incidents'
import { listTenants } from '@/lib/data/tenants'
import { getActorRole, getActorTenantId } from '@/lib/auth/session-from-cookie'

export const dynamic = 'force-dynamic'

/** GET /api/incidents – list; merges local + Autotask + alle RMM + alle EDR (global + alle Tenant-Konnektoren). Optional ?tenantId= filtert Anzeige. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as IncidentStatus | null
  const category = searchParams.get('category') as IncidentCategory | null
  const priority = searchParams.get('priority') as IncidentPriority | null
  const queryTenantId = searchParams.get('tenantId') ?? undefined
  const sessionTenantId = getActorTenantId(req)
  const role = getActorRole(req)
  if (queryTenantId && role === 'tenant_user' && queryTenantId !== sessionTenantId) {
    return NextResponse.json({ items: [], source: 'local', integrations: { autotask: { configured: false, count: 0 }, rmm: { configured: false, count: 0 }, sophos: { configured: false, count: 0 } } }, { status: 403 })
  }

  const local = listIncidents({
    ...(status && { status }),
    ...(category && { category }),
    ...(priority && { priority }),
    ...(queryTenantId && { tenantId: queryTenantId }),
  })

  const byId = new Map<string, IncidentRecord>()
  local.forEach((i) => byId.set(i.id, i))

  const hasAutotask = getAutotaskConfig()
  const tenants = listTenants()

  // RMM: global Env + jeder Tenant mit RMM-Konnektor
  const rmmConfigs: Array<{ apiUrl: string }> = []
  if (process.env.DATTO_RMM_API_URL) rmmConfigs.push({ apiUrl: process.env.DATTO_RMM_API_URL })
  for (const t of tenants) {
    if (t.connectors?.rmm?.apiUrl && !rmmConfigs.some((c) => c.apiUrl === t.connectors!.rmm!.apiUrl)) {
      rmmConfigs.push({ apiUrl: t.connectors.rmm.apiUrl })
    }
  }

  // Sophos: global Env + jeder Tenant mit Sophos-Konnektor
  const sophosConfigs: Array<{ tenantOrPartnerId: string }> = []
  if (process.env.SOPHOS_TENANT_ID) sophosConfigs.push({ tenantOrPartnerId: process.env.SOPHOS_TENANT_ID })
  for (const t of tenants) {
    const id = t.connectors?.sophos?.tenantId ?? t.connectors?.sophos?.partnerId
    if (id && !sophosConfigs.some((c) => c.tenantOrPartnerId === id)) {
      sophosConfigs.push({ tenantOrPartnerId: id })
    }
  }

  const fromAutotask = hasAutotask
    ? await fetchIncidentsFromAutotask({ sinceDays: 90 }).catch((e) => (console.error('Autotask fetch failed:', e), [] as IncidentRecord[]))
    : []

  const fromRmmArrays = await Promise.all(
    rmmConfigs.map((cfg) => fetchIncidentsFromRmm(cfg).catch((e) => (console.error('RMM incidents fetch failed:', e), [] as IncidentRecord[])))
  )
  const fromRmm = fromRmmArrays.flat()

  const fromSophosArrays = await Promise.all(
    sophosConfigs.map((cfg) => fetchIncidentsFromSophos(cfg).catch((e) => (console.error('Sophos incidents fetch failed:', e), [] as IncidentRecord[])))
  )
  const fromSophos = fromSophosArrays.flat()

  fromAutotask.forEach((i) => byId.set(i.id, i))
  fromRmm.forEach((i) => byId.set(i.id, i))
  fromSophos.forEach((i) => byId.set(i.id, i))

  let items = Array.from(byId.values()).sort(
    (a, b) => new Date(b.loggedAtISO).getTime() - new Date(a.loggedAtISO).getTime()
  )
  if (status) items = items.filter((i) => i.status === status)
  if (category) items = items.filter((i) => i.category === category)
  if (priority) items = items.filter((i) => i.priority === priority)
  if (queryTenantId != null) items = items.filter((i) => i.tenantId === queryTenantId)

  const source =
    items.some((i) => i.id.startsWith('autotask-')) || items.some((i) => i.id.startsWith('rmm-')) || items.some((i) => i.id.startsWith('sophos-'))
      ? 'mixed'
      : 'local'

  const rmmConfigured = rmmConfigs.length > 0 && !!(process.env.DATTO_RMM_API_KEY && process.env.DATTO_RMM_API_SECRET)
  const sophosConfigured = sophosConfigs.length > 0 && !!(process.env.SOPHOS_CLIENT_ID && process.env.SOPHOS_CLIENT_SECRET)
  const integrations = {
    autotask: { configured: !!hasAutotask, count: items.filter((i) => i.id.startsWith('autotask-')).length },
    rmm: { configured: rmmConfigured, count: items.filter((i) => i.id.startsWith('rmm-')).length },
    sophos: { configured: sophosConfigured, count: items.filter((i) => i.id.startsWith('sophos-')).length },
  }

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
