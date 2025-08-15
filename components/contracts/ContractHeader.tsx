'use client'

import { motion } from 'framer-motion'
import { Badge } from '../Badge'
import { formatCurrency } from '@/lib/pricing'
import { Contract } from '@/lib/contracts'

interface ContractHeaderProps {
  contract: Contract
}

export function ContractHeader({ contract }: ContractHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-600)]/10 border border-[var(--primary)]/20 rounded-[22px] p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-1">
            Mahoney One — {contract.plan.tier}
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {contract.plan.seats} seats • {contract.plan.devices} devices • {contract.plan.sla} SLA
          </p>
        </div>
        <Badge variant="accent" className="text-sm">
          {formatCurrency(contract.plan.baseMonthlyUSD)}/mo
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-[var(--muted)]">Renewal Date</p>
          <p className="text-[var(--text)] font-medium">{formatDate(contract.plan.renewalISO)}</p>
        </div>
        <div>
          <p className="text-[var(--muted)]">Total Monthly</p>
          <p className="text-[var(--text)] font-medium">{formatCurrency(contract.totals.monthlyUSD)}</p>
        </div>
      </div>
    </motion.div>
  )
}
