'use client'

import { motion } from 'framer-motion'
import { Badge } from '../Badge'
import { HapticButton } from '../HapticButton'
import { formatCurrency } from '@/lib/pricing'
import { UpsellingService } from '@/lib/upselling'
import { Shield, CheckCircle, Search, Target, GraduationCap, Server, Users } from 'lucide-react'

interface UpsellingCardProps {
  service: UpsellingService
  onSelect: (service: UpsellingService) => void
  variant?: 'default' | 'recommended' | 'limited'
}

export function UpsellingCard({ service, onSelect, variant = 'default' }: UpsellingCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-5 h-5" />
      case 'CheckCircle': return <CheckCircle className="w-5 h-5" />
      case 'Search': return <Search className="w-5 h-5" />
      case 'Target': return <Target className="w-5 h-5" />
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />
      case 'Server': return <Server className="w-5 h-5" />
      case 'Users': return <Users className="w-5 h-5" />
      default: return <Shield className="w-5 h-5" />
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'recommended':
        return 'border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-600)]/5'
      case 'limited':
        return 'border-[var(--warning)]/30 bg-gradient-to-r from-[var(--warning)]/5 to-[var(--warning)]/5'
      default:
        return 'border-[var(--border)] bg-[var(--surface)]/50'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-[16px] border ${getVariantStyles()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-[8px] flex items-center justify-center">
            {getIcon(service.icon)}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text)]">{service.name}</h3>
            <p className="text-xs text-[var(--muted)]">{service.duration}</p>
          </div>
        </div>
        <div className="text-right">
          {service.discount && (
            <Badge variant="destructive" className="text-xs mb-1">
              -{service.discount.percentage}%
            </Badge>
          )}
          <p className="font-bold text-[var(--text)]">
            {formatCurrency(service.discount ? service.price * (1 - service.discount.percentage / 100) : service.price)}
          </p>
          {service.discount && (
            <p className="text-xs text-[var(--muted)] line-through">
              {formatCurrency(service.price)}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] mb-3">{service.description}</p>

      <div className="space-y-2 mb-4">
        {service.features.slice(0, 3).map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-[var(--success)]" />
            <span className="text-xs text-[var(--text)]">{feature}</span>
          </div>
        ))}
        {service.features.length > 3 && (
          <p className="text-xs text-[var(--muted)]">+{service.features.length - 3} more features</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {service.recommended && (
            <Badge variant="accent" className="text-xs">
              Recommended
            </Badge>
          )}
          {service.discount && (
            <Badge variant="secondary" className="text-xs">
              Limited Time
            </Badge>
          )}
        </div>
        <HapticButton
          label="Add Service"
          onClick={() => onSelect(service)}
          className="text-xs px-3 py-1"
        />
      </div>
    </motion.div>
  )
}
