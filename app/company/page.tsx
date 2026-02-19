'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Plus, FileText, Edit } from 'lucide-react'
import { MiniMap } from '@/components/MiniMap'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'
import { FormSheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { company, demoTenant } from '@/lib/demo'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import { useActivityStore } from '@/lib/activity.store'

export default function CompanyPage() {
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const h = useHaptics()
  const addActivity = useActivityStore((s) => s.addActivity)
  
  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }
  
  const handleAddLocation = () => {
    h.impact('medium')
    addActivity({ type: 'added', title: 'Standort hinzugefügt' })
    addToast('success', 'Location added successfully')
    setIsAddLocationOpen(false)
  }
  
  const handleStartNavigation = (location: any) => {
    h.impact('light')
    const url = `https://maps.apple.com/?q=${encodeURIComponent(location.address)}`
    window.open(url, '_blank')
  }
  
  const handleEditCompany = () => {
    h.impact('light')
    addToast('info', 'Edit Company', 'Company details editing would be available in production.')
  }
  
  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Company Details */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text)] mb-2">{company.name}</h1>
              <p className="text-[var(--muted)]">Plan: {demoTenant.currentPlan.tier}</p>
            </div>
            <button
              onClick={handleEditCompany}
              className="p-2 rounded-full hover:bg-[var(--surface)]/50 transition-colors"
            >
              <Edit className="w-5 h-5 text-[var(--muted)]" />
            </button>
          </div>
        </Card>

        {/* Locations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--text)]">Locations</h2>
            <button
              onClick={() => setIsAddLocationOpen(true)}
              className="p-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
                          <div className="space-y-4">
            {company.locations.map((location) => (
              <Card key={location.name}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[var(--text)] mb-1">{location.name}</h3>
                      <p className="text-sm text-[var(--muted)]">{location.address}</p>
                    </div>
                    <HapticButton
                      label="Start Navigation"
                      variant="surface"
                      onClick={() => handleStartNavigation(location)}
                    />
                  </div>

                  {/* Mini Map */}
                  <MiniMap 
                    lat={location.lat} 
                    lng={location.lng} 
                    name={location.name}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Certificates</h2>
                          <div className="space-y-3">
            {company.certificates.map((cert) => (
              <Card key={cert.id}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-[12px] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--text)]">{cert.name}</h3>
                    <p className="text-sm text-[var(--muted)]">ID: {cert.id}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Add Location Sheet */}
      <FormSheet
        isOpen={isAddLocationOpen}
        onClose={() => setIsAddLocationOpen(false)}
        title="Add Location"
        onSubmit={handleAddLocation}
        submitLabel="Add Location"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Location Name</label>
            <input
              type="text"
              placeholder="e.g., Berlin Office"
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Address</label>
            <textarea
              placeholder="Full address"
              rows={3}
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
            />
          </div>
        </div>
      </FormSheet>

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
