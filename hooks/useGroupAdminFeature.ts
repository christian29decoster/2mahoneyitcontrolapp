'use client'

import { useState, useEffect } from 'react'

export interface FeaturesResponse {
  showGroupAdmin: boolean
}

export function useGroupAdminFeature() {
  const [showGroupAdmin, setShowGroupAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/demo/features')
      .then((r) => r.json())
      .then((data: FeaturesResponse) => {
        setShowGroupAdmin(Boolean(data?.showGroupAdmin))
      })
      .catch(() => setShowGroupAdmin(false))
      .finally(() => setLoading(false))
  }, [])

  return { showGroupAdmin, loading }
}
