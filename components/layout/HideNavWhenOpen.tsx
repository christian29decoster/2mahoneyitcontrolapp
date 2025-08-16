'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/lib/ui.store'

export default function HideNavWhenOpen({ open }: { open: boolean }) {
  const { hideNav, showNav } = useUIStore()
  
  useEffect(() => {
    if (open) hideNav()
    return () => showNav()
  }, [open, hideNav, showNav])
  
  return null
}
