# ITIL-Ausbau und Qualitätssicherung

Kurzüberblick: Was die App bereits abbildet und was für eine vollständige ITIL-orientierte Steuerung noch fehlt – inkl. priorisierter Schritte zur Qualitätssicherung.

---

## 1. Bereits vorhanden (Anknüpfungspunkte)

| ITIL-Bereich | Aktueller Stand in der App |
|--------------|----------------------------|
| **Incident** | Einzelner Incident-Typ (AWS), Status open/contained/resolved, Timeline, Aktionen; Incident-Kosten in Financials; „Open Incidents“ im Dashboard. |
| **Service Level** | Vertrag mit SLA (1h/4h), Anzeige in Contracts; SLA-Erwähnung in Marketplace/Enhance. |
| **Service Portfolio** | Marketplace mit Services (SOC, Backup, etc.) und Vertragsänderungen (ContractRequest: plan_change, service_add, …). |
| **Governance / Compliance** | Governance-Seite, Compliance-Score, Strafen für offene Findings/Incidents. |
| **Projekte** | Projekte mit Status, Kategorie, Priorität, Kommentare – eher „Projekt“ als „Change“, aber nutzbar. |
| **Alerts / Events** | RMM-Alerts, Sophos EDR, Events/MDU; Dashboard-KPIs (MTTR, Coverage). |

---

## 2. Lücken für „voll nach ITIL“

### 2.1 Incident Management (ITIL-konform erweitern)

- **Einheitlicher Incident-Lifecycle:**  
  Log → Classify → Assign → Diagnose → Resolve → Close (mit klaren Status-Übergängen).
- **Kategorisierung:**  
  Kategorie (z. B. Security, Hardware, Access, Application), Priorität (P1–P4) aus Impact × Urgency, optional Service/CI.
- **Verknüpfung:**  
  Incident ↔ Alerts (RMM, EDR), optional ↔ Problem, ↔ Change.
- **Eskalation & Zeiten:**  
  Reaktions- und Lösungszeiten pro Priorität, Eskalation bei SLA-Risiko (z. B. an 2nd Level / SOC).
- **Reporting:**  
  Anzahl pro Kategorie/Priorität, MTTR, SLA-Einhaltung (%), First-Line-Resolution.

**Konkrete Schritte:**  
Datenmodell „Incident“ erweitern (Kategorie, Priorität, zugeordneter Service/CI, Zeiten); API/CRUD; Liste/Filter auf neuer oder erweiterter Incidents-Seite; Optional: Anbindung an bestehende Alerts (RMM/EDR) als mögliche Incident-Quelle.

---

### 2.2 Problem Management

- **Problem-Record:**  
  Root Cause, bekannte Fehler (Known Errors), Workaround, Link zu betroffenen Incidents.
- **Verknüpfung:**  
  Mehrere Incidents → ein Problem; nach Lösung: Schließen des Problems und ggf. Auslösen eines Changes.
- **Proaktiv:**  
  Auswertung von Incident-Trends (z. B. wiederkehrende Themen) als Kandidaten für Problems.

**Konkrete Schritte:**  
Entität „Problem“ (mit Referenzen zu Incidents); einfache Liste/Detail-Ansicht; optional: „Incident zu Problem verknüpfen“ / „Problem aus Incidents erstellen“.

---

### 2.3 Change Management

- **Change Request:**  
  Typ (Standard/Normal/Emergency), Begründung, geplante Fenster, Genehmigungsworkflow, Durchführungsstatus.
- **CAB:**  
  Optionale Abbildung von Change Advisory Board (Genehmiger, Termine).
- **Release/Vorbereitung:**  
  Optionale Verknüpfung zu Release/Deployment (später).

**Konkrete Schritte:**  
Entität „Change Request“ mit Status (Draft → Approved → Scheduled → Implemented → Closed); eigene Liste/Detail; Verknüpfung zu Incident/Problem („Change zur Behebung“).

---

### 2.4 Service Asset & Configuration Management (CMDB light)

- **Konfigurationsobjekte (CIs):**  
  Geräte (bereits in Devices/RMM), Services (aus Vertrag/Marketplace), optional: Anwendungen, Standorte.
- **Beziehungen:**  
  Service → unterstützte CIs; Incident/Problem/Change → betroffene CI(s).
- **Lifecycle:**  
  CI-Status (aktiv, in Wartung, außer Betrieb).

**Konkrete Schritte:**  
Bestehende Devices als CIs nutzen; optional „Service“-Entität mit Referenz auf Vertrags-Services; Verknüpfung Incident/Change → „betroffene CIs“ (z. B. Gerät, Service).

---

### 2.5 Service Level Management (SLM)

- **SLA-Definitionen:**  
  Pro Service oder Vertrag: Reaktionszeit, Lösungszeit, Verfügbarkeit (%), Prioritätsmatrix.
- **Messung:**  
  Tatsächliche Reaktions-/Lösungszeiten aus Incidents; Vergleich Soll vs. Ist.
- **Reporting:**  
  SLA-Einhaltung pro Service/Vertrag, Ausnahmen (Breaches), monatliche Übersicht.

**Konkrete Schritte:**  
SLA-Parameter im Vertrag/Service (bereits „sla: 1h|4h“) um konkrete Ziele erweitern (z. B. Reaktionszeit in Min., Lösungszeit in Min.); aus Incident-Daten Zeiten auslesen und mit Zielen abgleichen; Dashboard-Kachel oder Report „SLA-Einhaltung“.

---

### 2.6 Service Catalog (ITIL)

- **Katalog:**  
  Kunden sichtbare Services mit Beschreibung, SLA-Optionen, Preisen (Anknüpfung Marketplace).
- **Service Request:**  
  Standardanfragen (z. B. Zugang, Gerät, Software) mit einfachem Workflow (Request → Fulfill).

**Konkrete Schritte:**  
Marketplace um „Service Catalog“-Sicht erweitern (Services mit SLA, Preis, Beschreibung); optional „Service Request“-Typ (z. B. „Access Request“) mit Status und Fulfillment-Schritten.

---

### 2.7 Knowledge Management

- **Known Errors / KB-Artikel:**  
  Aus Problems: Workaround, Lösung, FAQ.
- **Suche:**  
  Für Support: „Ähnliche Incidents“, „Lösung zu Fehlercode X“.

**Konkrete Schritte:**  
Entität „Knowledge Article“ oder „Known Error“ (mit Link zu Problem); bei Incident-Anzeige „Ähnliche Fälle“ / „Empfohlene Artikel“ (z. B. nach Kategorie/Keyword).

---

### 2.8 Continual Service Improvement (CSI)

- **KPIs:**  
  MTTR, First-Line-Resolution, SLA-Einhaltung, Incident-Volumen, Wiedereröffnungsrate.
- **Trends:**  
  Monatliche/quartalsweise Auswertung, Vergleich zu Zielwerten.
- **Aktionen:**  
  Ableitung von Verbesserungen (Process, Training, Automation) aus den Reports.

**Konkrete Schritte:**  
Dashboard oder Report-Seite „Service Quality“: KPIs aus Incidents + SLA; einfache Trenddarstellung (z. B. MTTR/SLA über Zeit); optional Ziele pro Kunde/Vertrag hinterlegen und Abweichungen anzeigen.

---

## 3. Priorisierte Reihenfolge (für Qualität und ITIL-Nähe)

1. **Incident Management erweitern**  
   Lifecycle, Kategorie, Priorität, Zeiten, Liste/Filter, Anbindung an Alerts.  
   → Grundlage für SLA, Problem und CSI.

2. **SLM schärfen**  
   SLA-Ziele pro Vertrag/Service definieren, aus Incidents messen, „SLA-Einhaltung“ anzeigen.  
   → Qualität und Transparenz für Kunden und Führung.

3. **Problem Management (Basis)**  
   Problem-Record, Verknüpfung zu Incidents, Known Error/Workaround.  
   → Weniger Wiederholungs-Incidents, bessere Qualität.

4. **Change Management (Basis)**  
   Change Request mit Status und optional Verknüpfung zu Incident/Problem.  
   → Kontrollierte Änderungen, Nachvollziehbarkeit.

5. **CMDB light**  
   Services und CIs (Devices) verknüpfen; Incident/Change → betroffene CIs.  
   → Bessere Zuordnung und Reporting.

6. **Knowledge / Known Errors**  
   Aus Problems Artikel anlegen, bei Incidents anzeigen.  
   → Schnellere Lösung, Qualität der Lösungen.

7. **CSI-Dashboard**  
   KPIs + Trends, Abweichungen von Zielen.  
   → Kontinuierliche Qualitätssicherung im Sinne von ITIL.

---

## 4. Qualität konkret aufrechterhalten

- **Datenqualität:**  
  Pflichtfelder für Incident (Kategorie, Priorität, Zeiten); Plausibilitätsprüfungen (z. B. Resolved ≤ Closed).
- **Prozess:**  
  Status-Übergänge regeln (z. B. nur „Resolved“ → „Closed“, nicht direkt „New“ → „Closed“); optionale Genehmigung bei Critical/High.
- **Audit:**  
  Änderungen an Incident/Problem/Change protokollieren (wer, wann, was); Anknüpfung an bestehendes Audit-Log.
- **Multi-Tenant:**  
  Incidents/Problems/Changes pro Tenant/Partner; SLA und Reports pro Kunde.
- **Integration:**  
  RMM/EDR-Alerts als mögliche Incident-Quelle; Ticketing (z. B. ServiceNow) später per API anbinden.

---

## 5. Kurzfassung

- **Bereits da:** Incidents (einzeln), Verträge mit SLA, Marketplace/Contracts, Governance, Projekte, Alerts/Events.
- **Wichtig für „voll ITIL“:**  
  Einheitlicher Incident-Lifecycle mit Kategorien/Prioritäten/Zeiten, Problem Management, Change Management, SLM mit Messung, optional CMDB light, Knowledge/Known Errors, CSI mit KPIs und Trends.
- **Qualität:**  
  Klare Datenmodelle, definierte Status-Übergänge, Audit, tenant-fähige Prozesse und saubere Anbindung an bestehende Alerts und Verträge.

Wenn du möchtest, können wir als Nächstes einen der Punkte (z. B. Incident-Lifecycle + Kategorien oder SLM-Messung) konkret im Datenmodell und in der UI ausarbeiten.
