'use client'

import { useLocaleStore } from './locale.store'
import type { Locale } from './locale.store'

export type TranslationKey = keyof typeof translations['en-US']

const translations = {
  'en-US': {
    // TopAppBar & global
    appTagline: 'Unified Risk, Operations & Growth Control Surface',
    askAICoPilot: 'Ask AI Co-Pilot',
    copilot: 'AI Co-Pilot',
    language: 'Language',
    english: 'English',
    german: 'Deutsch',
    // Nav sections
    menu: 'Menu',
    unpin: 'Unpin',
    pin: 'Pin',
    askAI: 'Ask AI',
    operationsTech: 'Operations (Technik)',
    dashboard: 'Dashboard',
    devicesAndStaff: 'Devices & Staff',
    company: 'Company',
    cloudSecurity: 'Cloud Security',
    governance: 'Governance',
    socComplianceHandbook: 'SOC-Compliance & Handbook',
    financials: 'Financials',
    contracts: 'Contracts',
    projects: 'Projects',
    incidents: 'Incidents',
    missionBriefing: 'Mission Briefing',
    aiGrowth: 'AI & Growth',
    aiGrowthRisk: 'AI Growth & Risk Intelligence',
    marketplacePurchase: 'Marketplace (Purchase)',
    marketplace: 'Marketplace',
    partnerPricing: 'Partner Pricing',
    enhanceUpgrades: 'Enhance / Upgrades',
    settings: 'Settings',
    faq: 'FAQ',
    profile: 'Profile',
    groupAdmin: 'Mahoney IT Group',
    groupAdminOnboarding: 'Group Admin (Onboarding)',
    appManagement: 'App Management',
    adminUserPartnerSettings: 'Admin (User, Partner, Settings)',
    display: 'Display',
    app: 'App',
    desktop: 'Desktop',
    openAICoPilot: 'Open AI Co-Pilot',
    // Dashboard
    controlDashboard: 'Control Dashboard',
    singleTenantView: 'Single-tenant view',
    partnerOverview: 'Partner overview',
    selectCustomer: 'Select customer',
    // Currency / units
    perMonth: '/mo',
    perPeriod: '/period',
    listPrice: 'List price',
    yourCost: 'Your cost',
    yourSalePrice: 'Your sale price',
    salePrice: 'Sale price',
    totalSale: 'Total sale',
    active: 'Active',
    inactive: 'Inactive',
    save: 'Save',
    cancel: 'Cancel',
    // Common
    loading: 'Loading…',
    error: 'Error',
    optional: 'Optional',
  },
  de: {
    appTagline: 'Einheitliche Risiko-, Betriebs- und Wachstumssteuerung',
    askAICoPilot: 'KI Co-Pilot fragen',
    copilot: 'KI Co-Pilot',
    language: 'Sprache',
    english: 'English',
    german: 'Deutsch',
    menu: 'Menü',
    unpin: 'Lösen',
    pin: 'Anheften',
    askAI: 'KI fragen',
    operationsTech: 'Betrieb (Technik)',
    dashboard: 'Dashboard',
    devicesAndStaff: 'Geräte & Mitarbeiter',
    company: 'Unternehmen',
    cloudSecurity: 'Cloud-Sicherheit',
    governance: 'Governance',
    socComplianceHandbook: 'SOC-Compliance & Handbuch',
    financials: 'Finanzen',
    contracts: 'Verträge',
    projects: 'Projekte',
    incidents: 'Vorfälle',
    missionBriefing: 'Mission Briefing',
    aiGrowth: 'KI & Wachstum',
    aiGrowthRisk: 'KI-Wachstum & Risiko-Intelligence',
    marketplacePurchase: 'Marketplace (Kauf)',
    marketplace: 'Marketplace',
    partnerPricing: 'Partner-Preise',
    enhanceUpgrades: 'Enhance / Upgrades',
    settings: 'Einstellungen',
    faq: 'FAQ',
    profile: 'Profil',
    groupAdmin: 'Mahoney IT Group',
    groupAdminOnboarding: 'Group Admin (Onboarding)',
    appManagement: 'App-Verwaltung',
    adminUserPartnerSettings: 'Admin (Benutzer, Partner, Einstellungen)',
    display: 'Anzeige',
    app: 'App',
    desktop: 'Desktop',
    openAICoPilot: 'KI Co-Pilot öffnen',
    controlDashboard: 'Kontroll-Dashboard',
    singleTenantView: 'Single-Tenant-Ansicht',
    partnerOverview: 'Partner-Übersicht',
    selectCustomer: 'Kunde auswählen',
    perMonth: '/Monat',
    perPeriod: '/Zeitraum',
    listPrice: 'Listenpreis',
    yourCost: 'Ihre Kosten',
    yourSalePrice: 'Ihr Verkaufspreis',
    salePrice: 'Verkaufspreis',
    totalSale: 'Gesamtverkauf',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    save: 'Speichern',
    cancel: 'Abbrechen',
    loading: 'Laden…',
    error: 'Fehler',
    optional: 'Optional',
  },
} as const

const en = translations['en-US']
const de = translations.de

export function getTranslations(locale: Locale): Record<TranslationKey, string> {
  return locale === 'de' ? (de as Record<TranslationKey, string>) : (en as Record<TranslationKey, string>)
}

export function t(key: TranslationKey, locale: Locale): string {
  const dict = getTranslations(locale)
  return dict[key] ?? (en as Record<string, string>)[key] ?? key
}

/** Hook: returns t(key) for current locale. Use in client components. */
export function useT(): (key: TranslationKey) => string {
  const locale = useLocaleStore((s) => s.locale)
  return (key: TranslationKey) => t(key, locale)
}

export { translations }
