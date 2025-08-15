export const demoPlan = {
  current: { 
    name: "Mahoney One — Essential", 
    tier: "Essential", 
    monthly: 1499, 
    seats: 150, 
    devices: 250 
  },
  nextTierOffer: {
    name: "Mahoney One — Professional",
    reason: [
      "Reduce MTTR with prioritized incident routing",
      "Enable automated device discovery & mapping",
      "Expand mailbox analytics and compliance coverage"
    ],
    deltaMonthly: 600
  }
}

export const demoStats = { 
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

export const demoRecommendations = [] // empty -> show 'Optimized' green note

export const demoRecentAlerts = [
  { 
    id: "AL-39281", 
    title: "Unauthorized access attempt", 
    source: "Back Office Access Control", 
    severity: "High", 
    time: "2025-08-14T09:24:00Z" 
  },
  { 
    id: "AL-39265", 
    title: "Low battery warning", 
    source: "Lobby Motion Sensor", 
    severity: "Low", 
    time: "2025-08-14T07:12:00Z" 
  },
  { 
    id: "AL-39244", 
    title: "Endpoint EDR quarantine", 
    source: "Laptop-Sales-23", 
    severity: "Medium", 
    time: "2025-08-14T05:41:00Z" 
  }
]

export const demoMail = {
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

export const demoDevices = [
  { type: "Server", name: "SRV-HQ-01", serial: "SRV-HQ-01-9FK2", location: "HQ Frankfurt", room: "R-204", assigned: "-", status: "Online" },
  { type: "PC", name: "PC-ACC-07", serial: "PC-ACC-07-X1A9", location: "NYC Office", room: "3-112", assigned: "Mary L.", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-23", serial: "LAP-23-4JQ8", location: "Austin Office", room: "2-Open", assigned: "Jim S.", status: "Quarantined" },
  { type: "Phone", name: "IPH-OPS-04", serial: "IPH-OPS-04-77B2", location: "Seattle Office", room: "N/A", assigned: "Tom C.", status: "Offline" },
  { type: "Server", name: "SRV-HQ-02", serial: "SRV-HQ-02-3M7K", location: "HQ Frankfurt", room: "R-205", assigned: "-", status: "Online" },
  { type: "PC", name: "PC-ACC-08", serial: "PC-ACC-08-Y2B0", location: "NYC Office", room: "3-113", assigned: "John D.", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-24", serial: "LAP-24-5KR9", location: "Austin Office", room: "2-Open", assigned: "Sarah M.", status: "Online" },
  { type: "Phone", name: "IPH-OPS-05", serial: "IPH-OPS-05-88C3", location: "Seattle Office", room: "N/A", assigned: "Lisa R.", status: "Online" },
  { type: "Server", name: "SRV-NYC-01", serial: "SRV-NYC-01-1N4L", location: "NYC Office", room: "R-101", assigned: "-", status: "Online" },
  { type: "PC", name: "PC-ACC-09", serial: "PC-ACC-09-Z3C1", location: "NYC Office", room: "3-114", assigned: "Mike P.", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-25", serial: "LAP-25-6LS0", location: "Austin Office", room: "2-Open", assigned: "Alex K.", status: "Online" },
  { type: "Phone", name: "IPH-OPS-06", serial: "IPH-OPS-06-99D4", location: "Seattle Office", room: "N/A", assigned: "Emma W.", status: "Offline" },
  { type: "Server", name: "SRV-AUS-01", serial: "SRV-AUS-01-2O5M", location: "Austin Office", room: "R-201", assigned: "-", status: "Online" },
  { type: "PC", name: "PC-ACC-10", serial: "PC-ACC-10-A4D2", location: "NYC Office", room: "3-115", assigned: "David H.", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-26", serial: "LAP-26-7MT1", location: "Austin Office", room: "2-Open", assigned: "Rachel F.", status: "Online" },
  { type: "Phone", name: "IPH-OPS-07", serial: "IPH-OPS-07-00E5", location: "Seattle Office", room: "N/A", assigned: "Chris B.", status: "Online" },
  { type: "Server", name: "SRV-SEA-01", serial: "SRV-SEA-01-3P6N", location: "Seattle Office", room: "R-301", assigned: "-", status: "Online" },
  { type: "PC", name: "PC-ACC-11", serial: "PC-ACC-11-B5E3", location: "NYC Office", room: "3-116", assigned: "Anna L.", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-27", serial: "LAP-27-8NU2", location: "Austin Office", room: "2-Open", assigned: "Mark T.", status: "Online" },
  { type: "Phone", name: "IPH-OPS-08", serial: "IPH-OPS-08-11F6", location: "Seattle Office", room: "N/A", assigned: "Nina G.", status: "Online" },
  { type: "Server", name: "SRV-HQ-03", serial: "SRV-HQ-03-4Q7O", location: "HQ Frankfurt", room: "R-206", assigned: "-", status: "Online" },
  { type: "PC", name: "PC-ACC-12", serial: "PC-ACC-12-C6F4", location: "NYC Office", room: "3-117", assigned: "Paul S.", status: "Online" },
  { type: "Laptop", name: "LAP-SALES-28", serial: "LAP-28-9OV3", location: "Austin Office", room: "2-Open", assigned: "Zoe X.", status: "Online" },
  { type: "Phone", name: "IPH-OPS-09", serial: "IPH-OPS-09-22G7", location: "Seattle Office", room: "N/A", assigned: "Ryan J.", status: "Online" },
  { type: "Server", name: "SRV-NYC-02", serial: "SRV-NYC-02-5R8P", location: "NYC Office", room: "R-102", assigned: "-", status: "Online" }
]

export const demoCompany = {
  name: "Acme Engineering Inc.",
  plan: "Essential",
  certificates: [
    { name: "ISO 27001", id: "ISO-27001-ACME-2025-001" },
    { name: "SOC 2 Type II", id: "SOC2-II-ACME-2025-014" }
  ],
  locations: [
    { name: "HQ Frankfurt", lat: 50.1109, lng: 8.6821, address: "Mainzer Landstr. 1, 60329 Frankfurt" },
    { name: "NYC Office", lat: 40.7128, lng: -74.0060, address: "200 Varick St, New York, NY" },
    { name: "Austin Office", lat: 30.2672, lng: -97.7431, address: "Congress Ave, Austin, TX" }
  ]
}

export const demoServices = [
  { 
    key: "backup", 
    name: "Backup Storage (per GB)", 
    price: "$0.25 / GB / month",
    bullets: ["Encrypted, geo-redundant", "Granular restores", "Ransomware-safe retention"] 
  },
  { 
    key: "vciso", 
    name: "Virtual CISO (vCISO)", 
    price: "from $2,500 / month",
    bullets: ["Board-ready reporting", "Policy/control design", "Quarterly strategy reviews"] 
  },
  { 
    key: "gap", 
    name: "Compliance Gap Assessment", 
    price: "one-time, from $4,900",
    bullets: ["Mapped to NIST/ISO/SOC 2", "Prioritized remediation", "Evidence checklist"] 
  },
  { 
    key: "policy", 
    name: "Policy Update Pack", 
    price: "one-time, from $1,900",
    bullets: ["Editable formats", "Acceptance tracking", "Annual refresh option"] 
  }
]
