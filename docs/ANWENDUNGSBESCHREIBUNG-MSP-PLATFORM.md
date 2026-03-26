# Mahoney IT Control App – Anwendungsbeschreibung

Dieses Dokument beschreibt **wofür** die Plattform gedacht ist, **welche Geschäfts- und Betriebsbereiche** sie abbildet und **welchen Nutzen** Managed Service Provider (MSP) sowie deren **Endkunden** davon haben. Es bezieht sich auf die **Mahoney Control App** (Next.js, Dark-UI), wie sie im Repository umgesetzt ist.

---

## 1. Kurzüberblick: Wofür ist die Anwendung da?

Die **Mahoney IT Control App** ist eine **zentralisierte Steuerungs- und Transparenzplattform** für **Cybersecurity- und IT-Betrieb** im MSP-Umfeld. Sie bündelt typische Steuerungsaufgaben – von Geräte- und Unternehmenskontext über Governance und Vorfälle bis zu **wirtschaftlichen Kennzahlen** (Financials), **Wachstum** (Mahoney Grow) und **Beschaffung** (Marketplace) – in **einer** konsistenten Oberfläche („Single Pane of Glass“).

Sie richtet sich an:

| Rolle | Nutzen in einem Satz |
|--------|----------------------|
| **MSP / Partner** | Einheitliche Sicht auf Mandanten, Services, Risiken und Wirtschaftlichkeit; bessere Beratung, Reporting und Skalierung. |
| **Endkunde / Mandant** | Verständliche Kennzahlen, Nachvollziehbarkeit von Security-Investitionen und Compliance-Themen ohne Excel-Wildwuchs. |

Technisch ist die App als **Webanwendung** (z. B. Vercel) ausgelegt, mit **rollen- und featureabhängigen** Bereichen (z. B. Partner-Preise, Mission Briefing, Gruppen-Administration je nach Konfiguration).

---

## 2. Welche „Business Lines“ bzw. Betriebsbereiche werden abgebildet?

Im Navigationskonzept der App lassen sich folgende **inhaltliche Säulen** zuordnen. Sie entsprechen typischen **MSP-Service-Lines** und **Sicherheitsfunktionen**:

### 2.1 Operations & Technik (laufender Betrieb)

- **Dashboard** – Gesamtüberblick zu Status, Kennzahlen und Handlungsempfehlungen.
- **Geräte & Personal (Devices)** – Endpunkte, Schutzstatus, Zuordnung zu Nutzern/Standorten (inkl. Anbindung an reale Datenquellen wie RMM, wo konfiguriert).
- **Unternehmen (Company)** – Mandanten-/Organisationskontext für Beratung und Reporting.
- **Cloud Security** – Fokus Cloud-relevante Sicherheitsaspekte (Übersichtsseite im Produkt).
- **Vorfälle (Incidents)** – Bearbeitung und Nachverfolgung sicherheitsrelevanter Ereignisse.
- **Projekte** – Zuordnung von Arbeitspaketen und Initiativen (operativ).

Diese Bereiche unterstützen die **MSP-Kernleistung**: Monitoring, Betrieb, Incident Response und kontinuierliche Verbesserung.

### 2.2 Governance, Compliance & Nachweis

- **Governance** – Rahmenwerke, Policies und reifegradorientierte Themen (u. a. Handbuch-/Fragebogenpfade wie SOC-Compliance).
- **SOC-Questionnaire / Compliance-Handbuch** – strukturierte Erfassung für Audits und Nachweise.

Damit wird die **Business Line „GRC“ (Governance, Risk, Compliance)** abgedeckt – wichtig für regulierte Branchen und für MSP, die **auditierbare** Lieferketten verkaufen.

### 2.3 Wirtschaftlichkeit & Investitionssteuerung (Financials)

Der Bereich **Financials** adressiert explizit die **wirtschaftliche Seite von Cybersecurity**:

- KPIs (z. B. Security Spend pro Nutzer, Kosten pro Vorfall, MTTR, Risikoexposition).
- **ROI-Simulator** – Ableitung von manuellem Aufwand, Ausfallkosten und Einsparpotenzialen.
- **Incident Cost Mapping** – Transparenz bei geschlossenen Vorfällen (Downtime, Arbeit, Gesamtkosten).
- Erweiterte Ansichten (je nach Release): Trends, Branchenbenchmarks, Compliance-Kostenlayer, Cyber-Versicherung, Budgetplanung, Partner-P&L, Executive-Reports.

Das bildet die **Business Line „FinOps / Security Economics“** ab: Security nicht nur technisch, sondern **investitions- und entscheidungsfähig** machen.

### 2.4 Wachstum, Beratung & Upselling (Mahoney Grow)

- **Mahoney Grow (AI Growth & Risk)** – Einordnung von Wachstum, Risiko und Empfehlungen – typisch für **vCISO-/Advisory-Leistungen** und **Account Growth**.

### 2.5 Beschaffung & Produktkatalog (Marketplace)

- **Marketplace** – Zugang zu Produkten, Add-ons und Services (inkl. partnerbezogener Preislogik wo vorgesehen).

Das unterstützt die **Business Line „Provisioning & Commercial“**: Von der Empfehlung bis zur nachvollziehbaren Kostenstruktur.

### 2.6 Spezielle MSP-/Partnerfunktionen

- **Partner Pricing** – Sicht auf Partnerpreise (rollenbasiert).
- **Mission Control / Mission Briefing** (wenn freigeschaltet) – operative „Mission“- bzw. Briefing-Szenarien für erweiterte Nutzung.
- **Gruppen-Administration / Admin** – zentrale Steuerung je nach Produktkonfiguration.

### 2.7 KI-gestützte Assistenz

- **Copilot (Ask AI)** – KI-gestützte Hilfe im Kontext der Plattform (Navigation und Nutzerfragen).

---

## 3. Vorteile für den MSP (Partner)

1. **Einheitliche Mandantensteuerung**  
   Weniger Tool-Brüche: Betrieb, Governance und Wirtschaftlichkeit hängen an derselben UX und denselben Datenprinzipien (wo integriert).

2. **Bessere Kundenkommunikation**  
   Kennzahlen und Reports (z. B. Financials, Executive-PDFs) sind für **Management- und Board-Gespräche** nutzbar – weniger „Technik-Silos“, mehr **Business-Sprache**.

3. **Skalierung der Beratung**  
   Standardisierte Fragebögen, Handbücher und ROI-/Kostenlogik ermöglichen **wiederholbare** Beratungs- und Review-Prozesse über viele Kunden hinweg.

4. **Differenzierung im Wettbewerb**  
   MSP, die **Risiko + Compliance + Kosten** gemeinsam zeigen, positionieren sich klarer als **strategischer Partner** statt nur „Ticket-Shop“.

5. **Upsell- und Marketplace-Logik**  
   Von der Empfehlung (Grow) zur Beschaffung (Marketplace) – durchgängiger **Commercial Funnel** im gleichen Ökosystem.

---

## 4. Vorteile für den Endkunden (Mandant)

1. **Transparenz**  
   Sichtbare Kosten und Effekte von Vorfällen, klare KPIs statt undokumentierter „Security als Black Box“.

2. **Nachvollziehbare Investitionen**  
   ROI-Simulator und Financials helfen, **intern** Budget und Prioritäten zu rechtfertigen (CFO, Geschäftsführung).

3. **Compliance & Audit**  
   Strukturierte Erfassung und Dokumentation unterstützt **Auditoren** und interne Revision – ohne parallele Excel-Welten (soweit im Produkt genutzt).

4. **Fokus auf Geschäftsrisiko**  
   Risikoexposition, Versicherungsbezug und Benchmarks (wo verfügbar) verbinden IT-Security mit **Unternehmensrisiko**.

5. **Geringere Reibung mit dem MSP**  
   Gemeinsame Plattform = weniger Missverständnisse über Stand, offene Punkte und nächste Schritte.

---

## 5. Typische Nutzungsszenarien (Beispiele)

| Szenario | Wie die App hilft |
|----------|-------------------|
| **Quartals-Review mit dem Kunden** | Dashboard + Financials + Governance-Stand |
| **Vorfall nachgeschaltet** | Incidents + Incident Cost Mapping + Lessons Learned |
| **Budgetjahr planen** | Financials (Budget, Trends) + ROI-Simulator |
| **Audit / SOC-Vorbereitung** | Governance, Fragebögen, Nachweise |
| **Strategiegespräch „mehr Security“** | Mahoney Grow + Marketplace + KPIs |

---

## 6. Abgrenzung (was die App bewusst „nicht allein“ ist)

Die Plattform **ersetzt** nicht vollständig:

- spezialisierte **SIEM-/XDR-Konsolen** (liefert aber Kontext und ggf. Anbindung/Einbettung je nach Integration),
- **PSA/ERP** für vollständige Finanzbuchhaltung (Financials sind **Steuerungs- und Schätzlogik**, keine Bilanz),
- **reine RMM-Steuerung** (kann Daten einbinden, ist aber kein Ersatz für das RMM selbst).

Sie ist als **Orchestrierungs- und Transparenzschicht** gedacht – dort, wo MSP und Kunde **gemeinsam** entscheiden.

---

## 7. Fazit

Die **Mahoney IT Control App** verbindet **technischen Betrieb**, **Governance/Compliance** und **wirtschaftliche Steuerung** von Cybersecurity in einer **MSP-tauglichen** Oberfläche. Für **MSP** bedeutet das Skalierung, bessere Reports und klare Positionierung; für **Kunden** bedeutet es Verständlichkeit, interne Legitimation von Security-Ausgaben und bessere Zusammenarbeit mit dem Dienstleister.

---

*Stand: Beschreibung orientiert an der im Repository dokumentierten Funktionsumgebung (Navigation, README, Module). Konkrete Integrations- und Lizenzdetails ergeben sich aus Deployment, Konfiguration und Vertrag.*
