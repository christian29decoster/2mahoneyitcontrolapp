 'use client'

import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import { Badge } from '@/components/Badge'
import { stagger } from '@/lib/ui/motion'

const intelligenceItems = [
  'SOC event streams',
  'SIEM logs',
  'Security event telemetry',
  'Endpoint and network monitoring data',
  'RMM system data',
  'Incident and alert histories',
]

const cyberLayerItems = [
  'Event logs and alert metadata',
  'Incident response timelines',
  'Threat prioritization metrics',
  'Vulnerability patterns',
  'Asset behavior anomalies',
  'Escalation frequency and response performance',
]

const businessIntegrationItems = [
  'Revenue metrics',
  'Operational costs',
  'Department performance indicators',
  'Growth KPIs',
  'Client acquisition data',
  'Service utilization metrics',
]

const outcomes = [
  'Risk-adjusted growth modeling',
  'Cost-to-risk optimization',
  'Security investment prioritization',
  'Resource allocation optimization',
  'Executive-level forecasting',
]

const positioningItems = [
  'An AI-driven Security Intelligence Platform',
  'A Cybersecurity-to-Business Optimization Engine',
  'A Data Correlation Layer between SOC operations and executive strategy',
  'A Growth steering system powered by security telemetry',
]

export default function MahoneyGrowPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={stagger} className="space-y-3">
        <Badge variant="accent" className="mb-1">
          Mahoney Grow
        </Badge>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text)]">
          Mahoney Grow – AI-Driven Security &amp; Business Intelligence Platform
        </h1>
        <p className="text-sm md:text-base text-[var(--muted)] max-w-2xl">
          Mahoney Grow transforms cybersecurity operational data into decision-ready
          business intelligence. The platform correlates security telemetry with
          financial and operational KPIs to show how security posture, efficiency and
          growth potential are connected.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-4"
      >
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Unified Security &amp; Operations Data
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Mahoney Grow aggregates and normalizes structured and unstructured
              cybersecurity data into one analytics layer:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[var(--text)]">
              {intelligenceItems.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Cybersecurity Intelligence Layer
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Through AI-assisted pattern recognition, Mahoney Grow links technical
              security events to operational impact:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[var(--text)]">
              {cyberLayerItems.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Strategic Purpose
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Mahoney Grow bridges the gap between technical cybersecurity operations
              and executive business strategy:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>Transforms raw event logs and SIEM data into executive dashboards</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>Delivers growth-oriented risk analytics and predictive modeling</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>Provides AI-supported recommendations for security and growth decisions</span>
              </li>
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Business Intelligence Integration
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Optionally, Mahoney Grow can correlate cybersecurity telemetry with
              financial and operational data from your business systems:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              {businessIntegrationItems.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-[var(--muted)]">
              This unlocks views on how security posture, service quality and growth
              targets influence each other across clients, locations and services.
            </p>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Outcomes for Leadership
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              By combining security and business data, Mahoney Grow supports
              board-level and C-level decisions:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              {outcomes.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Positioning
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Mahoney Grow is positioned as the correlation layer between SOC
              operations and executive growth steering:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              {positioningItems.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  )
}


