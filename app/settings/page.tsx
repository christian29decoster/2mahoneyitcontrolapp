'use client'

import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import { Badge } from '@/components/Badge'
import { stagger } from '@/lib/ui/motion'
import {
  Settings,
  Bell,
  Palette,
  Shield,
  Link2,
  FileText,
  Mail,
  MessageSquare,
  Server,
  Cloud,
  GitBranch,
  BarChart3,
  Cpu,
  Building2,
} from 'lucide-react'

const CONNECTORS = [
  { id: 'sharepoint', name: 'SharePoint / Microsoft 365', icon: FileText, status: 'Demo' },
  { id: 'outlook', name: 'Outlook / Exchange', icon: Mail, status: 'Demo' },
  { id: 'github', name: 'GitHub', icon: GitBranch, status: 'Demo' },
  { id: 'siem', name: 'SIEM (e.g. Sentinel, Splunk)', icon: BarChart3, status: 'Demo' },
  { id: 'rmm', name: 'RMM / PSA', icon: Cpu, status: 'Demo' },
  { id: 'azure', name: 'Azure / AWS', icon: Cloud, status: 'Demo' },
  { id: 'teams', name: 'Teams / Slack', icon: MessageSquare, status: 'Demo' },
  { id: 'ticketing', name: 'Ticketing (ServiceNow, etc.)', icon: Server, status: 'Demo' },
]

export default function SettingsPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={stagger} className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
          Settings
        </h1>
        <p className="text-sm text-[var(--muted)]">
          General app settings, notifications, and API & connector configuration for MSSP operations.
        </p>
      </motion.div>

      {/* General */}
      <motion.div variants={stagger}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
          General
        </h2>
        <Card className="p-4">
          <ul className="space-y-2">
            <li className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="flex items-center gap-3 text-sm text-[var(--text)]">
                <Palette size={18} className="text-[var(--muted)]" />
                Theme / Appearance
              </span>
              <Badge variant="secondary">System</Badge>
            </li>
            <li className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="flex items-center gap-3 text-sm text-[var(--text)]">
                <Building2 size={18} className="text-[var(--muted)]" />
                Organisation & tenants
              </span>
            </li>
            <li className="flex items-center justify-between py-2">
              <span className="flex items-center gap-3 text-sm text-[var(--text)]">
                <Shield size={18} className="text-[var(--muted)]" />
                Security & access
              </span>
            </li>
          </ul>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={stagger}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
          Notifications
        </h2>
        <Card className="p-4">
          <ul className="space-y-2">
            <li className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="flex items-center gap-3 text-sm text-[var(--text)]">
                <Bell size={18} className="text-[var(--muted)]" />
                Alerts & incidents
              </span>
              <Badge variant="accent">On</Badge>
            </li>
            <li className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="flex items-center gap-3 text-sm text-[var(--text)]">
                <Mail size={18} className="text-[var(--muted)]" />
                Email digest
              </span>
              <Badge variant="secondary">Weekly</Badge>
            </li>
            <li className="flex items-center justify-between py-2">
              <span className="flex items-center gap-3 text-sm text-[var(--text)]">
                <MessageSquare size={18} className="text-[var(--muted)]" />
                SOC / team messages
              </span>
              <Badge variant="accent">On</Badge>
            </li>
          </ul>
        </Card>
      </motion.div>

      {/* API & Connectors */}
      <motion.div variants={stagger}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
          API & Connectors
        </h2>
        <p className="text-xs text-[var(--muted)] mb-3">
          Connect SIEM, RMM, collaboration and cloud sources for MSSP visibility and automation.
        </p>
        <Card className="p-4">
          <div className="space-y-2">
            {CONNECTORS.map(({ id, name, icon: Icon, status }) => (
              <div
                key={id}
                className="flex items-center justify-between py-3 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 hover:border-[var(--primary)]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                    <Icon size={18} className="text-[var(--muted)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text)]">{name}</span>
                </div>
                <Badge variant="secondary">{status}</Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-[var(--muted)]">
            In production, each connector would open a configuration flow (OAuth, API keys, or tenant mapping).
          </p>
        </Card>
      </motion.div>
    </motion.div>
  )
}
