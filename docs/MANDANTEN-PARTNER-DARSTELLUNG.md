# Mandanten & Partner – Darstellung in der App

Vorschlag, wie die Sichtbarkeit **Mahoney → Partner → Kunde** in der UI klar wird und wie sich die Anzeige je Rolle unterscheidet.

---

## 1. Wer sieht was (bereits umgesetzt)

| Rolle | Sichtbarkeit | Technik |
|------|--------------|---------|
| **Mahoney** (SuperAdmin / Admin) | Alle Organisationen (Tenants) | `GET /api/tenants` ohne Partner-Filter; alle Seiten können jeden Tenant wählen. |
| **Partner** | Nur die eigenen Mandanten (Kunden) | `GET /api/tenants` filtert serverseitig nach `demo_partner_id`; Partner sieht nur Tenants mit seinem `partnerId`. |
| **Kunde** (Tenant-User) | Nur die eigene Organisation | Kein Tenant-Dropdown; `effectiveTenantId` = `demo_tenant_id` aus Session; APIs lehnen andere Tenant-IDs ab. |

Die **Daten** werden also schon korrekt gefiltert. Es geht darum, die **Darstellung** so anzupassen, dass die Hierarchie sofort erkennbar ist.

---

## 2. Empfohlene Darstellung je Rolle

### 2.1 Mahoney (SuperAdmin / Admin)

- **Kontext:** „Scope: All organizations“ oder „Viewing: [Organization]“.
- **Auswahl:** Dropdown **„Organization:“** mit Option „All (default env)“ und allen Tenants.
- **Begriffe:** „Organization“ oder „Company“ für den Mandanten; in der Admin-Ansicht weiter „Tenants“ / „Partner“.

### 2.2 Partner

- **Kontext:** „Scope: Your customers“ (oder „Partner: [Name] · Customer: [Name]“, falls Partnername geladen wird).
- **Auswahl:** Ein einziges Dropdown **„Customer:“** mit ausschließlich den eigenen Mandanten (API liefert nur diese).
- **Kein** „All“ – der Partner wählt immer einen konkreten Kunden/Mandanten.

### 2.3 Kunde (Tenant-User)

- **Kontext:** Kein Dropdown, keine Auswahl.
- **Anzeige:** Eine feste Zeile, z. B. **„Organization: [Name der eigenen Firma]“** (nur lesend), damit klar ist: „Du siehst nur deine Organisation.“

---

## 3. Konkrete UI-Anpassungen (Umsetzung)

1. **Devices & Staff / Company (und ggf. weitere Seiten)**  
   - **Mahoney:** Label „Organization:“, Option „All (default env)“ + Liste aller Tenants.  
   - **Partner:** Label „Customer:“, nur Dropdown mit den eigenen Mandanten (kein „All“).  
   - **Kunde:** Kein Dropdown; nur Text „Organization: [Name]“. Dafür wird der aktuelle Mandantenname einmalig z. B. per `GET /api/tenants/[id]` geladen (nur eigenes `id` erlaubt).

2. **Optional: Scope-Banner**  
   - Eine schmale Zeile (z. B. oberhalb der Inhalte oder in der Kopfzeile):  
     - Mahoney: „Scope: All organizations“  
     - Partner: „Scope: Your customers“  
     - Kunde: „Scope: Your organization“  
   - Macht die Rolle und den Sichtbereich ohne Klick sofort sichtbar.

3. **Terminologie**  
   - In der **Kunden- und Partner-Ansicht:** „Organization“ / „Customer“ (engl.).  
   - In der **Admin-Ansicht:** weiter „Tenants“ und „Partner“ für die Verwaltung.

---

## 4. Kurzfassung

- **Mahoney** zieht alles (alle Tenants), Auswahl per „Organization“-Dropdown inkl. „All“.  
- **Partner** zieht nur deren Mandaten; ein „Customer“-Dropdown zeigt ausschließlich die eigenen Kunden.  
- **Kunden** sehen nur sich selbst; feste Anzeige „Organization: [Name]“, kein Wechsel.

Damit ist die gewünschte Aufteilung „Mahoney alles – Partner nur deren Mandaten – Kunden nur sich selbst“ sowohl fachlich (bereits umgesetzt) als auch in der Darstellung klar abgebildet.
