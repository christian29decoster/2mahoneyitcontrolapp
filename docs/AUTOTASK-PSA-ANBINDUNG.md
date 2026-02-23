# Autotask PSA – Anbindung für Incidents & SLA

Die App kann **Tickets (Incidents)** und damit die Basis für **SLA-Auswertung** aus der **Autotask PSA REST API** beziehen, wenn die Konfiguration gesetzt ist.

---

## 1. Voraussetzungen in Autotask

- **API-User (API-only)** anlegen: unter Resource Management → Security → API User. Dieser Benutzer hat keinen UI-Zugang, nur API-Zugriff.
- **Tracking Identifier** für diesen User: auf der Security-Tab des API-Users „Custom (Internal Integration)“ erzeugen bzw. zuweisen. Dieser Wert wird als `APIIntegrationcode` verwendet.
- **Credentials:** E-Mail (Username), Passwort (Secret), plus den oben genannten Integration Code.

Weitere Details: [Autotask REST Security and Authentication](https://www.autotask.net/help/Developerhelp/Content/APIs/REST/General_Topics/REST_Security_Auth.htm).

---

## 2. Konfiguration in der App (Umgebungsvariablen)

| Variable | Beschreibung | Beispiel |
|----------|---------------|----------|
| `AUTOTASK_BASE_URL` | Basis-URL der Autotask REST API (zone-spezifisch). | `https://webservices3.autotask.net/atservicesrest/v1.0` |
| `AUTOTASK_USERNAME` | API-User (E-Mail). | `apiuser@firma.de` |
| `AUTOTASK_SECRET` | Passwort/Secret des API-Users. | (geheim) |
| `AUTOTASK_INTEGRATION_CODE` | Tracking Identifier (APIIntegrationcode). | `ASHJKL...` |

**Zone-URLs (Beispiele):**

- America East: `https://webservices3.autotask.net/atservicesrest/v1.0`
- UK: `https://webservices4.autotask.net/atservicesrest/v1.0`
- Weitere Zonen: [API Zones](https://www.autotask.net/help/DeveloperHelp/Content/APIs/General/API_Zones.htm) bzw. Zone-Information per API abfragen.

`.env.local` (nicht committen):

```bash
AUTOTASK_BASE_URL=https://webservices3.autotask.net/atservicesrest/v1.0
AUTOTASK_USERNAME=apiuser@example.com
AUTOTASK_SECRET=your-secret
AUTOTASK_INTEGRATION_CODE=your-integration-code
```

---

## 3. Abruf der Tickets (Incidents)

- **Endpoint:** `POST /Tickets/query` (oder GET mit Filter).
- **Relevante Felder** (Auszug):
  - `id`, `ticketNumber`, `title`, `description`
  - `createDate` → entspricht **Logged**
  - `firstResponseDateTime` → **Responded**
  - `resolvedDateTime` → **Resolved**
  - `status`, `priority` (Picklist-IDs)
  - `ticketType` (z. B. Incident)
  - `dueDateTime`, `firstResponseDueDateTime`, `resolvedDueDateTime`
  - `serviceLevelAgreementHasBeenMet`

- **Empfohlener Filter:** z. B. `createDate` der letzten 30–90 Tage, optional `ticketType = Incident`, damit nur Service-Desk-Incidents gezogen werden.

Die App mappt Autotask-Tickets auf das interne **IncidentRecord**-Format (inkl. Zeiten für Response-/Resolution-SLA).

---

## 4. Mapping Autotask → App

| Autotask | App (IncidentRecord / SLA) |
|----------|----------------------------|
| `id` | Externe Referenz oder lokale ID (z. B. `autotask-{id}`) |
| `ticketNumber` | Anzeige / Referenz |
| `title` | `title` |
| `description` | `description` |
| `createDate` | `loggedAtISO` |
| `firstResponseDateTime` | `respondedAtISO` |
| `resolvedDateTime` | `resolvedAtISO` |
| `dueDateTime` / `resolvedDueDateTime` | `dueByISO` (optional) |
| `priority` (Picklist) | Auf P1–P4 mappen (Konfiguration oder Default) |
| `status` (Picklist) | Auf New/Assigned/In Progress/Resolved/Closed mappen |
| `assignedResourceID` | Optional `assignedTo` (Name per Resources-API oder Cache) |

**SLA:** Response-Zeit = `firstResponseDateTime - createDate`, Resolution-Zeit = `resolvedDateTime - createDate`. Die gleichen Ziele (P1–P4) und die gleiche Report-Logik wie bei lokalen Incidents werden verwendet.

---

## 5. Verhalten der App

- **Ohne Autotask-Konfiguration:** Incidents und SLA kommen wie bisher aus dem lokalen Store (Demo/Datenbank).
- **Mit gesetzten Autotask-Variablen:**  
  - Optional: **Sync** – Abruf der Tickets von Autotask (z. B. per Cron oder beim Aufruf von „Incidents“), Mapping, Anreicherung des lokalen Stores oder direkte Anzeige.  
  - Oder: **Live-Abruf** – bei Aufruf der Incident-Liste bzw. des SLA-Reports werden die Daten einmalig von Autotask geholt, gemappt und angezeigt (ohne dauerhafte Speicherung).

Die konkrete Umsetzung (nur Anzeige vs. Sync in den lokalen Store) ist im Code unter `lib/autotask.ts` und den aufrufenden APIs beschrieben.

---

## 6. Sicherheit

- **Secrets** nur in Umgebungsvariablen oder sicherem Secret-Management, **niemals** im Frontend oder in Repo.
- API-User mit minimalen Rechten (nur Lese-Zugriff auf Tickets, wenn ausreichend).
- TLS 1.2 wird von Autotask vorausgesetzt; die App verwendet HTTPS für alle Autotask-Aufrufe.

---

## 7. Verifizierung (nicht lokal)

- Die Anbindung wird **nicht lokal** getestet; Verifizierung erfolgt in der **deployten Umgebung** über die normalen Funktionen:
  - **Incidents:** Liste unter `/incidents` (zeigt bei konfigurierter Autotask-Anbindung „Including tickets from Autotask PSA“ und gemergte Tickets).
  - **SLA-Report:** `/incidents/sla` bzw. API `GET /api/sla/report`.
- **Query-Format:** Die App nutzt `MaxRecords` (1–500) im POST-Body für `Tickets/query` (laut Autotask-Doku).
- **0 Tickets trotz Verbindung:** Wenn in der deployten Umgebung 0 Tickets von Autotask ankommen, an die **Sichtbarkeit des API-Users** denken: Autotask behandelt „Mine + Companies“ wie **None**. In Autotask unter Security die Sichtbarkeit des API-Users prüfen und ggf. auf „All“ oder die gewünschte Einschränkung setzen.

---

## 8. Nützliche Links

- [Tickets Entity](https://ww1.autotask.net/help/DeveloperHelp/Content/APIs/REST/Entities/TicketsEntity.htm)
- [REST Security and Authentication](https://www.autotask.net/help/Developerhelp/Content/APIs/REST/General_Topics/REST_Security_Auth.htm)
- [Basic Query Calls](https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm)
