'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Activity, Loader2 } from 'lucide-react'
import { Sheet } from './Sheets'
import { HapticButton } from './HapticButton'
import { Badge } from './Badge'
import { MiniMap } from './MiniMap'
import { useHaptics } from '@/hooks/useHaptics'
import CustomMessageDialog from './CustomMessageDialog'
import type { RmmDeviceData } from '@/lib/rmm-datto'

export interface RmmDetailsPayload {
  device?: Record<string, unknown> | null
  audit?: Record<string, unknown> | null
  alerts?: unknown[]
}

/** Demo-Gerät mit Health/EDR oder RMM-Gerät mit rmmData. */
interface DeviceDetail {
  name: string
  type: string
  serial?: string
  os: string
  version: string
  lastLogin: string
  location: string | { name: string; lat: number; lng: number }
  user?: string
  edrStatus?: 'active' | 'inactive'
  complianceStatus?: 'compliant' | 'non-compliant'
  health?: { cpu: number; ram: number; storage: number }
  alerts?: Array<{ id: string; title: string; severity: string; time: string }>
  rmmData?: RmmDeviceData
}

interface DeviceDetailSheetProps {
  device: DeviceDetail | null
  isOpen: boolean
  onClose: () => void
  onRemoteInvestigation: () => void
  onSendMessage: () => void
  onIsolateDevice: () => void
}

export function DeviceDetailSheet({
  device,
  isOpen,
  onClose,
  onRemoteInvestigation,
  onSendMessage,
  onIsolateDevice
}: DeviceDetailSheetProps) {
  const [showCustomMessage, setShowCustomMessage] = useState(false)
  const [rmmDetails, setRmmDetails] = useState<RmmDetailsPayload | null>(null)
  const [rmmDetailsLoading, setRmmDetailsLoading] = useState(false)
  const h = useHaptics()

  const uid = device?.rmmData?.uid
  useEffect(() => {
    if (!isOpen || !uid) {
      setRmmDetails(null)
      return
    }
    setRmmDetailsLoading(true)
    setRmmDetails(null)
    fetch(`/api/rmm/device/${encodeURIComponent(uid)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data: RmmDetailsPayload) => setRmmDetails(data))
      .catch(() => setRmmDetails(null))
      .finally(() => setRmmDetailsLoading(false))
  }, [isOpen, uid])

  if (!device) return null

  const isRmmDevice = !!device.rmmData
  const rmm = device.rmmData
  const rmmDevice = rmmDetails?.device as Record<string, unknown> | undefined
  const rmmAudit = rmmDetails?.audit as Record<string, unknown> | undefined
  const rmmAlerts = (rmmDetails?.alerts ?? []) as Array<{ priority?: string; diagnostics?: string; timestamp?: string; ticketNumber?: string }>

  const formatLastLogin = (dateString: string) => {
    if (!dateString || dateString === '–') return dateString
    try {
      const date = new Date(dateString)
      if (Number.isNaN(date.getTime())) return dateString
      return date.toLocaleString()
    } catch {
      return dateString
    }
  }

  const getHealthColor = (value: number) => {
    if (value < 70) return 'text-[var(--success)]'
    if (value < 90) return 'text-[var(--warning)]'
    return 'text-[var(--danger)]'
  }

  const loc = device.location
  const locationLabel =
    typeof loc === 'string'
      ? loc
      : loc && typeof loc === 'object' && 'name' in loc
        ? (loc as { name: string }).name
        : '–'
  const locationCoords =
    loc && typeof loc === 'object' && 'lat' in loc ? (loc as { lat: number; lng: number; name: string }) : null

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Device Details"
      maxHeight="90vh"
    >
      <div className="space-y-6">
        {/* Device Header */}
        <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">{device.name}</h3>
              <p className="text-sm text-[var(--muted)]">{device.type}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isRmmDevice && (
                <Badge variant="accent">Datto RMM</Badge>
              )}
              {device.edrStatus != null && (
                <Badge variant={device.edrStatus === 'active' ? 'accent' : 'destructive'}>
                  {device.edrStatus === 'active' ? 'EDR Active' : 'EDR Inactive'}
                </Badge>
              )}
              {device.complianceStatus != null && (
                <Badge variant={device.complianceStatus === 'compliant' ? 'accent' : 'destructive'}>
                  {device.complianceStatus === 'compliant' ? 'Compliant' : 'Non-Compliant'}
                </Badge>
              )}
            </div>
          </div>

          {/* Datto RMM – alle Gerätedaten */}
          {rmm && (
            <div className="mb-4 p-3 rounded-[12px] bg-[var(--primary)]/10 border border-[var(--primary)]/20">
              <h4 className="font-medium text-[var(--text)] mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--primary)]" />
                Daten aus Datto RMM
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <p className="text-[var(--muted)]">Seriennummer / UID</p>
                  <p className="text-[var(--text)] font-mono">{rmm.uid || device.serial || '–'}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">IP-Adresse</p>
                  <p className="text-[var(--text)]">{rmm.ipAddress || '–'}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Domain</p>
                  <p className="text-[var(--text)]">{rmm.domain || '–'}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Standort (Site)</p>
                  <p className="text-[var(--text)]">{rmm.siteName || '–'}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Geräteklasse</p>
                  <p className="text-[var(--text)]">{rmm.deviceClass || '–'}</p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Letztes gesehen</p>
                  <p className="text-[var(--text)]">
                    {rmm.lastSeen ? new Date(rmm.lastSeen).toLocaleString() : '–'}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Letzter Nutzer</p>
                  <p className="text-[var(--text)]">{rmm.lastLoggedInUser || '–'}</p>
                </div>
                {rmm.description && (
                  <div className="col-span-2">
                    <p className="text-[var(--muted)]">Beschreibung</p>
                    <p className="text-[var(--text)]">{rmm.description}</p>
                  </div>
                )}
              </div>

              {/* Erweiterte RMM-Daten (vom Einzelgerät-Endpoint) */}
              {rmmDetailsLoading && (
                <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Zusätzliche Daten werden geladen…
                </div>
              )}
              {!rmmDetailsLoading && rmmDevice && (
                <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {rmmDevice.extIpAddress != null && (
                    <div>
                      <p className="text-[var(--muted)]">Externe IP</p>
                      <p className="text-[var(--text)] font-mono">{String(rmmDevice.extIpAddress)}</p>
                    </div>
                  )}
                  {rmmDevice.cagVersion != null && (
                    <div>
                      <p className="text-[var(--muted)]">Agent-Version</p>
                      <p className="text-[var(--text)]">{String(rmmDevice.cagVersion)}</p>
                    </div>
                  )}
                  {rmmDevice.lastReboot != null && (
                    <div>
                      <p className="text-[var(--muted)]">Letzter Neustart</p>
                      <p className="text-[var(--text)]">{new Date(String(rmmDevice.lastReboot)).toLocaleString()}</p>
                    </div>
                  )}
                  {rmmDevice.lastAuditDate != null && (
                    <div>
                      <p className="text-[var(--muted)]">Letztes Audit</p>
                      <p className="text-[var(--text)]">{new Date(String(rmmDevice.lastAuditDate)).toLocaleString()}</p>
                    </div>
                  )}
                  {rmmDevice.creationDate != null && (
                    <div>
                      <p className="text-[var(--muted)]">Erstellt am</p>
                      <p className="text-[var(--text)]">{new Date(String(rmmDevice.creationDate)).toLocaleString()}</p>
                    </div>
                  )}
                  {typeof rmmDevice.rebootRequired === 'boolean' && (
                    <div>
                      <p className="text-[var(--muted)]">Neustart nötig</p>
                      <p className="text-[var(--text)]">{rmmDevice.rebootRequired ? 'Ja' : 'Nein'}</p>
                    </div>
                  )}
                  {rmmDevice.antivirus != null && typeof rmmDevice.antivirus === 'object' && (
                    <div>
                      <p className="text-[var(--muted)]">Antivirus</p>
                      <p className="text-[var(--text)]">
                        {String((rmmDevice.antivirus as Record<string, unknown>).productName ?? (rmmDevice.antivirus as Record<string, unknown>).status ?? '–')}
                      </p>
                    </div>
                  )}
                  {rmmDevice.patchManagement != null && typeof rmmDevice.patchManagement === 'object' && (
                    <div>
                      <p className="text-[var(--muted)]">Patch-Status</p>
                      <p className="text-[var(--text)]">{String((rmmDevice.patchManagement as Record<string, unknown>).patchStatus ?? '–')}</p>
                    </div>
                  )}
                  {rmmDevice.softwareStatus != null && (
                    <div>
                      <p className="text-[var(--muted)]">Software-Status</p>
                      <p className="text-[var(--text)]">{String(rmmDevice.softwareStatus)}</p>
                    </div>
                  )}
                  {rmmDevice.warrantyDate != null && (
                    <div>
                      <p className="text-[var(--muted)]">Garantie bis</p>
                      <p className="text-[var(--text)]">{new Date(String(rmmDevice.warrantyDate)).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Hardware (Audit) */}
              {!rmmDetailsLoading && rmmAudit && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <h5 className="font-medium text-[var(--text)] mb-2">Hardware (Audit)</h5>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {rmmAudit.systemInfo != null && typeof rmmAudit.systemInfo === 'object' && (
                      <>
                        {(rmmAudit.systemInfo as Record<string, unknown>).manufacturer != null && (
                          <div>
                            <p className="text-[var(--muted)]">Hersteller</p>
                            <p className="text-[var(--text)]">{String((rmmAudit.systemInfo as Record<string, unknown>).manufacturer)}</p>
                          </div>
                        )}
                        {(rmmAudit.systemInfo as Record<string, unknown>).model != null && (
                          <div>
                            <p className="text-[var(--muted)]">Modell</p>
                            <p className="text-[var(--text)]">{String((rmmAudit.systemInfo as Record<string, unknown>).model)}</p>
                          </div>
                        )}
                        {(rmmAudit.systemInfo as Record<string, unknown>).serialNumber != null && (
                          <div>
                            <p className="text-[var(--muted)]">Seriennummer (Hardware)</p>
                            <p className="text-[var(--text)] font-mono">{String((rmmAudit.systemInfo as Record<string, unknown>).serialNumber)}</p>
                          </div>
                        )}
                      </>
                    )}
                    {Array.isArray(rmmAudit.processors) && rmmAudit.processors.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-[var(--muted)]">Prozessor</p>
                        <p className="text-[var(--text)]">{String((rmmAudit.processors[0] as Record<string, unknown>).name ?? rmmAudit.processors[0])}</p>
                      </div>
                    )}
                    {Array.isArray(rmmAudit.physicalMemory) && rmmAudit.physicalMemory.length > 0 && (
                      <div>
                        <p className="text-[var(--muted)]">Arbeitsspeicher (Module)</p>
                        <p className="text-[var(--text)]">{rmmAudit.physicalMemory.length} Modul(e)</p>
                      </div>
                    )}
                    {Array.isArray(rmmAudit.logicalDisks) && rmmAudit.logicalDisks.length > 0 && (
                      <div>
                        <p className="text-[var(--muted)]">Laufwerke</p>
                        <p className="text-[var(--text)]">{rmmAudit.logicalDisks.length} Laufwerk(e)</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Offene Alerts */}
              {!rmmDetailsLoading && rmmAlerts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <h5 className="font-medium text-[var(--text)] mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                    Offene Alerts ({rmmAlerts.length})
                  </h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {rmmAlerts.slice(0, 10).map((a, i) => (
                      <div key={i} className="p-2 rounded-lg bg-[var(--surface)] text-sm">
                        <div className="flex justify-between gap-2">
                          <Badge variant={a.priority === 'High' || a.priority === 'Critical' ? 'destructive' : 'secondary'}>
                            {a.priority ?? 'Alert'}
                          </Badge>
                          {a.ticketNumber && <span className="text-[var(--muted)] font-mono">{a.ticketNumber}</span>}
                        </div>
                        {a.diagnostics && <p className="text-[var(--text)] mt-1">{a.diagnostics}</p>}
                        {a.timestamp && <p className="text-[var(--muted)] text-xs mt-1">{new Date(a.timestamp).toLocaleString()}</p>}
                      </div>
                    ))}
                    {rmmAlerts.length > 10 && <p className="text-[var(--muted)] text-xs">… und {rmmAlerts.length - 10} weitere</p>}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">OS</p>
              <p className="text-[var(--text)]">{device.os} {device.version}</p>
            </div>
            <div>
              <p className="text-[var(--muted)]">Last Login</p>
              <p className="text-[var(--text)]">{isRmmDevice ? device.lastLogin : formatLastLogin(device.lastLogin)}</p>
            </div>
            {device.user != null && (
              <div>
                <p className="text-[var(--muted)]">User</p>
                <p className="text-[var(--text)]">{device.user}</p>
              </div>
            )}
            <div>
              <p className="text-[var(--muted)]">Location</p>
              <p className="text-[var(--text)]">
                {typeof device.location === 'string' ? device.location : device.location?.name ?? '–'}
              </p>
            </div>
            {device.serial && !rmm && (
              <div>
                <p className="text-[var(--muted)]">Serial</p>
                <p className="text-[var(--text)] font-mono">{device.serial}</p>
              </div>
            )}
          </div>
        </div>

        {/* Device Health – nur bei Demo-Geräten */}
        {device.health != null && (
        <div>
          <h4 className="font-medium text-[var(--text)] mb-3">Device Health</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--muted)]">CPU Usage</span>
                <span className={getHealthColor(device.health.cpu)}>{device.health.cpu}%</span>
              </div>
              <div className="w-full bg-[var(--surface)] rounded-full h-2">
                <div
                  className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${device.health.cpu}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--muted)]">RAM Usage</span>
                <span className={getHealthColor(device.health.ram)}>{device.health.ram}%</span>
              </div>
              <div className="w-full bg-[var(--surface)] rounded-full h-2">
                <div
                  className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${device.health.ram}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--muted)]">Storage Usage</span>
                <span className={getHealthColor(device.health.storage)}>{device.health.storage}%</span>
              </div>
              <div className="w-full bg-[var(--surface)] rounded-full h-2">
                <div
                  className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${device.health.storage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Location Map */}
        <div>
          <h4 className="font-medium text-[var(--text)] mb-3">Location</h4>
          {locationCoords ? (
            <MiniMap lat={locationCoords.lat} lng={locationCoords.lng} name={locationCoords.name} />
          ) : (
            <div className="p-4 bg-[var(--surface)]/50 rounded-[16px]">
              <p className="text-[var(--text)]">{locationLabel}</p>
            </div>
          )}
        </div>

        {/* Active Alerts */}
        {device.alerts && device.alerts.length > 0 && (
          <div>
            <h4 className="font-medium text-[var(--text)] mb-3">Active Alerts</h4>
            <div className="space-y-2">
              {device.alerts.map((alert) => (
                <div key={alert.id} className="flex items-center space-x-3 p-3 bg-[var(--surface)]/50 rounded-[12px]">
                  <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text)]">{alert.title}</p>
                    <p className="text-xs text-[var(--muted)]">{alert.time}</p>
                  </div>
                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <HapticButton
            label="Remote Investigation"
            onClick={() => {
              h.impact('medium')
              onRemoteInvestigation()
            }}
            className="w-full"
          />
          
          <HapticButton
            label="Send Message to User"
            variant="surface"
            onClick={() => {
              h.impact('light')
              setShowCustomMessage(true)
            }}
            className="w-full"
          />
          
          <HapticButton
            label="Isolate Device"
            variant="danger"
            onClick={() => {
              h.impact('heavy')
              onIsolateDevice()
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Custom Message Dialog */}
      <CustomMessageDialog
        open={showCustomMessage}
        onOpenChange={setShowCustomMessage}
        onSend={(message) => {
          h.success()
          onSendMessage()
          // TODO: Send custom message to SOC
        }}
      />
    </Sheet>
  )
}
