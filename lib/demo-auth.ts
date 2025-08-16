export const DEMO_USER = 'demo123'
export const DEMO_PASS = 'Demo321#'

export function checkDemoCredentials(u: string, p: string) {
  return u === DEMO_USER && p === DEMO_PASS
}
