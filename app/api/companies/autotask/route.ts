import { NextRequest, NextResponse } from 'next/server'
import { getAutotaskConfig, queryAutotaskCompanies } from '@/lib/autotask'
import { getActorRole, canManageTenants } from '@/lib/auth/session-from-cookie'

export const dynamic = 'force-dynamic'

/**
 * GET /api/companies/autotask
 * Liste der Unternehmen aus Autotask PSA (für Mapping zu Tenants).
 * Nur für SuperAdmin, Admin, Partner.
 */
export async function GET(req: NextRequest) {
  const role = getActorRole(req)
  if (!canManageTenants(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  if (!getAutotaskConfig()) {
    return NextResponse.json(
      { source: 'autotask', items: [], error: 'Autotask nicht konfiguriert (AUTOTASK_BASE_URL, USERNAME, SECRET, INTEGRATION_CODE in Vercel prüfen).' },
      { status: 503 }
    )
  }

  const companies = await queryAutotaskCompanies({ maxRecords: 200, activeOnly: true })
  return NextResponse.json({ source: 'autotask', items: companies })
}
