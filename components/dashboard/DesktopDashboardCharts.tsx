'use client'

import Card from '@/components/ui/Card'

/** Demo data: alerts per day (last 7 days) */
const alertsByDay = [4, 7, 3, 9, 5, 6, 3]
const mttrByDay = [2.8, 2.5, 2.2, 2.4, 2.3, 2.1, 2.3]
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const CHART_HEIGHT_PX = 160

/** Y-axis ticks for alerts: 0 to max (rounded up) */
function getAlertTicks(max: number): number[] {
  const step = max <= 5 ? 1 : max <= 10 ? 2 : 5
  const top = Math.ceil(max / step) * step || 1
  const ticks: number[] = []
  for (let i = 0; i <= top; i += step) ticks.push(i)
  return ticks
}

/** Y-axis ticks for MTTR in hours (e.g. 2.0, 2.2, 2.4, 2.8) */
function getMttrTicks(min: number, max: number): number[] {
  const range = max - min
  const step = range <= 0.5 ? 0.1 : 0.2
  const ticks: number[] = []
  const start = Math.floor(min * 10) / 10
  for (let v = start; v <= max + 0.01; v = Math.round((v + step) * 10) / 10) ticks.push(v)
  return ticks.length ? ticks : [min, max]
}

export function AlertsChart() {
  const max = Math.max(...alertsByDay)
  const yTicks = getAlertTicks(max)
  const yMax = yTicks[yTicks.length - 1] || 1
  return (
    <Card className="card-desktop p-5 h-full">
      <div className="mb-5 pb-1">
        <h3 className="text-sm font-semibold text-[var(--text)]">Alerts (last 7 days)</h3>
        <p className="text-xs text-[var(--muted)] mt-0.5">Count per day</p>
      </div>
      <div className="flex gap-3 pt-3" style={{ minHeight: CHART_HEIGHT_PX }}>
        {/* Y-axis */}
        <div className="flex flex-col justify-between text-[10px] text-[var(--muted)] shrink-0 py-0.5" style={{ height: CHART_HEIGHT_PX }}>
          {[...yTicks].reverse().map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        {/* Chart area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-end gap-1.5" style={{ height: CHART_HEIGHT_PX }}>
            {alertsByDay.map((val, i) => {
              const barHeight = yMax ? (val / yMax) * (CHART_HEIGHT_PX - 4) : 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0">
                  <div
                    className="w-full rounded-t bg-[var(--primary)] min-h-[8px] transition-all"
                    style={{ height: `${Math.max(barHeight, 4)}px` }}
                    title={`${val} alerts`}
                  />
                  <span className="text-[10px] text-[var(--muted)] shrink-0 font-medium">{dayLabels[i]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--border)] flex justify-between text-xs text-[var(--muted)]">
        <span>Total: <strong className="text-[var(--text)]">{alertsByDay.reduce((a, b) => a + b, 0)}</strong> alerts</span>
        <span>Peak: <strong className="text-[var(--text)]">{max}</strong> (Thu)</span>
      </div>
    </Card>
  )
}

export function MttrChart() {
  const min = Math.min(...mttrByDay)
  const max = Math.max(...mttrByDay)
  const yTicks = getMttrTicks(min, max)
  const yMin = yTicks[0]
  const yMax = yTicks[yTicks.length - 1] ?? max
  const yRange = yMax - yMin || 0.1
  return (
    <Card className="card-desktop p-5 h-full">
      <div className="mb-5 pb-1">
        <h3 className="text-sm font-semibold text-[var(--text)]">MTTR trend (h)</h3>
        <p className="text-xs text-[var(--muted)] mt-0.5">Mean time to resolve</p>
      </div>
      <div className="flex gap-3 pt-3" style={{ minHeight: CHART_HEIGHT_PX }}>
        {/* Y-axis */}
        <div className="flex flex-col justify-between text-[10px] text-[var(--muted)] shrink-0 py-0.5" style={{ height: CHART_HEIGHT_PX }}>
          {[...yTicks].reverse().map((tick) => (
            <span key={tick}>{tick.toFixed(1)}h</span>
          ))}
        </div>
        {/* Chart area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-end gap-1.5" style={{ height: CHART_HEIGHT_PX }}>
            {mttrByDay.map((val, i) => {
              const barHeight = ((val - yMin) / yRange) * (CHART_HEIGHT_PX - 4)
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0">
                  <div
                    className="w-full rounded-t bg-[var(--success)] min-h-[8px] transition-all"
                    style={{ height: `${Math.max(barHeight, 8)}px` }}
                    title={`${val}h`}
                  />
                  <span className="text-[10px] text-[var(--muted)] shrink-0 font-medium">{dayLabels[i]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--border)] flex justify-between text-xs text-[var(--muted)]">
        <span>Avg: <strong className="text-[var(--text)]">{(mttrByDay.reduce((a, b) => a + b, 0) / mttrByDay.length).toFixed(1)}h</strong></span>
        <span>Best: <strong className="text-[var(--text)]">{min}h</strong> (Sat)</span>
      </div>
    </Card>
  )
}
