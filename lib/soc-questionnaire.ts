/**
 * SOC Customer Onboarding – Compliance & Handbook Questionnaire.
 * Basierend auf SOC_Customer_Onboarding_Questionnaire_v2_DattoRMM (ISO 27001, NIS2, GDPR, SOC 2).
 * Wirtschaftspsychologisch aufbereitet: klare Schritte, positive Formulierungen, optional wo möglich.
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
    title: 'Organisationsprofil',
    description: 'Rechtsträger, Branche und Ansprechpartner. Diese Angaben bilden die Grundlage für Ihr SOC-Handbook.',
    complianceRef: 'ISO 27001:2022 4.1/4.2 | NIS2 Art. 3 | GDPR Art. 4 | SOC 2 CC1.1',
    subsections: [
      {
        id: 'legal',
        title: 'Recht & Unternehmensdaten',
        fields: [
          { id: 'legalName', label: 'Vollständiger Firmenname (laut Register)', type: 'text', required: true },
          { id: 'tradingName', label: 'Handelsname (falls abweichend)', type: 'text' },
          { id: 'companyRegNo', label: 'Handelsregisternummer', type: 'text' },
          { id: 'vatId', label: 'USt-IdNr. / Steuernummer', type: 'text' },
          { id: 'countryIncorporation', label: 'Sitz / Land der Eintragung', type: 'text', required: true },
          { id: 'primaryRegion', label: 'Hauptgeschäftsregion', type: 'text' },
          { id: 'employeesTotal', label: 'Anzahl Mitarbeiter (gesamt)', type: 'number' },
          { id: 'employeesItSecurity', label: 'Anzahl IT- / Sicherheitsmitarbeiter', type: 'number' },
          { id: 'parentCompany', label: 'Mutterkonzern (falls zutreffend)', type: 'text' },
        ],
      },
      {
        id: 'industry',
        title: 'Branchenzuordnung',
        description: 'NIS2 unterscheidet „wesentliche“ und „wichtige“ Einrichtungen. Die Zuordnung bestimmt regulatorische Anforderungen.',
        fields: [
          {
            id: 'industrySector',
            label: 'Branche',
            type: 'select',
            required: true,
            options: [
              { value: 'financial', label: 'Finanzdienstleistungen / Banken' },
              { value: 'healthcare', label: 'Gesundheitswesen' },
              { value: 'energy', label: 'Energie / Versorgung / KRITIS' },
              { value: 'transport', label: 'Transport & Logistik' },
              { value: 'digital_infra', label: 'Digitale Infrastruktur' },
              { value: 'government', label: 'Öffentliche Verwaltung' },
              { value: 'manufacturing', label: 'Produktion / OT/ICS' },
              { value: 'retail', label: 'Handel / E-Commerce' },
              { value: 'telecom', label: 'Telekommunikation' },
              { value: 'legal', label: 'Recht / Beratung' },
              { value: 'education', label: 'Bildung / Forschung' },
              { value: 'other', label: 'Sonstige' },
            ],
          },
          {
            id: 'nis2Classification',
            label: 'NIS2-Einstufung',
            type: 'select',
            options: [
              { value: 'essential', label: 'Wesentliche Einrichtung' },
              { value: 'important', label: 'Wichtige Einrichtung' },
              { value: 'out_of_scope', label: 'Nicht im Anwendungsbereich' },
            ],
          },
          { id: 'kritisSector', label: 'KRITIS-Bereich (falls zutreffend)', type: 'text' },
          { id: 'otherCerts', label: 'Weitere Zertifizierungen (z. B. PCI DSS, HIPAA)', type: 'textarea' },
        ],
      },
      {
        id: 'contacts',
        title: 'Ansprechpartner',
        description: 'Diese Kontakte werden in Ihr SOC-Handbook und die Eskalationsmatrix übernommen.',
        fields: [
          { id: 'contactCiso', label: 'CISO / Leiter Sicherheit (Name, E-Mail, Telefon)', type: 'textarea' },
          { id: 'contactItManager', label: 'IT-Leitung / CIO', type: 'textarea' },
          { id: 'contactDpo', label: 'Datenschutzbeauftragter (DPO)', type: 'textarea' },
          { id: 'contactSocLiaison', label: 'SOC-Ansprechpartner (Hauptkontakt)', type: 'textarea', required: true },
          { id: 'contactEscalation', label: 'Eskalation (Geschäftsführung)', type: 'textarea' },
          { id: 'contactLegal', label: 'Recht / Compliance', type: 'textarea' },
          { id: 'contactIr24x7', label: 'Incident Response (24/7)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'it-infrastructure',
    number: '02',
    title: 'IT-Infrastruktur & Bestandsübersicht',
    description: 'Netzwerk, Systeme und kritische Assets. Viele Werte können aus Datto RMM übernommen werden.',
    complianceRef: 'ISO 27001 A.8 | ISO 27005 | NIST CSF ID.AM | SOC 2 CC6.1',
    subsections: [
      {
        id: 'it-env',
        title: 'IT-Umfeld',
        fields: [
          {
            id: 'envType',
            label: 'Primäre IT-Umgebung',
            type: 'multiselect',
            options: [
              { value: 'onprem', label: 'On-Premises Rechenzentrum' },
              { value: 'private_cloud', label: 'Private Cloud' },
              { value: 'aws', label: 'Public Cloud – AWS' },
              { value: 'azure', label: 'Public Cloud – Microsoft Azure' },
              { value: 'gcp', label: 'Public Cloud – Google Cloud' },
              { value: 'hybrid', label: 'Hybrid (On-Prem + Cloud)' },
              { value: 'multicloud', label: 'Multi-Cloud' },
              { value: 'ics', label: 'Industriesteuerung (ICS/SCADA)' },
              { value: 'saas', label: 'Hauptsächlich SaaS' },
            ],
          },
          { id: 'managedEndpoints', label: 'Anzahl verwaltete Endgeräte (PCs/Laptops)', type: 'number', autoFromRmm: true },
          { id: 'physicalServers', label: 'Anzahl physische Server', type: 'number', autoFromRmm: true },
          { id: 'virtualMachines', label: 'Anzahl virtuelle Maschinen', type: 'number', autoFromRmm: true },
          { id: 'networkDevices', label: 'Netzwerkgeräte (SNMP)', type: 'number', autoFromRmm: true },
          { id: 'mobileDevices', label: 'Mobile Geräte (MDM)', type: 'number' },
          { id: 'sitesCount', label: 'Anzahl Standorte', type: 'number' },
          { id: 'countriesHosted', label: 'Länder, in denen Infrastruktur gehostet wird', type: 'text' },
        ],
      },
      {
        id: 'network',
        title: 'Netzwerkarchitektur',
        fields: [
          {
            id: 'networkSegmentation',
            label: 'Netzwerksegmentierung',
            type: 'multiselect',
            options: [
              { value: 'dmz', label: 'DMZ' },
              { value: 'prod_nonprod', label: 'Produktion / Nicht-Produktion getrennt' },
              { value: 'vlan', label: 'VLAN-Segmentierung' },
              { value: 'zero_trust', label: 'Zero Trust' },
              { value: 'ot_it_sep', label: 'OT/IT getrennt' },
              { value: 'none', label: 'Keine formale Segmentierung' },
            ],
          },
          { id: 'firewallVendor', label: 'Firewall-Hersteller / Modell', type: 'text', autoFromRmm: true },
          { id: 'vpnSolution', label: 'VPN-Lösung', type: 'text' },
          { id: 'identityProvider', label: 'Verzeichnis / Identity (z. B. AD, Azure AD, Okta)', type: 'text' },
          { id: 'networkTopologyNote', label: 'Kurzbeschreibung Netzwerktopologie / Verweis auf Diagramm', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'security-controls',
    number: '03',
    title: 'Sicherheitsmaßnahmen',
    description: 'Endpoint-, Netzwerk- und Zugriffsschutz sowie Überwachung.',
    complianceRef: 'ISO 27001 Annex A | NIST CSF PR/DE | SOC 2',
    subsections: [
      {
        id: 'endpoint-network',
        title: 'Endpoint & Netzwerk',
        fields: [
          { id: 'avEdrSolution', label: 'AV/EDR-Lösung', type: 'text' },
          { id: 'patchManagement', label: 'Patch-Management (Prozess / Tool)', type: 'text' },
          { id: 'diskEncryption', label: 'Festplattenverschlüsselung (Ja/Teilweise/Nein)', type: 'select', options: [{ value: 'yes', label: 'Ja' }, { value: 'partial', label: 'Teilweise' }, { value: 'no', label: 'Nein' }] },
        ],
      },
      {
        id: 'iam',
        title: 'Identität & Zugriff',
        fields: [
          { id: 'mfaUsage', label: 'MFA-Nutzung (Umfang)', type: 'textarea' },
          { id: 'accessReviewCadence', label: 'Zugriffsüberprüfungen (Turnus)', type: 'text' },
        ],
      },
      {
        id: 'backup',
        title: 'Backup & Wiederherstellung',
        fields: [
          { id: 'backupSolution', label: 'Backup-Lösung', type: 'text' },
          { id: 'backupRetention', label: 'Aufbewahrungsdauer', type: 'text' },
          { id: 'drTestFrequency', label: 'DR-Tests (Häufigkeit)', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'compliance-audit',
    number: '04',
    title: 'Compliance & Audit',
    description: 'Bestehende Zertifizierungen und Dokumentation.',
    complianceRef: 'ISO 27001 | NIS2 | GDPR | SOC 2',
    subsections: [
      {
        id: 'certifications',
        title: 'Zertifizierungen & Attestierungen',
        fields: [
          { id: 'existingCerts', label: 'Bestehende Zertifizierungen (ISO, SOC 2, etc.)', type: 'textarea' },
          { id: 'lastAuditDate', label: 'Letzter externer Audit-Termin', type: 'date' },
          { id: 'policyDocumentationStatus', label: 'Stand Richtlinien / Dokumentation (kurz)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'data-protection',
    number: '05',
    title: 'Datenschutz',
    description: 'Auftragsverarbeitung und Meldepflichten.',
    complianceRef: 'GDPR Art. 5, 13, 28, 30, 32, 33 | ISO 27701',
    subsections: [
      {
        id: 'data-controller',
        title: 'Auftragsverarbeiter-Status',
        fields: [
          { id: 'dataControllerProcessor', label: 'Auftragsgeber / Auftragsverarbeiter (Kurz)', type: 'textarea' },
          { id: 'personalDataCategories', label: 'Kategorien personenbezogener Daten', type: 'textarea' },
          { id: 'dataBreachHistory24m', label: 'Datenpannen (letzte 24 Monate) – Kurz', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'risk-management',
    number: '06',
    title: 'Risikomanagement',
    description: 'Risikoframework und Top-Risiken.',
    complianceRef: 'ISO 27005 | NIST SP 800-30 | NIS2 Art. 21(2)',
    subsections: [
      {
        id: 'risk-framework',
        title: 'Risikomanagement',
        fields: [
          { id: 'riskFramework', label: 'Risikomanagement-Framework (z. B. ISO 27005)', type: 'text' },
          { id: 'riskReviewCadence', label: 'Turnus Risikobewertung', type: 'text' },
          { id: 'top5Risks', label: 'Top-5-Risiken (Kurz)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'incident-response',
    number: '07',
    title: 'Incident Response & SOC-Eskalation',
    description: 'Eskalationswege und SOC-Berechtigungen.',
    complianceRef: 'ISO 27001 A.5.24–5.28 | NIST SP 800-61 | NIS2 Art. 23',
    subsections: [
      {
        id: 'ir-capability',
        title: 'IR-Kapazität',
        fields: [
          { id: 'irTeamExists', label: 'Internes IR-Team (Ja/Nein/Teilweise)', type: 'select', options: [{ value: 'yes', label: 'Ja' }, { value: 'partial', label: 'Teilweise' }, { value: 'no', label: 'Nein' }] },
          { id: 'socEscalationExpectations', label: 'Erwartungen an SOC-Eskalation & Benachrichtigung', type: 'textarea' },
          { id: 'escalationMatrix', label: 'Eskalationsmatrix (Kurz oder Verweis)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'vendor-soc-auth',
    number: '08',
    title: 'Auftraggeber & SOC-Auftrag',
    description: 'Auftraggeberübersicht und Freigabe für SOC-Dienste.',
    complianceRef: 'ISO 27001 A.5.19–5.22 | NIS2 Art. 21(2)(d)',
    subsections: [
      {
        id: 'vendor-overview',
        title: 'Auftraggeber & Autorisierung',
        fields: [
          { id: 'keyVendors', label: 'Wichtige IT/Sicherheits-Auftraggeber (Kurz)', type: 'textarea' },
          { id: 'socServiceAuthorization', label: 'SOC-Dienstleistung autorisiert durch (Rolle/Name)', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    id: 'logging-siem',
    number: '09',
    title: 'Logquellen & SIEM',
    description: 'Welche Daten fließen in die Überwachung.',
    complianceRef: 'ISO 27001 A.8.15 | NIST CSF DE.CM | NIS2 Art. 21(2)',
    subsections: [
      {
        id: 'log-sources',
        title: 'Logquellen & Use Cases',
        fields: [
          { id: 'logSources', label: 'Logquellen / Data Feeds (z. B. Firewall, AD, EDR)', type: 'textarea' },
          { id: 'siemIntegration', label: 'SIEM / Integration (Kurz)', type: 'text' },
          { id: 'detectionPriorities', label: 'Priorität der Erkennungs-Use-Cases', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'bcp-drp',
    number: '10',
    title: 'BCP/DRP',
    description: 'Geschäftskontinuität und Verfügbarkeit.',
    complianceRef: 'ISO 22301 | ISO 27001 A.5.29–5.30 | NIS2 Art. 21(2)(c)',
    subsections: [
      {
        id: 'bcp-status',
        title: 'BCP/DRP-Status',
        fields: [
          { id: 'bcpDrpStatus', label: 'BCP/DRP-Status (kurz)', type: 'textarea' },
          { id: 'criticalProcessAvailability', label: 'Verfügbarkeitsanforderungen kritischer Prozesse', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'training',
    number: '11',
    title: 'Schulungen',
    description: 'Sicherheitsbewusstsein und Schulung.',
    complianceRef: 'ISO 27001 A.6.3 | NIS2 Art. 20 | SOC 2 CC1.4',
    subsections: [
      {
        id: 'training-programme',
        title: 'Schulungsprogramm',
        fields: [
          { id: 'securityAwarenessTraining', label: 'Sicherheitsschulungen (Turnus / Inhalt)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'reporting-sla',
    number: '12',
    title: 'Reporting & SLA',
    description: 'Berichtsturnus und KPIs für den SOC.',
    complianceRef: 'ISO 27001 Clause 9.1 | ITIL 4 | SOC 2',
    subsections: [
      {
        id: 'reporting',
        title: 'Berichte & KPIs',
        fields: [
          { id: 'reportingCadence', label: 'Gewünschter Berichtsturnus', type: 'select', options: [{ value: 'weekly', label: 'Wöchentlich' }, { value: 'biweekly', label: 'Zweiwöchentlich' }, { value: 'monthly', label: 'Monatlich' }, { value: 'quarterly', label: 'Vierteljährlich' }] },
          { id: 'kpiPriorities', label: 'Priorisierte KPIs für den SOC', type: 'textarea' },
          { id: 'slaParameters', label: 'SLA-Parameter (Reaktionszeiten etc.)', type: 'textarea' },
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
