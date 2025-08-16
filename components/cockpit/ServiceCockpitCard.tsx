'use client'

import { Card } from '@/components/Card'
import { serviceCockpit, toSignal, cockpitTips } from '@/lib/cockpit'
import { motion } from 'framer-motion'
import { HapticButton } from '@/components/HapticButton'

const Dot = ({ sig }: { sig: 'good' | 'warn' | 'risk' }) => (
  <span className={`inline-block w-2.5 h-2.5 rounded-full ${
    sig === 'good' ? 'bg-green-500' : sig === 'warn' ? 'bg-yellow-500' : 'bg-red-500'
  }`} />
)

export default function ServiceCockpitCard({ onOpen }: { onOpen: () => void }) {
  const edrSig = toSignal(serviceCockpit.edr.unprotected + serviceCockpit.edr.stale, 1, 3)
  const bkpSig = toSignal(1 - serviceCockpit.backup.protectedPct, .2, .3)
  const mailSig = toSignal(serviceCockpit.mail.o365Approaching + serviceCockpit.mail.onPremHighUtil, 1, 2)
  const compSig = toSignal((100 - serviceCockpit.compliance.score) / 100, .25, .4)

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-[var(--text)]">Service Cockpit</div>
        <span className="text-xs text-[var(--muted)]">Secured by Mahoney IT Group</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-3">
          <div className="text-[var(--text)]">EDR Coverage</div>
          <Dot sig={edrSig} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-3">
          <div className="text-[var(--text)]">Backups</div>
          <Dot sig={bkpSig} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-3">
          <div className="text-[var(--text)]">Mail Systems</div>
          <Dot sig={mailSig} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-3">
          <div className="text-[var(--text)]">Compliance</div>
          <Dot sig={compSig} />
        </div>
      </div>

      <div className="mt-3 text-xs text-[var(--muted)]">
        Tips: {cockpitTips.slice(0, 2).map(t => t.text).join(' • ')}
      </div>

      <div className="mt-3">
        <HapticButton label="Open Service Cockpit" onClick={onOpen} />
      </div>
    </Card>
  )
}
