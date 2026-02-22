/**
 * Mahoney Data Units (MDU) – Layer 3 Data Processing pricing.
 * Wirtschaftlichere Stufe: 1M inklusive, dann gestaffelt.
 *
 * Basis für die Abrechnung ist ausschließlich das Event-Volumen (z. B. aus
 * Schätzung oder später aus echter Event-Log-API). Alert-Anzahlen (RMM,
 * Sophos) werden nicht als Events gezählt und erhöhen die MDU-Kosten nicht.
 */

export const MDU_TIERS = [
  { upTo: 1_000_000, perThousandUsd: 0, label: 'Included' },
  { upTo: 50_000_000, perThousandUsd: 0.1, label: '1M – 50M' },
  { upTo: 200_000_000, perThousandUsd: 0.08, label: '50M – 200M' },
  { upTo: Infinity, perThousandUsd: 0.05, label: '200M+' },
] as const

const INCLUDED_EVENTS = 1_000_000

export interface MduCostBreakdown {
  eventsPerMonth: number
  includedEvents: number
  billableEvents: number
  costUsd: number
  /** Human-readable tier breakdown, e.g. "0–1M included; 2.5M × $0.10/1k" */
  summary: string
}

/**
 * Compute monthly MDU cost from event count.
 * 0–1M included; 1M–50M $0.10/1k; 50M–200M $0.08/1k; 200M+ $0.05/1k.
 */
export function computeMduCost(eventsPerMonth: number): MduCostBreakdown {
  const includedEvents = Math.min(eventsPerMonth, INCLUDED_EVENTS)
  let billableEvents = Math.max(0, eventsPerMonth - INCLUDED_EVENTS)
  let costUsd = 0

  if (billableEvents <= 0) {
    return {
      eventsPerMonth,
      includedEvents,
      billableEvents: 0,
      costUsd: 0,
      summary: `0–1M included · ${(eventsPerMonth / 1_000_000).toFixed(2)}M events`,
    }
  }

  let remaining = billableEvents
  const parts: string[] = []

  // 1M–50M: 49M at $0.10/1k
  const tier1 = Math.min(remaining, 49_000_000)
  if (tier1 > 0) {
    const c = (tier1 / 1000) * 0.1
    costUsd += c
    parts.push(`${(tier1 / 1_000_000).toFixed(1)}M × $0.10/1k`)
    remaining -= tier1
  }
  // 50M–200M: 150M at $0.08/1k
  const tier2 = Math.min(remaining, 150_000_000)
  if (tier2 > 0) {
    const c = (tier2 / 1000) * 0.08
    costUsd += c
    parts.push(`${(tier2 / 1_000_000).toFixed(1)}M × $0.08/1k`)
    remaining -= tier2
  }
  // 200M+
  if (remaining > 0) {
    const c = (remaining / 1000) * 0.05
    costUsd += c
    parts.push(`${(remaining / 1_000_000).toFixed(1)}M × $0.05/1k`)
  }

  return {
    eventsPerMonth,
    includedEvents,
    billableEvents,
    costUsd: Math.round(costUsd * 100) / 100,
    summary: `1M included; ${parts.join('; ')}`,
  }
}

/** Default events per device per day for estimation when no real event count exists. */
export const DEFAULT_EVENTS_PER_DEVICE_PER_DAY = 10

/** Estimate monthly events from device count. */
export function estimateMonthlyEvents(
  deviceCount: number,
  eventsPerDevicePerDay: number = DEFAULT_EVENTS_PER_DEVICE_PER_DAY
): number {
  return Math.round(deviceCount * eventsPerDevicePerDay * 30)
}
