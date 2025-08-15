'use client'

import { motion } from 'framer-motion'
import { Badge } from '../Badge'
import { HapticButton } from '../HapticButton'
import { formatCurrency } from '@/lib/pricing'
import { CrossSellingBundle } from '@/lib/upselling'
import { Package, Clock, Sparkles } from 'lucide-react'

interface BundleCardProps {
  bundle: CrossSellingBundle
  onSelect: (bundle: CrossSellingBundle) => void
}

export function BundleCard({ bundle, onSelect }: BundleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-[16px] border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-600)]/5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-[8px] flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text)]">{bundle.name}</h3>
            <p className="text-xs text-[var(--muted)]">Bundle Package</p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant="destructive" className="text-xs mb-1">
            Save {formatCurrency(bundle.savings)}
          </Badge>
          <p className="font-bold text-[var(--text)]">
            {formatCurrency(bundle.bundlePrice)}
          </p>
          <p className="text-xs text-[var(--muted)] line-through">
            {formatCurrency(bundle.originalPrice)}
          </p>
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] mb-3">{bundle.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3 h-3 text-[var(--primary)]" />
          <span className="text-xs text-[var(--text)]">
            {bundle.services.length} services included
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-3 h-3 text-[var(--warning)]" />
          <span className="text-xs text-[var(--muted)]">
            Valid until {formatDate(bundle.validUntil)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Badge variant="accent" className="text-xs">
            Bundle Deal
          </Badge>
          {bundle.limited && (
            <Badge variant="destructive" className="text-xs">
              Limited Time
            </Badge>
          )}
        </div>
        <HapticButton
          label="Get Bundle"
          onClick={() => onSelect(bundle)}
          className="text-xs px-3 py-1"
        />
      </div>
    </motion.div>
  )
}
