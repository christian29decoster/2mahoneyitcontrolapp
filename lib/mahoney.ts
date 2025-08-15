export const plans = {
  essential: {
    name: "Mahoney One — Essential",
    tier: "Essential",
    startingUSD: 99,          // per seat or device, min 10
    responseTime: "4h",
    helpdesk: "Email + WhatsApp",
    security: "SOCaaS basic threat protection",
    backup: "Monthly key data backups",
  },
  prime: {
    name: "Mahoney One — Prime",
    tier: "Prime",
    startingUSD: 175,
    responseTime: "4h",
    helpdesk: "Call, Email + WhatsApp",
    security: "Advanced SOCaaS, server/room cameras",
    backup: "Weekly comprehensive backups",
  },
  elite: {
    name: "Mahoney One — Elite",
    tier: "Elite",
    startingUSD: 199,
    responseTime: "1h",
    helpdesk: "Direct expert access (Call, Email, WhatsApp)",
    security: "Maximum protection, continuous monitoring, cameras",
    backup: "Daily detailed backups + recovery verification",
    exclusive: ["Virtual CISO (vCISO)", "Customer Success Manager"]
  }
}

export const services = [
  { 
    key: "soc", 
    name: "Security Operations Center as a Service (SOCaaS)",
    price: "Included in plan",
    bullets: ["24/7 threat monitoring", "Incident response", "Security analytics"]
  },
  { 
    key: "backup",
    name: "Backup Storage", 
    price: "$0.20 / GB / month", 
    retention: "PoW; DR check $0.10/GB",
    bullets: ["Encrypted storage", "Point-in-time recovery", "Disaster recovery testing"]
  },
  { 
    key: "firewall",
    name: "Managed Firewall", 
    desc: "Proactive policy management",
    price: "from $45 / month",
    bullets: ["Policy management", "Threat prevention", "Traffic monitoring"]
  },
  { 
    key: "endpoint",
    name: "Managed Endpoint", 
    desc: "Security management for end devices",
    price: "from $25 / device / month",
    bullets: ["Antivirus management", "Patch management", "Device monitoring"]
  },
  { 
    key: "serverVision",
    name: "Server Vision", 
    desc: "Camera surveillance for server rooms",
    price: "from $75 / camera / month",
    bullets: ["24/7 monitoring", "Motion detection", "Remote access"]
  },
  { 
    key: "vciso", 
    name: "Virtual CISO (vCISO)",
    price: "from $2,500 / month",
    bullets: ["Strategic guidance", "Compliance oversight", "Board reporting"]
  }
]
