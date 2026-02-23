# Berechtigungskonzept – Multitenant

Dieses Dokument beschreibt das Rollen- und Berechtigungsmodell für die Mahoney Control App im Multitenant-Betrieb.

---

## 1. Rollenübersicht

| Rolle | Beschreibung | Sichtbarkeit / Wirkbereich |
|--------|--------------|----------------------------|
| **SuperAdmin** | Höchste Berechtigung (z. B. Mahoney IT Group). Einmalig oder wenige Accounts. | Gesamte Plattform, alle Partner und Tenants. |
| **Admin** | Administratoren für Onboarding, APIs, Governance. | Abhängig von Zuweisung (global oder pro Partner). |
| **Partner** | Partner, die eigene Kunden (Tenants) verwalten. | Nur die eigenen Kunden/Mandanten. |
| **Tenant** | Endkunde (Mandant), der seine Ergebnisse und Funktionen nutzt. | Nur der eigene Mandant. |

---

## 2. SuperAdmin

- **Zweck:** Systemverwaltung, Notfallzugang, Absicherung der Plattform.
- **Besonderheiten:**
  - **Passwort:** Darf von anderen Admins **nicht geändert** werden (nur durch den SuperAdmin selbst oder über gesicherten Recovery-Prozess).
  - **Löschen:** SuperAdmin-Account(s) dürfen von **niemandem** gelöscht oder deaktiviert werden (außer durch einen anderen SuperAdmin, falls vorgesehen).
- **Rechte:** Alle Rechte der anderen Rollen; zusätzlich Verwaltung von Admins, Partnern und systemweiten Einstellungen.

---

## 3. Admin

- **Zweck:** Operative Administration, Onboarding, Konfiguration, Governance.
- **Typische Aufgaben:**
  - **Onboarding** neuer Mandanten/Partner.
  - **APIs & Konnektoren** einrichten (RMM, Sophos, ggf. weitere) und **Tenants zu Konnektoren matchen** (welcher Tenant gehört zu welchem RMM/Sophos-Account).
  - **Governance:** Handbücher, Richtlinien, andere Governance-Dokumente pflegen; Bereitstellung für **KI-Prüfung** (z. B. Abgleich mit Konfiguration, Compliance).
- **Einschränkung:** Kein Ändern des SuperAdmin-Passworts, kein Löschen/Deaktivieren des SuperAdmin.

---

## 4. Partner

- **Zweck:** Partner sieht und verwaltet **ausschließlich seine eigenen Kunden** (Tenants).
- **Sichtbarkeit:**
  - Nur die Tenants, die diesem Partner zugeordnet sind.
  - Keine Sicht auf andere Partner oder deren Kunden.
- **Rechte:**
  - Eigene Kunden (Tenants) auf **Mandantenebene** verwalten (Anlegen, Bearbeiten, Konnektor-Zuordnung soweit freigegeben).
  - Kein Zugriff auf systemweite Admin-Funktionen oder andere Partner.
- **Technisch:** Partner-ID (z. B. aus Sophos/Datto oder intern) bestimmt die Zuordnung Tenant ↔ Partner.

---

## 5. Tenant (Mandant) – aus Sicht Mahoney IT Group

- **Modell:** **Mehrere Tenants**, nicht nur einer. Mahoney IT Group verwaltet alle Tenants (direkt oder über Partner).
- **Matching zu Konnektoren:**
  - Jeder Tenant wird **RMM** (z. B. Datto) und **Sophos** (und künftigen APIs) **zugeordnet** (Tenant-ID, API-Credentials pro Tenant oder pro Partner mit Tenant-Filter).
  - Bei neuen APIs: gleiches Prinzip – Tenant ↔ Konnektor-Mapping pflegen (Admin/Partner je nach Modell).

---

## 6. Tenant-Benutzer (Endkunde / Mandanten-Nutzer)

- **Zweck:** Der Kunde (Mandant) nutzt die App für seine Ergebnisse und Aktionen.
- **Rechte:**
  - **Ergebnisse ansehen:** Dashboard, Reports, Geräte/Events (soweit für den Tenant freigegeben).
  - **Tickets erstellen und verwalten.**
  - **Projekte anlegen und verwalten.**
  - **Kontakt:** Buttons zum Kontakt mit Mahoney (Support, Ansprechpartner) – keine Admin-Funktionen.
- **Sichtbarkeit:** Nur Daten des **eigenen Tenants**.

---

## 7. Zusammenfassung der Hierarchie und Regeln

1. **SuperAdmin** ist geschützt (Passwort-Änderung und Löschen nur durch SuperAdmin/Recovery).
2. **Admin** konfiguriert Onboarding, APIs/Konnektoren, Governance; respektiert SuperAdmin-Schutz.
3. **Partner** sieht und verwaltet nur **seine** Kunden (Tenants); Tenant ↔ Konnektor-Matching kann bei Partner oder Admin liegen.
4. **Tenant** (Mandant) wird von Mahoney/Partner verwaltet und mit **RMM, Sophos und weiteren APIs gematcht**.
5. **Tenant-Benutzer** nutzt die App lesend und für Tickets/Projekte/Kontakt, ohne Admin-Rechte.

---

## 8. Technische Hinweise für die Umsetzung

- **Rollen:** Als Enum/Union z. B. `superadmin | admin | partner | tenant_user`.
- **Tenant-Entität:** Mit Feldern für Konnektor-Mappings (z. B. `rmmTenantId`, `sophosTenantId`, `partnerId`).
- **Partner-Entität:** Mit Liste der zugeordneten Tenant-IDs; Abfragen immer gefiltert nach `partnerId` des aktuellen Benutzers.
- **Auth:** Session/JWT enthält `role`, `tenantId?`, `partnerId?`; Middleware und API-Routen prüfen Zugriff je nach Rolle und Kontext.

Dieses Konzept kann schrittweise in die bestehende App (Login, Demo-Auth, Admin-Seite) integriert werden.
