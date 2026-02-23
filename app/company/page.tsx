'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Plus, FileText, Edit, Search, Building2, ChevronRight } from 'lucide-react'
import { MiniMap } from '@/components/MiniMap'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'
import { FormSheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { company as demoCompany, demoTenant } from '@/lib/demo'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import { useActivityStore } from '@/lib/activity.store'

type TenantItem = { id: string; name: string; partnerId?: string; active: boolean }

function getRoleFromCookie(): string {
  if (typeof document === 'undefined') return 'demo'
  const m = document.cookie.match(/(?:^|;) ?demo_role=([^;]+)/)
  return (m?.[1] ?? 'demo').toLowerCase()
}

function getTenantIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(/(?:^|;) ?demo_tenant_id=([^;]+)/)
  return m?.[1] ?? null
}

export default function CompanyPage() {
  const [role, setRole] = useState<string>('demo')
  const [tenantIdFromSession, setTenantIdFromSession] = useState<string | null>(null)
  const [tenants, setTenants] = useState<TenantItem[]>([])
  const [tenantsLoading, setTenantsLoading] = useState(false)
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const h = useHaptics()
  const addActivity = useActivityStore((s) => s.addActivity)

  const canSeeMultipleCompanies = role === 'superadmin' || role === 'admin' || role === 'partner'
  const effectiveTenantId = selectedTenantId ?? (canSeeMultipleCompanies ? null : tenantIdFromSession)

  useEffect(() => {
    setRole(getRoleFromCookie())
    setTenantIdFromSession(getTenantIdFromCookie())
  }, [])

  useEffect(() => {
    if (!canSeeMultipleCompanies) return
    setTenantsLoading(true)
    fetch('/api/tenants')
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data: { items?: TenantItem[] }) => setTenants(Array.isArray(data.items) ? data.items : []))
      .catch(() => setTenants([]))
      .finally(() => setTenantsLoading(false))
  }, [canSeeMultipleCompanies])

  useEffect(() => {
    if (canSeeMultipleCompanies && tenants.length > 0 && !selectedTenantId)
      setSelectedTenantId(tenants[0].id)
  }, [canSeeMultipleCompanies, tenants, selectedTenantId])

  useEffect(() => {
    if (!canSeeMultipleCompanies && tenantIdFromSession) setSelectedTenantId(tenantIdFromSession)
  }, [canSeeMultipleCompanies, tenantIdFromSession])

  useEffect(() => {
    if (canSeeMultipleCompanies || !tenantIdFromSession) return
    setTenantsLoading(true)
    fetch(`/api/tenants/${tenantIdFromSession}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { item?: TenantItem } | null) => {
        if (data?.item) setTenants([data.item])
      })
      .catch(() => {})
      .finally(() => setTenantsLoading(false))
  }, [canSeeMultipleCompanies, tenantIdFromSession])

  const selectedTenant = effectiveTenantId ? tenants.find((t) => t.id === effectiveTenantId) : null

  const filteredTenants = tenants.filter(
    (t) =>
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const handleAddLocation = () => {
    h.impact('medium')
    addActivity({ type: 'added', title: 'Standort hinzugefügt' })
    addToast('success', 'Location added successfully')
    setIsAddLocationOpen(false)
  }

  const handleStartNavigation = (location: { address: string }) => {
    h.impact('light')
    window.open(`https://maps.apple.com/?q=${encodeURIComponent(location.address)}`, '_blank')
  }

  const handleEditCompany = () => {
    h.impact('light')
    addToast('info', 'Edit Company', 'Company details editing in Admin → Tenants.')
  }

  const companyName = selectedTenant?.name ?? demoCompany.name
  const locations = demoCompany.locations
  const certificates = demoCompany.certificates
  const showDetail = selectedTenant || (!canSeeMultipleCompanies && !tenantIdFromSession)

  if (canSeeMultipleCompanies && !selectedTenantId && !tenantsLoading && tenants.length === 0) {
    return (
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        <Card className="p-8 text-center">
          <Building2 className="w-12 h-12 mx-auto text-[var(--muted)] mb-3" />
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">No companies yet</h2>
          <p className="text-[var(--muted)]">
            Create tenants in <strong>Admin → Tenants</strong> or import from Autotask (when configured).
          </p>
        </Card>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {canSeeMultipleCompanies && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-[var(--muted)]" />
              <input
                type="search"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[var(--text)] placeholder-[var(--muted)]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredTenants.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    h.impact('light')
                    setSelectedTenantId(t.id)
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-left transition-colors ${
                    selectedTenantId === t.id
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface-2)]/80'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs opacity-80">{t.id}</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              ))}
            </div>
            {tenantsLoading && <p className="text-sm text-[var(--muted)] mt-2">Loading companies…</p>}
          </Card>
        )}

        {showDetail && (
          <>
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text)] mb-2">{companyName}</h1>
                  <p className="text-[var(--muted)]">Plan: {demoTenant.currentPlan.tier}</p>
                  {selectedTenant.id && (
                    <p className="text-sm text-[var(--muted)] mt-1">ID: {selectedTenant.id}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleEditCompany}
                  className="p-2 rounded-full hover:bg-[var(--surface)]/50 transition-colors"
                >
                  <Edit className="w-5 h-5 text-[var(--muted)]" />
                </button>
              </div>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text)]">Locations</h2>
                <button
                  type="button"
                  onClick={() => setIsAddLocationOpen(true)}
                  className="p-2 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {locations.map((location) => (
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
                      <MiniMap lat={location.lat} lng={location.lng} name={location.name} />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Certificates</h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
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
          </>
        )}

        {!selectedTenant && !canSeeMultipleCompanies && tenantIdFromSession && tenantsLoading && (
          <p className="text-[var(--muted)]">Loading company…</p>
        )}
      </motion.div>

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

      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            />
          </div>
        ))}
      </div>
    </>
  )
}
