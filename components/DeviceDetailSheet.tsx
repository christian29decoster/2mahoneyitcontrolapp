'use client'

import { motion } from 'framer-motion'
import { Shield, AlertTriangle, MessageSquare, Wifi, Download, Send } from 'lucide-react'
import { Sheet } from './Sheets'
import { HapticButton } from './HapticButton'
import { Badge } from './Badge'
import { MiniMap } from './MiniMap'
import { useHaptics } from '@/hooks/useHaptics'

interface DeviceDetail {
  name: string
  type: string
  os: string
  version: string
  lastLogin: string
  location: string | {
    name: string
    lat: number
    lng: number
  }
  user: string
  edrStatus: 'active' | 'inactive'
  complianceStatus: 'compliant' | 'non-compliant'
  health: {
    cpu: number
    ram: number
    storage: number
  }
  alerts: Array<{
    id: string
    title: string
    severity: string
    time: string
  }>
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
  const h = useHaptics()

  if (!device) return null

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getHealthColor = (value: number) => {
    if (value < 70) return 'text-[var(--success)]'
    if (value < 90) return 'text-[var(--warning)]'
    return 'text-[var(--danger)]'
  }

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
            <div className="flex space-x-2">
              <Badge variant={device.edrStatus === 'active' ? 'accent' : 'destructive'}>
                {device.edrStatus === 'active' ? 'EDR Active' : 'EDR Inactive'}
              </Badge>
              <Badge variant={device.complianceStatus === 'compliant' ? 'accent' : 'destructive'}>
                {device.complianceStatus === 'compliant' ? 'Compliant' : 'Non-Compliant'}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">OS</p>
              <p className="text-[var(--text)]">{device.os} {device.version}</p>
            </div>
            <div>
              <p className="text-[var(--muted)]">Last Login</p>
              <p className="text-[var(--text)]">{formatLastLogin(device.lastLogin)}</p>
            </div>
            <div>
              <p className="text-[var(--muted)]">User</p>
              <p className="text-[var(--text)]">{device.user}</p>
            </div>
            <div>
              <p className="text-[var(--muted)]">Location</p>
              <p className="text-[var(--text)]">
                {typeof device.location === 'string' ? device.location : device.location.name}
              </p>
            </div>
          </div>
        </div>

        {/* Device Health */}
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

        {/* Location Map */}
        <div>
          <h4 className="font-medium text-[var(--text)] mb-3">Location</h4>
          {typeof device.location === 'string' ? (
            <div className="p-4 bg-[var(--surface)]/50 rounded-[16px]">
              <p className="text-[var(--text)]">{device.location}</p>
            </div>
          ) : (
            <MiniMap 
              lat={device.location.lat} 
              lng={device.location.lng} 
              name={device.location.name}
            />
          )}
        </div>

        {/* Active Alerts */}
        {device.alerts.length > 0 && (
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
              onSendMessage()
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
    </Sheet>
  )
}
