import KpiTile from "./KpiTile"

export default function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <KpiTile label="Active Alerts" value="3" trend={{ delta: "+1", positive: true }} />
      <KpiTile label="Offline Devices" value="3" trend={{ delta: "-1", positive: false }} />
      <KpiTile label="MTTR" value="2.3h" trend={{ delta: "-0.5h", positive: true }} />
      <KpiTile label="Coverage" value="92%" trend={{ delta: "+2%", positive: true }} />
    </div>
  )
}
