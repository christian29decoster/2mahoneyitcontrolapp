export type UpsellingService = {
  id: string
  type: 'vciso' | 'compliance' | 'audit' | 'threat_hunting' | 'training' | 'hardware' | 'consulting'
  name: string
  description: string
  price: number
  duration: string
  features: string[]
  priority: 'high' | 'medium' | 'low'
  targetAudience: string[]
  discount?: {
    percentage: number
    validUntil: string
    code: string
  }
  recommended: boolean
  icon: string
}

export type CrossSellingBundle = {
  id: string
  name: string
  description: string
  services: string[]
  originalPrice: number
  bundlePrice: number
  savings: number
  validUntil: string
  limited: boolean
}

export type UpsellingRecommendation = {
  id: string
  type: 'personalized' | 'trending' | 'limited_time'
  title: string
  description: string
  services: UpsellingService[]
  reason: string
  priority: number
}

// Upselling Services
export const upsellingServices: UpsellingService[] = [
  {
    id: 'vciso-001',
    type: 'vciso',
    name: 'Virtual CISO',
    description: 'Dedicated virtual Chief Information Security Officer for strategic security leadership',
    price: 2500,
    duration: 'Monthly',
    features: [
      'Strategic security planning',
      'Compliance oversight',
      'Incident response leadership',
      'Security policy development',
      'Board reporting',
      'Vendor security reviews'
    ],
    priority: 'high',
    targetAudience: ['Essential', 'Prime'],
    discount: {
      percentage: 15,
      validUntil: '2025-12-31',
      code: 'VCISO15'
    },
    recommended: true,
    icon: 'Shield'
  },
  {
    id: 'compliance-001',
    type: 'compliance',
    name: 'Compliance Upgrade Package',
    description: 'Comprehensive compliance solution for upcoming regulatory changes',
    price: 1800,
    duration: 'Monthly',
    features: [
      'GDPR compliance monitoring',
      'SOC 2 Type II preparation',
      'ISO 27001 framework',
      'Regular compliance audits',
      'Policy templates',
      'Training materials'
    ],
    priority: 'high',
    targetAudience: ['Essential'],
    recommended: true,
    icon: 'CheckCircle'
  },
  {
    id: 'audit-001',
    type: 'audit',
    name: 'Advanced Security Audit',
    description: 'Comprehensive security assessment including cloud, IoT, and external networks',
    price: 3500,
    duration: 'One-time',
    features: [
      'External network penetration testing',
      'Cloud security assessment',
      'IoT device security audit',
      'Social engineering testing',
      'Detailed remediation plan',
      'Follow-up consultation'
    ],
    priority: 'medium',
    targetAudience: ['Essential', 'Prime'],
    discount: {
      percentage: 20,
      validUntil: '2025-10-31',
      code: 'AUDIT20'
    },
    recommended: false,
    icon: 'Search'
  },
  {
    id: 'threat-001',
    type: 'threat_hunting',
    name: 'Proactive Threat Hunting',
    description: 'Advanced threat detection and hunting services',
    price: 1200,
    duration: 'Monthly',
    features: [
      '24/7 threat monitoring',
      'Advanced threat intelligence',
      'Custom threat hunting',
      'Incident response support',
      'Threat reports',
      'Security recommendations'
    ],
    priority: 'medium',
    targetAudience: ['Prime', 'Elite'],
    recommended: false,
    icon: 'Target'
  },
  {
    id: 'training-001',
    type: 'training',
    name: 'Security Awareness Training',
    description: 'Comprehensive security training for all employees',
    price: 8,
    duration: 'Per user/month',
    features: [
      'Interactive training modules',
      'Phishing simulation tests',
      'Compliance training',
      'Progress tracking',
      'Certification programs',
      'Regular updates'
    ],
    priority: 'medium',
    targetAudience: ['Essential', 'Prime', 'Elite'],
    recommended: true,
    icon: 'GraduationCap'
  },
  {
    id: 'hardware-001',
    type: 'hardware',
    name: 'Advanced Security Hardware',
    description: 'Next-generation security appliances and licenses',
    price: 5000,
    duration: 'One-time',
    features: [
      'Next-gen firewalls',
      'Advanced endpoint protection',
      'Network monitoring tools',
      'Installation and setup',
      '1-year warranty',
      'Technical support'
    ],
    priority: 'low',
    targetAudience: ['Prime', 'Elite'],
    recommended: false,
    icon: 'Server'
  },
  {
    id: 'consulting-001',
    type: 'consulting',
    name: 'Security Consulting Package',
    description: 'Expert consultation on specific security challenges',
    price: 300,
    duration: 'Per hour',
    features: [
      'Cloud security consulting',
      'Incident response planning',
      'Forensic analysis',
      'Security architecture review',
      'Vendor selection support',
      'Implementation guidance'
    ],
    priority: 'low',
    targetAudience: ['Essential', 'Prime', 'Elite'],
    recommended: false,
    icon: 'Users'
  }
]

// Cross-selling Bundles
export const crossSellingBundles: CrossSellingBundle[] = [
  {
    id: 'bundle-001',
    name: 'Security Excellence Bundle',
    description: 'Complete security transformation package',
    services: ['vciso-001', 'compliance-001', 'training-001'],
    originalPrice: 6100,
    bundlePrice: 4800,
    savings: 1300,
    validUntil: '2025-12-31',
    limited: true
  },
  {
    id: 'bundle-002',
    name: 'Compliance & Training Package',
    description: 'Essential compliance and training solution',
    services: ['compliance-001', 'training-001'],
    originalPrice: 2600,
    bundlePrice: 2100,
    savings: 500,
    validUntil: '2025-11-30',
    limited: false
  }
]

// Personalized Recommendations
export const getPersonalizedRecommendations = (currentPlan: string, currentServices: string[]): UpsellingRecommendation[] => {
  const recommendations: UpsellingRecommendation[] = []

  // vCISO for Essential/Prime plans
  if (['Essential', 'Prime'].includes(currentPlan) && !currentServices.includes('vciso')) {
    recommendations.push({
      id: 'rec-vciso',
      type: 'personalized',
      title: 'Elevate Your Security Leadership',
      description: 'Based on your current plan, a Virtual CISO could provide strategic security guidance.',
      services: [upsellingServices.find(s => s.id === 'vciso-001')!],
      reason: 'Strategic security leadership for growing organizations',
      priority: 1
    })
  }

  // Compliance for Essential
  if (currentPlan === 'Essential' && !currentServices.includes('compliance')) {
    recommendations.push({
      id: 'rec-compliance',
      type: 'personalized',
      title: 'Stay Compliant & Secure',
      description: 'Upcoming regulatory changes require enhanced compliance measures.',
      services: [upsellingServices.find(s => s.id === 'compliance-001')!],
      reason: 'Regulatory compliance requirements',
      priority: 2
    })
  }

  // Training for all plans
  if (!currentServices.includes('training')) {
    recommendations.push({
      id: 'rec-training',
      type: 'personalized',
      title: 'Empower Your Team',
      description: 'Security awareness training reduces human error by up to 70%.',
      services: [upsellingServices.find(s => s.id === 'training-001')!],
      reason: 'Human factor security improvement',
      priority: 3
    })
  }

  return recommendations.sort((a, b) => a.priority - b.priority)
}
