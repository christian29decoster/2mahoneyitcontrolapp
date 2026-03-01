/**
 * SOC Customer Onboarding – Compliance & Handbook Questionnaire.
 * Based on SOC_Customer_Onboarding_Questionnaire_v2_DattoRMM (ISO 27001, NIS2, GDPR, SOC 2).
 * Clear steps, positive wording, optional where possible.
 */

export type FieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'date' | 'contact_table'

export interface QuestionnaireField {
  id: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  autoFromRmm?: boolean
  hint?: string
}

export interface QuestionnaireSubsection {
  id: string
  title: string
  description?: string
  fields: QuestionnaireField[]
}

export interface QuestionnaireSection {
  id: string
  number: string
  title: string
  description: string
  complianceRef?: string
  subsections: QuestionnaireSubsection[]
}

export const SOC_QUESTIONNAIRE_SECTIONS: QuestionnaireSection[] = [
  {
    id: 'org-profile',
    number: '01',
    title: 'Organization profile',
    description: 'Legal entity, industry and contacts. This information forms the basis for your SOC handbook.',
    complianceRef: 'ISO 27001:2022 4.1/4.2 | NIS2 Art. 3 | GDPR Art. 4 | SOC 2 CC1.1',
    subsections: [
      {
        id: 'legal',
        title: 'Legal & company data',
        fields: [
          { id: 'legalName', label: 'Full legal company name (per register)', type: 'text', required: true },
          { id: 'tradingName', label: 'Trading name (if different)', type: 'text' },
          { id: 'companyRegNo', label: 'Company registration number', type: 'text' },
          { id: 'vatId', label: 'VAT ID / Tax ID', type: 'text' },
          { id: 'countryIncorporation', label: 'Registered office / country of incorporation', type: 'text', required: true },
          { id: 'primaryRegion', label: 'Primary business region', type: 'text' },
          { id: 'employeesTotal', label: 'Number of employees (total)', type: 'number' },
          { id: 'employeesItSecurity', label: 'Number of IT / security staff', type: 'number' },
          { id: 'parentCompany', label: 'Parent company (if applicable)', type: 'text' },
        ],
      },
      {
        id: 'industry',
        title: 'Industry classification',
        description: 'NIS2 distinguishes "essential" and "important" entities. Classification determines regulatory requirements.',
        fields: [
          {
            id: 'industrySector',
            label: 'Industry',
            type: 'select',
            required: true,
            options: [
              { value: 'financial', label: 'Financial services / Banking' },
              { value: 'healthcare', label: 'Healthcare' },
              { value: 'energy', label: 'Energy / Utilities / Critical infrastructure' },
              { value: 'transport', label: 'Transport & logistics' },
              { value: 'digital_infra', label: 'Digital infrastructure' },
              { value: 'government', label: 'Public administration' },
              { value: 'manufacturing', label: 'Manufacturing / OT/ICS' },
              { value: 'retail', label: 'Retail / E-commerce' },
              { value: 'telecom', label: 'Telecommunications' },
              { value: 'legal', label: 'Legal / Consulting' },
              { value: 'education', label: 'Education / Research' },
              { value: 'other', label: 'Other' },
            ],
          },
          {
            id: 'nis2Classification',
            label: 'NIS2 classification',
            type: 'select',
            options: [
              { value: 'essential', label: 'Essential entity' },
              { value: 'important', label: 'Important entity' },
              { value: 'out_of_scope', label: 'Out of scope' },
            ],
          },
          { id: 'kritisSector', label: 'Critical infrastructure sector (if applicable)', type: 'text' },
          { id: 'otherCerts', label: 'Other certifications (e.g. PCI DSS, HIPAA)', type: 'textarea' },
        ],
      },
      {
        id: 'contacts',
        title: 'Contacts',
        description: 'These contacts will be included in your SOC handbook and escalation matrix.',
        fields: [
          { id: 'contactCiso', label: 'CISO / Head of security (name, email, phone)', type: 'textarea' },
          { id: 'contactItManager', label: 'IT leadership / CIO', type: 'textarea' },
          { id: 'contactDpo', label: 'Data protection officer (DPO)', type: 'textarea' },
          { id: 'contactSocLiaison', label: 'SOC contact (primary)', type: 'textarea', required: true },
          { id: 'contactEscalation', label: 'Escalation (executive)', type: 'textarea' },
          { id: 'contactLegal', label: 'Legal / Compliance', type: 'textarea' },
          { id: 'contactIr24x7', label: 'Incident response (24/7)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'it-infrastructure',
    number: '02',
    title: 'IT infrastructure & inventory',
    description: 'Network, systems and critical assets. Many values can be taken from Datto RMM.',
    complianceRef: 'ISO 27001 A.8 | ISO 27005 | NIST CSF ID.AM | SOC 2 CC6.1',
    subsections: [
      {
        id: 'it-env',
        title: 'IT environment',
        fields: [
          {
            id: 'envType',
            label: 'Primary IT environment',
            type: 'multiselect',
            options: [
              { value: 'onprem', label: 'On-premises data center' },
              { value: 'private_cloud', label: 'Private cloud' },
              { value: 'aws', label: 'Public cloud – AWS' },
              { value: 'azure', label: 'Public cloud – Microsoft Azure' },
              { value: 'gcp', label: 'Public cloud – Google Cloud' },
              { value: 'hybrid', label: 'Hybrid (on-prem + cloud)' },
              { value: 'multicloud', label: 'Multi-cloud' },
              { value: 'ics', label: 'Industrial control (ICS/SCADA)' },
              { value: 'saas', label: 'Primarily SaaS' },
            ],
          },
          { id: 'managedEndpoints', label: 'Number of managed endpoints (PCs/laptops)', type: 'number', autoFromRmm: true },
          { id: 'physicalServers', label: 'Number of physical servers', type: 'number', autoFromRmm: true },
          { id: 'virtualMachines', label: 'Number of virtual machines', type: 'number', autoFromRmm: true },
          { id: 'networkDevices', label: 'Network devices (SNMP)', type: 'number', autoFromRmm: true },
          { id: 'mobileDevices', label: 'Mobile devices (MDM)', type: 'number' },
          { id: 'sitesCount', label: 'Number of sites', type: 'number' },
          { id: 'countriesHosted', label: 'Countries where infrastructure is hosted', type: 'text' },
        ],
      },
      {
        id: 'network',
        title: 'Network architecture',
        fields: [
          {
            id: 'networkSegmentation',
            label: 'Network segmentation',
            type: 'multiselect',
            options: [
              { value: 'dmz', label: 'DMZ' },
              { value: 'prod_nonprod', label: 'Production / non-production separated' },
              { value: 'vlan', label: 'VLAN segmentation' },
              { value: 'zero_trust', label: 'Zero Trust' },
              { value: 'ot_it_sep', label: 'OT/IT separated' },
              { value: 'none', label: 'No formal segmentation' },
            ],
          },
          { id: 'firewallVendor', label: 'Firewall vendor / model', type: 'text', autoFromRmm: true },
          { id: 'vpnSolution', label: 'VPN solution', type: 'text' },
          { id: 'identityProvider', label: 'Directory / identity (e.g. AD, Azure AD, Okta)', type: 'text' },
          { id: 'networkTopologyNote', label: 'Brief network topology description / reference to diagram', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'security-controls',
    number: '03',
    title: 'Security controls',
    description: 'Endpoint, network and access protection plus monitoring.',
    complianceRef: 'ISO 27001 Annex A | NIST CSF PR/DE | SOC 2',
    subsections: [
      {
        id: 'endpoint-network',
        title: 'Endpoint & network',
        fields: [
          { id: 'avEdrSolution', label: 'AV/EDR solution', type: 'text' },
          { id: 'patchManagement', label: 'Patch management (process / tool)', type: 'text' },
          { id: 'diskEncryption', label: 'Disk encryption (Yes/Partial/No)', type: 'select', options: [{ value: 'yes', label: 'Yes' }, { value: 'partial', label: 'Partial' }, { value: 'no', label: 'No' }] },
        ],
      },
      {
        id: 'iam',
        title: 'Identity & access',
        fields: [
          { id: 'mfaUsage', label: 'MFA usage (scope)', type: 'textarea' },
          { id: 'accessReviewCadence', label: 'Access reviews (frequency)', type: 'text' },
        ],
      },
      {
        id: 'backup',
        title: 'Backup & recovery',
        fields: [
          { id: 'backupSolution', label: 'Backup solution', type: 'text' },
          { id: 'backupRetention', label: 'Retention period', type: 'text' },
          { id: 'drTestFrequency', label: 'DR tests (frequency)', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'compliance-audit',
    number: '04',
    title: 'Compliance & audit',
    description: 'Existing certifications and documentation.',
    complianceRef: 'ISO 27001 | NIS2 | GDPR | SOC 2',
    subsections: [
      {
        id: 'certifications',
        title: 'Certifications & attestations',
        fields: [
          { id: 'existingCerts', label: 'Existing certifications (ISO, SOC 2, etc.)', type: 'textarea' },
          { id: 'lastAuditDate', label: 'Last external audit date', type: 'date' },
          { id: 'policyDocumentationStatus', label: 'Policy / documentation status (brief)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'data-protection',
    number: '05',
    title: 'Data protection',
    description: 'Data processing and notification obligations.',
    complianceRef: 'GDPR Art. 5, 13, 28, 30, 32, 33 | ISO 27701',
    subsections: [
      {
        id: 'data-controller',
        title: 'Processor status',
        fields: [
          { id: 'dataControllerProcessor', label: 'Data controller / processor (brief)', type: 'textarea' },
          { id: 'personalDataCategories', label: 'Categories of personal data', type: 'textarea' },
          { id: 'dataBreachHistory24m', label: 'Data breaches (last 24 months) – brief', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'risk-management',
    number: '06',
    title: 'Risk management',
    description: 'Risk framework and top risks.',
    complianceRef: 'ISO 27005 | NIST SP 800-30 | NIS2 Art. 21(2)',
    subsections: [
      {
        id: 'risk-framework',
        title: 'Risk management',
        fields: [
          { id: 'riskFramework', label: 'Risk management framework (e.g. ISO 27005)', type: 'text' },
          { id: 'riskReviewCadence', label: 'Risk assessment frequency', type: 'text' },
          { id: 'top5Risks', label: 'Top 5 risks (brief)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'incident-response',
    number: '07',
    title: 'Incident response & SOC escalation',
    description: 'Escalation paths and SOC authorization.',
    complianceRef: 'ISO 27001 A.5.24–5.28 | NIST SP 800-61 | NIS2 Art. 23',
    subsections: [
      {
        id: 'ir-capability',
        title: 'IR capability',
        fields: [
          { id: 'irTeamExists', label: 'Internal IR team (Yes/No/Partial)', type: 'select', options: [{ value: 'yes', label: 'Yes' }, { value: 'partial', label: 'Partial' }, { value: 'no', label: 'No' }] },
          { id: 'socEscalationExpectations', label: 'Expectations for SOC escalation & notification', type: 'textarea' },
          { id: 'escalationMatrix', label: 'Escalation matrix (brief or reference)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'vendor-soc-auth',
    number: '08',
    title: 'Client & SOC mandate',
    description: 'Client overview and authorization for SOC services.',
    complianceRef: 'ISO 27001 A.5.19–5.22 | NIS2 Art. 21(2)(d)',
    subsections: [
      {
        id: 'vendor-overview',
        title: 'Client & authorization',
        fields: [
          { id: 'keyVendors', label: 'Key IT/security vendors (brief)', type: 'textarea' },
          { id: 'socServiceAuthorization', label: 'SOC service authorized by (role/name)', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    id: 'logging-siem',
    number: '09',
    title: 'Log sources & SIEM',
    description: 'What data feeds into monitoring.',
    complianceRef: 'ISO 27001 A.8.15 | NIST CSF DE.CM | NIS2 Art. 21(2)',
    subsections: [
      {
        id: 'log-sources',
        title: 'Log sources & use cases',
        fields: [
          { id: 'logSources', label: 'Log sources / data feeds (e.g. firewall, AD, EDR)', type: 'textarea' },
          { id: 'siemIntegration', label: 'SIEM / integration (brief)', type: 'text' },
          { id: 'detectionPriorities', label: 'Priority of detection use cases', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'bcp-drp',
    number: '10',
    title: 'BCP/DRP',
    description: 'Business continuity and availability.',
    complianceRef: 'ISO 22301 | ISO 27001 A.5.29–5.30 | NIS2 Art. 21(2)(c)',
    subsections: [
      {
        id: 'bcp-status',
        title: 'BCP/DRP status',
        fields: [
          { id: 'bcpDrpStatus', label: 'BCP/DRP status (brief)', type: 'textarea' },
          { id: 'criticalProcessAvailability', label: 'Availability requirements for critical processes', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'training',
    number: '11',
    title: 'Training',
    description: 'Security awareness and training.',
    complianceRef: 'ISO 27001 A.6.3 | NIS2 Art. 20 | SOC 2 CC1.4',
    subsections: [
      {
        id: 'training-programme',
        title: 'Training program',
        fields: [
          { id: 'securityAwarenessTraining', label: 'Security awareness training (frequency / content)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'reporting-sla',
    number: '12',
    title: 'Reporting & SLA',
    description: 'Reporting frequency and KPIs for the SOC.',
    complianceRef: 'ISO 27001 Clause 9.1 | ITIL 4 | SOC 2',
    subsections: [
      {
        id: 'reporting',
        title: 'Reports & KPIs',
        fields: [
          { id: 'reportingCadence', label: 'Desired reporting frequency', type: 'select', options: [{ value: 'weekly', label: 'Weekly' }, { value: 'biweekly', label: 'Biweekly' }, { value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }] },
          { id: 'kpiPriorities', label: 'Prioritized KPIs for the SOC', type: 'textarea' },
          { id: 'slaParameters', label: 'SLA parameters (response times, etc.)', type: 'textarea' },
        ],
      },
    ],
  },
]

export type SocQuestionnaireAnswers = Record<string, string | number | string[]>

export function getEmptyAnswers(): SocQuestionnaireAnswers {
  const out: SocQuestionnaireAnswers = {}
  for (const section of SOC_QUESTIONNAIRE_SECTIONS) {
    for (const sub of section.subsections) {
      for (const field of sub.fields) {
        if (field.type === 'multiselect') out[field.id] = []
        else out[field.id] = ''
      }
    }
  }
  return out
}
