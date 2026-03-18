# MDU (Mahoney Data Units) – Erklärung für Sales

**Zweck:** Deinen Vertriebsmitarbeitern in wenigen Minuten erklären, was MDU ist, wie es berechnet wird und wie sie es im Gespräch mit Partnern und Kunden nutzen können.

---

## Was ist MDU?

**MDU = Mahoney Data Units** – die nutzungsabhängige Komponente für **Datenverarbeitung** auf der Plattform.

- Es geht um **Events**: technische Ereignisse (z. B. Logs, Alerts, Systemmeldungen), die aus RMM, EDR oder SIEM in die Mahoney-Plattform fließen.
- **Nicht** gemeint: reine Alert-Anzahlen („wie viele Tickets“). Die Event-Zahl ist die Basis für die MDU-Abrechnung.
- Kurz gesagt: **Je mehr Daten (Events) durch die Plattform laufen, desto höher der MDU-Anteil – dafür ist die Nutzung für den Kunden nachvollziehbar („Pay for what you use“).**

---

## Wie wird MDU berechnet?

1. **1 Mio. Events pro Monat sind inklusive** (in der Plattform-Stufe enthalten). Darüber hinaus gilt eine gestaffelte Abrechnung (z. B. pro 1.000 Events; konkrete Preise siehe Marketplace / Preisliste).
2. **Quellen der Events:** RMM (z. B. Datto), EDR (z. B. Sophos), SIEM, Autotask – alles, was an die Plattform angebunden ist und Events liefert. Wenn keine echte Event-Zählung da ist, nutzt die App eine **Schätzung** (z. B. Geräteanzahl × Events pro Gerät pro Tag).
3. **Abrechnungszeitraum:** pro Monat. Im **Admin → Billing** siehst du die „Monthly accumulation“ (Alerts, Events, Schwellwert 1M, MDU-Kosten) – ideal für Rechnungsstellung.

---

## MDU-Budget (wichtig für Vertrieb und Kundenbetreuung)

- **Pro Kunde (Tenant) bzw. Partner** kann ein **MDU-Budget in USD** gesetzt werden – **mindestens 1.000 USD**.
- **Funktion:** Sobald das Budget in der Abrechnungsperiode erreicht ist, wird **keine weitere MDU-Verarbeitung** für diesen Kunden ausgeführt (Wachstum kontrollierbar, keine Überraschungen).
- **Wo einstellen:** Admin → **Customer file** → Reiter **Billing** → Feld **„MDU budget (USD)“**.
- **Wo sichtbar:** Überall, wo MDU vorkommt (Dashboard, Financials, Admin Billing), wird das Budget angezeigt, wenn es gesetzt ist. So sehen Partner und Kunden ihr Limit auf einen Blick.

**Sales-Argument:** „Sie können ein klares Budget setzen – wenn es erreicht ist, stoppen wir die Verarbeitung. So behalten Sie die Kosten im Griff.“

---

## Für Partner: passive Marge durch MDU

- Partner verdienen an der **Datenverarbeitung** mit: Es gibt eine **Marge pro 1.000 Events** (siehe Partner-Preisliste). Das ist **passives Einkommen** – der Kundendatenfluss erzeugt die Events, der Partner erhält die Marge, ohne zusätzlichen Aufwand.
- Im **Partner Pricing** (Deal-Rechner) wird die **monatliche MDU-Potenz** aus Geräteanzahl bzw. eingegebenen Events berechnet – ideal für Angebote und Gespräche mit Partnern.
- **Hinweis für Partner:** Das pro Kunde setzbare MDU-Budget (min. 1.000 USD) kann in Admin → Customer file → Billing gepflegt werden; bei Erreichen stoppt die Verarbeitung bis zur nächsten Periode.

---

## Wo sieht man MDU in der App?

| Bereich | Was wird gezeigt |
|--------|-------------------|
| **Dashboard** (Kunde) | Events & Data cost (MDU), ggf. MDU-Budget |
| **Financials** | Platform & Data (MDU), Kosten/Monat, ggf. MDU-Budget |
| **Admin → Billing** | Monatliche Kumulation (Alerts, Events, Schwellwert, MDU-Kosten), Hinweis auf pro-Tenant-MDU-Budget |
| **Admin → Customer file → Billing** | Eingabe des **MDU-Budgets (USD)** pro Kunde; Anzeige im Abschnitt „MDU consumption (customer)“ |
| **Partner Pricing** | MDU-Potenzial (Events/Monat, Marge), Hinweis auf MDU-Budget pro Tenant |
| **Marketplace** | Plattform & Data (MDU) – nutzungsbasiert ab 1M Events |

---

## Kurz-Argumente für Sales

- **Für den Kunden:** „MDU ist die nutzungsabhängige Komponente: 1 Mio. Events sind inklusive, darüber zahlen Sie nur, was tatsächlich anfällt. Optional können Sie ein Budget setzen – dann stoppt die Verarbeitung bei Erreichen.“
- **Für den Partner:** „Sie verdienen mit jedem Datenfluss mit – passive Marge pro 1.000 Events. Im Deal-Rechner sehen Sie sofort das MDU-Potenzial pro Kunde. Pro Kunde kann ein MDU-Budget (min. 1.000 USD) gesetzt werden, damit die Kosten planbar bleiben.“

---

*Stand: Inhalt basiert auf dem aktuellen Datenmodell und der Control App (Admin, Financials, Dashboard, Partner Pricing). Konkrete Preise pro 1k Events bitte der aktuellen Preisliste / dem Marketplace entnehmen.*
