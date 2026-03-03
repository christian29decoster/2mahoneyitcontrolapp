/**
 * GET /api/mission-briefing/dashboard
 * Aggregated scores and metrics for Mission Control dashboard. Tenant-scoped.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getActorRole, getActorTenantId } from '@/lib/auth/session-from-cookie'
import { generateAutoSummary } from '@/lib/mission-briefing/aggregation'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const role = getActorRole(req)
  const sessionTenantId = getActorTenantId(req)
  const { searchParams } = new URL(req.url)
  const queryTenantId = searchParams.get('tenantId')

  const tenantId = queryTenantId ?? sessionTenantId
  if (!tenantId) {
    return NextResponse.json({ error: 'tenant_id_required' }, { status: 400 })
  }

  if (role === 'tenant_user' && queryTenantId && queryTenantId !== sessionTenantId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    const summary = await generateAutoSummary(tenantId)
    return NextResponse.json({
      tenantId,
      summary: {
        threatLandscapeScore: summary.threatLandscapeScore,
        infrastructureHealthScore: summary.infrastructureHealthScore,
        operationalLoadScore: summary.operationalLoadScore,
        complianceExposureScore: summary.complianceExposureScore,
        customerRiskIndex: summary.customerRiskIndex,
        perCustomer: summary.perCustomer,
        rawMetrics: summary.rawMetrics,
        generatedAtISO: summary.generatedAtISO,
      },
    })
  } catch (e) {
    console.error('mission-briefing dashboard:', e)
    return NextResponse.json({ error: 'aggregation_failed' }, { status: 500 })
  }
}
