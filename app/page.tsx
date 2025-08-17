'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StatTile } from '@/components/StatTile'
import { Recommendation } from '@/components/Recommendation'
import { HapticButton } from '@/components/HapticButton'
import Card from '@/components/ui/Card'
import { Badge } from '@/components/Badge'
import { AlertItem } from '@/components/AlertItem'
import { MiniMap } from '@/components/MiniMap'
import { Sheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { QuickAuditBlock } from '@/components/QuickAuditBlock'
import { demoTenant, stats, alerts, mail } from '@/lib/demo'
import { TrendingUp, CheckCircle } from 'lucide-react'
import { planMonthlyUSD, formatCurrency } from '@/lib/pricing'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import ServiceCockpitCard from '@/components/cockpit/ServiceCockpitCard'
import ServiceCockpitSheet from '@/components/cockpit/ServiceCockpitSheet'
import { useAuditStore } from '@/lib/store'
import UpgradeBanner from '@/components/dashboard/UpgradeBanner'
import KpiGrid from '@/components/dashboard/KpiGrid'
import CloudTiles from '@/components/dashboard/CloudTiles'
import FabAudit from '@/components/audit/FabAudit'

export default function DashboardPage() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [isUpgradeSheetOpen, setIsUpgradeSheetOpen] = useState(false)
  const [openCockpit, setOpenCockpit] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const h = useHaptics()
  const setAuditCounts = useAuditStore(s => s.setAuditCounts)
  
  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }
  
  const statsData = [
    { label: 'Active Alerts', value: stats.activeAlerts, change: `+${stats.trend.alerts}`, trend: 'up' as const },
    { label: 'Offline Devices', value: stats.offlineDevices, change: `${stats.trend.offline}`, trend: 'down' as const },
    { label: 'MTTR', value: `${stats.mttrHours}h`, change: `${stats.trend.mttr}h`, trend: 'down' as const },
    { label: 'Coverage', value: `${stats.coveragePct}%`, change: `+${stats.trend.coverage}%`, trend: 'up' as const }
  ]
  
  const handleAlertClick = (alert: any) => {
    h.impact('light')
    setSelectedAlert(alert)
  }
  
  const handleSendMessage = (message: string) => {
    h.success()
    addToast('success', 'Message sent to Mahoney SOC')
    setSelectedAlert(null)
  }
  
  const handleUpgradePreview = () => {
    h.impact('medium')
    addToast('info', 'Upgrade Preview', 'This would initiate the upgrade process in production.')
    setIsUpgradeSheetOpen(false)
  }

  // Demo Audit Counts setzen (simuliert Quick Audit)
  useEffect(() => {
    // Simuliere Audit-Ergebnisse: 2 unprotected, 1 stale, 0 quarantined
    setAuditCounts({
      unprotected: 2,
      stale: 1,
      quarantined: 0,
    })
  }, [setAuditCounts])
  
  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Service Banner */}
        <motion.div variants={stagger} className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-600)]/10 border border-[var(--primary)]/20 rounded-[22px] p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-[var(--text)] mb-2">
                You&apos;re on <strong>{demoTenant.currentPlan.tier}</strong> ({formatCurrency(planMonthlyUSD('Essential', 5, 25))}/mo). Upgrade to <strong>{demoTenant.upgradeOffer.target.tier}</strong> (+${demoTenant.upgradeOffer.deltaMonthly}/mo) to reduce MTTR, enable automated device discovery, and expand mailbox analytics.
              </p>
              <div className="flex space-x-3">
                <HapticButton
                  label="See Upgrade Details"
                  variant="surface"
                  onClick={() => setIsUpgradeSheetOpen(true)}
                />
                <HapticButton
                  label="Upgrade Preview"
                  onClick={handleUpgradePreview}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div className="text-center space-y-3" variants={stagger}>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
            Your security posture at a glance.
          </h1>
        </motion.div>

        {/* KPI Grid */}
        <div className="mt-4">
          <KpiGrid />
        </div>

        {/* Cloud Security Posture */}
        <div className="mt-4">
          <div className="text-base font-semibold mb-3">Cloud Security Posture</div>
          <CloudTiles onOpen={() => window.location.assign('/cloud')} />
        </div>

        {/* Enhanced Quick Audit Block */}
        <QuickAuditBlock />

        {/* Service Cockpit */}
        <ServiceCockpitCard onOpen={() => setOpenCockpit(true)} />

        {/* Upselling Recommendations */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text)]">Security Enhancements</h3>
            <HapticButton
              label="View All"
              onClick={() => window.location.href = '/upselling'}
              variant="surface"
              className="text-xs"
            />
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-600)]/10 border border-[var(--primary)]/20 rounded-[16px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-[var(--primary)]/20 rounded-[6px] flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-[var(--primary)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text)]">Virtual CISO</span>
                <Badge variant="destructive" className="text-xs">-15%</Badge>
              </div>
              <p className="text-xs text-[var(--muted)] mb-2">
                Strategic security leadership for your organization
              </p>
              <HapticButton
                label="Learn More"
                onClick={() => window.location.href = '/upselling'}
                variant="surface"
                className="text-xs"
              />
            </div>
            
            <div className="p-3 bg-gradient-to-r from-[var(--warning)]/10 to-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-[16px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-[var(--warning)]/20 rounded-[6px] flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-[var(--warning)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text)]">Compliance Package</span>
                <Badge variant="secondary" className="text-xs">New</Badge>
              </div>
              <p className="text-xs text-[var(--muted)] mb-2">
                Stay ahead of regulatory changes
              </p>
              <HapticButton
                label="Learn More"
                onClick={() => window.location.href = '/upselling'}
                variant="surface"
                className="text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Proactive Recommendations */}
        <Recommendation />

        {/* Recent Alerts */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onClick={() => handleAlertClick(alert)}
              />
            ))}
          </div>
        </Card>

        {/* Office 365 / Exchange */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Microsoft 365 Mailboxes</h3>
            <div className="space-y-3">
              {mail.o365.map((mailbox) => (
                <div key={mailbox.user} className="flex items-center justify-between p-3 bg-[var(--surface)]/50 rounded-[16px]">
                  <div>
                    <p className="font-medium text-[var(--text)]">{mailbox.user}</p>
                    <p className="text-sm text-[var(--muted)]">{mailbox.sizeGB}GB / {mailbox.quotaGB}GB</p>
                  </div>
                  <Badge variant={mailbox.status === 'Healthy' ? 'accent' : 'secondary'}>
                    {mailbox.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Exchange On-Prem</h3>
            <div className="space-y-3">
              {mail.exchangeOnPrem.dbs.map((db) => (
                <div key={db.name} className="p-3 bg-[var(--surface)]/50 rounded-[16px]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-[var(--text)]">{db.name}</p>
                    <Badge variant={db.status === 'Healthy' ? 'accent' : 'secondary'}>
                      {db.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-[var(--muted)]">
                      <span>{db.usedGB}GB / {db.capacityGB}GB</span>
                      <span>{Math.round((db.usedGB / db.capacityGB) * 100)}%</span>
                    </div>
                    <div className="w-full bg-[var(--surface)] rounded-full h-2">
                      <div 
                        className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(db.usedGB / db.capacityGB) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Alert Details Sheet */}
      <Sheet
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title="Alert Details"
      >
        {selectedAlert && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{selectedAlert.title}</h3>
              <div className="space-y-2 text-sm text-[var(--muted)]">
                <p><strong>Source:</strong> {selectedAlert.source}</p>
                <p><strong>Time:</strong> {new Date(selectedAlert.time).toLocaleString()}</p>
                <p><strong>Severity:</strong> {selectedAlert.severity}</p>
                <p><strong>Device:</strong> {selectedAlert.device}</p>
                <p><strong>OS:</strong> {selectedAlert.os}</p>
                <p><strong>IP:</strong> {selectedAlert.ip}</p>
                <p><strong>Last Login:</strong> {new Date(selectedAlert.lastLogin).toLocaleString()}</p>
                <p><strong>User:</strong> {selectedAlert.user}</p>
              </div>
            </div>
            
            {/* Mini Map */}
            <div>
              <h4 className="font-medium text-[var(--text)] mb-3">Location</h4>
              <MiniMap 
                lat={selectedAlert.location.lat} 
                lng={selectedAlert.location.lng} 
                name={selectedAlert.location.name}
              />
            </div>
            
            {selectedAlert.notes && (
              <div>
                <h4 className="font-medium text-[var(--text)] mb-3">Notes</h4>
                <div className="space-y-2">
                  {selectedAlert.notes.map((note: string, index: number) => (
                    <p key={index} className="text-sm text-[var(--muted)]">• {note}</p>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-[var(--text)] mb-3">Quick Actions</h4>
              <div className="space-y-3">
                <HapticButton
                  label="Send me more details"
                  variant="surface"
                  onClick={() => handleSendMessage('Please send me more details about this alert.')}
                />
                <HapticButton
                  label="Please contact me"
                  variant="surface"
                  onClick={() => handleSendMessage('Please contact me regarding this alert.')}
                />
                <HapticButton
                  label="Custom message..."
                  variant="surface"
                  onClick={() => handleSendMessage('Custom message regarding this alert.')}
                />
              </div>
            </div>
          </div>
        )}
      </Sheet>

      {/* Upgrade Details Sheet */}
      <Sheet
        isOpen={isUpgradeSheetOpen}
        onClose={() => setIsUpgradeSheetOpen(false)}
        title={`Upgrade to ${demoTenant.upgradeOffer.target.tier}`}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
              {demoTenant.upgradeOffer.target.name}
            </h3>
            <div className="space-y-3">
              {demoTenant.upgradeOffer.reasons.map((reason, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-[var(--muted)]">{reason}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
            <p className="text-sm text-[var(--muted)] mb-2">Additional monthly cost:</p>
            <p className="text-2xl font-bold text-[var(--text)]">+${demoTenant.upgradeOffer.deltaMonthly}/month</p>
          </div>
          
          <HapticButton
            label="Upgrade Preview"
            onClick={handleUpgradePreview}
          />
        </div>
      </Sheet>

      {/* Service Cockpit Sheet */}
      {openCockpit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-[520px] mx-auto rounded-t-3xl bg-[var(--bg)] border-t border-[var(--border)]">
            <ServiceCockpitSheet />
          </div>
        </div>
      )}

      {/* FAB Audit */}
      <FabAudit />

      {/* Toast Manager */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          </div>
        ))}
      </div>
    </>
  )
}
