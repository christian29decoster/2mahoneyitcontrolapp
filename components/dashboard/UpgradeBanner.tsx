import Card from "@/components/ui/Card"

export default function UpgradeBanner() {
  return (
    <Card className="p-3 flex items-center justify-between bg-[linear-gradient(135deg,rgba(59,130,246,.10),rgba(59,130,246,.03))] border-[rgba(59,130,246,.2)]">
      <div>
        <div className="text-xs text-[var(--muted)]">Current Plan</div>
        <div className="font-semibold text-[var(--text)]">Essential</div>
        <div className="text-xs text-[var(--muted)]">
          Upgrade to Prime to reduce MTTR and enable auto-discovery.
        </div>
      </div>
      <button className="px-3 py-1.5 rounded-xl border border-[rgba(59,130,246,.4)] text-[var(--primary)] hover:bg-[rgba(59,130,246,.08)] transition-colors">
        Upgrade
      </button>
    </Card>
  )
}
