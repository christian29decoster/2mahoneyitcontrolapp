# Mahoney Control App – Zusammenfassung

## Sinn der App

Die **Mahoney Control App** ist die zentrale Steuerungs- und Sichtoberfläche für Unternehmen, die IT-Sicherheit und Betrieb aus einer Hand nutzen. Sie verbindet **Technik (Operations)** mit **Wachstum (Grow)** und **Einkauf (Marktplatz)**: Nutzer sehen ihren Status, ihre Geräte, Verträge und Cloud-Sicherheit, können Opportunities aus Logdaten nutzen und Services nachbuchen – alles in einer App, mit klarer Trennung zwischen Kunden- und Partner-Ansicht.

---

## Zielgruppe

- **Endkunden** (z. B. Speditionen, Mittelstand): ein einziges Dashboard für Sicherheit, Geräte, Verträge und Wachstumspotenzial.
- **Partner/MSP**: Übersicht über alle Kunden, Kennzahlen und direkter Zugriff auf Mahoney Grow pro Kunde.

---

## Funktionen (Überblick)

### Operations (Technik)

- **Dashboard**  
  Zentrale Übersicht: aktive Alerts, Offline-Geräte, MTTR, Coverage. Kunden- vs. Partner-Ansicht umschaltbar. KPI-Kacheln, Cloud-Posture, Service-Cockpit, Upgrade-Hinweis.

- **Devices & Staff**  
  Geräteliste (Server, PC, Laptop, Phone) mit Suche und Filter, Standorte, Gerätedetails (inkl. Aktionen), Mitarbeiter/Staff-Verwaltung, Quick-Audit (unprotected/stale/quarantined).

- **Company**  
  Stammdaten des Unternehmens, Standorte mit Karte und Navigation, Bearbeitung von Organisation und Tenants.

- **Cloud Security**  
  Cloud-Security-Findings (z. B. AWS, Azure) nach Vendor, Severity und Kategorie filterbar; Verknüpfung zu Incidents (z. B. AWS Incident).

- **Contracts**  
  Vertragsübersicht, gebuchte Services, Tarif und Laufzeit. Anfragen für Planänderungen, Zusatzservices und Sitzzahl-Anpassung; Download des Vertrags.

- **Projects**  
  Projektliste mit Filter und Suchfunktion, Projektwizard zum Anlegen, Detailansicht pro Projekt (Status, Meilensteine, Aufgaben).

---

### Mahoney Grow

- **Opportunities aus Logdaten**  
  Nutzung von SIEM- und RMM-Logdaten (Anrufe, E-Mails, Nutzung) als objektive Basis. Gemeinsame Auswertung mit dem Kunden und seinen Prozessverantwortlichen; auf Wunsch **AI-Analyse** für Automatisierungspotenzial und Einsparungen.

- **Ablauf**  
  1) Ihre Daten (nur was freigegeben wird), 2) Auswertung mit Ihnen, 3) AI-Analyse auf Anfrage, 4) konkrete Opportunities (Apps, Automatisierung) mit Nachweis aus Logs.

- **Beispiel-Opportunity**  
  „Communication & call analysis“: Auswertung von Anruf- und E-Mail-Volumen, Kennzahlen (z. B. Stunden pro Mitarbeiter/Tag), geschätztes Einsparpotenzial; Button „Request AI analysis“ zur Aktivierung der Auswertung.

- **Technical & Business Insights**  
  Klickbare Insight-Karten mit Begründung und Impact; Score und „Detected manual workflows“; Business-Growth-Analyst-Sheet.

---

### Marktplatz & Enhance

- **Marketplace**  
  Katalog von Services (z. B. SOC, Backup, MDR), Detailansicht pro Service, „Add to plan“ bzw. „Request quote“, Checkout mit Zusammenfassung.

- **Enhance / Upgrades**  
  Personalisierte Empfehlungen, Zusatzservices und Cross-Selling-Bundles; Aufwertung des Vertrags und Nachbuchung von Services.

---

### Einstellungen & Profil

- **Settings**  
  General (Theme, Organisation, Security), Notifications (Alerts, E-Mail-Digest, SOC-Messages), **API & Connectors**: Anbindung von SharePoint/M365, Outlook, GitHub, SIEM (z. B. Sentinel, Splunk), RMM/PSA, Azure/AWS, Teams/Slack, Ticketing (z. B. ServiceNow). Pro Connector: Anbieter-Logo, Button **Connect**; Dialog erklärt, dass Parameter (API-Key, Client ID, Tenant) im Anbieter-Dashboard eingegeben werden müssen; **Open provider** öffnet die offizielle Admin-/Developer-URL des Anbieters.

- **Profile**  
  Benutzerprofil und Account-Einstellungen.

---

### Admin (für Admin-Rolle)

- **Admin**  
  Benutzerverwaltung (Rollen, Anlegen/Bearbeiten), Audit-Log für Aktionen.

---

## Technische Besonderheiten

- **Rollen**  
  Kunden- vs. Partner-Ansicht; Admin-Bereich nur für Nutzer mit Admin-Rolle.

- **Haptik & UX**  
  Klickbare Zeilen, Haptic Feedback wo sinnvoll, Toasts für Aktionen, Sheets/Modals für Details.

- **Connectors**  
  Klar benannte Anbieter mit Logos; Connect-Dialog mit Hinweis „App verlassen und Parameter beim Anbieter eingeben“; direkte Links zu den jeweiligen Admin-/Developer-Portalen.

Die App bildet damit **eine Plattform**: Operations sichtbar machen, Verträge und Projekte führen, Cloud-Security im Blick behalten, Wachstumspotenzial aus Logdaten (inkl. AI) nutzen und Services über Marktplatz sowie Enhance nachbuchen – ohne Erwähnung eines reinen Demobetriebs.
