import { NextRequest, NextResponse } from 'next/server'
import { getActorRole, canManageTenants } from '@/lib/auth/session-from-cookie'
import { queryAutotaskCompanies } from '@/lib/autotask'
import { createTenant, getTenantByAutotaskCompanyId, getTenantById } from '@/lib/data/tenants'
import type { Tenant } from '@/lib/auth/roles'

export const dynamic = 'force-dynamic'

/**
 * POST /api/tenants/import-autotask
 * Autotask-Companies als Tenants importieren (nur neue; bestehende Verknüpfung wird übersprungen).
 * Body: { companyIds?: number[] } – optional, sonst werden alle von Autotask geholten Companies verwendet.
 */
export async function POST(req: NextRequest) {
  const role = getActorRole(req)
  if (!canManageTenants(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let companies: { id: number; companyName?: string }[] = []
  try {
    const body = await req.json().catch(() => ({}))
    if (Array.isArray(body.companyIds) && body.companyIds.length > 0) {
      const fromApi = await queryAutotaskCompanies({ maxRecords: 200, activeOnly: false })
      const idSet = new Set(body.companyIds as number[])
      companies = fromApi.filter((c) => idSet.has(c.id))
    } else {
      companies = await queryAutotaskCompanies({ maxRecords: 200, activeOnly: true })
      if (companies.length === 0) companies = await queryAutotaskCompanies({ maxRecords: 200, activeOnly: false })
    }
  } catch (e) {
    console.error('Import Autotask companies:', e)
    return NextResponse.json({ error: 'Autotask-Anfrage fehlgeschlagen', imported: 0, skipped: 0, items: [] }, { status: 502 })
  }

  const created: Tenant[] = []
  let skipped = 0
  for (const c of companies) {
    const id = `autotask-${c.id}`
    if (getTenantByAutotaskCompanyId(c.id) || getTenantById(id)) {
      skipped += 1
      continue
    }
    const name = ((c as { companyName?: string; CompanyName?: string }).companyName ?? (c as { CompanyName?: string }).CompanyName ?? `Company ${c.id}`).trim() || `Company ${c.id}`
    const tenant = createTenant({
      id,
      name,
      connectors: { autotask: { companyId: String(c.id) } },
      active: true,
    })
    created.push(tenant)
  }

  return NextResponse.json({ imported: created.length, skipped, items: created })
}
