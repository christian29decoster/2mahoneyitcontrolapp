'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, MapPin } from 'lucide-react'
import { Card } from '@/components/Card'
import { DeviceRow } from '@/components/DeviceRow'
import { HapticButton } from '@/components/HapticButton'
import { FormSheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { devices, demoTenant } from '@/lib/demo'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import { useAuditStore } from '@/lib/store'
import { DeviceDetailSheet } from '@/components/DeviceDetailSheet'

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [isRemapLoading, setIsRemapLoading] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const h = useHaptics()
  const clearAuditCounts = useAuditStore(s => s.clearAuditCounts)
  
  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }
  
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'server', label: 'Server' },
    { key: 'pc', label: 'PC' },
    { key: 'laptop', label: 'Laptop' },
    { key: 'phone', label: 'Phone' }
  ]
  
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || device.type.toLowerCase() === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const handleAddDevice = () => {
    h.impact('medium')
    addToast('success', 'Device added. Plan & costs updated.')
    setIsAddDeviceOpen(false)
  }
  
  const handleAddStaff = () => {
    h.impact('medium')
    addToast('success', 'Staff added.')
    setIsAddStaffOpen(false)
  }
  
  const handleRemap = () => {
    if (demoTenant.currentPlan.tier === 'Essential') {
      addToast('warning', 'Automated discovery requires Prime. Preview upgrade?')
      return
    }

    setIsRemapLoading(true)
    h.impact('medium')

    setTimeout(() => {
      setIsRemapLoading(false)
      h.success()
      addToast('success', 'Mapping successful. 24 devices updated.')
    }, 2000)
  }

  // Badge zurücksetzen beim Öffnen der Devices-Seite
  useEffect(() => {
    clearAuditCounts()
  }, [clearAuditCounts])

  const handleDeviceClick = (device: any) => {
    h.impact('light')
    setSelectedDevice(device)
  }

  const handleRemoteInvestigation = () => {
    h.impact('medium')
    addToast('info', 'Remote Investigation', 'Initiating remote investigation session...')
    setSelectedDevice(null)
  }

  const handleSendMessage = () => {
    h.impact('light')
    addToast('success', 'Message Sent', 'Message sent to device user.')
    setSelectedDevice(null)
  }

  const handleIsolateDevice = () => {
    h.impact('heavy')
    addToast('warning', 'Device Isolated', 'Device has been isolated from network.')
    setSelectedDevice(null)
  }
  
  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Header with Remap */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--text)]">Devices & Staff</h1>
          <HapticButton
            label={isRemapLoading ? "Remapping..." : "Remap"}
            variant="surface"
            onClick={isRemapLoading ? undefined : handleRemap}
          />
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => {
                  h.impact('light')
                  setSelectedFilter(filter.key)
                }}
                className={`px-4 py-2 rounded-[12px] text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-elev)]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Device Count */}
        <div className="text-sm text-[var(--muted)]">
          {filteredDevices.length} of {devices.length} devices
        </div>

        {/* Device List */}
        <div className="space-y-3">
          {filteredDevices.map((device) => (
            <div key={device.serial} onClick={() => handleDeviceClick(device)}>
              <DeviceRow device={device} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Device Sheet */}
      <FormSheet
        isOpen={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        title="Add Device"
        onSubmit={handleAddDevice}
        submitLabel="Add Device"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Type</label>
            <select className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
              <option>Server</option>
              <option>PC</option>
              <option>Laptop</option>
              <option>Phone</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Name</label>
            <input
              type="text"
              placeholder="Device name"
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Serial</label>
            <input
              type="text"
              placeholder="Serial number"
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Location</label>
            <input
              type="text"
              placeholder="Office location"
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Room</label>
            <input
              type="text"
              placeholder="Room number"
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Assign to</label>
            <input
              type="text"
              placeholder="Staff member (optional)"
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
        </div>
      </FormSheet>

      {/* Add Staff Sheet */}
      <FormSheet
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        title="Add Staff"
        onSubmit={handleAddStaff}
        submitLabel="Add Staff"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Name</label>
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Email</label>
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Role</label>
            <select className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
              <option>Security Manager</option>
              <option>IT Administrator</option>
              <option>Facility Manager</option>
              <option>Security Officer</option>
              <option>System Administrator</option>
            </select>
          </div>
        </div>
      </FormSheet>

      {/* Action Sheet for FAB */}
      <FormSheet
        isOpen={false}
        onClose={() => {}}
        title="Add"
        onSubmit={() => {}}
      >
        <div className="space-y-4">
          <HapticButton
            label="Add Device"
            onClick={() => setIsAddDeviceOpen(true)}
            className="w-full"
          />
          <HapticButton
            label="Add Staff"
            variant="surface"
            onClick={() => setIsAddStaffOpen(true)}
            className="w-full"
          />
        </div>
      </FormSheet>

      {/* Device Detail Sheet */}
      <DeviceDetailSheet
        device={selectedDevice}
        isOpen={!!selectedDevice}
        onClose={() => setSelectedDevice(null)}
        onRemoteInvestigation={handleRemoteInvestigation}
        onSendMessage={handleSendMessage}
        onIsolateDevice={handleIsolateDevice}
      />

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
