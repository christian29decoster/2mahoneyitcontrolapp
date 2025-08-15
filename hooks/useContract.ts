'use client'

import { useState, useEffect } from 'react'
import { Contract, ContractRequest, demoContract, demoRequests } from '@/lib/contracts'

export function useContract() {
  const [contract, setContract] = useState<Contract | null>(null)
  const [requests, setRequests] = useState<ContractRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Simulate API call
  const fetchContract = async () => {
    setLoading(true)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setContract(demoContract)
    setRequests(demoRequests)
    setLoading(false)
  }

  // Simulate API call for submitting requests
  const submitRequest = async (type: ContractRequest['type'], payload: any) => {
    const newRequest: ContractRequest = {
      id: `req-${Date.now()}`,
      type,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      payload,
      reference: `REQ-${new Date().getFullYear()}-${String(demoRequests.length + 1).padStart(3, '0')}`
    }

    setRequests(prev => [newRequest, ...prev])

    // Simulate auto-approval after 3 seconds
    setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === newRequest.id 
            ? { ...req, status: 'approved', processedAt: new Date().toISOString() }
            : req
        )
      )
    }, 3000)

    return newRequest
  }

  // Simulate API call for withdrawing requests
  const withdrawRequest = async (requestId: string) => {
    setRequests(prev => prev.filter(req => req.id !== requestId))
  }

  useEffect(() => {
    fetchContract()
  }, [])

  return {
    contract,
    requests,
    loading,
    submitRequest,
    withdrawRequest,
    refetch: fetchContract
  }
}
