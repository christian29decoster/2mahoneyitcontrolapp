'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import { awsIncident, markActionDone } from '@/lib/incident';

export default function AwsIncident(){
  const [inc, setInc] = useState(awsIncident);

  function doAction(key:string){
    const updated = markActionDone(key);
    setInc({...updated});
  }

  return (
    <div className="mx-auto w-full max-w-[920px] px-4 py-4">
      <h1 className="text-2xl font-bold">{inc.title}</h1>
      <div className="text-sm text-[var(--muted)]">Started {new Date(inc.startedAtISO).toLocaleString()} • Severity: {inc.severity}</div>

      <Card className="p-3 mt-3">
        <div className="font-semibold">Summary</div>
        <div className="text-sm mt-1">{inc.summary}</div>
        <div className="text-xs mt-2 text-[var(--muted)]">
          IAM user: {inc.suspected.iamUser} • Source ASN: {inc.suspected.sourceASN} • IP: {inc.suspected.ip} • EC2: {inc.suspected.ec2Id} • S3: {inc.suspected.s3Bucket}
        </div>
      </Card>

      <Card className="p-3 mt-3">
        <div className="font-semibold">Timeline</div>
        <ul className="mt-2 text-sm space-y-1">
          {inc.timeline.map((t,i)=>(
            <li key={i}>• {new Date(t.atISO).toLocaleTimeString()} — {t.text}</li>
          ))}
        </ul>
      </Card>

      <Card className="p-3 mt-3">
        <div className="font-semibold mb-2">Containment & Remediation</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {inc.actions.map(a=>(
            <button key={a.key} onClick={()=>doAction(a.key)}
              className={`text-left px-3 py-2 rounded-xl border ${a.done ? 'border-emerald-500 text-emerald-300' : 'border-[var(--border)] hover:border-[rgba(59,130,246,.35)]'}`}>
              {a.done ? '✅ ' : ''}{a.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-3 text-xs text-[var(--muted)]">
        Note: Demo only. Actions update simulation state; no cloud APIs are called.
      </div>
    </div>
  );
}
