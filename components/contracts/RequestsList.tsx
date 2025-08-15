'use client'

import { motion } from 'framer-motion'
import { Badge } from '../Badge'
import { ContractRequest } from '@/lib/contracts'

interface RequestsListProps {
  requests: ContractRequest[]
  onRequestClick: (request: ContractRequest) => void
}

export function RequestsList({ requests, onRequestClick }: RequestsListProps) {
  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'plan_change': return 'Plan Change'
      case 'service_add': return 'Add Service'
      case 'qty_change': return 'Quantity Change'
      case 'pause': return 'Pause Service'
      case 'cancel': return 'Cancel Service'
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'approved': return 'accent'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--muted)]">No pending requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request, index) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onRequestClick(request)}
          className="p-3 bg-[var(--surface)]/50 rounded-[16px] cursor-pointer hover:bg-[var(--surface)]/70 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-[var(--text)]">{getRequestTypeLabel(request.type)}</p>
              <Badge variant={getStatusColor(request.status) as any} className="text-xs">
                {request.status}
              </Badge>
            </div>
            <p className="text-xs text-[var(--muted)]">{request.reference}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <p className="text-[var(--muted)]">
              {formatDate(request.requestedAt)}
            </p>
            {request.processedAt && (
              <p className="text-[var(--muted)]">
                Processed: {formatDate(request.processedAt)}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
