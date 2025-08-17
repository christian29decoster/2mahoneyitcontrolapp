'use client';
import Card from '@/components/ui/Card';
import { demoCloudPosture, postureDot } from '@/lib/cloud';

const Dot = ({state}:{state:'good'|'warn'|'risk'}) => (
  <span className={`inline-block w-2.5 h-2.5 rounded-full ${
    state==='good'?'bg-green-500':state==='warn'?'bg-yellow-500':'bg-red-500'
  }`}/>
);

export default function CloudTiles({onOpen}:{onOpen:()=>void}){
  return (
    <div className="grid grid-cols-2 gap-3">
      {demoCloudPosture.map(p=>(
        <Card key={p.vendor} className="p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{p.vendor}</div>
            <Dot state={postureDot(p.score) as any}/>
          </div>
          <div className="mt-1 text-2xl font-semibold">{p.score}/100</div>
          <div className="text-xs text-[var(--muted)]">
            {p.openFindings} findings • scan {new Date(p.lastScanISO).toLocaleTimeString()}
          </div>
          <button onClick={onOpen}
            className="mt-2 text-xs px-2 py-1 rounded-lg border border-[var(--border)] hover:border-[rgba(59,130,246,.35)]">
            View Cloud Posture
          </button>
        </Card>
      ))}
    </div>
  );
}
