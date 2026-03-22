# Prompt für Claude: Projektplan „Mahoney Control App – Live-Produktionsversion“

**Anweisung:** Nutze den folgenden Text als **System-/User-Prompt** (oder kopiere ihn vollständig in einen neuen Chat). Bitte Claude, daraus einen **strukturierten Projektplan** mit Phasen, Meilensteinen, Risiken und Checklisten zu erstellen – nicht nur eine Feature-Liste.

---

## Kontext (für den Plan zugrunde legen)

Wir haben eine **Next.js 14 (App Router)** Web-App („Mahoney Control App“ / Control Surface): Unified Risk, Operations & Growth. Sie läuft aktuell stark **demo-/mock-basiert** (Cookies, in-memory Stores, Demo-APIs). Ziel ist eine **vollumfängliche Live-Version** für echte Kunden mit echter Persistenz, Sicherheit, Betrieb und erweiterbarer Architektur.

**Bereits vorhanden (Auszug):**
- Mandantenmodell: **Mahoney (Plattform) → Partner → Endkunde (Tenant)**; Sichtbarkeit und API-Filter sind konzeptionell beschrieben (siehe Repo-Doku `MANDANTEN-PARTNER-DARSTELLUNG.md`).
- UI: Dashboard, Devices, Governance, Financials, Marketplace, Incidents, Mission Briefing, Admin (User/Partner/Tenants), Nexus-Bereich, Agent-Download pro Tenant, Device-Agent (Events-POST), diverse Integrations-Hooks (RMM, Sophos, Autotask, … teils Stub/Demo).

**Technologie-Stack (aktuell):**
- Frontend/Backend: **Next.js**, TypeScript, API Routes unter `app/api/**`.
- Deployment typischerweise **Vercel** oder vergleichbar.
- Entwicklung mit **Cursor**; optional auch **Bolt**-ähnliche Rapid-Prototyping-Tools – der Plan soll **ORM-/Schema- und Migrations-Workflows** nutzen, die in Cursor gut funktionieren (z. B. Prisma + SQL, oder Drizzle).

---

## Ziele der Live-Version

1. **Produktionsreife:** echte Datenhaltung, Backups, Monitoring, Logging, Fehlerbehandlung.
2. **Sicherheit:** Authentifizierung, Autorisierung, Secret-Management, Härtung der APIs, Compliance-orientierte Grundlagen (Audit, Zugriffskontrolle).
3. **Berechtigungsmodell:** klar definierte Rollen und **Tenant-Isolation** (kein Cross-Tenant-Leak).
4. **Konnektoren & APIs:** externe Systeme und interne REST/JSON-APIs **dokumentiert, versioniert, abgesichert**.
5. **Modularität:** Architektur so, dass **Features/Module** (z. B. Billing, Mission Briefing, Agent, RMM) ohne Monolith-Bruch erweiterbar sind.

---

## Datenbanken & Persistenz (vom Plan konkret empfehlen)

Bitte im Projektplan **konkrete Datenbankwahl** und Begründung liefern, kompatibel mit **Cursor + typisiertem Schema** (Prisma oder Drizzle empfohlen):

| Zweck | Empfehlung (vom Plan zu bewerten/abwägen) |
|--------|---------------------------------------------|
| **Haupt-OLTP** (User, Partner, Tenant, Rollen, Rechte, Einstellungen, Billing, Audit) | **PostgreSQL** (z. B. **Neon**, **Supabase Postgres**, **AWS RDS**, **Azure Database for PostgreSQL**) – überall gut mit Prisma/Drizzle kombinierbar. |
| **Cache / Sessions / Rate-Limit** (optional) | **Redis** (Upstash Redis passt gut zu Vercel/Serverless). |
| **Blobs / Dateien** (Logos, Handbücher, PDFs) | **S3-kompatibel** (AWS S3, Cloudflare R2, MinIO) – nicht in der DB. |
| **Suche / Analytics** (später) | Optional **OpenSearch/Elasticsearch** oder Postgres **Full-Text** – als Phase 2. |

**Anforderung:** Migrationen, Seed-Skripte, Umgebungen **dev/staging/prod**.

---

## Sicherheit (im Plan abarbeiten)

- **Auth:** Session-basiert (z. B. NextAuth/Auth.js) oder BFF mit JWT/OIDC; **MFA** für Admin/Partner (Roadmap).
- **Secrets:** nur in `.env` / Secret Manager (Vercel, AWS Secrets Manager, …), nie im Repo.
- **APIs:** Authentifizierung pro Route; **Service-Keys** für Device-Agent (`X-Agent-Key` / Bearer) rotierbar.
- **Tenant-Isolation:** jede Abfrage mit `tenantId` / Partner-Scope; Tests gegen IDOR.
- **Transport:** HTTPS, HSTS, sichere Cookies.
- **Eingaben:** Validierung (z. B. Zod), SQL-Injection-Schutz durch ORM.
- **Rate Limiting** / Abuse-Schutz für öffentliche und Agent-Endpunkte.
- **Audit-Log:** wer hat wann was an welchem Tenant geändert (mind. Admin-kritische Aktionen).

---

## Berechtigungsstruktur (für den Plan explizit modellieren)

Bitte im Projektplan **Rollen-Matrix** und **technische Umsetzung** vorsehen:

| Ebene | Rolle (Beispiel) | Scope |
|--------|------------------|--------|
| Plattform | `mahoney_superadmin`, `mahoney_support` | Alle Partner & Tenants (nur mit Begründung/Audit). |
| Partner | `partner_admin`, `partner_user` | Nur eigene Tenants; Partner-Daten. |
| Tenant | `tenant_admin`, `tenant_user`, `tenant_readonly` | Nur eigener Tenant; ggf. Feature-Flags pro Modul. |
| Technisch | API-Keys / Service-Principals | Agent, Webhooks, externe Systeme – **kein** UI-Login. |

**Implementierung:** RBAC in DB (Rollen + Permissions) oder Policy-Layer (z. B. zentrale `can(user, action, resource)`), konsistent in API Routes und Server Actions.

---

## Konnektoren & API-Fläche (im Plan inventarisieren und priorisieren)

**Interne (App) API-Routen** (aus Codebase; Namen können im Plan zur Roadmap werden):  
`/api/tenants`, `/api/tenants/[id]`, `/api/tenants/import-autotask`, `/api/partners`, `/api/partners/[id]`, `/api/demo/*` (ersetzen durch echte Auth), `/api/usage`, `/api/rmm/*`, `/api/edr/*`, `/api/sophos/events`, `/api/incidents`, `/api/incidents/[id]`, `/api/health`, `/api/admin/*`, `/api/nexus/*`, `/api/mission-briefing/*`, `/api/governance/*`, `/api/sla/*`, `/api/edr/devices`, `/api/companies/autotask`, `/api/agent/events`, `/api/agent/download`, …

**Externe Konnektoren / Integrationen** (im Plan je Modul: Auth, Datenfluss, Fehlerfall, Retry, Rate Limits):

- **Datto RMM** (Devices, Usage, Alerts – je nach vorhandener API)
- **Sophos** (SIEM/Events – wo vorhanden)
- **Autotask** (Companies, Import)
- **E-Mail / Notifications** (Transaktionsmail, Alerts)
- **Billing/Abrechnung** (später Stripe, ERP-Anbindung oder manuell – Phase festlegen)
- **Identity** (optional SSO/SAML für Enterprise-Kunden – Phase 2)

**Pro Konnektor im Plan:** Datenflussdiagramm (kurz), gespeicherte Secrets, Sync-Strategie (Polling vs. Webhook), Idempotenz, Monitoring.

---

## Modularität

Bitte im Projektplan vorschlagen:

- **Domain-Module** (Ordner/Package-Grenzen): z. B. `core/auth`, `tenancy`, `billing`, `integrations/rmm`, `integrations/psa`, `agent`, `audit`, `notifications`.
- **Grenzen:** öffentliche Schnittstellen pro Modul; gemeinsame DB-Schemas nur über definierte Repositories.
- **Feature-Flags** (z. B. für Partner/Plan: Mission Briefing an/aus).

---

## Deliverables (vom Plan erwarten)

1. **Phasen** (0–n) mit Dauer-Schätzung und Abhängigkeiten.
2. **Meilensteine** (z. B. „DB live“, „Auth produktiv“, „Erster Konnektor produktiv“).
3. **Risiken** (Datenmigration, Vendor-APIs, Compliance).
4. **Team-Checkliste** (DevOps, Security Review, QA).
5. **Artefakte:** ER-Diagramm oder Schema-Übersicht, API-Liste (OpenAPI empfohlen), Rollenmatrix.

---

## Explizite Bitte an Claude

Erstelle einen **Projektplan** (Markdown), der:

- die **Datenbankwahl** (PostgreSQL + optional Redis + Object Storage) **begründet** und mit **Cursor/CI-Workflow** (Migrations, Prisma/Drizzle) verknüpft;
- **Sicherheit** und **Berechtigungen** als eigene Arbeitspakete enthält;
- alle **API- und Konnektoren-Bereiche** abdeckt (intern inventarisieren, extern priorisieren);
- **modular** und **erweiterbar** bleibt;
- konkrete **nächste Schritte** (erste 2 Wochen) und eine **Roadmap** (3–6 Monate) enthält.

---

*Ende des Prompts – hier kannst du bei Bedarf noch firmenspezifische Ziele (z. B. nur EU-Hosting, SOC2, ISO) ergänzen.*
