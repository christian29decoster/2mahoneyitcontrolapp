'use client'

import { MapPin } from 'lucide-react'

interface MiniMapProps {
  lat: number
  lng: number
  name: string
  className?: string
}

export function MiniMap({ lat, lng, name, className = '' }: MiniMapProps) {
  return (
    <div className={`w-full h-32 bg-[var(--surface)] rounded-[16px] flex items-center justify-center border border-[var(--border)] ${className}`}>
      <div className="text-center">
        <MapPin className="w-8 h-8 text-[var(--muted)] mx-auto mb-2" />
        <p className="text-sm text-[var(--muted)]">{name}</p>
        <p className="text-xs text-[var(--muted)]">
          Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
        </p>
      </div>
    </div>
  )
}
