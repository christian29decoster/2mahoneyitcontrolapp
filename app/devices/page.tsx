'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, MapPin, Wifi, RefreshCw, Building2, Radio } from 'lucide-react'
import { Card } from '@/components/Card'
import { DeviceRow } from '@/components/DeviceRow'
import { HapticButton } from '@/components/HapticButton'
import { FormSheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { devices as demoDevices, demoTenant } from '@/lib/demo'
import { siemDemoDevices } from '@/lib/siem-demo-devices'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import { FolderOpen } from 'lucide-react'
import { useAuditStore } from '@/lib/store'
import { useActivityStore } from '@/lib/activity.store'
import { DeviceDetailSheet } from '@/components/DeviceDetailSheet'
import { useViewModeStore } from '@/lib/viewMode.store'

type TenantItem = { id: string; name: string }

/** Normalize "last user" from demo user, RMM lastLoggedInUser, or from "user • date" in lastLogin. */
function getLastUser(device: any): string {
  if (device?.user) return device.user
  if (device?.rmmData?.lastLoggedInUser) return device.rmmData.lastLoggedInUser
  const ll = device?.lastLogin
  if (typeof ll === 'string' && ll.includes(' • ')) return ll.split(' • ')[0].trim()
  return '–'
}

/** Last login date/time for display (full string or date part). */
function getLastLoginDisplay(device: any): string {
  const ll = device?.lastLogin
  if (!ll) return '–'
  if (typeof ll === 'string' && ll.includes(' • ')) return ll.split(' • ').slice(1).join(' • ').trim() || ll
  return ll
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
  /** For tenant_user: display name of the single org they belong to */
  const [currentTenantName, setCurrentTenantName] = useState<string | null>(null)
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    try { return localStorage.getItem(DEVICES_TENANT_STORAGE_KEY) } catch { return null }
  })
  /** Nutzerauswahl: Demo, Datto RMM, SIEM (SOC), Sophos EDR */
  const [dataMode, setDataMode] = useState<'demo' | 'rmm' | 'siem' | 'edr'>(() => {
    if (typeof window === 'undefined') return 'demo'
    try {
      const m = localStorage.getItem('devices-data-mode') as 'demo' | 'rmm' | 'siem' | 'edr'
      return m === 'rmm' || m === 'edr' || m === 'siem' ? m : 'demo'
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
  const viewMode = useViewModeStore((s) => s.viewMode)

  const canSeeMultipleCompanies = role === 'superadmin' || role === 'admin' || role === 'partner'
  const sessionTenantId = getTenantIdFromCookie()
  const effectiveTenantId = canSeeMultipleCompanies ? selectedTenantId : sessionTenantId

  const displayList =
    dataMode === 'demo'
      ? demoDevices
      : dataMode === 'rmm'
        ? rmmDevicesCache
        : dataMode === 'siem'
          ? siemDemoDevices
          : edrDevicesCache

  const setDataModeAndPersist = (mode: 'demo' | 'rmm' | 'siem' | 'edr') => {
    setDataMode(mode)
    try { localStorage.setItem('devices-data-mode', mode) } catch { /* ignore */ }
  }

  const setSelectedTenantAndPersist = (id: string | null) => {
    setSelectedTenantId(id)
    try { if (id) localStorage.setItem(DEVICES_TENANT_STORAGE_KEY, id); else localStorage.removeItem(DEVICES_TENANT_STORAGE_KEY) } catch { /* ignore */ }
  }

  const loadRmmDevices = useCallback(() => {
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
        setRmmError('Network error loading RMM data.')
        setRmmDevicesCache([])
      })
      .finally(() => setDevicesLoading(false))
  }, [effectiveTenantId])

  const loadEdrDevices = useCallback((showLoading = false) => {
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
        setEdrError('Network error loading EDR data.')
        setEdrDevicesCache([])
      })
      .finally(() => { if (showLoading) setDevicesLoading(false) })
  }, [effectiveTenantId])

  useEffect(() => { setRole(getRoleFromCookie()) }, [])
  useEffect(() => {
    if (!canSeeMultipleCompanies) return
    fetch('/api/tenants')
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data: { items?: TenantItem[] }) => setTenants(Array.isArray(data.items) ? data.items : []))
      .catch(() => setTenants([]))
  }, [canSeeMultipleCompanies])
  /** Tenant-user: load single tenant name for read-only "Organization: [name]" */
  useEffect(() => {
    if (canSeeMultipleCompanies || !sessionTenantId) return
    fetch(`/api/tenants/${sessionTenantId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { item?: { name?: string } } | null) => setCurrentTenantName(data?.item?.name ?? null))
      .catch(() => setCurrentTenantName(null))
  }, [canSeeMultipleCompanies, sessionTenantId])

  useEffect(() => {
    loadRmmDevices()
    loadEdrDevices(false)
  }, [loadRmmDevices, loadEdrDevices])
  
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
  
  const filteredDevices = displayList.filter((device: any) => {
    const loc = typeof device.location === 'string' ? device.location : device.location?.name ?? ''
    const q = searchTerm.toLowerCase()
    const siem = device.siemData as { logSources?: string[]; lastNotableEvent?: string; mitreTactics?: string } | undefined
    const matchesSiem =
      siem &&
      (siem.logSources?.some((l) => l.toLowerCase().includes(q)) ||
        (siem.lastNotableEvent && siem.lastNotableEvent.toLowerCase().includes(q)) ||
        (siem.mitreTactics && siem.mitreTactics.toLowerCase().includes(q)))
    const matchesSearch =
      device.name.toLowerCase().includes(q) ||
      (device.serial || '').toLowerCase().includes(q) ||
      (loc || '').toLowerCase().includes(q) ||
      !!matchesSiem
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
    addActivity({ type: 'added', title: 'Device added', message: 'Plan & costs updated' })
    addToast('success', 'Device added. Plan & costs updated.')
    setIsAddDeviceOpen(false)
  }
  
  const handleAddStaff = () => {
    h.impact('medium')
    addActivity({ type: 'added', title: 'Staff added' })
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
      addActivity({ type: 'changed', title: 'Device mapping updated', message: '24 devices assigned' })
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
    addActivity({ type: 'changed', title: 'Message sent to device user' })
    addToast('success', 'Message Sent', 'Message sent to device user.')
    setSelectedDevice(null)
  }

  const handleIsolateDevice = () => {
    h.impact('heavy')
    addActivity({ type: 'changed', title: 'Device isolated', message: 'Disconnected from network' })
    addToast('warning', 'Device Isolated', 'Device has been isolated from network.')
    setSelectedDevice(null)
  }
  
  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Scope: Mahoney = all orgs, Partner = their customers, Customer = own org only */}
        {(canSeeMultipleCompanies && tenants.length > 0) || (!canSeeMultipleCompanies && sessionTenantId) ? (
          <Card className="p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Building2 className="w-4 h-4 text-[var(--muted)] shrink-0" />
              {canSeeMultipleCompanies ? (
                <>
                  <span className="text-sm font-medium text-[var(--muted)]">
                    {role === 'partner' ? 'Customer:' : 'Organization:'}
                  </span>
                  <select
                    value={selectedTenantId ?? ''}
                    onChange={(e) => { h.impact('light'); setSelectedTenantAndPersist(e.target.value || null) }}
                    className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  >
                    {role !== 'partner' && <option value="">All (default env)</option>}
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                    ))}
                  </select>
                </>
              ) : (
                <span className="text-sm text-[var(--text)]">
                  <span className="font-medium text-[var(--muted)]">Organization: </span>
                  {currentTenantName ?? 'Your organization'}
                </span>
              )}
            </div>
          </Card>
        ) : null}

        {/* Header: Titel + Umschalter Demo / RMM / SIEM / EDR + Remap */}
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
                onClick={() => { h.impact('light'); setDataModeAndPersist('siem') }}
                className={`px-3 py-1.5 rounded-[10px] text-sm font-medium transition-colors ${
                  dataMode === 'siem'
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                SIEM
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
                Demo data
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
                  title="Reload EDR data"
                >
                  <RefreshCw className={`w-4 h-4 ${devicesLoading ? 'animate-spin' : ''}`} />
                </button>
              </>
            )}
            {dataMode === 'rmm' && (
              <>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Wifi className="w-3.5 h-3.5" />
                  Live from Datto RMM
                </span>
                <button
                  type="button"
                  onClick={() => loadRmmDevices()}
                  disabled={devicesLoading}
                  className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] disabled:opacity-50"
                  title="Reload RMM data"
                >
                  <RefreshCw className={`w-4 h-4 ${devicesLoading ? 'animate-spin' : ''}`} />
                </button>
              </>
            )}
            {dataMode === 'siem' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                <Radio className="w-3.5 h-3.5" />
                SIEM · SOC (demo)
              </span>
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
              <strong>RMM data could not be loaded.</strong> {rmmError}
            </p>
            <HapticButton
              label={devicesLoading ? 'Loading…' : 'Reload RMM data'}
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
              <strong>Devices from Datto RMM.</strong> Click a device for serial number, IP, domain, company and more details.
            </p>
          </div>
        )}

        {/* RMM gewählt, aber keine Geräte (und kein Fehler) */}
        {dataMode === 'rmm' && displayList.length === 0 && !devicesLoading && !rmmError && (
          <div className="p-4 rounded-[16px] bg-[var(--surface)] border border-[var(--border)]">
            <p className="text-sm text-[var(--muted)]">
              No devices found in Datto RMM. Check the RMM portal to see if devices are set up.
            </p>
          </div>
        )}

        {/* EDR-Fehler */}
        {dataMode === 'edr' && edrError && edrDevicesCache.length === 0 && (
          <div className="p-4 rounded-[16px] bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-[var(--text)] mb-3">
              <strong>EDR data could not be loaded.</strong> {edrError}
            </p>
            <HapticButton
              label={devicesLoading ? 'Loading…' : 'Reload EDR data'}
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
              <strong>Devices from Sophos EDR.</strong> Endpoints with health status and tenant.
            </p>
          </div>
        )}

        {/* EDR gewählt, aber keine Geräte (und kein Fehler) */}
        {dataMode === 'edr' && displayList.length === 0 && !devicesLoading && !edrError && (
          <div className="p-4 rounded-[16px] bg-[var(--surface)] border border-[var(--border)]">
            <p className="text-sm text-[var(--muted)]">
              No EDR endpoints found. Check Sophos Central and the API configuration.
            </p>
          </div>
        )}

        {/* SIEM: Hinweis (Mahoney SOC Handbook — collection, normalization, correlation, triage) */}
        {dataMode === 'siem' && displayList.length > 0 && (
          <div className="p-4 rounded-[16px] bg-cyan-500/10 border border-cyan-500/25">
            <p className="text-sm text-[var(--text)]">
              <strong>SIEM-covered assets (demo).</strong> Each row reflects log sources, ingestion health, normalized event volume,
              and correlated alerts aligned with the <strong>Mahoney SOC Handbook</strong> workflow (collection → normalization → correlation → L1/L2 triage).
              MITRE ATT&CK references illustrate analyst routing; live data would come from your SIEM connector.
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
              ? 'Loading…'
              : dataMode === 'edr' && devicesLoading
                ? 'Loading…'
                : totalPages > 1
                  ? `Devices ${(currentPage - 1) * DEVICES_PER_PAGE + 1}–${Math.min(currentPage * DEVICES_PER_PAGE, totalFiltered)} of ${totalFiltered}`
                  : `${totalFiltered} device${totalFiltered !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Device List: table on desktop, cards on app */}
        {viewMode === 'desktop' ? (
          <Card className="overflow-x-auto p-0">
            {dataMode === 'siem' ? (
              <table className="w-full text-sm text-left min-w-[900px]">
                <thead>
                  <tr className="text-[var(--muted)] border-b border-[var(--border)] bg-[var(--surface-2)]/50">
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Hostname</th>
                    <th className="py-3 px-4 font-semibold">OS</th>
                    <th className="py-3 px-4 font-semibold">Log sources</th>
                    <th className="py-3 px-4 font-semibold">Ingestion</th>
                    <th className="py-3 px-4 font-semibold text-right">Events / 24h</th>
                    <th className="py-3 px-4 font-semibold text-right">Alerts</th>
                    <th className="py-3 px-4 font-semibold">Last notable</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text)]">
                  {paginatedDevices.map((device: any) => {
                    const s = device.siemData
                    if (!s) return null
                    return (
                      <tr
                        key={device.uid ?? device.serial ?? device.name}
                        onClick={() => handleDeviceClick(device)}
                        className="border-b border-[var(--border)] hover:bg-[var(--surface-elev)]/50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">{device.type ?? '–'}</td>
                        <td className="py-3 px-4 font-medium">{device.name ?? '–'}</td>
                        <td className="py-3 px-4">{device.os ?? '–'}</td>
                        <td className="py-3 px-4 max-w-[220px] text-xs" title={s.logSources.join(', ')}>
                          {s.logSources.slice(0, 2).join(' · ')}
                          {s.logSources.length > 2 ? '…' : ''}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                              s.ingestionHealth === 'ok'
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : s.ingestionHealth === 'degraded'
                                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                  : 'bg-red-500/20 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {s.ingestionHealth}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-xs">{s.normalizedEvents24h.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-medium">{s.openAlerts}</span>
                          <span className="text-[var(--muted)] text-xs ml-1">({s.maxSeverity})</span>
                        </td>
                        <td className="py-3 px-4 text-xs max-w-[280px]">{s.lastNotableEvent}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[var(--muted)] border-b border-[var(--border)] bg-[var(--surface-2)]/50">
                    <th className="py-3 px-4 font-semibold">Device type</th>
                    <th className="py-3 px-4 font-semibold">Hostname</th>
                    <th className="py-3 px-4 font-semibold">OS</th>
                    <th className="py-3 px-4 font-semibold">Last user</th>
                    <th className="py-3 px-4 font-semibold">Last login</th>
                    <th className="py-3 px-4 font-semibold">Serial</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text)]">
                  {paginatedDevices.map((device) => (
                    <tr
                      key={device.uid ?? device.serial ?? device.name}
                      onClick={() => handleDeviceClick(device)}
                      className="border-b border-[var(--border)] hover:bg-[var(--surface-elev)]/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">{device.type ?? '–'}</td>
                      <td className="py-3 px-4 font-medium">{device.name ?? '–'}</td>
                      <td className="py-3 px-4">{device.os ?? '–'}</td>
                      <td className="py-3 px-4">{getLastUser(device)}</td>
                      <td className="py-3 px-4">{getLastLoginDisplay(device)}</td>
                      <td className="py-3 px-4 font-mono text-xs">{device.serial ?? '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {paginatedDevices.map((device) => (
              <div key={device.uid ?? device.serial ?? device.name} onClick={() => handleDeviceClick(device)}>
                <DeviceRow device={device} />
              </div>
            ))}
          </div>
        )}

        {/* Seiten-Navigation */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => { h.impact('light'); setDeviceListPage(p => Math.max(1, p - 1)) }}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-[10px] text-sm font-medium bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-elev)]"
            >
              Back
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
              Next
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
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Company</label>
            <input
              type="text"
              placeholder="Company (e.g. from RMM Location)"
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
