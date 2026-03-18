/**
 * FAQ content for the app – 10 main categories, 30–40 Q&As.
 * Used on /faq page. All copy in US English.
 */

export type FaqCategory = {
  id: string
  title: string
  icon: string
  items: { question: string; answer: string }[]
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'dashboard',
    title: 'Dashboard & Overview',
    icon: 'LayoutDashboard',
    items: [
      {
        question: 'What is the Dashboard?',
        answer: 'The Dashboard is your home screen. It shows key metrics (e.g., coverage, open incidents, compliance), events and MDU (data cost), alerts from RMM/EDR, and quick links to Company, Financials, and Marketplace. You can switch between App and Desktop view and, for partners, between Partner and Customer view.',
      },
      {
        question: 'What are the main KPIs on the Dashboard?',
        answer: 'Coverage (monitored assets), Open Incidents, and Compliance percentage. Trends (e.g., +X% over 30 days) help you see direction. Events & Data cost (MDU) shows monthly event volume and estimated data processing cost.',
      },
      {
        question: 'How do I switch between App and Desktop view?',
        answer: 'Open the menu (hamburger or pinned sidebar). At the bottom you will see "App" and "Desktop". Tap or click to switch. Desktop view shows a wider layout with a sidebar you can pin for quick navigation.',
      },
      {
        question: 'What is the difference between Partner and Customer view?',
        answer: 'As a partner you can switch to "Partner" view to see your portfolio, MRR, deal calculator (Partner Pricing), and P/L. In "Customer" view you see the perspective of a single tenant (company): their devices, incidents, financials, and governance.',
      },
    ],
  },
  {
    id: 'company',
    title: 'Company & Tenants',
    icon: 'Building2',
    items: [
      {
        question: 'What is the Company page?',
        answer: 'The Company page shows your organization (tenant): name, locations (sites with address and map), and optional certificates. If you manage multiple companies, use the company selector at the top to switch.',
      },
      {
        question: 'What is a tenant?',
        answer: 'A tenant is a customer or organization in the system. Each tenant has its own Company data, locations, billing, connectors (APIs), and users. Admins and partners manage tenants in Admin → Tenants (Customer file).',
      },
      {
        question: 'What is Data residency (region)?',
        answer: 'Data residency defines where this tenant\'s data is processed (e.g., US, EU, Asia). It can be set in the Customer file → Company. This supports compliance requirements such as GDPR.',
      },
      {
        question: 'How do I add or edit locations?',
        answer: 'On the Company page you can add locations (name, address, optional lat/lng). In Admin, open the Customer file for a tenant and go to the "Locations" tab to add or remove sites for that tenant.',
      },
    ],
  },
  {
    id: 'devices',
    title: 'Devices & Security',
    icon: 'Shield',
    items: [
      {
        question: 'What does Devices & Staff show?',
        answer: 'Devices & Staff lists monitored devices (from RMM or demo data), their status, and optional staff assignments. It gives you a single view of endpoints and who is responsible for them.',
      },
      {
        question: 'What is Cloud Security?',
        answer: 'The Cloud Security area shows cloud assets and security posture (e.g., misconfigurations, recommendations). It helps you see risks across cloud environments in one place.',
      },
      {
        question: 'How does RMM/EDR data get into the app?',
        answer: 'Data is connected via APIs. In Admin → Customer file → API & Connectors you can add connectors (e.g., RMM, Sophos, Autotask) and enter the parameters (URL, keys, tenant ID). The app then pulls devices, alerts, and events from these sources.',
      },
      {
        question: 'What are Incidents?',
        answer: 'Incidents are security or operational events that have been triaged (e.g., Resolved or Closed). They come from RMM, EDR, or other integrations. The Incidents page lets you filter, open details, and see event logs. Resolved/Closed incidents feed into billing.',
      },
    ],
  },
  {
    id: 'billing-mdu',
    title: 'Billing & MDU',
    icon: 'DollarSign',
    items: [
      {
        question: 'What is MDU (Mahoney Data Units)?',
        answer: 'MDU is the data processing component. Events (from RMM, EDR, SIEM) that flow through the platform are counted. The first 1 million events per month are typically included; beyond that, usage is billed in tiers. See Financials and Admin → Billing for your numbers.',
      },
      {
        question: 'What is the MDU budget?',
        answer: 'You can set a monthly MDU budget per tenant (minimum $1,000) in Admin → Customer file → Billing. When the budget is reached, no further MDU processing runs for that tenant until the next period or a budget increase. This keeps costs predictable.',
      },
      {
        question: 'Where do I see my billing and MDU cost?',
        answer: 'Financials shows Platform & Data (MDU) with devices, events per month, and MDU cost. Admin → Billing shows monthly accumulation (alerts, events, threshold, MDU cost) and a "Copy for invoice" option for invoicing.',
      },
      {
        question: 'How is the monthly accumulation used for invoicing?',
        answer: 'In Admin → Billing you see per month: number of alerts (incidents), total events, whether the 1M threshold was exceeded, and MDU cost. Use "Copy for invoice" to paste a summary into your invoice or billing tool.',
      },
    ],
  },
  {
    id: 'financials',
    title: 'Financials',
    icon: 'TrendingUp',
    items: [
      {
        question: 'What is the Financials page for?',
        answer: 'Financials gives you an overview of costs and value: data (MDU) monthly cost, ROI inputs (e.g., time saved, incidents avoided), and optional incident cost history. It helps you understand spend and justify investment.',
      },
      {
        question: 'What is the ROI simulator?',
        answer: 'The ROI simulator lets you enter assumptions (e.g., hours saved per month, incidents avoided, labor cost). It then calculates a simple ROI so you can show customers or management the value of the platform.',
      },
      {
        question: 'Where do event and device numbers come from?',
        answer: 'When RMM or SIEM is connected, event counts can come from live APIs. Otherwise the app uses an estimate (e.g., devices × events per device per day × 30). The source (SIEM vs. estimate) is indicated on the Financials and Dashboard.',
      },
    ],
  },
  {
    id: 'partners',
    title: 'Partners & Pricing',
    icon: 'Users',
    items: [
      {
        question: 'What is Partner Pricing?',
        answer: 'Partner Pricing is a deal calculator. You enter customer size (devices, optional events), and the app shows list prices, your cost, margin, tier impact, and MDU earning potential. It helps you price deals and see margin.',
      },
      {
        question: 'How does partner margin on MDU work?',
        answer: 'Partners earn a margin per 1,000 events (MDU) that flow through the platform. This is passive revenue: as the customer\'s data is processed, you receive a share. The exact rate is in the Partner Pricing page and your price list.',
      },
      {
        question: 'What are partner tiers?',
        answer: 'Partners can be Authorized, Advanced, or Elite. Tier affects discount levels (e.g., 20–40% on platform products) and onboarding fees. Tier is set in Admin → Partners and influences the deal calculator.',
      },
      {
        question: 'Where do I manage my customers (tenants)?',
        answer: 'Admins and partners manage tenants in Admin → Tenants. Open the Customer file to edit company data, locations, partner assignment, billing, API & Connectors, frameworks, and user sync. Partners only see their own tenants.',
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance & Compliance',
    icon: 'Scale',
    items: [
      {
        question: 'What is the Governance page?',
        answer: 'Governance shows compliance posture: frameworks (e.g., ISO 27001, SOC 2), document status, and optional AI-evaluated policies. It helps you track what is in place and what is missing.',
      },
      {
        question: 'What is the SOC questionnaire and handbook?',
        answer: 'The SOC-Compliance & Handbook area supports SOC 2 readiness: questionnaire, controls, and a place to maintain your security handbook. It guides you through evidence and documentation needed for an audit.',
      },
      {
        question: 'How do I add a framework or upload a document?',
        answer: 'In Admin → Customer file → Framework & documents you select a framework (e.g., ISO 27001) and can upload a document (e.g., policy PDF). Documents can be used for AI evaluation. The same tenant can have multiple framework–document pairs.',
      },
    ],
  },
  {
    id: 'mission',
    title: 'Mission Briefing & Incidents',
    icon: 'Radio',
    items: [
      {
        question: 'What is Mission Briefing (Mission Control)?',
        answer: 'Mission Briefing supports shift handover and daily briefings. You can create briefings by date, add participants, link metrics (e.g., open incidents, events), and record red flags or post-shift reviews. It keeps SOC or NOC teams aligned.',
      },
      {
        question: 'How do I create a briefing?',
        answer: 'Go to Mission Control, choose the tenant (if you have several), and create a new briefing for a date. Add participants, optional metrics, and notes. You can lock a briefing when it is final and use debrief/review after the shift.',
      },
      {
        question: 'How do Incidents relate to billing?',
        answer: 'Only incidents in status Resolved or Closed are counted for billing (e.g., monthly accumulation in Admin → Billing). Open or other statuses are for operational view only. Event logs per incident feed into event/MDU totals.',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin & Settings',
    icon: 'Settings',
    items: [
      {
        question: 'Who can access Admin?',
        answer: 'Admin is available to users with the right role (e.g., admin, superadmin, or partner). Partners only see their own tenants and partners. Here you manage users, partners, tenants (Customer file), billing overview, and app settings.',
      },
      {
        question: 'How do I add API connectors for a tenant?',
        answer: 'Open Admin → Tenants, select or add a tenant, and go to the "API & Connectors" tab. Click "+ Add connector", enter a name (e.g., RMM, Sophos) and the parameters required by that API (URL, key, tenant ID, etc.). Save the tenant.',
      },
      {
        question: 'What is the User tab in the Customer file?',
        answer: 'The User tab lets you configure user sync for that tenant: provider (LDAP, Azure, or AWS), protocol (e.g., SAML, OIDC), and optional key-value config. This supports pulling users from the customer\'s directory into the platform.',
      },
      {
        question: 'Where do I change app settings (e.g. theme)?',
        answer: 'Settings (in the menu) lets you change theme (light/dark), notifications, and view API & connector registration links. Profile lets you change your profile picture and view security (e.g., last sign-in).',
      },
    ],
  },
  {
    id: 'ai-marketplace',
    title: 'AI & Marketplace',
    icon: 'ShoppingBag',
    items: [
      {
        question: 'What is the AI Co-Pilot?',
        answer: 'The AI Co-Pilot is an in-app assistant. You can ask questions about the platform, billing, MDU, partners, or incidents. It uses the app\'s context to give short answers. Open it from the menu or the Co-Pilot entry point.',
      },
      {
        question: 'What is AI Growth & Risk Intelligence (Mahoney Grow)?',
        answer: 'Mahoney Grow provides AI-driven growth and risk insights: scores, trends, and recommendations. It helps you see where to improve coverage, compliance, or sales and where risks might be increasing.',
      },
      {
        question: 'What is the Marketplace?',
        answer: 'The Marketplace lists products and services you can subscribe to: platform tiers (Essential, Professional, Enterprise), Platform & Data (MDU), SOC tiers, and AI (e.g., Claude). Prices and descriptions help you choose or sell add-ons.',
      },
      {
        question: 'How is AI (e.g. Claude) billed?',
        answer: 'AI features that use external APIs (e.g., Claude) track usage (e.g., tokens). Costs are passed through with a margin (e.g., 50%). You see reference pricing in Admin → Billing and actual usage in your billing or usage reports.',
      },
    ],
  },
]
