import { plans } from './mahoney'

export const demoTenant = {
  company: "Acme Engineering Inc.",
  currentPlan: plans.essential,         // show Essential as current
  upgradeOffer: {
    target: plans.prime,
    deltaMonthly: 600,
    reasons: [
      "Reduce MTTR with prioritized incident routing",
      "Enable automated device discovery & mapping",
      "Expand mailbox analytics and compliance coverage"
    ]
  }
}

export const stats = { 
  activeAlerts: 3, 
  offlineDevices: 3, 
  mttrHours: 2.3, 
  coveragePct: 92, 
  trend: {
    alerts: +1, 
    offline: -1, 
    mttr: -0.5, 
    coverage: +2
  } 
}

export const recommendations: any[] = [] // empty -> show 'Optimized' green note

export const alerts = [
  { 
    id: "AL-39281", 
    title: "Unauthorized access attempt", 
    source: "Back Office Access Control", 
    severity: "High", 
    time: "2025-08-14T09:24:00Z",
    os: "Windows Server 2022", 
    device: "SRV-HQ-01", 
    ip: "10.1.4.22", 
    user: "svc-door", 
    lastLogin: "2025-08-14T08:51:00Z", 
    location: { name: "HQ Frankfurt", lat: 50.1109, lng: 8.6821 }, 
    notes: ["3 failed badges in 2 min"] 
  },
  { 
    id: "AL-39265", 
    title: "Low battery warning", 
    source: "Laptop-Sales-23", 
    severity: "Low", 
    time: "2025-08-14T07:12:00Z",
    os: "Windows 11 Pro 23H2", 
    device: "LAP-SALES-23", 
    ip: "10.3.8.41", 
    user: "Jim S.", 
    lastLogin: "2025-08-14T06:57:00Z", 
    location: { name: "Austin Office", lat: 30.2672, lng: -97.7431 } 
  },
  { 
    id: "AL-39244", 
    title: "Endpoint EDR quarantine", 
    source: "PC-ACC-07", 
    severity: "Medium", 
    time: "2025-08-14T05:41:00Z",
    os: "Windows 10 22H2", 
    device: "PC-ACC-07", 
    ip: "10.2.5.17", 
    user: "Mary L.", 
    lastLogin: "2025-08-14T05:31:00Z", 
    location: { name: "NYC Office", lat: 40.7128, lng: -74.0060 } 
  }
]

export const mail = {
  o365: [
    { user: "ciso@acme.com", sizeGB: 42.6, quotaGB: 50, status: "Healthy" },
    { user: "cto@acme.com", sizeGB: 37.1, quotaGB: 50, status: "Healthy" },
    { user: "finance@acme.com", sizeGB: 48.7, quotaGB: 50, status: "Approaching limit" }
  ],
  exchangeOnPrem: { 
    dbs: [
      { name: "DB01-HQ", usedGB: 820, capacityGB: 1000, status: "Healthy" },
      { name: "DB02-NYC", usedGB: 960, capacityGB: 1000, status: "High utilization" }
    ] 
  }
}

export const devices = [
  { type: "Server", name: "SRV-HQ-01", serial: "SRV-HQ-01-9FK2", os: "Windows Server 2022", version: "20348.2402", location: "HQ Frankfurt", room: "R-204", lastLogin: "svc-backup • 2025-08-13 23:10", status: "Online" },
  { type: "PC", name: "PC-ACC-07", serial: "PC-ACC-07-X1A9", os: "Windows 10 22H2", version: "19045.4651", location: "NYC Office", room: "3-112", lastLogin: "mary.l • 2025-08-14 05:31", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-23", serial: "LAP-23-4JQ8", os: "Windows 11 Pro 23H2", version: "22631.3737", location: "Austin Office", room: "2-Open", lastLogin: "jim.s • 2025-08-14 06:57", status: "Quarantined" },
  { type: "Phone", name: "IPH-OPS-04", serial: "IPH-OPS-04-77B2", os: "iOS 17.5", version: "21F79", location: "Seattle Office", room: "N/A", lastLogin: "tom.c • 2025-08-13 21:04", status: "Offline" },
  { type: "Server", name: "SRV-HQ-02", serial: "SRV-HQ-02-3M7K", os: "Windows Server 2022", version: "20348.2402", location: "HQ Frankfurt", room: "R-205", lastLogin: "svc-web • 2025-08-13 22:45", status: "Online" },
  { type: "PC", name: "PC-ACC-08", serial: "PC-ACC-08-Y2B0", os: "Windows 10 22H2", version: "19045.4651", location: "NYC Office", room: "3-113", lastLogin: "john.d • 2025-08-14 07:15", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-24", serial: "LAP-24-5KR9", os: "Windows 11 Pro 23H2", version: "22631.3737", location: "Austin Office", room: "2-Open", lastLogin: "sarah.m • 2025-08-14 08:22", status: "Online" },
  { type: "Phone", name: "IPH-OPS-05", serial: "IPH-OPS-05-88C3", os: "iOS 17.5", version: "21F79", location: "Seattle Office", room: "N/A", lastLogin: "lisa.r • 2025-08-14 06:30", status: "Online" },
  { type: "Server", name: "SRV-NYC-01", serial: "SRV-NYC-01-1N4L", os: "Windows Server 2022", version: "20348.2402", location: "NYC Office", room: "R-101", lastLogin: "svc-db • 2025-08-13 23:30", status: "Online" },
  { type: "PC", name: "PC-ACC-09", serial: "PC-ACC-09-Z3C1", os: "Windows 10 22H2", version: "19045.4651", location: "NYC Office", room: "3-114", lastLogin: "mike.p • 2025-08-14 07:45", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-25", serial: "LAP-25-6LS0", os: "Windows 11 Pro 23H2", version: "22631.3737", location: "Austin Office", room: "2-Open", lastLogin: "alex.k • 2025-08-14 08:10", status: "Online" },
  { type: "Phone", name: "IPH-OPS-06", serial: "IPH-OPS-06-99D4", os: "iOS 17.5", version: "21F79", location: "Seattle Office", room: "N/A", lastLogin: "emma.w • 2025-08-13 20:15", status: "Offline" },
  { type: "Server", name: "SRV-AUS-01", serial: "SRV-AUS-01-2O5M", os: "Windows Server 2022", version: "20348.2402", location: "Austin Office", room: "R-201", lastLogin: "svc-app • 2025-08-13 23:15", status: "Online" },
  { type: "PC", name: "PC-ACC-10", serial: "PC-ACC-10-A4D2", os: "Windows 10 22H2", version: "19045.4651", location: "NYC Office", room: "3-115", lastLogin: "david.h • 2025-08-14 07:30", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-26", serial: "LAP-26-7MT1", os: "Windows 11 Pro 23H2", version: "22631.3737", location: "Austin Office", room: "2-Open", lastLogin: "rachel.f • 2025-08-14 08:05", status: "Online" },
  { type: "Phone", name: "IPH-OPS-07", serial: "IPH-OPS-07-00E5", os: "iOS 17.5", version: "21F79", location: "Seattle Office", room: "N/A", lastLogin: "chris.b • 2025-08-14 06:45", status: "Online" },
  { type: "Server", name: "SRV-SEA-01", serial: "SRV-SEA-01-3P6N", os: "Windows Server 2022", version: "20348.2402", location: "Seattle Office", room: "R-301", lastLogin: "svc-mail • 2025-08-13 23:45", status: "Online" },
  { type: "PC", name: "PC-ACC-11", serial: "PC-ACC-11-B5E3", os: "Windows 10 22H2", version: "19045.4651", location: "NYC Office", room: "3-116", lastLogin: "anna.l • 2025-08-14 07:20", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-27", serial: "LAP-27-8NU2", os: "Windows 11 Pro 23H2", version: "22631.3737", location: "Austin Office", room: "2-Open", lastLogin: "mark.t • 2025-08-14 08:15", status: "Online" },
  { type: "Phone", name: "IPH-OPS-08", serial: "IPH-OPS-08-11F6", os: "iOS 17.5", version: "21F79", location: "Seattle Office", room: "N/A", lastLogin: "nina.g • 2025-08-14 06:20", status: "Online" },
  { type: "Server", name: "SRV-HQ-03", serial: "SRV-HQ-03-4Q7O", os: "Windows Server 2022", version: "20348.2402", location: "HQ Frankfurt", room: "R-206", lastLogin: "svc-backup • 2025-08-13 23:05", status: "Online" },
  { type: "PC", name: "PC-ACC-12", serial: "PC-ACC-12-C6F4", os: "Windows 10 22H2", version: "19045.4651", location: "NYC Office", room: "3-117", lastLogin: "paul.s • 2025-08-14 07:40", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-28", serial: "LAP-28-9OV3", os: "Windows 11 Pro 23H2", version: "22631.3737", location: "Austin Office", room: "2-Open", lastLogin: "zoe.x • 2025-08-14 08:25", status: "Online" },
  { type: "Phone", name: "IPH-OPS-09", serial: "IPH-OPS-09-22G7", os: "iOS 17.5", version: "21F79", location: "Seattle Office", room: "N/A", lastLogin: "ryan.j • 2025-08-14 06:35", status: "Online" },
  { type: "Server", name: "SRV-NYC-02", serial: "SRV-NYC-02-5R8P", os: "Windows Server 2022", version: "20348.2402", location: "NYC Office", room: "R-102", lastLogin: "svc-web • 2025-08-13 23:20", status: "Online" }
]

export const company = {
  name: "Acme Engineering Inc.",
  certificates: [
    { name: "ISO 27001", id: "ISO-27001-ACME-2025-001" },
    { name: "SOC 2 Type II", id: "SOC2-II-ACME-2025-014" }
  ],
  locations: [
    { name: "HQ Frankfurt", address: "Mainzer Landstr. 1, 60329 Frankfurt", lat: 50.1109, lng: 8.6821 },
    { name: "NYC Office", address: "200 Varick St, New York, NY", lat: 40.7128, lng: -74.0060 },
    { name: "Austin Office", address: "Congress Ave, Austin, TX", lat: 30.2672, lng: -97.7431 }
  ]
}

// Services are now imported from mahoney.ts
