'use client';
import { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import { demoFindings, CloudFinding } from '@/lib/cloud';
import Link from 'next/link';

export default function CloudPage(){
  const [vendor, setVendor] = useState<'ALL'|'AWS'|'Azure'>('ALL');
  const [sev, setSev] = useState<'ALL'|'low'|'medium'|'high'|'critical'>('ALL');
  const [cat, setCat] = useState<'ALL'|'IAM'|'Storage'|'Network'|'Logging'|'KMS'|'Compute'|'Other'>('ALL');

  const items = useMemo(()=>{
    return demoFindings.filter(f =>
      (vendor==='ALL'||f.vendor===vendor) &&
      (sev==='ALL'||f.severity===sev) &&
      (cat==='ALL'||f.category===cat)
    );
  }, [vendor, sev, cat]);

  const hasCriticalAws = demoFindings.some(f => f.vendor === 'AWS' && f.severity === 'critical');

  return (
    <div className="mx-auto w-full max-w-[920px] px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cloud Security</h1>
        <div className="flex items-center gap-3">
          <div className="text-xs text-[var(--muted)]">SOC-III-US-Team monitoring</div>
          {hasCriticalAws && (
            <Link href="/incidents/aws" className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">
              Open AWS Incident
            </Link>
          )}
        </div>
      </div>

      <Card className="p-3 mt-3">
        <div className="grid grid-cols-3 gap-2">
          <select value={vendor} onChange={e=>setVendor(e.target.value as any)} className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-2 py-2 text-sm">
            <option value="ALL">All vendors</option><option value="AWS">AWS</option><option value="Azure">Azure</option>
          </select>
          <select value={sev} onChange={e=>setSev(e.target.value as any)} className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-2 py-2 text-sm">
            <option value="ALL">All severities</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
          </select>
          <select value={cat} onChange={e=>setCat(e.target.value as any)} className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-2 py-2 text-sm">
            <option value="ALL">All categories</option>
            <option value="IAM">IAM</option><option value="Storage">Storage</option><option value="Network">Network</option>
            <option value="Logging">Logging</option><option value="KMS">KMS</option><option value="Compute">Compute</option><option value="Other">Other</option>
          </select>
        </div>
      </Card>

      <div className="mt-3 grid gap-3">
        {items.map(f=>(
          <Card key={f.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{f.title}</div>
              <span className={`text-xs px-2 py-1 rounded-lg border ${
                f.severity==='critical'?'border-red-400 text-red-300':
                f.severity==='high'?'border-orange-400 text-orange-300':
                f.severity==='medium'?'border-yellow-400 text-yellow-300':'border-zinc-400 text-zinc-300'
              }`}>{f.severity}</span>
            </div>
            <div className="text-sm text-[var(--muted)] mt-1">{f.description}</div>
            <div className="text-xs mt-1">
              <b>{f.vendor}</b> • {f.category} • {f.region || 'global'} • <span className="text-[var(--muted)]">{f.resource}</span>
            </div>
            {f.recommendation && (
              <div className="text-xs mt-2">
                Recommendation: {f.recommendation}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1.5 rounded-xl border border-[var(--border)]">Open Runbook</button>
              <button className="px-3 py-1.5 rounded-xl border border-[var(--border)]">Create Ticket</button>
              <button className="px-3 py-1.5 rounded-xl border border-[var(--border)]">Ask AI</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
