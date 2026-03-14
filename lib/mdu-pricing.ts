/**
 * Mahoney Data Units (MDU) – Layer 3 Datenverarbeitung.
 * Struktur für Event-Volumen-Staffelung; konkrete Preise folgen (aktuell alle auf Anfrage).
 *
 * Abrechnungsbasis: ausschließlich Event-Volumen. Alert-Anzahlen (RMM, Sophos) sind nur zur Anzeige.
 */

export const MDU_TIERS = [
  { upTo: 1_000_000, perThousandUsd: 0, label: 'Included' },
  { upTo: 50_000_000, perThousandUsd: 0, label: '1M – 50M' },
  { upTo: 200_000_000, perThousandUsd: 0, label: '50M – 200M' },
  { upTo: Infinity, perThousandUsd: 0, label: '200M+' },
] as const

const PRICE_PLACEHOLDER = 'Preis folgt'

const INCLUDED_EVENTS = 1_000_000

export interface MduCostBreakdown {
  eventsPerMonth: number
  includedEvents: number
  billableEvents: number
  costUsd: number
  summary: string
}

/**
 * Monatliche MDU-Kosten aus Event-Anzahl.
 * Aktuell: keine Preise hinterlegt → costUsd = 0, summary = Platzhalter.
 */
export function computeMduCost(eventsPerMonth: number): MduCostBreakdown {
  const includedEvents = Math.min(eventsPerMonth, INCLUDED_EVENTS)
  const billableEvents = Math.max(0, eventsPerMonth - INCLUDED_EVENTS)
  return {
    eventsPerMonth,
    includedEvents,
    billableEvents,
    costUsd: 0,
    summary: billableEvents <= 0
      ? `0–1M inklusive · ${(eventsPerMonth / 1_000_000).toFixed(2)}M Events`
      : PRICE_PLACEHOLDER,
  }
}

/** Anzeige für Preisspalte in Tabellen (keine konkreten Beträge). */
export function mduPriceDisplay(_perThousandUsd: number): string {
  return PRICE_PLACEHOLDER
}

/** Default Events pro Gerät pro Tag für Schätzung (Basis). */
export const DEFAULT_EVENTS_PER_DEVICE_PER_DAY = 10

/** Für Kunden mit SIEM, XDR, System-Events: deutlich mehr Events pro Gerät. */
export const EVENTS_PER_DEVICE_PER_DAY_SECURITY = 100

/** Monatliche Events aus Geräteanzahl schätzen. */
export function estimateMonthlyEvents(
  deviceCount: number,
  eventsPerDevicePerDay: number = DEFAULT_EVENTS_PER_DEVICE_PER_DAY
): number {
  return Math.round(deviceCount * eventsPerDevicePerDay * 30)
}
