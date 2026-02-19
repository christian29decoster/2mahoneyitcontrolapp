'use client'

import Card from '@/components/ui/Card'

/** Demo data: alerts per day (last 7 days) */
const alertsByDay = [4, 7, 3, 9, 5, 6, 3]
const mttrByDay = [2.8, 2.5, 2.2, 2.4, 2.3, 2.1, 2.3]
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function AlertsChart() {
  const max = Math.max(...alertsByDay)
  return (
    <Card className="card-desktop p-5 h-full">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Alerts (last 7 days)</h3>
      <div className="flex items-end gap-2 h-32">
        {alertsByDay.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-[var(--primary)]/60 min-h-[4px] transition-all"
              style={{ height: `${(val / (max || 1)) * 100}%` }}
            />
            <span className="text-[10px] text-[var(--muted)]">{dayLabels[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function MttrChart() {
  const max = Math.max(...mttrByDay)
  return (
    <Card className="card-desktop p-5 h-full">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-4">MTTR trend (h)</h3>
      <div className="flex items-end gap-2 h-32">
        {mttrByDay.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-[var(--success)]/50 min-h-[4px] transition-all"
              style={{ height: `${(val / (max || 1)) * 100}%` }}
            />
            <span className="text-[10px] text-[var(--muted)]">{dayLabels[i]}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
