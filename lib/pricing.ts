// Base plan pricing (can be adjusted per tier)
export type PlanTier = 'Essential' | 'Prime' | 'Elite'

export const PLAN_BASE = {
  Essential: { perSeatUSD: 99, perDeviceUSD: 99, devicesPerSeat: 5 },
  Prime: { perSeatUSD: 175, perDeviceUSD: 175, devicesPerSeat: 5 },
  Elite: { perSeatUSD: 199, perDeviceUSD: 199, devicesPerSeat: 5 }
} as const

// Given seats and devices, compute the monthly base by the cheaper metric.
// Seats include up to devicesPerSeat devices. Extra devices bill perDevice.
export function planMonthlyUSD(tier: PlanTier, seats: number, devices: number) {
  const cfg = PLAN_BASE[tier]
  const seatBased = seats * cfg.perSeatUSD
  const includedDevices = seats * cfg.devicesPerSeat
  const extraDevices = Math.max(0, devices - includedDevices)
  const seatBasedWithExtras = seatBased + extraDevices * cfg.perDeviceUSD

  // Device-based (no seat inclusion) is just devices * perDevice
  const deviceBased = devices * cfg.perDeviceUSD

  // Choose lower of (seat-based+extras) vs (device-based)
  return Math.min(seatBasedWithExtras, deviceBased)
}

// Generic monthly for add-ons
export function monthlyAddonUSD(unit: 'gb' | 'seat' | 'device' | 'flat', unitPrice: number, qty: number) {
  if (unit === 'flat') return unitPrice
  return +(unitPrice * Math.max(0, qty)).toFixed(2)
}

// Proration (simple 30-day month model for preview)
export function prorate(monthly: number, startISO: string, endISO: string) {
  const start = new Date(startISO).getTime()
  const end = new Date(endISO).getTime()
  const now = Date.now()
  const effectiveStart = Math.max(start, now)
  const remaining = Math.max(0, end - effectiveStart)
  const monthMs = 30 * 24 * 3600 * 1000
  return +((monthly * (remaining / monthMs))).toFixed(2)
}

// Legacy functions for backward compatibility
export function monthlyDelta(current: number, next: number): number {
  return +(next - current).toFixed(2)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export function calculateServiceCost(unitPrice: number, quantity: number): number {
  return +(unitPrice * quantity).toFixed(2)
}
