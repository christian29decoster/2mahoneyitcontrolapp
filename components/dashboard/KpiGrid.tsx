import KpiTile from "./KpiTile"
import { KEY_METRIC_TOOLTIPS } from "@/lib/dashboard-metric-tooltips"

export default function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <KpiTile label="Active Alerts" value="3" trend={{ delta: "+1", positive: false }} trendTooltip={KEY_METRIC_TOOLTIPS.activeAlerts} />
      <KpiTile label="Offline Devices" value="3" trend={{ delta: "-1", positive: true }} trendTooltip={KEY_METRIC_TOOLTIPS.offlineDevices} />
      <KpiTile label="MTTR" value="2.3h" trend={{ delta: "-0.5h", positive: true }} trendTooltip={KEY_METRIC_TOOLTIPS.mttr} />
      <KpiTile label="Coverage" value="92%" trend={{ delta: "+2%", positive: true }} trendTooltip={KEY_METRIC_TOOLTIPS.coverage} />
    </div>
  )
}
