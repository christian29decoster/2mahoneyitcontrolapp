export type PlanTier = 'Essential' | 'Prime' | 'Elite'

export type Contract = {
  id: string
  tenantId: string
  plan: {
    tier: PlanTier
    seats: number
    devices: number
    baseMonthlyUSD: number
    renewalISO: string
    sla: '1h' | '4h'
  }
  services: Array<{
    key: string
    name: string
    unit: 'seat' | 'device' | 'gb' | 'flat'
    qty: number
    unitPriceUSD: number
    monthlyUSD: number
    status: 'active' | 'pending' | 'paused'
  }>
  totals: {
    monthlyUSD: number
    nextInvoiceISO: string
  }
}

export type ContractRequest = {
  id: string
  type: 'plan_change' | 'service_add' | 'qty_change' | 'pause' | 'cancel'
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  processedAt?: string
  payload: any
  reference: string
}

// Demo Contract Data
export const demoContract: Contract = {
  id: 'contract-001',
  tenantId: 'tenant-acme',
  plan: {
    tier: 'Essential',
    seats: 25,
    devices: 30,
    baseMonthlyUSD: 2500,
    renewalISO: '2025-09-14T00:00:00Z',
    sla: '4h'
  },
  services: [
    {
      key: 'backup',
      name: 'Backup Storage',
      unit: 'gb',
      qty: 500,
      unitPriceUSD: 0.25,
      monthlyUSD: 125,
      status: 'active'
    },
    {
      key: 'endpoint',
      name: 'Managed Endpoint',
      unit: 'device',
      qty: 25,
      unitPriceUSD: 15,
      monthlyUSD: 375,
      status: 'active'
    },
    {
      key: 'firewall',
      name: 'Managed Firewall',
      unit: 'flat',
      qty: 1,
      unitPriceUSD: 200,
      monthlyUSD: 200,
      status: 'active'
    }
  ],
  totals: {
    monthlyUSD: 3200,
    nextInvoiceISO: '2025-09-01T00:00:00Z'
  }
}

export const demoRequests: ContractRequest[] = [
  {
    id: 'req-001',
    type: 'service_add',
    status: 'pending',
    requestedAt: '2025-08-14T10:30:00Z',
    payload: {
      serviceKey: 'vciso',
      quantity: 1
    },
    reference: 'REQ-2025-001'
  }
]

// Plan comparison data
export const planComparison = {
  Essential: {
    basePrice: 2500,
    seats: 25,
    devices: 30,
    sla: '4h',
    features: [
      'Basic EDR/XDR Protection',
      'Email Security',
      'Backup & Recovery',
      '24/7 Support'
    ]
  },
  Prime: {
    basePrice: 4500,
    seats: 50,
    devices: 75,
    sla: '2h',
    features: [
      'Advanced EDR/XDR Protection',
      'Email Security + Analytics',
      'Backup & Recovery',
      'Managed Firewall',
      'Device Discovery',
      'Priority Support'
    ]
  },
  Elite: {
    basePrice: 8500,
    seats: 100,
    devices: 150,
    sla: '1h',
    features: [
      'Enterprise EDR/XDR Protection',
      'Email Security + Analytics',
      'Backup & Recovery',
      'Managed Firewall',
      'Device Discovery',
      'Virtual CISO',
      'SOC Integration',
      'Dedicated Support'
    ]
  }
}
