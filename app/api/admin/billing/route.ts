import { NextRequest, NextResponse } from 'next/server'
import { getMergedIncidents } from '@/lib/incidents-merged'
import { getActorRole } from '@/lib/auth/session-from-cookie'
import { dataMduCategory } from '@/lib/marketplace-pricing'
import { MDU_TIERS } from '@/lib/mdu-pricing'
import { computeMduCost } from '@/lib/mdu-pricing'

export const dynamic = 'force-dynamic'

const SCHWELLWERT_EVENTS = 1_000_000

/** Monat gruppieren aus ISO-Datum (YYYY-MM). */
function getMonthKey(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/** GET /api/admin/billing – Abrechnungsbereich: gewertete Incidents (Resolved/Closed) + Event-Logs + monatliche Kumulation + Schwellwert. Nur Admin/SuperAdmin. */
export async function GET(req: NextRequest) {
  const role = getActorRole(req)
  if (role !== 'admin' && role !== 'superadmin') {
    return NextResponse.json({ error: 'Admin/SuperAdmin only' }, { status: 403 })
  }

  const { items, integrations } = await getMergedIncidents({
    lastDays: 90,
    sessionTenantId: null,
    role,
  })

  const billingItems = items.filter((i) => i.status === 'Resolved' || i.status === 'Closed')

  // Monatliche Kumulation: pro Monat Incidents-Anzahl, Events-Summe, Schwellwert, MDU-Kosten
  const byMonth = new Map<string, { incidentsCount: number; eventsCount: number }>()
  for (const inc of billingItems) {
    const key = getMonthKey(inc.loggedAtISO)
    const events = inc.eventLog?.length ?? 0
    const cur = byMonth.get(key) ?? { incidentsCount: 0, eventsCount: 0 }
    byMonth.set(key, {
      incidentsCount: cur.incidentsCount + 1,
      eventsCount: cur.eventsCount + events,
    })
  }
  const monthKeys = Array.from(byMonth.keys()).sort().reverse()
  const monthlyTotals = monthKeys.map((month) => {
    const { incidentsCount, eventsCount } = byMonth.get(month)!
    const mdu = computeMduCost(eventsCount)
    const [y, m] = month.split('-')
    const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
    return {
      month,
      label,
      incidentsCount,
      eventsCount,
      thresholdExceeded: eventsCount > SCHWELLWERT_EVENTS,
      thresholdEvents: SCHWELLWERT_EVENTS,
      mduCostUsd: mdu.costUsd,
      mduSummary: mdu.summary,
    }
  })

  const costRefs = {
    marketplaceLink: '/marketplace',
    schwellwertEvents: SCHWELLWERT_EVENTS,
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
    monthlyTotals,
    costRefs,
  })
}
