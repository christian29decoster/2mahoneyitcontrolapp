'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import { Badge } from '@/components/Badge'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import { HapticButton } from '@/components/HapticButton'
import { ConnectorLogo } from '@/components/settings/ConnectorLogo'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Bell,
  Palette,
  Shield,
  Mail,
  MessageSquare,
  BarChart3,
  Cpu,
  Cloud,
  GitBranch,
  Server,
  Building2,
} from 'lucide-react'

/** Official admin / app registration URLs for each provider. */
const CONNECTORS = [
  { id: 'sharepoint', name: 'SharePoint / Microsoft 365', icon: BarChart3, providerUrl: 'https://admin.microsoft.com/adminportal/home#/apps' },
  { id: 'outlook', name: 'Outlook / Exchange', icon: Mail, providerUrl: 'https://admin.microsoft.com/adminportal/home#/apps' },
  { id: 'github', name: 'GitHub', icon: GitBranch, providerUrl: 'https://github.com/settings/developers' },
  { id: 'siem', name: 'SIEM (e.g. Sentinel, Splunk)', icon: BarChart3, providerUrl: 'https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/0' },
  { id: 'rmm', name: 'RMM / PSA', icon: Cpu, providerUrl: 'https://www.n-able.com/' },
  { id: 'azure', name: 'Azure / AWS', icon: Cloud, providerUrl: 'https://portal.azure.com/#blade/Microsoft_Azure_Identity/ActiveDirectoryMenuBlade/RegisteredApps' },
  { id: 'teams', name: 'Teams / Slack', icon: MessageSquare, providerUrl: 'https://admin.teams.microsoft.com/' },
  { id: 'ticketing', name: 'Ticketing (ServiceNow, etc.)', icon: Server, providerUrl: 'https://developer.servicenow.com/' },
]

const rowTap = { scale: 0.98 }
const rowClass =
  'flex items-center justify-between w-full py-3 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 hover:border-[var(--primary)]/30 hover:bg-[var(--surface-2)] transition-colors cursor-pointer active:border-[var(--primary)]/50 text-left'

function SettingsRow({
  icon: Icon,
  label,
  right,
  onClick,
}: {
  icon: React.ElementType
  label: string
  right?: React.ReactNode
  onClick?: () => void
}) {
  const h = useHaptics()
  return (
    <motion.button
      type="button"
      className={`${rowClass} ${right ? 'border-b border-[var(--border)] last:border-0' : ''}`}
      whileTap={rowTap}
      onClick={() => {
        h.impact('light')
        onClick?.()
      }}
    >
      <span className="flex items-center gap-3 text-sm text-[var(--text)]">
        <Icon size={18} className="text-[var(--muted)] shrink-0" />
        {label}
      </span>
      {right != null && <span className="shrink-0">{right}</span>}
    </motion.button>
  )
}

export default function SettingsPage() {
  const [connectDialogProvider, setConnectDialogProvider] = useState<string | null>(null)
  const h = useHaptics()

  const connector = connectDialogProvider ? CONNECTORS.find((c) => c.id === connectDialogProvider) : null
  const providerName = connector?.name ?? connectDialogProvider ?? ''
  const providerUrl = connector?.providerUrl ?? null

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
        <Card className="p-2">
          <div className="flex flex-col gap-1">
            <SettingsRow icon={Palette} label="Theme / Appearance" right={<Badge variant="secondary">System</Badge>} />
            <SettingsRow icon={Building2} label="Organisation & tenants" />
            <SettingsRow icon={Shield} label="Security & access" />
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={stagger}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
          Notifications
        </h2>
        <Card className="p-2">
          <div className="flex flex-col gap-1">
            <SettingsRow icon={Bell} label="Alerts & incidents" right={<Badge variant="accent">On</Badge>} />
            <SettingsRow icon={Mail} label="Email digest" right={<Badge variant="secondary">Weekly</Badge>} />
            <SettingsRow icon={MessageSquare} label="SOC / team messages" right={<Badge variant="accent">On</Badge>} />
          </div>
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
            {CONNECTORS.map(({ id, name, icon: Icon }) => (
              <motion.div
                key={id}
                className="flex items-center justify-between py-3 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 hover:border-[var(--primary)]/30 transition-colors"
                whileTap={rowTap}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden">
                    <ConnectorLogo id={id} className="w-5 h-5 shrink-0" />
                  </div>
                  <span className="text-sm font-medium text-[var(--text)] truncate">{name}</span>
                </div>
                <HapticButton
                  label="Connect"
                  variant="surface"
                  className="shrink-0 py-2 px-3 text-xs"
                  onClick={() => {
                    h.impact('light')
                    setConnectDialogProvider(id)
                  }}
                />
              </motion.div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-[var(--muted)]">
            In production, each connector would open a configuration flow (OAuth, API keys, or tenant mapping).
          </p>
        </Card>
      </motion.div>

      {/* Connect provider dialog */}
      <Dialog open={!!connectDialogProvider} onOpenChange={(open) => !open && setConnectDialogProvider(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Connect {providerName}</DialogTitle>
            <DialogDescription>
              To connect <strong className="text-[var(--text)]">{providerName}</strong>, you need to leave the app
              and enter your parameters (e.g. API key, client ID, tenant ID) in the provider&apos;s dashboard or
              admin center. After saving there, return here and use Connect again to link the connection.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <HapticButton variant="surface" label="Cancel" onClick={() => setConnectDialogProvider(null)} />
            <HapticButton
              label={providerUrl ? 'Open provider' : 'OK'}
              onClick={() => {
                if (providerUrl && typeof window !== 'undefined') {
                  window.open(providerUrl, '_blank', 'noopener,noreferrer')
                }
                setConnectDialogProvider(null)
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
