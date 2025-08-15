'use client'

import { motion } from 'framer-motion'
import { Badge } from './Badge'
import { Server, Monitor, Laptop, Smartphone } from 'lucide-react'
import { popIn } from '@/lib/ui/motion'

interface DeviceRowProps {
  device: {
    type: string
    name: string
    serial: string
    os: string
    version: string
    location: string | { name: string; lat: number; lng: number }
    room: string
    lastLogin: string
    status: string
  }
}

export function DeviceRow({ device }: DeviceRowProps) {
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'server':
        return <Server className="w-4 h-4" />
      case 'pc':
        return <Monitor className="w-4 h-4" />
      case 'laptop':
        return <Laptop className="w-4 h-4" />
      case 'phone':
        return <Smartphone className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'accent'
      case 'offline':
        return 'destructive'
      case 'quarantined':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <motion.div
      variants={popIn}
      className="flex items-center space-x-3 p-4 bg-[var(--surface)]/50 rounded-[16px] cursor-pointer hover:bg-[var(--surface)]/70 transition-colors"
    >
      <div className="flex-shrink-0 w-8 h-8 bg-[var(--surface-elev)] rounded-[12px] flex items-center justify-center">
        {getDeviceIcon(device.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <p className="font-medium text-[var(--text)] truncate">{device.name}</p>
          <Badge variant={getStatusColor(device.status) as any}>
            {device.status}
          </Badge>
        </div>
        <p className="text-sm text-[var(--muted)] mb-1">{device.serial}</p>
        <div className="flex items-center space-x-2 text-xs text-[var(--muted)]">
          <span>{typeof device.location === 'string' ? device.location : device.location.name}</span>
          <span>•</span>
          <span>{device.room}</span>
          <span>•</span>
          <span>{device.lastLogin}</span>
        </div>
      </div>
    </motion.div>
  )
}
