# Sophos Central einbinden – Anleitung

Diese Anleitung erklärt, wie Sie **Sophos Central** (EDR / Endpoint) per API an die Mahoney Control App anbinden. Damit können EDR-Alerts in die Event-Zählung (MDU) und ins Dashboard einfließen.

---

## 1. API-Zugang in Sophos Central anlegen

1. In **Sophos Central** einloggen (als **Super Admin**).
2. Gehen Sie zu **Alles verwalten** (oder **Global Settings**) → **API Credentials Management** (API-Zugangsdaten).
   - Bei **Partner**-Accounts: **Einstellungen & Richtlinien** → **API Credentials Management**.
3. Klicken Sie auf **Add Credential** (Zugangsdaten hinzufügen).
4. Vergeben Sie einen **Namen** und optional eine **Beschreibung** (z. B. „Mahoney Control App“).
5. Wählen Sie eine **Rolle** mit mindestens Lese-Recht für Alerts:
   - **Service Principal Read-Only** – nur Lesen (empfohlen für reine Anzeige/Zählung).
   - **Service Principal Management** – wenn Sie später mehr als nur Alerts abfragen wollen.
6. Klicken Sie auf **Add** – **Client ID** und **Client Secret** werden angezeigt.
7. **Client ID** und **Client Secret sofort kopieren und sicher aufbewahren.**  
   Das Secret wird danach nicht erneut angezeigt.

---

## 2. Tenant- / Organization-ID ermitteln (für API-Aufrufe)

Die API arbeitet mit einer **Tenant-ID** (bzw. Organization-ID). Sie können sie so ermitteln:

1. **Option A – Über die API (nach Token):**  
   Mit einem gültigen OAuth-Token einen Aufruf an die **whoami**-API senden:
   ```http
   GET https://api.central.sophos.com/whoami/v1
   Authorization: Bearer <Ihr_Access_Token>
   ```
   Die Antwort enthält Ihre **ID** (Tenant- oder Organization-UUID) und den **API-Host** (bei regionalen Umgebungen).

2. **Option B – In der Sophos Central Oberfläche:**  
   In einigen Bereichen (z. B. URL oder Einstellungen) wird die Tenant-/Organization-ID angezeigt. Falls Sie sie dort finden, notieren Sie die UUID.

Für **einen** Mandanten (nur Ihre Organisation) reicht diese eine ID. Als **Partner** mit mehreren Tenants müssten Sie die Partner-API nutzen (`/partner/v1/tenants`) und pro Tenant die Alerts abfragen – das kann in einer späteren Erweiterung ergänzt werden.

---

## 3. API-URLs und Endpunkte (Überblick)

| Zweck              | URL / Endpunkt |
|--------------------|----------------|
| OAuth Token        | `https://id.sophos.com/api/v2/oauth2/token` |
| API-Basis (Standard) | `https://api.central.sophos.com` |
| Whoami (Tenant-ID) | `GET https://api.central.sophos.com/whoami/v1` |
| Alerts             | `GET https://api.central.sophos.com/common/v1/alerts` |
| SIEM Events        | `GET https://api.central.sophos.com/siem/v1/events` (cursor-Paginierung, `from_date`) |

- Beim Token: `grant_type=client_credentials`, `client_id`, `client_secret`, `scope=token`.
- Bei Alerts: Header `Authorization: Bearer <Token>` und `X-Tenant-ID: <Ihre-Tenant-UUID>` (bzw. der von whoami zurückgegebene ID-Header).
- SIEM Events: gleiche Auth, cursor-basierte Paginierung; in der App unter `GET /api/sophos/events` (optional `?from_date=...&limit=...&count_only=1`).

---

## 4. Umgebungsvariablen im Projekt setzen

### Lokal (auf Ihrem Rechner)

1. Im Projektordner in der Datei **`.env.local`** (oder neu anlegen) folgende Zeilen eintragen:

```env
# Sophos Central API (optional – für EDR-Alerts und Event-Zählung)
SOPHOS_CLIENT_ID=Ihre_Client_ID
SOPHOS_CLIENT_SECRET=Ihr_Client_Secret
# Tenant- oder Organization-UUID (aus whoami oder Sophos Central)
SOPHOS_TENANT_ID=Ihre_Tenant_UUID
```

2. **SOPHOS_CLIENT_ID** und **SOPHOS_CLIENT_SECRET** aus Schritt 1 einsetzen.  
3. **SOPHOS_TENANT_ID** mit der UUID aus Schritt 2 ersetzen.  
4. Datei speichern. **`.env.local`** nicht in Git committen (steht in `.gitignore`).

### Optional: Tenant-ID per whoami ermitteln

Falls Sie die Tenant-ID noch nicht haben, kann die App beim ersten Aufruf optional **whoami** nutzen und die ID cachen – oder Sie setzen sie nach dem ersten manuellen whoami-Aufruf (z. B. mit Postman) in `SOPHOS_TENANT_ID`.

---

## 5. Auf Vercel (oder anderem Hosting)

1. Im Vercel-Dashboard das **Projekt** öffnen.  
2. **Settings** → **Environment Variables**.  
3. Diese Variablen anlegen:

| Name                   | Value                | Environment   |
|------------------------|----------------------|----------------|
| `SOPHOS_CLIENT_ID`     | Ihre Client ID       | Production (ggf. Preview) |
| `SOPHOS_CLIENT_SECRET` | Ihr Client Secret    | Production (ggf. Preview) |
| `SOPHOS_TENANT_ID`     | Ihre Tenant-UUID     | Production (ggf. Preview) |

4. **Save** und bei Bedarf einen neuen **Redeploy** auslösen.

---

## 6. Prüfen, ob es funktioniert

Sobald die Sophos-Integration in der App implementiert ist:

1. **Dashboard** oder **Finanzen** öffnen (Events / MDU-Bereich).  
2. Wenn Sophos korrekt eingebunden ist:
   - Es erscheint ein Hinweis auf **Sophos EDR** bzw. EDR-Alerts.
   - Die Event-Zählung kann EDR-Alerts (z. B. „Alerts im Monat“) einbeziehen.
3. Ohne gesetzte Sophos-Variablen (oder bei API-Fehler):
   - Es werden nur RMM- und ggf. geschätzte Events angezeigt; EDR bleibt ausgeblendet oder 0.

---

## 7. Häufige Probleme

| Problem | Mögliche Lösung |
|--------|------------------|
| „Token failed“ / 401 | Client ID und Secret prüfen, keine Leerzeichen; API Credentials in Sophos nicht abgelaufen? |
| Keine Alerts / leere Liste | Tenant-ID korrekt? whoami-Aufruf mit dem gleichen Token prüfen; in Sophos Central prüfen, ob Alerts existieren. |
| Falsche Region | whoami liefert ggf. einen anderen **API-Host** (regional). Dann Base-URL in der App anpassen (z. B. aus whoami-Response). |
| CORS / Netzwerkfehler | API wird serverseitig aufgerufen; CORS betrifft nur den Browser. Bei Vercel: Deployment und Env-Variablen prüfen. |

---

## 8. Sicherheit und Rollen

- Nutzen Sie nach Möglichkeit **Service Principal Read-Only**, wenn die App nur Alerts lesen soll.  
- **Client Secret** niemals im Frontend oder in öffentlichen Repos ablegen – nur in `.env.local` und in den Environment Variables des Hosters.  
- Credentials in Sophos Central haben Ablaufdaten; bei Ablauf neue anlegen und Env-Variablen aktualisieren.

---

## Kurz-Checkliste

- [ ] In Sophos Central: **API Credentials** angelegt (Client ID + Secret), Rolle z. B. Read-Only  
- [ ] **Tenant-ID** (Organization-ID) ermittelt (whoami oder Oberfläche)  
- [ ] **`.env.local`** mit `SOPHOS_CLIENT_ID`, `SOPHOS_CLIENT_SECRET`, `SOPHOS_TENANT_ID` angelegt  
- [ ] Dev-Server **neu gestartet** (`npm run dev`)  
- [ ] Auf Vercel: gleiche **Environment Variables** gesetzt und **Redeploy**  
- [ ] In der App prüfen: EDR-/Sophos-Hinweis und Event-Zählung  

Wenn Sie diese Schritte durchgehen, ist die Anbindung von Sophos Central für die API vorbereitet. Die konkrete Implementierung (Token-Handling, Alerts abrufen, in Events/MDU einrechnen) erfolgt im Code (z. B. `lib/sophos-central.ts` und API-Routen).
