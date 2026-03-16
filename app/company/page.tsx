'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Plus, FileText, Edit, Search, Building2, ChevronDown, Check } from 'lucide-react'
import { MiniMap } from '@/components/MiniMap'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'
import { FormSheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { company as demoCompany, demoTenant } from '@/lib/demo'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import { useActivityStore } from '@/lib/activity.store'
import { useDemoViewRoleStore } from '@/lib/demoViewRole.store'

/** Tenant id for Acme Engineering Inc. (single-tenant demo for clients). */
const ACME_TENANT_ID = 'O-25-001'

type TenantLocation = { name: string; address: string; lat: number; lng: number }
type TenantCertificate = { id: string; name: string }
type TenantItem = {
  id: string
  name: string
  partnerId?: string
  active: boolean
  locations?: TenantLocation[]
  certificates?: TenantCertificate[]
}

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
  const [orgPickerOpen, setOrgPickerOpen] = useState(false)
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const h = useHaptics()
  const addActivity = useActivityStore((s) => s.addActivity)
  const demoViewRole = useDemoViewRoleStore((s) => s.demoViewRole)
  const isClientDemo = demoViewRole === 'client_wit' || demoViewRole === 'client_woit'

  const canSeeMultipleCompanies = !isClientDemo && (role === 'superadmin' || role === 'admin' || role === 'partner')
  const effectiveSingleTenantId = tenantIdFromSession ?? (isClientDemo ? ACME_TENANT_ID : null)
  const effectiveTenantId = selectedTenantId ?? (canSeeMultipleCompanies ? null : effectiveSingleTenantId)

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
    if (!canSeeMultipleCompanies && effectiveSingleTenantId) setSelectedTenantId(effectiveSingleTenantId)
  }, [canSeeMultipleCompanies, effectiveSingleTenantId])

  useEffect(() => {
    if (!orgPickerOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOrgPickerOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [orgPickerOpen])

  useEffect(() => {
    if (canSeeMultipleCompanies || !effectiveSingleTenantId) return
    setTenantsLoading(true)
    fetch(`/api/tenants/${effectiveSingleTenantId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { item?: TenantItem } | null) => {
        if (data?.item) setTenants([data.item])
      })
      .catch(() => {})
      .finally(() => setTenantsLoading(false))
  }, [canSeeMultipleCompanies, effectiveSingleTenantId])

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
  const locations =
    selectedTenant?.locations && selectedTenant.locations.length > 0
      ? selectedTenant.locations
      : demoCompany.locations
  const certificates =
    selectedTenant?.certificates && selectedTenant.certificates.length > 0
      ? selectedTenant.certificates
      : demoCompany.certificates
  const showDetail = selectedTenant || (!canSeeMultipleCompanies && !effectiveSingleTenantId)

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

  const isPartner = role === 'partner'

  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Scope: Customer sees read-only org name; Partner/Mahoney see selector */}
        {!canSeeMultipleCompanies && (effectiveSingleTenantId || tenants.length > 0) && (
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[var(--muted)] shrink-0" />
              <span className="text-sm text-[var(--text)]">
                <span className="font-medium text-[var(--muted)]">Organization: </span>
                {tenants[0]?.name ?? 'Your organization'}
              </span>
            </div>
          </Card>
        )}
        {canSeeMultipleCompanies && (
          <Card className="p-4 relative">
            <button
              type="button"
              onClick={() => { h.impact('light'); setOrgPickerOpen((o) => !o) }}
              className="flex items-center gap-3 w-full text-left rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 hover:bg-[var(--surface-2)]/80 transition-colors"
              aria-expanded={orgPickerOpen}
              aria-haspopup="listbox"
              aria-label={isPartner ? 'Select customer' : 'Select organization'}
            >
              <Building2 className="w-5 h-5 text-[var(--muted)] shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-[var(--text)] block truncate">
                  {selectedTenant ? `${selectedTenant.name} (${selectedTenant.id})` : (isPartner ? 'Select a customer' : 'Select an organization')}
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {isPartner ? 'Customer' : 'Organization'} · {tenants.length} total
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 text-[var(--muted)] shrink-0 transition-transform ${orgPickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {orgPickerOpen && (
              <>
                <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elev)] shadow-lg overflow-hidden" role="listbox">
                  <div className="p-2 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2 rounded-lg bg-[var(--surface-2)] px-3 py-2">
                      <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
                      <input
                        type="search"
                        placeholder={isPartner ? 'Search customers...' : 'Search organizations...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-[280px] overflow-y-auto overscroll-contain">
                    {filteredTenants.length === 0 ? (
                      <p className="py-4 px-4 text-sm text-[var(--muted)] text-center">
                        {searchQuery.trim() ? 'No matches' : 'Loading…'}
                      </p>
                    ) : (
                      filteredTenants.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          role="option"
                          aria-selected={selectedTenantId === t.id}
                          onClick={() => {
                            h.impact('light')
                            setSelectedTenantId(t.id)
                            setOrgPickerOpen(false)
                          }}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                            selectedTenantId === t.id
                              ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                              : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                          }`}
                        >
                          {selectedTenantId === t.id ? <Check className="w-4 h-4 shrink-0" /> : <Building2 className="w-4 h-4 shrink-0 text-[var(--muted)]" />}
                          <span className="font-medium truncate">{t.name}</span>
                          <span className="text-xs text-[var(--muted)] shrink-0">{t.id}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="fixed inset-0 z-10"
                  aria-label="Close"
                  onClick={() => setOrgPickerOpen(false)}
                />
              </>
            )}
            {tenantsLoading && <p className="text-sm text-[var(--muted)] mt-2">Loading…</p>}
          </Card>
        )}

        {showDetail && (
          <>
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text)] mb-2">{companyName}</h1>
                  <p className="text-[var(--muted)]">Plan: {demoTenant.currentPlan.tier}</p>
                  {selectedTenant?.id && (
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
