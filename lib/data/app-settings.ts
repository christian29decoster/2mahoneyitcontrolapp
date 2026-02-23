/**
 * App-weite Einstellungen (Demo: In-Memory).
 * Später durch DB oder Env ersetzen.
 */

export interface AppSettings {
  /** Anzeigename der App (z. B. im Header). */
  appName: string
  /** Session-Dauer in Minuten (Demo-Cookie). */
  sessionDurationMinutes: number
  /** Standard-Rolle für neu angelegte User. */
  defaultRoleForNewUsers: string
  /** Hinweis/Info für Admins (optional). */
  adminNotice?: string
  /** Logo für Login-Seite (Data URL, z. B. base64). Max ~300 KB empfohlen. */
  logoDataUrl?: string
  updatedAtISO: string
}

const defaults: Omit<AppSettings, 'updatedAtISO'> = {
  appName: 'Mahoney IT Control',
  sessionDurationMinutes: 30,
  defaultRoleForNewUsers: 'demo',
  adminNotice: '',
}

let store: AppSettings = {
  ...defaults,
  updatedAtISO: new Date().toISOString(),
}

export function getAppSettings(): AppSettings {
  return { ...store }
}

export function updateAppSettings(data: Partial<Omit<AppSettings, 'updatedAtISO'>>): AppSettings {
  const updatedAtISO = new Date().toISOString()
  store = { ...store, ...data, updatedAtISO }
  return { ...store }
}
