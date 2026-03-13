'use client'

import { useState } from 'react'

export type MetricDeltaTooltipContent = {
  /** Where the number comes from (e.g. "RMM + SIEM alerts") */
  source: string
  /** What the delta tells the user (e.g. "Change vs previous 7 days") */
  meaning: string
  /** Data basis / calculation (e.g. "Open alerts from connected RMM and EDR") */
  dataBasis: string
}

export default function MetricDeltaTooltip({
  children,
  content,
  className = '',
}: {
  children: React.ReactNode
  content: MetricDeltaTooltipContent
  className?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <span
      className={`relative inline-flex cursor-help ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          className="absolute left-0 top-full z-50 mt-1 w-64 p-3 text-xs rounded-xl bg-[var(--surface-elev)] border border-[var(--border)] text-left shadow-xl"
          role="tooltip"
        >
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-[var(--muted)] uppercase tracking-wide">Source</span>
              <p className="text-[var(--text)] mt-0.5">{content.source}</p>
            </div>
            <div>
              <span className="font-semibold text-[var(--muted)] uppercase tracking-wide">What it means</span>
              <p className="text-[var(--text)] mt-0.5">{content.meaning}</p>
            </div>
            <div>
              <span className="font-semibold text-[var(--muted)] uppercase tracking-wide">Data basis</span>
              <p className="text-[var(--text)] mt-0.5">{content.dataBasis}</p>
            </div>
          </div>
        </span>
      )}
    </span>
  )
}
