'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  Home,
  Shield,
  Building2,
  ShoppingBag,
  FileText,
  User,
  FolderOpen,
  TrendingUp,
  LineChart,
  Settings,
  Cloud,
  Wrench,
  Scale,
  DollarSign,
  PinOff,
  Pin,
  UsersRound,
  Smartphone,
  Monitor,
  MessageSquare,
  AlertTriangle,
  ClipboardList,
  Radio,
  Receipt,
  HelpCircle,
} from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'
import { useViewModeStore } from '@/lib/viewMode.store'
import { useDemoViewRoleStore } from '@/lib/demoViewRole.store'
import { useT } from '@/lib/i18n'
import LogoutButton from '@/components/auth/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

export const SIDEBAR_WIDTH_PX = 260

const linkClass =
  'flex items-center gap-3 px-2 py-2 rounded-xl border border-[var(--border)] hover:border-[rgba(59,130,246,.35)] hover:text-[var(--primary)] transition-colors text-[var(--text)]'

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string
  label: string
  icon: LucideIcon
  onClick: () => void
}) {
  return (
    <Link href={href} onClick={onClick} className={linkClass}>
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </Link>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mt-4 mb-1.5 first:mt-0">
      {children}
    </div>
  )
}

export default function DrawerNav({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const h = useHaptics()
  const viewMode = useViewModeStore((s) => s.viewMode)
  const menuPinned = useViewModeStore((s) => s.menuPinned)
  const setMenuPinned = useViewModeStore((s) => s.setMenuPinned)
  const viewModeSet = useViewModeStore((s) => s.setViewMode)
  const demoViewRole = useDemoViewRoleStore((s) => s.demoViewRole)
  const t = useT()

  // Demo view role: Mahoney = all; Partner = no Enhance/Group Admin, yes Partner Pricing & Admin; Client-wit = like Partner minus Partner Pricing & Admin (includes Mission Briefing); Client-woit = same as Client-wit but no Mission Briefing
  const showEnhanceUpgrades = demoViewRole === 'mahoney_it_group'
  const showGroupAdmin = demoViewRole === 'mahoney_it_group'
  const showPartnerPricingLink = demoViewRole === 'mahoney_it_group' || demoViewRole === 'partner'
  const showAdminLink = demoViewRole === 'mahoney_it_group' || demoViewRole === 'partner'
  const showMissionBriefing = demoViewRole !== 'client_woit'

  const isPinnedSidebar = viewMode === 'desktop' && menuPinned
  const showDrawer = open && !isPinnedSidebar

  const handleNavClick = () => {
    h.impact('light')
    if (!isPinnedSidebar) onOpenChange(false)
  }

  const handleUnpin = () => {
    h.impact('light')
    setMenuPinned(false)
  }

  const handlePin = () => {
    h.impact('light')
    setMenuPinned(true)
    onOpenChange(false)
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-sm font-semibold text-[var(--text)]">{t('menu')}</span>
        {isPinnedSidebar ? (
          <button
            type="button"
            onClick={handleUnpin}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
            aria-label={t('unpin')}
          >
            <PinOff size={14} />
            {t('unpin')}
          </button>
        ) : (
          viewMode === 'desktop' && (
            <button
              type="button"
              onClick={handlePin}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10"
              aria-label={t('pin')}
            >
              <Pin size={14} />
              {t('pin')}
            </button>
          )
        )}
      </div>
      <nav className="grid gap-1">
          <SectionTitle>{t('askAI')}</SectionTitle>
          <NavLink href="/copilot" label={t('copilot')} icon={MessageSquare} onClick={handleNavClick} />
          <SectionTitle>{t('operationsTech')}</SectionTitle>
          <NavLink href="/" label={t('dashboard')} icon={Home} onClick={handleNavClick} />
          <NavLink href="/devices" label={t('devicesAndStaff')} icon={Shield} onClick={handleNavClick} />
          <NavLink href="/company" label={t('company')} icon={Building2} onClick={handleNavClick} />
          <NavLink href="/cloud" label={t('cloudSecurity')} icon={Cloud} onClick={handleNavClick} />
          <NavLink href="/governance" label={t('governance')} icon={Scale} onClick={handleNavClick} />
          <NavLink href="/governance/soc-questionnaire" label={t('socComplianceHandbook')} icon={ClipboardList} onClick={handleNavClick} />
          <NavLink href="/financials" label={t('financials')} icon={DollarSign} onClick={handleNavClick} />
          <NavLink href="/contracts" label={t('contracts')} icon={FileText} onClick={handleNavClick} />
          <NavLink href="/projects" label={t('projects')} icon={FolderOpen} onClick={handleNavClick} />
          <NavLink href="/incidents" label={t('incidents')} icon={AlertTriangle} onClick={handleNavClick} />
          {showMissionBriefing && (
            <NavLink href="/mission-control" label={t('missionBriefing')} icon={Radio} onClick={handleNavClick} />
          )}

              <SectionTitle>{t('aiGrowth')}</SectionTitle>
              <NavLink href="/mahoney-grow" label={t('aiGrowthRisk')} icon={LineChart} onClick={handleNavClick} />

              <SectionTitle>{t('marketplacePurchase')}</SectionTitle>
              <NavLink href="/marketplace" label={t('marketplace')} icon={ShoppingBag} onClick={handleNavClick} />
              {showPartnerPricingLink && (
                <NavLink href="/partner-pricing" label={t('partnerPricing')} icon={Receipt} onClick={handleNavClick} />
              )}
              {showEnhanceUpgrades && (
          <NavLink href="/upselling" label={t('enhanceUpgrades')} icon={TrendingUp} onClick={handleNavClick} />
          )}

          <SectionTitle>{t('settings')}</SectionTitle>
          <NavLink href="/faq" label={t('faq')} icon={HelpCircle} onClick={handleNavClick} />
          <NavLink href="/settings" label={t('settings')} icon={Settings} onClick={handleNavClick} />
          <NavLink href="/profile" label={t('profile')} icon={User} onClick={handleNavClick} />

          {showGroupAdmin && (
            <>
              <SectionTitle>{t('groupAdmin')}</SectionTitle>
              <NavLink href="/group-admin" label={t('groupAdminOnboarding')} icon={UsersRound} onClick={handleNavClick} />
            </>
          )}

          {showAdminLink && (
            <>
              <SectionTitle>{t('appManagement')}</SectionTitle>
              <Link href="/admin" onClick={handleNavClick} className={linkClass}>
                <Wrench size={18} />
                <span className="text-sm">{t('adminUserPartnerSettings')}</span>
              </Link>
            </>
          )}
        </nav>

      <div className="mt-6 pt-4 border-t border-[var(--border)] space-y-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-1.5">{t('display')}</div>
          <ThemeToggle />
        </div>
        <div className="flex rounded-xl border border-[var(--border)] overflow-hidden">
          <button
            type="button"
            onClick={() => { h.impact('light'); viewModeSet('app'); if (!isPinnedSidebar) onOpenChange(false) }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium ${viewMode === 'app' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}
            aria-label={t('app')}
          >
            <Smartphone size={14} />
            {t('app')}
          </button>
          <button
            type="button"
            onClick={() => { h.impact('light'); viewModeSet('desktop'); if (!isPinnedSidebar) onOpenChange(false) }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium ${viewMode === 'desktop' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}
            aria-label={t('desktop')}
          >
            <Monitor size={14} />
            {t('desktop')}
          </button>
        </div>
        <Link href="/copilot" onClick={handleNavClick} className={linkClass + ' w-full'}>
          <MessageSquare size={18} />
          <span className="text-sm">{t('openAICoPilot')}</span>
        </Link>
        <LogoutButton />
      </div>
    </>
  )

  if (isPinnedSidebar) {
    return (
      <aside
        className="fixed left-0 top-12 bottom-0 z-30 w-[260px] bg-[var(--surface)] border-r border-[var(--border)] p-4 overflow-y-auto"
        style={{ width: SIDEBAR_WIDTH_PX }}
      >
        {sidebarContent}
      </aside>
    )
  }

  if (!showDrawer) return null

  return (
    <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[340px] bg-[var(--surface)] border-r border-[var(--border)] p-4 overflow-y-auto"
      >
        {sidebarContent}
      </aside>
    </div>
  )
}
