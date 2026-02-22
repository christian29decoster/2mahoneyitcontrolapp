# Analyse: Nur 130 RMM-Geräte statt z. B. 380+

## Offizielle Datto RMM API (laut Doku + OpenAPI)

- **GET /v2/account/devices** unterstützt Query-Parameter: `page`, `max`, `filterId`, `hostname`, …
- Antwort-Schema **DevicesPage**: `{ pageDetails: PaginationData, devices: Device[] }`
- **PaginationData**: `count`, `totalCount`, `prevPageUrl`, `nextPageUrl`
- Doku: *"When dealing with paginated results, the **nextPageUrl** value can be used to check for results on additional pages until a **NULL** value is encountered."*
- Max. 250 Ergebnisse pro Request; weitere Seiten über `page` oder **nextPageUrl**.

## Mögliche Ursachen für „nur 130“

1. **API liefert keine `nextPageUrl`**  
   Wenn die API bei 130 Geräten `pageDetails.nextPageUrl = null` zurückgibt (z. B. eigenes Limit 130), bauen wir selbst `?page=2`. Wenn dann **Seite 2 leer** ist (0 Geräte), stoppen wir mit 130.

2. **Seite 2 wird nicht unterstützt / falsch interpretiert**  
   Manche APIs erwarten die **exakte URL aus nextPageUrl** (inkl. Token/Cursor). Unser selbst gebautes `?max=250&page=2` könnte ignoriert werden oder wieder Seite 1 liefern.

3. **`nextPageUrl` wird bei uns nicht gelesen**  
   Z. B. anderes Feld (z. B. `next_page_url`), oder `pageDetails` an anderer Stelle. Dann würden wir nie die „echte“ nächste Seite aufrufen.

4. **Wirklich nur 130 Geräte im Konto**  
   Unwahrscheinlich, wenn du 380+ erwartest; trotzdem prüfbar über RMM-UI oder Debug.

## Was der aktuelle Code macht

- Liest **nextPageUrl** aus: `Link`-Header, `pageDetails.nextPageUrl`, `nextPageURL`, `next_page_url`, Top-Level-Varianten.
- Liest **totalCount** aus: `pageDetails.totalCount` / `total`, Top-Level.
- Wenn **kein** nextPageUrl: wir setzen trotzdem `nextUrl = …?max=250&page=2` und laden weitere Seiten, bis:
  - eine Seite 0 Geräte liefert, oder
  - `all.length >= totalCount`, oder
  - wir 100 Seiten geladen haben.

**Folgerung:** Wenn weiterhin nur 130 ankommen, passiert mindestens eines:

- Die API liefert für Seite 1 **keinen** `nextPageUrl` (oder wir lesen ihn nicht).
- Unser Request für **Seite 2** (`?max=250&page=2`) liefert **0 Geräte** (oder die API ignoriert `page`).

## Nächster Schritt: Debug auswerten

**Bitte einmal aufrufen (mit konfiguriertem RMM):**

```text
GET /api/rmm/devices?debug=1
```

In der Antwort prüfen:

- **`debug.pageDetails`** (vollständig): Steht dort `nextPageUrl` (oder ähnlich) und ein Wert (URL), oder `null`?
- **`debug.pageDetailsTotalCount`**: Welche Zahl? (z. B. 380 → es gibt mehr; 130 → API sagt „nur 130“.)
- **`debug.firstPageRaw.devices`**: Sollte `"[130 items]"` sein.
- **`debug.page2`** (falls vorhanden): Zeigt, was ein zweiter Request mit `?page=2` zurückgibt (Anzahl Geräte, ob leer).

Damit lässt sich entscheiden:

- Wenn **nextPageUrl** gesetzt ist, wir aber trotzdem bei 130 bleiben → wir müssen diese URL exakt verwenden (evtl. Bug beim Auslesen/Anhängen).
- Wenn **nextPageUrl** null ist und **page 2** 0 Geräte liefert → die API nutzt vermutlich nur die in nextPageUrl übergebene URL für die nächste Seite; dann müssen wir die API-Antwort so anpassen, dass wir nextPageUrl immer aus der letzten Antwort nehmen und nie selbst `page=2` bauen, sobald die API eine URL liefert.
- Wenn **totalCount** z. B. 380 ist → wir wissen, dass wir weiter paginieren müssen; die Ursache liegt in nextPageUrl oder in der Auswertung von Seite 2.

Diese Analyse wurde vor weiteren Code-Änderungen erstellt; die Debug-Route wurde so erweitert, dass `pageDetails` und optional Seite 2 sichtbar sind.
