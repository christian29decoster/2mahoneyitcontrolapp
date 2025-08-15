'use client'

import { motion } from 'framer-motion'
import { Badge } from '../Badge'
import { formatCurrency } from '@/lib/pricing'

interface ServiceRowProps {
  service: {
    key: string
    name: string
    unit: 'seat' | 'device' | 'gb' | 'flat'
    qty: number
    unitPriceUSD: number
    monthlyUSD: number
    status: 'active' | 'pending' | 'paused'
  }
}

export function ServiceRow({ service }: ServiceRowProps) {
  const getStatusColor = () => {
    switch (service.status) {
      case 'active': return 'accent'
      case 'pending': return 'secondary'
      case 'paused': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatUnit = (unit: string, qty: number) => {
    switch (unit) {
      case 'seat': return `${qty} seat${qty !== 1 ? 's' : ''}`
      case 'device': return `${qty} device${qty !== 1 ? 's' : ''}`
      case 'gb': return `${qty} GB`
      case 'flat': return 'Flat rate'
      default: return `${qty} ${unit}`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 bg-[var(--surface)]/50 rounded-[16px]"
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <p className="font-medium text-[var(--text)]">{service.name}</p>
          <Badge variant={getStatusColor() as any} className="text-xs">
            {service.status}
          </Badge>
        </div>
        <p className="text-sm text-[var(--muted)]">
          {formatUnit(service.unit, service.qty)} • {formatCurrency(service.unitPriceUSD)}/{service.unit}
        </p>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-[var(--text)]">{formatCurrency(service.monthlyUSD)}</p>
        <p className="text-xs text-[var(--muted)]">per month</p>
      </div>
    </motion.div>
  )
}
