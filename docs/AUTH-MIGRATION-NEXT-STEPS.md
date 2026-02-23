# Auth-Migration – Nächste Schritte

Von Demo-Cookies zu echter Authentifizierung (NextAuth oder vergleichbar).

---

## 1. Ziel-Session

Die App braucht pro Request:

- **userId** (stabil)
- **username** (Anzeige)
- **role** (superadmin | admin | partner | tenant_user)
- **partnerId** (wenn role=partner)
- **tenantId** (wenn role=tenant_user)

Diese Struktur ist in `lib/auth/roles.ts` als `AuthSession` bereits vorgesehen.

---

## 2. Optionen für echte Auth

| Option | Beschreibung | Aufwand |
|--------|--------------|---------|
| **NextAuth.js** | OAuth + Credentials + DB-Adapter (User in DB, Session in JWT oder DB). Gut für Next.js. | Mittel |
| **Clerk** | Managed Auth, UI fertig, Multi-Tenant unterstützt. | Gering (externer Dienst) |
| **Eigene JWT + DB** | Login-POST prüft User in DB, setzt JWT mit role/partnerId/tenantId. Middleware prüft JWT. | Mittel |

Empfehlung: **NextAuth.js** mit Credentials-Provider und eigener User-Tabelle (oder Adapter), damit Rollen und partnerId/tenantId aus der DB kommen.

---

## 3. Konkrete Schritte (NextAuth.js)

### 3.1 Installation

```bash
npm install next-auth
```

### 3.2 Konfiguration

- **Route Handler:** `app/api/auth/[...nextauth]/route.ts` mit:
  - **Providers:** credentials (username + password), optional OAuth (Google, etc.).
  - **callbacks:** in `jwt` und `session` die Felder `role`, `partnerId`, `tenantId` aus dem User-Objekt in die Session übernehmen.
- **User-Quelle:** Zunächst gleiche Logik wie jetzt (z. B. User aus Demo-User-Liste oder aus DB); beim Login User laden und `role`, `partnerId`, `tenantId` an NextAuth übergeben (z. B. über `user.id` und dann in callbacks aus DB nachladen).

### 3.3 Session-Form

- NextAuth-Session erweitern (TypeScript):  
  `role`, `partnerId?`, `tenantId?` in `types/next-auth.d.ts` ergänzen.
- In `callbacks.session`:  
  `session.role = token.role`, `session.partnerId = token.partnerId`, `session.tenantId = token.tenantId`.

### 3.4 Middleware

- **Bisher:** Prüfung auf Cookie `demo_authed`.
- **Danach:** `getToken()` von NextAuth in der Middleware; wenn kein gültiger Token → Redirect auf `/login`.  
  Optional: Rollenprüfung pro Route (z. B. `/admin` nur für role admin/superadmin).

### 3.5 Login-Seite

- **Bisher:** Eigenes Formular, setzt `demo_authed`, `demo_user`, `demo_role`.
- **Danach:** `signIn('credentials', { username, password, redirect: true })`; Redirect nach Erfolg auf `/`.  
  Alte Cookies können in einer Übergangsphase ignoriert oder entfernt werden.

### 3.6 API-Routen

- **Bisher:** `req.cookies.get('demo_role')` etc.
- **Danach:** `getServerSession(authOptions)` in geschützten API-Routen; aus `session` die Rolle und ggf. tenantId/partnerId lesen und Zugriff filtern (z. B. nur eigene Tenants bei role=partner).

---

## 4. Ablauf bei Migration

1. NextAuth einrichten (Route, Credentials-Provider, Session-Callbacks mit role/partnerId/tenantId).
2. Login-Seite auf `signIn('credentials', …)` umstellen; Logout auf `signOut()`.
3. Middleware auf NextAuth-Token umstellen; Demo-Cookie-Check entfernen.
4. API-Routen nacheinander auf `getServerSession` umstellen (z. B. zuerst /api/demo/users, dann /api/tenants, /api/partners).
5. User-Datenquelle: von In-Memory/Demo-Users auf DB (z. B. Vercel Postgres) umstellen; gleiche Felder (username, role, partnerId, tenantId) beibehalten.

---

## 5. Kurz-Checkliste

- [ ] next-auth installieren
- [ ] `app/api/auth/[...nextauth]/route.ts` anlegen
- [ ] Credentials-Provider mit User-Lookup (Demo oder DB)
- [ ] JWT/Session-Callbacks: role, partnerId, tenantId setzen
- [ ] TypeScript: Session-Typ erweitern
- [ ] Middleware: getToken(), Redirect bei fehlendem Auth
- [ ] Login-Page: signIn('credentials', …)
- [ ] Logout-Button: signOut()
- [ ] Bestehende APIs: getServerSession statt Cookie lesen
- [ ] SuperAdmin-Schutz in User-APIs beibehalten (Rolle aus Session)

Damit bleibt das Berechtigungskonzept (SuperAdmin, Admin, Partner, Tenant) erhalten; nur die technische Basis wechselt von Cookies zu NextAuth-Session.
