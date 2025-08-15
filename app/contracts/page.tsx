'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'
import { Badge } from '@/components/Badge'
import { Sheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { ContractHeader } from '@/components/contracts/ContractHeader'
import { ServiceRow } from '@/components/contracts/ServiceRow'
import { RequestsList } from '@/components/contracts/RequestsList'
import { useContract } from '@/hooks/useContract'
import { useHaptics } from '@/hooks/useHaptics'
import { formatCurrency } from '@/lib/pricing'
import { stagger } from '@/lib/ui/motion'
import { TrendingUp } from 'lucide-react'

export default function ContractsPage() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false)
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const { contract, requests, loading, submitRequest, withdrawRequest } = useContract()
  const h = useHaptics()

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  const handleChangePlan = () => {
    h.impact('medium')
    setIsChangePlanOpen(true)
  }

  const handleAddService = () => {
    h.impact('medium')
    setIsAddServiceOpen(true)
  }

  const handleAdjustSeats = () => {
    h.impact('light')
    addToast('info', 'Adjust Seats', 'This would open a quantity adjustment wizard.')
  }

  const handleDownloadContract = () => {
    h.impact('light')
    addToast('info', 'Download Contract', 'Contract PDF would be generated and downloaded.')
  }

  const handleRequestCancellation = () => {
    h.impact('heavy')
    addToast('warning', 'Cancellation Request', 'Cancellation request would be submitted.')
  }

  const handleRequestClick = (request: any) => {
    h.impact('light')
    setSelectedRequest(request)
  }

  if (loading || !contract) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">Loading contract...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Contract Header */}
        <ContractHeader contract={contract} />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <HapticButton
            label="Change Plan"
            onClick={handleChangePlan}
            variant="surface"
          />
          <HapticButton
            label="Add Service"
            onClick={handleAddService}
            variant="surface"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <HapticButton
            label="Adjust Seats"
            onClick={handleAdjustSeats}
            variant="surface"
          />
          <HapticButton
            label="Download Contract"
            onClick={handleDownloadContract}
            variant="surface"
          />
        </div>

        <HapticButton
          label="Request Cancellation"
          onClick={handleRequestCancellation}
          variant="danger"
        />

        {/* Upselling Banner */}
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-[8px] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--text)]">Enhance Your Security</h3>
              <p className="text-sm text-[var(--muted)]">
                Discover services tailored to your current plan
              </p>
            </div>
            <HapticButton
              label="Explore"
              onClick={() => window.location.href = '/upselling'}
              variant="surface"
              className="text-xs"
            />
          </div>
        </Card>

        {/* Active Services */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Active Services</h3>
          <div className="space-y-3">
            {contract.services.map((service) => (
              <ServiceRow key={service.key} service={service} />
            ))}
          </div>
        </Card>

        {/* Billing Summary */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Billing Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Next Invoice</span>
              <span className="font-semibold text-[var(--text)]">
                {formatCurrency(contract.totals.monthlyUSD)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Due Date</span>
              <span className="text-[var(--text)]">
                {new Date(contract.totals.nextInvoiceISO).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <HapticButton
              label="View Last Invoice"
              onClick={() => addToast('info', 'Last Invoice', 'Invoice PDF would open.')}
              variant="surface"
            />
          </div>
        </Card>

        {/* Approvals & Requests */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Approvals & Requests</h3>
          <RequestsList 
            requests={requests} 
            onRequestClick={handleRequestClick}
          />
        </Card>
      </motion.div>

      {/* Request Details Sheet */}
      <Sheet
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Request Details"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">Request #{selectedRequest.reference}</h3>
              <p className="text-sm text-[var(--muted)]">
                Submitted: {new Date(selectedRequest.requestedAt).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
              <h4 className="font-medium text-[var(--text)] mb-2">Request Details</h4>
              <pre className="text-sm text-[var(--muted)] whitespace-pre-wrap">
                {JSON.stringify(selectedRequest.payload, null, 2)}
              </pre>
            </div>

            {selectedRequest.status === 'pending' && (
              <HapticButton
                label="Withdraw Request"
                onClick={() => {
                  withdrawRequest(selectedRequest.id)
                  setSelectedRequest(null)
                  addToast('info', 'Request Withdrawn', 'Your request has been withdrawn.')
                }}
                variant="danger"
              />
            )}
          </div>
        )}
      </Sheet>

      {/* Toast Manager */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          </div>
        ))}
      </div>
    </>
  )
}
