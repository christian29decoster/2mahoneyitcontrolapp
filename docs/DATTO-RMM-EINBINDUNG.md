# Datto RMM einbinden – Anleitung

Diese Anleitung erklärt, wie Sie echte Server und Geräte aus **Datto RMM** in der App anzeigen lassen.

---

## 1. API in Datto RMM freischalten

1. In **Datto RMM** einloggen (Centrastage / Ihr RMM-Portal).
2. Gehen Sie zu **Setup** → **Global Settings** → **Access Control**.
3. Aktivieren Sie **API Access** („Enable API Access“ / API-Zugriff aktivieren).
4. Einstellungen speichern.

---

## 2. API-Keys erzeugen

1. Gehen Sie zu **Setup** → **Users**.
2. Wählen Sie den Benutzer, unter dem die API laufen soll (z. B. ein technischer User).
3. Klicken Sie auf **Generate API Keys** (API-Schlüssel erzeugen).
4. **API Key** und **API Secret** werden angezeigt – **sofort kopieren und sicher aufbewahren**.  
   Das Secret wird später nicht erneut angezeigt.

---

## 3. Richtige API-URL ermitteln

Die Basis-URL hängt von Ihrer RMM-Plattform ab. Typische Beispiele:

| Plattform  | API-URL (Basis, ohne `/api`)                |
|-----------|----------------------------------------------|
| Pinotage  | `https://pinotage-api.centrastage.net`       |
| Merlot    | `https://merlot-api.centrastage.net`         |
| Concord   | `https://concord-api.centrastage.net`        |
| Vidal     | `https://vidal-api.centrastage.net`          |
| Zinfandel | `https://zinfandel-api.centrastage.net`      |
| Syrah     | `https://syrah-api.centrastage.net`         |

- In der Regel steht in der Adresszeile Ihres RMM-Portals der Plattform-Name (z. B. `pinotage.centrastage.net` → dann Basis-URL: `https://pinotage-api.centrastage.net`).
- **Wichtig:** Nur die Basis-URL angeben, **ohne** `/api` am Ende.

---

## 4. Umgebungsvariablen im Projekt setzen

### Lokal (auf Ihrem Rechner)

1. Im Projektordner eine Datei **`.env.local`** anlegen (falls noch nicht vorhanden).
2. Folgende Zeilen eintragen (Werte durch Ihre Daten ersetzen):

```env
# Datto RMM API (optional – ohne diese Werte werden Demo-Geräte angezeigt)
DATTO_RMM_API_URL=https://pinotage-api.centrastage.net
DATTO_RMM_API_KEY=Ihr_API_Key
DATTO_RMM_API_SECRET=Ihr_API_Secret
```

3. **API Key** und **API Secret** aus Schritt 2 einsetzen.  
4. **DATTO_RMM_API_URL** durch Ihre passende URL aus Schritt 3 ersetzen.  
5. Datei speichern. **`.env.local`** nicht in Git committen (steht normalerweise bereits in `.gitignore`).

### Entwicklungsserver neu starten

Nach dem Anlegen oder Ändern von `.env.local` den Next.js-Server neu starten:

```bash
# Im Projektordner
npm run dev
```

Dann die App im Browser öffnen und zur Seite **Devices** gehen.

---

## 5. Auf Vercel (oder anderem Hosting)

Wenn die App z. B. auf Vercel läuft:

1. Im Vercel-Dashboard das **Projekt** öffnen.
2. **Settings** → **Environment Variables**.
3. Diese Variablen anlegen (für Production und ggf. Preview):

| Name                   | Value                          | Environment   |
|------------------------|--------------------------------|---------------|
| `DATTO_RMM_API_URL`    | `https://pinotage-api.centrastage.net` (oder Ihre URL) | Production (evtl. Preview) |
| `DATTO_RMM_API_KEY`    | Ihr API Key                    | Production (evtl. Preview) |
| `DATTO_RMM_API_SECRET` | Ihr API Secret                 | Production (evtl. Preview) |

4. **Save** und bei Bedarf einen neuen **Redeploy** auslösen.

---

## 6. Prüfen, ob es funktioniert

1. **Devices-Seite** in der App öffnen.
2. Wenn die RMM-API korrekt eingebunden ist:
   - Es erscheint der grüne Hinweis **„Live from Datto RMM“** neben der Überschrift.
   - Die Liste zeigt Ihre echten Geräte aus Datto RMM (Server, PCs, Laptops etc.).
3. Wenn **keine** der drei Umgebungsvariablen gesetzt ist (oder die API fehlschlägt):
   - Es werden weiterhin die **Demo-Geräte** angezeigt.
   - Kein „Live from Datto RMM“-Badge.

---

## 7. Häufige Probleme

| Problem | Mögliche Lösung |
|--------|------------------|
| Immer noch Demo-Geräte | `.env.local` prüfen, Server neu starten; auf Vercel: Env-Variablen gesetzt und neu deployt? |
| „Datto RMM token failed“ | API in RMM aktiviert? API Key/Secret korrekt? Keine Leerzeichen am Anfang/Ende. |
| Leere Geräteliste | RMM-Account hat Geräte? Richtige API-URL für Ihre Plattform (z. B. pinotage-api …)? |
| CORS / Netzwerkfehler | API wird serverseitig aufgerufen; CORS betrifft nur den Browser. Bei Vercel: gleiche Domain, kein lokaler Aufruf gegen RMM. |

---

## Kurz-Checkliste

- [ ] In Datto RMM: **API Access** unter Setup → Global Settings aktiviert  
- [ ] **API Key** und **API Secret** unter Setup → Users erzeugt und notiert  
- [ ] **Basis-URL** für Ihre Plattform ermittelt (z. B. `https://pinotage-api.centrastage.net`)  
- [ ] **`.env.local`** mit `DATTO_RMM_API_URL`, `DATTO_RMM_API_KEY`, `DATTO_RMM_API_SECRET` angelegt  
- [ ] Dev-Server **neu gestartet** (`npm run dev`)  
- [ ] Auf **Devices**-Seite prüfen: „Live from Datto RMM“ und echte Geräte sichtbar  

Wenn Sie diese Schritte durchgehen, sind die Daten von RMM in der App eingebunden.
