'use client'

export function FinancialsSectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3 animate-pulse">
      <div className="h-5 w-48 bg-[var(--surface-2)] rounded" />
      <div className="h-3 w-full max-w-md bg-[var(--border)] rounded" />
      <div className="grid gap-2 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 bg-[var(--surface-2)] rounded-lg" />
        ))}
      </div>
    </div>
  )
}
