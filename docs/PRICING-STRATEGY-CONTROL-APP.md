# Preis- und Abrechnungsmodell: Mahoney Control App

**Ziel:** Die App wirtschaftlich abrechnen – einfach zu verkaufen, kalkulierbar für euch, transparent für den Kunden.

---

## Was die App heute abbildet

| Komponente | Heutige Logik | Nutzung für Abrechnung |
|------------|----------------|-------------------------|
| **Control App (Plattform)** | Dashboard, Devices, Incidents, Governance, Marketplace, Grow | Basis: Zugang zur Oberfläche pro Mandant/Kunde |
| **Incidents (Resolved/Closed)** | Pro Monat gezählt, Event-Log pro Incident | Optional: Pauschale oder pro Incident |
| **Events (MDU)** | 1M inklusive, danach gestaffelt ($0.10 / $0.08 / $0.05 pro 1k) | Nutzung aus RMM/EDR/SIEM – nur echte Events, keine reinen Alerts |
| **SOC-Stufen** | Core $85/User/Monat, Advanced $135, Enterprise ab $45k | Referenz für SOC-Zusatzleistungen |

---

## Empfohlenes Modell: **Plattform-Mindestpreis + Nutzung**

### 1. Plattform-Preis (Fix pro Mandant/Kunde)

- **Mindestbeitrag pro Monat** für die Nutzung der Control App (Dashboard, Geräte, Incidents, Governance, Billing-Übersicht, optional Mahoney Grow).
- Begründung: Feste Kosten für Hosting, Wartung und Entwicklung; jeder Kunde soll einen klaren Basisbeitrag leisten.

**Vorschlag Stufen:**

| Stufe | Zielkunde | Plattform (monatlich) | Enthalten |
|-------|------------|------------------------|-----------|
| **Starter** | Kleine Kunden, erste Schritte | z. B. 299–499 €/Monat | Bis X User/Geräte, 1M Events inklusive, Standard-Support |
| **Professional** | Mid-Market, mehrere Standorte | z. B. 799–1.499 €/Monat | Höhere Limits, Prioritäts-Support, erweiterte Reports |
| **Enterprise** | Große Kunden, Compliance | Individuell (z. B. ab 2.500 €/Monat) | Volle Nutzung, SLA, Dedicated Support |

- Die genauen Zahlen solltet ihr an eure Kosten (Hosting, Lizenzen, Personalkosten anteilig) und gewünschte Marge anpassen.

### 2. Nutzungsabhängig: MDU (Events)

- So wie **bereits in der App** umgesetzt: 1M Events inklusive, darüber hinaus gestaffelt.
- Vorteil: Kunde mit viel Event-Volumen (viele Geräte, SIEM-Anbindung) zahlt mehr – für euch fair, für den Kunden nachvollziehbar („Pay for what you use“).

**Abrechnung:**

- Pro Monat: Events aus RMM, EDR, Autotask/SIEM (oder Schätzung) → MDU-Kosten nach Tabelle (1M–50M / 50M–200M / 200M+).
- Im Admin-Bereich „Monthly Accumulation“ und „Copy for invoice“ nutzen – die App liefert die Zahlen bereits.

### 3. Optional: Incidents (Resolved/Closed)

- **Variante A:** In der Plattform-Pauschale enthalten (einfachste Variante).
- **Variante B:** Zusätzlich z. B. Pauschale pro „gewertetem“ Incident (z. B. ab 50–100 Incidents/Monat Aufschlag) – nur wenn ihr explizit SOC/Triage-Leistung pro Incident abrechnen wollt.
- **Variante C:** Nur für reine SOC-Pakete (Core/Advanced/Enterprise) – dann sind Incidents Teil des SOC-Preises, nicht der Plattform.

**Empfehlung:** Incidents in der **Plattform-Pauschale** oder im **SOC-Paket** mit abdecken; separate Incident-Abrechnung nur, wenn ihr wirklich „pro bearbeitetem Ticket“ abrechnet.

### 4. AI (Claude API) – Kosten durchreichen + 50 % Marge

- **AI-Features** (AI Co-Pilot, Auswertungen, Analysen) laufen über die [Claude API](https://claude.com/pricing#api) (Anthropic). Die API-Kosten werden erfasst und mit **50 % Marge** an den Kunden weiterberechnet.
- **Umsetzung in der App:** In `lib/claude-pricing.ts` sind die API-Preise (USD pro 1M Tokens) hinterlegt; die Funktion `computeClaudeCost()` berechnet aus Input-/Output-Tokens die API-Kosten und den Kundennetto (API-Kosten × 1,5). Im **Admin → Billing** erscheint die Referenztabelle (Modelle Opus, Sonnet, Haiku) sowie die typischen Kosten pro Co-Pilot-Anfrage.
- **Abrechnung:** Entweder monatlich nach tatsächlicher Nutzung (Token-Zählung aus API-Responses) oder Pauschale „AI-Paket“ (z. B. X Anfragen inklusive, darüber Verbrauch). Die 50 %-Marge bleibt eure Kalkulation; der Kunde sieht transparent „AI (Claude)“ als eigene Position.

---

## Alternative: Reine Pauschale pro Mandant

- Ein **fester Monatspreis** pro Kunde/Mandant (z. B. 499 € oder 999 €), inklusive „vernünftiger“ Nutzung (z. B. bis 1M Events, bis X User).
- Darüber hinaus: Aufschlag für MDU oder Upgrade in die nächste Stufe (Professional/Enterprise).
- Vorteil: Sehr einfach zu kommunizieren und zu fakturieren; Nachteil: Bei sehr großen Kunden müsst ihr Obergrenzen oder Aufschläge definieren.

---

## Was sich wirtschaftlich lohnt – Kurz-Checkliste

1. **Plattform-Mindestpreis** so setzen, dass pro Kunde mindestens eure direkten Kosten (App-Hosting, Lizenzen, anteilige Entwicklung) + Marge (z. B. 30–50 %) gedeckt sind.
2. **MDU** beibehalten: Große Event-Volumen zahlen mehr – skaliert mit dem Wert (Datenmenge) für den Kunden.
3. **SOC-Stufen** (Core/Advanced/Enterprise) als **Add-on** zum Plattform-Preis verkaufen – dann ist klar: Plattform = Control App, SOC = Überwachung/Response.
4. **Jahresverträge** mit 1–2 Monaten Rabatt anbieten (z. B. „2 Monate frei bei 12 Monaten Laufzeit“) – verbessert Cashflow und Commitment.
5. **Transparenz:** Im Marketplace und in Rechnungen sichtbar machen: „Plattform XY € + MDU nach Verbrauch + optional SOC + optional AI (Claude, mit 50 % Marge auf API-Kosten)“.
6. **AI (Claude):** API-Kosten aus [Claude Pricing](https://claude.com/pricing#api) mit 50 % Marge weiterberechnen – Referenz und Beispielkosten pro Anfrage stehen im Admin-Bereich unter Billing.

---

## Konkrete Zahlen (Beispielrechnung)

| Position | Beispiel |
|----------|----------|
| Plattform Professional | 999 €/Monat |
| Events (z. B. 5M/Monat) | (5M − 1M) × 0,10 €/1k ≈ 400 € |
| **Summe Basis** | **~1.399 €/Monat** |
| Optional: SOC Advanced (50 User) | 50 × 135 USD ≈ 6.750 USD (~6.200 €) |
| Optional: AI (z. B. 500 Co-Pilot-Anfragen/Monat) | API-Kosten + 50 % Marge (siehe Admin → Billing) |
| **Mit SOC** | **~7.600 €/Monat** |

- Die App kann bereits **Incidents, Events, Schwellwert, MDU-Kosten** und **AI (Claude)-Referenz** (API-Preise + 50 % Marge) ausweisen – siehe Admin → Billing. Ihr müsst die **Plattform-Stufen und Preise** festlegen und in Vertrag/Angebot übernehmen.

---

## Nächste Schritte in der App (optional)

- In **Settings** oder **Admin** konfigurierbare **Plattform-Tarife** (z. B. Starter/Professional/Enterprise) mit Mindestpreis und inkludierten Events/Usern.
- Rechnungspositionen: „Plattform [Stufe]“, „MDU (Events)“, „SOC [Stufe]“, „AI (Claude)“ – Werte kommen aus Billing-API bzw. Admin-Bereich.
- Einmal pro Jahr die **MDU-Preise, SOC-Referenzpreise** und **Claude-API-Preise** prüfen und ggf. in `lib/mdu-pricing.ts`, `lib/marketplace-pricing.ts` und `lib/claude-pricing.ts` anpassen (Quelle Claude: [claude.com/pricing#api](https://claude.com/pricing#api)).

Wenn du willst, können wir als Nächstes die **konkreten Euro-Beträge** für Starter/Professional/Enterprise anhand eurer Zielmarge durchrechnen oder die Config-Felder für Plattform-Tarife in der App skizzieren.
