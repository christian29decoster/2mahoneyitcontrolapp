'use client'

import { serviceCockpit, cockpitTips } from '@/lib/cockpit'
import SheetBody from '@/components/SheetBody'
import { HapticButton } from '@/components/HapticButton'

export default function ServiceCockpitSheet() {
  const items = [
    { label: 'Plan', value: `${serviceCockpit.plan.tier} • ${serviceCockpit.plan.seats} seats / ${serviceCockpit.plan.devices} devices` },
    { label: 'SOC', value: `${serviceCockpit.soc.team} • ${serviceCockpit.soc.status}` },
    { label: 'EDR', value: `Coverage ${(serviceCockpit.edr.coverage * 100).toFixed(0)}% • ${serviceCockpit.edr.unprotected} unprotected • ${serviceCockpit.edr.stale} stale` },
    { label: 'Backup', value: `Scope ${(serviceCockpit.backup.protectedPct * 100).toFixed(0)}% • last failures ${serviceCockpit.backup.lastFailures}` },
    { label: 'Mail', value: `O365 near limit: ${serviceCockpit.mail.o365Approaching} • On-Prem high util: ${serviceCockpit.mail.onPremHighUtil}` },
    { label: 'Compliance', value: `Score ${serviceCockpit.compliance.score}/100 • Gaps: ${serviceCockpit.compliance.gaps.join(', ')}` },
  ]

  return (
    <SheetBody>
      <div className="space-y-3">
        <div className="text-lg font-semibold text-[var(--text)]">Service Cockpit</div>
        
        <div className="space-y-2">
          {items.map((x, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-3 text-sm">
              <div className="text-[var(--muted)]">{x.label}</div>
              <div className="text-[var(--text)]">{x.value}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-sm font-medium mb-1 text-[var(--text)]">Recommendations</div>
          <ul className="list-disc pl-5 text-sm text-[var(--muted)] space-y-1">
            {cockpitTips.map((t, i) => <li key={i}>{t.text}</li>)}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          <HapticButton 
            label="Run Quick Self-Audit" 
            onClick={() => window.location.href = '/?audit=1'} 
          />
          <HapticButton 
            variant="surface" 
            label="Open Remediation (Unprotected)" 
            onClick={() => window.location.href = '/devices?audit=unprotected'} 
          />
          <HapticButton 
            variant="surface" 
            label="Adjust Backup Scope" 
            onClick={() => window.location.href = '/marketplace?svc=backup'} 
          />
          <HapticButton 
            variant="surface" 
            label="Compliance Gap Assessment" 
            onClick={() => window.location.href = '/marketplace?svc=gap'} 
          />
        </div>
      </div>
    </SheetBody>
  )
}
