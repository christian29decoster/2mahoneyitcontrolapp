export type ProjectStatus =
  | 'Draft' | 'Submitted' | 'Under Review' | 'Needs Info' | 'Approved'
  | 'Scheduled' | 'In Progress' | 'Blocked' | 'Completed' | 'Closed'

export type Project = {
  id: string
  ref: string // e.g., PRJ-1042
  title: string
  category: 'Building Cabling' | 'Server' | 'Workstation' | 'Network' | 'Other'
  subcategories: string[] // dynamic list
  description: string
  priority: 'Low' | 'Normal' | 'High' | 'Critical'
  onsite: boolean
  location: { name: string; address?: string; lat?: number; lng?: number }
  relatedAssetIds?: string[] // device IDs (demo: names)
  desiredStartISO?: string
  desiredEndISO?: string
  status: ProjectStatus
  createdBy: string // email
  createdAtISO: string
  updatedAtISO: string
  approvals?: { 
    budgetContact?: { name: string; email: string; role?: string }
    status?: 'pending' | 'approved' | 'rejected'
  }
  comments: Array<{ atISO: string; by: string; text: string }>
}

// Category subcategories mapping
export const categorySubcategories = {
  'Building Cabling': [
    'MDF/IDF build-out',
    'Rack & patch panels',
    'Backbone/fiber',
    'Pathways & labeling',
    'Acceptance test'
  ],
  'Server': [
    'Windows',
    'Linux',
    'VMware/Hyper-V',
    'Migration',
    'Backup & DR',
    'Hardening'
  ],
  'Workstation': [
    'Deployment/Imaging',
    'Data migration',
    'Peripherals',
    'Kiosk/Shared',
    'Hardening'
  ],
  'Network': [
    'Subnets/VLANs',
    'Wi-Fi/WLAN',
    'Firewall',
    'VPN/Remote Access',
    'Switching',
    'SD-WAN'
  ],
  'Other': []
}

// Demo Projects
export const demoProjects: Project[] = [
  {
    id: 'p1',
    ref: 'PRJ-1042',
    title: 'VLAN segmentation for finance & HR',
    category: 'Network',
    subcategories: ['Subnets/VLANs', 'Firewall', 'VPN/Remote Access'],
    description: 'Create dedicated VLANs for Finance/HR, update firewall policies, and enforce MFA for remote users.',
    priority: 'High',
    onsite: false,
    location: { name: 'HQ Frankfurt', lat: 50.1109, lng: 8.6821 },
    relatedAssetIds: ['SRV-HQ-01', 'PC-ACC-07'],
    desiredStartISO: '2025-09-01',
    status: 'Under Review',
    createdBy: 'ciso@acme.com',
    createdAtISO: '2025-08-10T12:02:00Z',
    updatedAtISO: '2025-08-14T09:00:00Z',
    approvals: {
      status: 'pending',
      budgetContact: { name: 'Jane Doe', email: 'jane@acme.com', role: 'CFO' }
    },
    comments: [
      { atISO: '2025-08-14T09:01:00Z', by: 'SOC-III-US-Team', text: 'Review in progress. Need VLAN plan.' }
    ]
  },
  {
    id: 'p2',
    ref: 'PRJ-1043',
    title: 'Server room cooling upgrade',
    category: 'Building Cabling',
    subcategories: ['MDF/IDF build-out', 'Rack & patch panels'],
    description: 'Upgrade server room cooling system to support new equipment and ensure optimal performance.',
    priority: 'Normal',
    onsite: true,
    location: { name: 'NYC Office', lat: 40.7128, lng: -74.0060 },
    relatedAssetIds: ['SRV-NYC-01'],
    desiredStartISO: '2025-09-15',
    desiredEndISO: '2025-09-30',
    status: 'Submitted',
    createdBy: 'cto@acme.com',
    createdAtISO: '2025-08-14T14:30:00Z',
    updatedAtISO: '2025-08-14T14:30:00Z',
    comments: []
  },
  {
    id: 'p3',
    ref: 'PRJ-1044',
    title: 'Workstation deployment for new office',
    category: 'Workstation',
    subcategories: ['Deployment/Imaging', 'Peripherals'],
    description: 'Deploy 25 new workstations for the Austin office expansion with standard security configuration.',
    priority: 'High',
    onsite: true,
    location: { name: 'Austin Office', lat: 30.2672, lng: -97.7431 },
    desiredStartISO: '2025-10-01',
    status: 'Approved',
    createdBy: 'hr@acme.com',
    createdAtISO: '2025-08-12T10:15:00Z',
    updatedAtISO: '2025-08-13T16:45:00Z',
    approvals: {
      status: 'approved',
      budgetContact: { name: 'Mike Johnson', email: 'mike@acme.com', role: 'IT Manager' }
    },
    comments: [
      { atISO: '2025-08-13T16:45:00Z', by: 'SOC-III-US-Team', text: 'Approved. Schedule for October deployment.' }
    ]
  }
]

// Project cost estimates (demo)
export const projectCostEstimates = {
  'Building Cabling': { hourly: 85, package: 2500 },
  'Server': { hourly: 95, package: 3500 },
  'Workstation': { hourly: 75, package: 1800 },
  'Network': { hourly: 90, package: 3000 },
  'Other': { hourly: 80, package: 2000 }
}
