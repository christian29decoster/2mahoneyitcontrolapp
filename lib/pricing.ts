export function monthlyDelta(current: number, next: number): number {
  return +(next - current).toFixed(2)
}

export function prorate(monthly: number, startISO: string, endISO: string): number {
  const start = new Date(startISO).getTime()
  const end = new Date(endISO).getTime()
  const today = Date.now()
  const remaining = Math.max(0, Math.min(end, end) - Math.max(start, today))
  const monthMs = 30 * 24 * 3600 * 1000 // simple demo
  return +((monthly * (remaining / monthMs))).toFixed(2)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

export function calculateServiceCost(unitPrice: number, quantity: number): number {
  return +(unitPrice * quantity).toFixed(2)
}
