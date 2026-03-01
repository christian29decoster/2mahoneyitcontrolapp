import { NextRequest, NextResponse } from 'next/server'
import { getMergedIncidents } from '@/lib/incidents-merged'
import { getActorRole } from '@/lib/auth/session-from-cookie'
import { dataMduCategory } from '@/lib/marketplace-pricing'
import { MDU_TIERS } from '@/lib/mdu-pricing'

export const dynamic = 'force-dynamic'

/** GET /api/admin/billing – Abrechnungsbereich: gewertete Incidents (Resolved/Closed) + Event-Logs + Kostenreferenzen aus Marketplace. Nur Admin/SuperAdmin. */
export async function GET(req: NextRequest) {
  const role = getActorRole(req)
  if (role !== 'admin' && role !== 'superadmin') {
    return NextResponse.json({ error: 'Nur für Admin/SuperAdmin' }, { status: 403 })
  }

  const { items, integrations } = await getMergedIncidents({
    lastDays: 90,
    sessionTenantId: null,
    role,
  })

  const billingItems = items.filter((i) => i.status === 'Resolved' || i.status === 'Closed')

  const costRefs = {
    marketplaceLink: '/marketplace',
    mdu: {
      name: dataMduCategory.name,
      description: dataMduCategory.description,
      tiers: MDU_TIERS.map((t) => ({ label: t.label, perThousandUsd: t.perThousandUsd })),
    },
    socTiers: [
      { id: 'soc-core', name: 'Core Monitoring', price: '$85/user/mo' },
      { id: 'soc-advanced', name: 'Advanced SOC', price: '$135/user/mo' },
      { id: 'soc-enterprise', name: 'Enterprise Threat Operations', price: 'ab $45.000/mo' },
    ],
  }

  return NextResponse.json({
    items: billingItems,
    integrations,
    totalBillingIncidents: billingItems.length,
    costRefs,
  })
}
