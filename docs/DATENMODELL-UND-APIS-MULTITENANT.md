# Datenmodell und APIs – Multitenant

Konkrete Entitäten, API-Endpunkte und Nutzung in RMM/Sophos/Usage.

---

## 1. Entitäten (Datenmodell)

### 1.1 Partner

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | string (UUID) | Eindeutige ID |
| name | string | Anzeigename |
| externalId | string? | z. B. Sophos Partner-ID für API-Matching |
| active | boolean | |
| createdAtISO | string | |

**Speicher:** Tabelle `partners` (später DB; vorerst In-Memory oder JSON).

---

### 1.2 Tenant (Mandant)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | string (UUID) | Eindeutige ID |
| name | string | Mandantenname |
| partnerId | string? | Zuordnung zum Partner (null = direkt Mahoney) |
| connectors | TenantConnectors | RMM-, Sophos-, weitere API-Zuordnungen |
| active | boolean | |
| createdAtISO | string | |

**TenantConnectors (pro Tenant):**

| Konnektor | Felder | Verwendung |
|-----------|--------|------------|
| rmm | apiUrl?, tenantId?, label? | Datto RMM: Base-URL + optional Tenant; Credentials können global oder pro Tenant sein |
| sophos | tenantId?, partnerId?, label? | Sophos Central: Tenant-ID oder Partner-ID (für Partner-Flow) |
| (erweiterbar) | tenantId?, partnerId?, apiUrl?, label? | Weitere APIs analog |

**Speicher:** Tabelle `tenants`; `connectors` als JSON-Spalte oder 1:n Tabelle `tenant_connectors`.

---

### 1.3 User (bereits vorhanden, erweitert)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | string | |
| username | string | |
| role | superadmin \| admin \| partner \| tenant_user \| … | |
| partnerId | string? | Bei role=partner: zugeordneter Partner |
| tenantId | string? | Bei role=tenant_user: zugeordneter Tenant |
| … | | (wie bisher) |

---

### 1.4 GovernanceDocument

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | string | |
| tenantId | string? | null = global |
| scope | global \| tenant | |
| title | string | |
| type | handbook \| policy \| other | |
| contentRef | string? | URL oder Pfad zum Inhalt |
| updatedAtISO | string | |

---

## 2. API-Übersicht

### 2.1 Partner

| Methode | Pfad | Beschreibung | Wer darf |
|---------|------|--------------|----------|
| GET | /api/partners | Liste aller Partner | superadmin, admin |
| GET | /api/partners/[id] | Ein Partner | superadmin, admin; partner nur eigenes [id] |
| POST | /api/partners | Partner anlegen | superadmin, admin |
| PATCH | /api/partners/[id] | Partner bearbeiten | superadmin, admin |
| DELETE | /api/partners/[id] | Partner löschen (soft) | superadmin |

---

### 2.2 Tenants

| Methode | Pfad | Beschreibung | Wer darf |
|---------|------|--------------|----------|
| GET | /api/tenants | Liste Tenants (gefiltert nach partnerId bei role=partner) | superadmin, admin (alle); partner (nur eigene) |
| GET | /api/tenants/[id] | Ein Tenant inkl. Connectors | superadmin, admin; partner nur eigene; tenant_user nur eigenes [id] |
| POST | /api/tenants | Tenant anlegen | superadmin, admin; partner (nur mit eigenem partnerId) |
| PATCH | /api/tenants/[id] | Tenant + Connectors bearbeiten | superadmin, admin; partner nur eigene |
| DELETE | /api/tenants/[id] | Tenant deaktivieren/löschen | superadmin, admin; partner nur eigene |

**Query:** `?partnerId=…` für Filter (Admin/SuperAdmin).

---

### 2.3 Konnektor-Matching in bestehenden APIs

- **GET /api/usage**  
  - Ohne Multitenant: wie bisher (eine RMM-/Sophos-Config pro Env).  
  - Mit Multitenant: Query `?tenantId=…`; Tenant laden → aus `connectors.rmm` / `connectors.sophos` die passenden Credentials/IDs verwenden (oder aus zentraler Credential-Store pro Tenant).  
  - Bei role=tenant_user: tenantId aus Session, kein Query nötig.

- **GET /api/rmm/devices**  
  - Optional `?tenantId=…`. Tenant-Connector für RMM lesen → apiUrl/Credentials für diesen Tenant verwenden.

- **GET /api/edr/devices**, **GET /api/sophos/events**  
  - Analog: tenantId aus Query oder Session → Sophos-Connector (tenantId/partnerId) für diesen Tenant verwenden.

**Credential-Handling:** Entweder pro Tenant gespeichert (verschlüsselt) oder ein globaler Pool mit tenantId/partnerId als Auswahlkriterium. Siehe Abschnitt 4.

---

### 2.4 Governance

| Methode | Pfad | Beschreibung | Wer darf |
|---------|------|--------------|----------|
| GET | /api/governance | Liste (optional ?tenantId=, ?scope=) | admin, superadmin; tenant_user nur eigene tenantId |
| GET | /api/governance/[id] | Ein Dokument | wie oben |
| POST | /api/governance | Dokument anlegen | admin, superadmin |
| PATCH | /api/governance/[id] | Dokument bearbeiten | admin, superadmin |
| DELETE | /api/governance/[id] | Dokument löschen | admin, superadmin |

---

## 3. Ablauf „Tenant zu RMM/Sophos matchen“

1. **Admin/Partner** legt Tenant an (POST /api/tenants) oder bearbeitet ihn (PATCH /api/tenants/[id]).
2. Im Body werden **connectors** mitgegeben, z. B.:
   - `connectors.rmm`: apiUrl (z. B. aus RMM-Portal), optional tenantId/label.
   - `connectors.sophos`: tenantId oder partnerId (aus Sophos), label.
3. Credentials (API-Key, Client-Secret) können:
   - global in Env liegen und nur die Tenant-/Partner-IDs pro Tenant unterschiedlich sein, oder
   - pro Tenant in einem sicheren Store liegen (dann Tenant → Credential-Zuordnung).
4. Bei **GET /api/usage?tenantId=xyz** (oder implizit aus Session):
   - Tenant xyz laden → connectors.rmm / connectors.sophos lesen.
   - RMM/Sophos-Aufrufe mit den zu diesem Tenant gehörenden Parametern (und ggf. Credentials) ausführen.
   - Antwort nur für diesen Tenant zurückgeben.

---

## 4. Credential-Store (Empfehlung)

- **Variante A (einfach):** Eine RMM- und eine Sophos-Config pro **Partner** (Env oder DB). Tenant hat nur partnerId + ggf. sophosTenantId; bei Abruf wird Partner-Config + Tenant-Sophos-ID verwendet.
- **Variante B (flexibel):** Pro Tenant eigene Credentials (verschlüsselt in DB). Tenant-Connectors enthalten nur Referenzen (z. B. credentialRef); Credentials werden serverseitig aus dem Store geladen.

Für den Einstieg reicht Variante A: Partner-Credentials in Env oder 1:1 in `partners`; Tenants nur IDs (sophosTenantId, RMM-Seite/Filter).

---

## 5. Nächste Implementierungsschritte

1. **In-Memory oder JSON:** `lib/data/partners.ts` und `lib/data/tenants.ts` mit CRUD; gleiche Typen wie in `lib/auth/roles.ts`.
2. **API-Routen:** `app/api/partners/route.ts`, `app/api/tenants/route.ts` (GET/POST); `app/api/tenants/[id]/route.ts` (GET/PATCH/DELETE). Middleware oder Route-Handler prüft Rolle (aus Session/Cookie) und filtert bei role=partner nach partnerId.
3. **Usage anbinden:** GET /api/usage akzeptiert tenantId (Query oder Session); lädt Tenant → connectors → ruft RMM/Sophos mit passenden Parametern auf (inkl. Credentials aus Env/Store).
4. **DB:** Später `partners` und `tenants` in Vercel Postgres (oder anderes) migrieren; gleiche API-Schnittstellen beibehalten.
