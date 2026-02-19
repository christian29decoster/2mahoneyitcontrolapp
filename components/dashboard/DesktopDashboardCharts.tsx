'use client'

import Card from '@/components/ui/Card'

/** Demo data: alerts per day (last 7 days) */
const alertsByDay = [4, 7, 3, 9, 5, 6, 3]
const mttrByDay = [2.8, 2.5, 2.2, 2.4, 2.3, 2.1, 2.3]
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const CHART_HEIGHT_PX = 140

export function AlertsChart() {
  const max = Math.max(...alertsByDay)
  return (
    <Card className="card-desktop p-5 h-full">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Alerts (last 7 days)</h3>
      <div className="flex items-end gap-2" style={{ height: CHART_HEIGHT_PX }}>
        {alertsByDay.map((val, i) => {
          const barHeight = max ? (val / max) * (CHART_HEIGHT_PX - 20) : 0
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0">
              <div
                className="w-full rounded-t bg-[var(--primary)] min-h-[6px] transition-all"
                style={{ height: `${barHeight}px` }}
                title={`${val} alerts`}
              />
              <span className="text-[10px] text-[var(--muted)] shrink-0">{dayLabels[i]}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[var(--muted)]">
        <span>Total: {alertsByDay.reduce((a, b) => a + b, 0)} alerts</span>
        <span>Peak: {max} (Thu)</span>
      </div>
    </Card>
  )
}

export function MttrChart() {
  const max = Math.max(...mttrByDay)
  const min = Math.min(...mttrByDay)
  return (
    <Card className="card-desktop p-5 h-full">
      <h3 className="text-sm font-semibold text-[var(--text)] mb-4">MTTR trend (h)</h3>
      <div className="flex items-end gap-2" style={{ height: CHART_HEIGHT_PX }}>
        {mttrByDay.map((val, i) => {
          const range = max - min || 1
          const barHeight = ((val - min) / range) * (CHART_HEIGHT_PX - 20) + 12
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0">
              <div
                className="w-full rounded-t bg-[var(--success)]/80 min-h-[6px] transition-all"
                style={{ height: `${barHeight}px` }}
                title={`${val}h`}
              />
              <span className="text-[10px] text-[var(--muted)] shrink-0">{dayLabels[i]}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[var(--muted)]">
        <span>Avg: {(mttrByDay.reduce((a, b) => a + b, 0) / mttrByDay.length).toFixed(1)}h</span>
        <span>Best: {min}h (Sat)</span>
      </div>
    </Card>
  )
}
