'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, MapPin, Wifi, RefreshCw, Building2 } from 'lucide-react'
import { Card } from '@/components/Card'
import { DeviceRow } from '@/components/DeviceRow'
import { HapticButton } from '@/components/HapticButton'
import { FormSheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { devices as demoDevices, demoTenant } from '@/lib/demo'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import { FolderOpen } from 'lucide-react'
import { useAuditStore } from '@/lib/store'
import { useActivityStore } from '@/lib/activity.store'
import { DeviceDetailSheet } from '@/components/DeviceDetailSheet'

type TenantItem = { id: string; name: string }

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

const DEVICES_TENANT_STORAGE_KEY = 'devices-selected-tenant-id'

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [isRemapLoading, setIsRemapLoading] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const [role, setRole] = useState<string>('demo')
  const [tenants, setTenants] = useState<TenantItem[]>([])
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    try { return localStorage.getItem(DEVICES_TENANT_STORAGE_KEY) } catch { return null }
  })
  /** Nutzerauswahl: Demo, Datto RMM oder Sophos EDR */
  const [dataMode, setDataMode] = useState<'demo' | 'rmm' | 'edr'>(() => {
    if (typeof window === 'undefined') return 'demo'
    try {
      const m = localStorage.getItem('devices-data-mode') as 'demo' | 'rmm' | 'edr'
      return m === 'rmm' || m === 'edr' ? m : 'demo'
    } catch { return 'demo' }
  })
  const [rmmDevicesCache, setRmmDevicesCache] = useState<any[]>([])
  const [edrDevicesCache, setEdrDevicesCache] = useState<any[]>([])
  const [devicesLoading, setDevicesLoading] = useState(true)
  const [rmmError, setRmmError] = useState<string | null>(null)
  const [edrError, setEdrError] = useState<string | null>(null)
  const h = useHaptics()
  const clearAuditCounts = useAuditStore(s => s.clearAuditCounts)
  const addActivity = useActivityStore((s) => s.addActivity)

  const canSeeMultipleCompanies = role === 'superadmin' || role === 'admin' || role === 'partner'
  const sessionTenantId = getTenantIdFromCookie()
  const effectiveTenantId = canSeeMultipleCompanies ? selectedTenantId : sessionTenantId

  const displayList = dataMode === 'demo' ? demoDevices : dataMode === 'rmm' ? rmmDevicesCache : edrDevicesCache

  const setDataModeAndPersist = (mode: 'demo' | 'rmm' | 'edr') => {
    setDataMode(mode)
    try { localStorage.setItem('devices-data-mode', mode) } catch { /* ignore */ }
  }

  const setSelectedTenantAndPersist = (id: string | null) => {
    setSelectedTenantId(id)
    try { if (id) localStorage.setItem(DEVICES_TENANT_STORAGE_KEY, id); else localStorage.removeItem(DEVICES_TENANT_STORAGE_KEY) } catch { /* ignore */ }
  }

  const loadRmmDevices = () => {
    setDevicesLoading(true)
    setRmmError(null)
    const q = effectiveTenantId ? `?tenantId=${encodeURIComponent(effectiveTenantId)}` : ''
    fetch(`/api/rmm/devices${q}`)
      .then((r) => r.json())
      .then((data: { source: string; devices: any[]; error?: string | null }) => {
        setRmmError(data.error ?? null)
        if (data.source === 'rmm' && Array.isArray(data.devices)) {
          setRmmDevicesCache(data.devices)
        } else {
          setRmmDevicesCache([])
        }
      })
      .catch(() => {
        setRmmError('Netzwerkfehler beim Laden der RMM-Daten.')
        setRmmDevicesCache([])
      })
      .finally(() => setDevicesLoading(false))
  }

  const loadEdrDevices = (showLoading = false) => {
    if (showLoading) setDevicesLoading(true)
    setEdrError(null)
    const q = effectiveTenantId ? `?tenantId=${encodeURIComponent(effectiveTenantId)}` : ''
    fetch(`/api/edr/devices${q}`)
      .then((r) => r.json())
      .then((data: { source: string; devices: any[]; error?: string | null }) => {
        setEdrError(data.error ?? null)
        if (data.source === 'edr' && Array.isArray(data.devices)) {
          setEdrDevicesCache(data.devices)
        } else {
          setEdrDevicesCache([])
        }
      })
      .catch(() => {
        setEdrError('Netzwerkfehler beim Laden der EDR-Daten.')
        setEdrDevicesCache([])
      })
      .finally(() => { if (showLoading) setDevicesLoading(false) })
  }

  useEffect(() => { setRole(getRoleFromCookie()) }, [])
  useEffect(() => {
    if (!canSeeMultipleCompanies) return
    fetch('/api/tenants')
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data: { items?: TenantItem[] }) => setTenants(Array.isArray(data.items) ? data.items : []))
      .catch(() => setTenants([]))
  }, [canSeeMultipleCompanies])

  useEffect(() => {
    loadRmmDevices()
    loadEdrDevices(false)
  }, [effectiveTenantId])
  
  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }
  
  const DEVICES_PER_PAGE = 25
  const [deviceListPage, setDeviceListPage] = useState(1)

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'server', label: 'Server' },
    { key: 'pc', label: 'PC' },
    { key: 'laptop', label: 'Laptop' },
    { key: 'phone', label: 'Phone' }
  ]
  
  const filteredDevices = displayList.filter(device => {
    const loc = typeof device.location === 'string' ? device.location : device.location?.name ?? ''
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (device.serial || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (loc || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || (device.type || '').toLowerCase() === selectedFilter
    return matchesSearch && matchesFilter
  })

  const totalFiltered = filteredDevices.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / DEVICES_PER_PAGE))
  const currentPage = Math.min(deviceListPage, totalPages)
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * DEVICES_PER_PAGE,
    currentPage * DEVICES_PER_PAGE
  )

  useEffect(() => {
    setDeviceListPage(1)
  }, [searchTerm, selectedFilter, displayList.length])

  const handleAddDevice = () => {
    h.impact('medium')
    addActivity({ type: 'added', title: 'Gerät hinzugefügt', message: 'Plan & Kosten aktualisiert' })
    addToast('success', 'Device added. Plan & costs updated.')
    setIsAddDeviceOpen(false)
  }
  
  const handleAddStaff = () => {
    h.impact('medium')
    addActivity({ type: 'added', title: 'Mitarbeiter hinzugefügt' })
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
      addActivity({ type: 'changed', title: 'Geräte-Mapping aktualisiert', message: '24 Geräte zugeordnet' })
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
    addActivity({ type: 'changed', title: 'Nachricht an Gerätenutzer gesendet' })
    addToast('success', 'Message Sent', 'Message sent to device user.')
    setSelectedDevice(null)
  }

  const handleIsolateDevice = () => {
    h.impact('heavy')
    addActivity({ type: 'changed', title: 'Gerät isoliert', message: 'Vom Netzwerk getrennt' })
    addToast('warning', 'Device Isolated', 'Device has been isolated from network.')
    setSelectedDevice(null)
  }
  
  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Company (Tenant) filter for SuperAdmin/Admin/Partner */}
        {canSeeMultipleCompanies && tenants.length > 0 && (
          <Card className="p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Building2 className="w-4 h-4 text-[var(--muted)] shrink-0" />
              <span className="text-sm font-medium text-[var(--muted)]">Company:</span>
              <select
                value={selectedTenantId ?? ''}
                onChange={(e) => { h.impact('light'); setSelectedTenantAndPersist(e.target.value || null) }}
                className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              >
                <option value="">All (default env)</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                ))}
              </select>
            </div>
          </Card>
        )}

        {/* Header: Titel + Umschalter Demo / RMM / EDR + Remap */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-[var(--text)]">Devices & Staff</h1>
            <div className="flex rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-0.5">
              <button
                type="button"
                onClick={() => { h.impact('light'); setDataModeAndPersist('demo') }}
                className={`px-3 py-1.5 rounded-[10px] text-sm font-medium transition-colors ${
                  dataMode === 'demo'
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                Demo
              </button>
              <button
                type="button"
                onClick={() => { h.impact('light'); setDataModeAndPersist('rmm') }}
                className={`px-3 py-1.5 rounded-[10px] text-sm font-medium transition-colors ${
                  dataMode === 'rmm'
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                RMM
              </button>
              <button
                type="button"
                onClick={() => { h.impact('light'); setDataModeAndPersist('edr') }}
                className={`px-3 py-1.5 rounded-[10px] text-sm font-medium transition-colors ${
                  dataMode === 'edr'
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                EDR
              </button>
            </div>
            {dataMode === 'demo' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-elev)] text-[var(--muted)] border border-[var(--border)]">
                Demo-Daten
              </span>
            )}
            {dataMode === 'edr' && (
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/30">
                  EDR (Sophos)
                </span>
                <button
                  type="button"
                  onClick={() => loadEdrDevices(true)}
                  disabled={devicesLoading}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] disabled:opacity-50"
                  title="EDR-Daten neu laden"
                >
                  <RefreshCw className={`w-4 h-4 ${devicesLoading ? 'animate-spin' : ''}`} />
                </button>
              </>
            )}
            {dataMode === 'rmm' && (
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Wifi className="w-3.5 h-3.5" />
                  Live aus Datto RMM
                </span>
                <button
                  type="button"
                  onClick={() => loadRmmDevices()}
                  disabled={devicesLoading}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] disabled:opacity-50"
                  title="RMM-Daten neu laden"
                >
                  <RefreshCw className={`w-4 h-4 ${devicesLoading ? 'animate-spin' : ''}`} />
                </button>
              </>
            )}
          </div>
          <HapticButton
            label={isRemapLoading ? "Remapping..." : "Remap"}
            variant="surface"
            onClick={isRemapLoading ? undefined : handleRemap}
          />
        </div>

        {/* RMM-Fehler: wenn RMM gewählt, aber Laden fehlgeschlagen */}
        {dataMode === 'rmm' && rmmError && rmmDevicesCache.length === 0 && (
          <div className="p-4 rounded-[16px] bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-[var(--text)] mb-3">
              <strong>RMM-Daten konnten nicht geladen werden.</strong> {rmmError}
            </p>
            <HapticButton
              label={devicesLoading ? 'Laden…' : 'RMM-Daten erneut laden'}
              variant="surface"
              onClick={devicesLoading ? undefined : loadRmmDevices}
              className="text-sm"
            />
          </div>
        )}

        {/* Hinweis bei RMM-Daten (wenn Geräte da sind) */}
        {dataMode === 'rmm' && displayList.length > 0 && (
          <div className="p-4 rounded-[16px] bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            <p className="text-sm text-[var(--text)]">
              <strong>Geräte aus Datto RMM.</strong> Klicken Sie auf ein Gerät für Seriennummer, IP, Domain, Standort und weitere Details.
            </p>
          </div>
        )}

        {/* RMM gewählt, aber keine Geräte (und kein Fehler) */}
        {dataMode === 'rmm' && displayList.length === 0 && !devicesLoading && !rmmError && (
          <div className="p-4 rounded-[16px] bg-[var(--surface)] border border-[var(--border)]">
            <p className="text-sm text-[var(--muted)]">
              Keine Geräte in Datto RMM gefunden. Prüfen Sie im RMM-Portal, ob Geräte angelegt sind.
            </p>
          </div>
        )}

        {/* EDR-Fehler */}
        {dataMode === 'edr' && edrError && edrDevicesCache.length === 0 && (
          <div className="p-4 rounded-[16px] bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-[var(--text)] mb-3">
              <strong>EDR-Daten konnten nicht geladen werden.</strong> {edrError}
            </p>
            <HapticButton
              label={devicesLoading ? 'Laden…' : 'EDR-Daten erneut laden'}
              variant="surface"
              onClick={devicesLoading ? undefined : () => loadEdrDevices(true)}
              className="text-sm"
            />
          </div>
        )}

        {/* Hinweis bei EDR-Daten */}
        {dataMode === 'edr' && displayList.length > 0 && (
          <div className="p-4 rounded-[16px] bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            <p className="text-sm text-[var(--text)]">
              <strong>Geräte aus Sophos EDR.</strong> Endpoints mit Health-Status und Tenant.
            </p>
          </div>
        )}

        {/* EDR gewählt, aber keine Geräte (und kein Fehler) */}
        {dataMode === 'edr' && displayList.length === 0 && !devicesLoading && !edrError && (
          <div className="p-4 rounded-[16px] bg-[var(--surface)] border border-[var(--border)]">
            <p className="text-sm text-[var(--muted)]">
              Keine EDR-Endpoints gefunden. Prüfen Sie Sophos Central und die API-Konfiguration.
            </p>
          </div>
        )}

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

        {/* Device Count + Pagination Info */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-[var(--muted)]">
            {dataMode === 'rmm' && devicesLoading
              ? 'Laden…'
              : totalPages > 1
                ? `Geräte ${(currentPage - 1) * DEVICES_PER_PAGE + 1}–${Math.min(currentPage * DEVICES_PER_PAGE, totalFiltered)} von ${totalFiltered}`
                : `${totalFiltered} Gerät${totalFiltered !== 1 ? 'e' : ''}`}
          </div>
        </div>

        {/* Device List */}
        <div className="space-y-3">
          {paginatedDevices.map((device) => (
            <div key={device.uid ?? device.serial ?? device.name} onClick={() => handleDeviceClick(device)}>
              <DeviceRow device={device} />
            </div>
          ))}
        </div>

        {/* Seiten-Navigation */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => { h.impact('light'); setDeviceListPage(p => Math.max(1, p - 1)) }}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-[10px] text-sm font-medium bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-elev)]"
            >
              Zurück
            </button>
            <div className="flex flex-wrap justify-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { h.impact('light'); setDeviceListPage(p) }}
                  className={`min-w-[2.25rem] px-2 py-1.5 rounded-[10px] text-sm font-medium ${
                    p === currentPage
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--text)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => { h.impact('light'); setDeviceListPage(p => Math.min(totalPages, p + 1)) }}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-[10px] text-sm font-medium bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-elev)]"
            >
              Weiter
            </button>
          </div>
        )}
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

      {/* Project Suggestion */}
      <Card>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-[8px] flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-[var(--primary)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text)]">Need a Project?</h3>
            <p className="text-sm text-[var(--muted)]">
              Create a project to scope and track this work
            </p>
          </div>
          <HapticButton
            label="Create"
            onClick={() => window.location.href = '/projects?new=1'}
            variant="surface"
            className="text-xs"
          />
        </div>
      </Card>

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
