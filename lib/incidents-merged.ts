/**
 * Merged incidents from local store + Autotask + RMM + Sophos.
 * Used by GET /api/incidents and GET /api/admin/billing.
 */

import { listIncidents, getDemoIncidents } from '@/lib/data/incidents'
import type { IncidentCategory, IncidentPriority, IncidentStatus } from '@/lib/data/incidents'
import type { IncidentRecord } from '@/lib/data/incidents'
import { fetchIncidentsFromAutotask, getAutotaskConfig } from '@/lib/autotask'
import { fetchIncidentsFromRmm, fetchIncidentsFromSophos } from '@/lib/incidents-sources'
import { listTenants } from '@/lib/data/tenants'

export type Integrations = {
  autotask: { configured: boolean; count: number }
  rmm: { configured: boolean; count: number }
  sophos: { configured: boolean; count: number }
}

export interface GetMergedIncidentsOptions {
  lastDays?: number
  status?: IncidentStatus | null
  category?: IncidentCategory | null
  priority?: IncidentPriority | null
  queryTenantId?: string | null
  sessionTenantId?: string | null
  role?: string | null
}

export interface GetMergedIncidentsResult {
  items: IncidentRecord[]
  integrations: Integrations
}

export async function getMergedIncidents(opts: GetMergedIncidentsOptions = {}): Promise<GetMergedIncidentsResult> {
  const {
    lastDays = 30,
    status = null,
    category = null,
    priority = null,
    queryTenantId = undefined,
    sessionTenantId = null,
    role = null,
  } = opts

  if (queryTenantId && role === 'tenant_user' && queryTenantId !== sessionTenantId) {
    return {
      items: [],
      integrations: {
        autotask: { configured: false, count: 0 },
        rmm: { configured: false, count: 0 },
        sophos: { configured: false, count: 0 },
      },
    }
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

  const rmmConfigs: Array<{ apiUrl: string }> = []
  if (process.env.DATTO_RMM_API_URL) rmmConfigs.push({ apiUrl: process.env.DATTO_RMM_API_URL })
  for (const t of tenants) {
    if (t.connectors?.rmm?.apiUrl && !rmmConfigs.some((c) => c.apiUrl === t.connectors!.rmm!.apiUrl)) {
      rmmConfigs.push({ apiUrl: t.connectors.rmm.apiUrl })
    }
  }

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

  const useDemoData = fromRmm.length === 0 && fromAutotask.length === 0 && fromSophos.length === 0
  let items: IncidentRecord[]
  if (useDemoData) {
    items = getDemoIncidents({ lastDays }).sort(
      (a, b) => new Date(b.loggedAtISO).getTime() - new Date(a.loggedAtISO).getTime()
    )
  } else {
    items = Array.from(byId.values()).sort(
      (a, b) => new Date(b.loggedAtISO).getTime() - new Date(a.loggedAtISO).getTime()
    )
  }
  if (status) items = items.filter((i) => i.status === status)
  if (category) items = items.filter((i) => i.category === category)
  if (priority) items = items.filter((i) => i.priority === priority)
  if (queryTenantId != null) items = items.filter((i) => i.tenantId === queryTenantId)
  if (lastDays > 0 && !useDemoData) {
    const cutoff = Date.now() - lastDays * 24 * 60 * 60 * 1000
    items = items.filter((i) => new Date(i.loggedAtISO).getTime() >= cutoff)
  }

  const rmmConfigured = rmmConfigs.length > 0 && !!(process.env.DATTO_RMM_API_KEY && process.env.DATTO_RMM_API_SECRET)
  const sophosConfigured = sophosConfigs.length > 0 && !!(process.env.SOPHOS_CLIENT_ID && process.env.SOPHOS_CLIENT_SECRET)
  const integrations: Integrations = {
    autotask: { configured: !!hasAutotask, count: items.filter((i) => i.id.startsWith('autotask-')).length },
    rmm: { configured: rmmConfigured, count: items.filter((i) => i.id.startsWith('rmm-')).length },
    sophos: { configured: sophosConfigured, count: items.filter((i) => i.id.startsWith('sophos-')).length },
  }

  return { items, integrations }
}
