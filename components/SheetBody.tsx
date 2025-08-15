export default function SheetBody({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="max-h-[80dvh] overflow-y-auto overscroll-contain px-4 py-3"
      style={{ WebkitOverflowScrolling: 'touch' as any }}
    >
      {children}
    </div>
  )
}
