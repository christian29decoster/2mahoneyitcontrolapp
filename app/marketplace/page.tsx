'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, Check, Sparkles } from 'lucide-react'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'
import { Sheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { services } from '@/lib/mahoney'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'

export default function MarketplacePage() {
  const [selectedService, setSelectedService] = useState<any>(null)
  const [checkoutStep, setCheckoutStep] = useState(0)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const h = useHaptics()
  
  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }
  
  const handleServiceClick = (service: any) => {
    h.impact('light')
    setSelectedService(service)
  }
  
  const handleAddToPlan = () => {
    h.impact('medium')
    setSelectedService(null)
    setIsCheckoutOpen(true)
    setCheckoutStep(0)
  }
  
  const handleRequestQuote = () => {
    h.impact('medium')
    addToast('success', 'Quote Requested', 'Our team will contact you within 24 hours.')
    setSelectedService(null)
  }
  
  const handleCheckoutNext = () => {
    h.impact('light')
    if (checkoutStep < 2) {
      setCheckoutStep(checkoutStep + 1)
    } else {
      // Final step - complete checkout
      h.success()
      addToast('success', 'Request Submitted', 'Your request has been submitted. Our team will activate this shortly.')
      setIsCheckoutOpen(false)
      setCheckoutStep(0)
    }
  }
  
  const handleCheckoutBack = () => {
    h.impact('light')
    if (checkoutStep > 0) {
      setCheckoutStep(checkoutStep - 1)
    } else {
      setIsCheckoutOpen(false)
    }
  }
  
  const checkoutSteps = [
    {
      title: 'Summary',
      content: (
        <div className="space-y-4">
          <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
            <h3 className="font-semibold text-[var(--text)] mb-2">{selectedService?.name}</h3>
            <p className="text-[var(--primary)] font-medium">{selectedService?.price}</p>
          </div>
          <div className="text-sm text-[var(--muted)]">
            <p>This service will be added to your current plan and billed accordingly.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Billing',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Card Number</label>
            <input
              type="text"
              placeholder="•••• •••• •••• ••••"
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">CVC</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Review & Confirm',
      content: (
        <div className="space-y-4">
          <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
            <h3 className="font-semibold text-[var(--text)] mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Service:</span>
                <span className="text-[var(--text)]">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Price:</span>
                <span className="text-[var(--primary)] font-medium">{selectedService?.price}</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-[var(--muted)]">
            <p>By confirming, you agree to add this service to your plan.</p>
          </div>
        </div>
      )
    }
  ]
  
  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-[var(--text)]">Marketplace</h1>
          <p className="text-[var(--muted)]">Enhance your security with additional services</p>
        </div>

                {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card
              key={service.key}
              onClick={() => handleServiceClick(service)}
              className="cursor-pointer hover:bg-[var(--surface-elev)]/80 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--text)] mb-1">{service.name}</h3>
                    <p className="text-[var(--primary)] font-medium">{service.price}</p>
                  </div>
                  <ShoppingBag className="w-5 h-5 text-[var(--muted)]" />
                </div>

                <div className="space-y-2">
                  {service.bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[var(--muted)]">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Service Details Sheet */}
      <Sheet
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.name}
      >
        {selectedService && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{selectedService.name}</h3>
              <p className="text-2xl font-bold text-[var(--primary)] mb-4">{selectedService.price}</p>
              
              <div className="space-y-3">
                {selectedService.bullets.map((bullet: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-[var(--success)] mt-0.5 flex-shrink-0" />
                    <p className="text-[var(--muted)]">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <HapticButton
                label="Add to Plan"
                onClick={handleAddToPlan}
                className="w-full"
              />
              <HapticButton
                label="Request Quote"
                variant="surface"
                onClick={handleRequestQuote}
                className="w-full"
              />
            </div>
          </div>
        )}
      </Sheet>

      {/* Checkout Sheet */}
      <Sheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title={`Checkout - ${checkoutSteps[checkoutStep]?.title}`}
        maxHeight="90vh"
      >
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {checkoutSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= checkoutStep 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-[var(--surface)] text-[var(--muted)]'
                }`}>
                  {index < checkoutStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < checkoutSteps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < checkoutStep ? 'bg-[var(--primary)]' : 'bg-[var(--surface)]'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Content */}
          <div>
            {checkoutSteps[checkoutStep]?.content}
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-3 pt-4">
            <HapticButton
              label="Back"
              variant="surface"
              onClick={handleCheckoutBack}
              className="flex-1"
            />
                          <HapticButton
                label={checkoutStep === 2 ? "Confirm" : "Next"}
                onClick={handleCheckoutNext}
                className="flex-1"
              />
          </div>
        </div>
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
