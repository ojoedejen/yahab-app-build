/**
 * Admin auth helper — simple session-based passcode gate.
 *
 * The passcode is checked client-side and stored in sessionStorage so it
 * clears automatically when the browser tab is closed. This is a prototype
 * gate, not a production auth system — replace with NextAuth / Supabase Auth
 * before go-live.
 *
 * The actual passcode value lives ONLY here (not in any public page) so donors
 * cannot discover it by browsing the site.
 */

const SESSION_KEY = 'kharis_admin_auth'
const PASSCODE = 'kharis2026'

/** Returns true if the current session has been authenticated. */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

/**
 * Attempt to authenticate with the given passcode.
 * Returns true on success and persists the session.
 */
export function attemptAdminLogin(passcode: string): boolean {
  if (passcode.trim() === PASSCODE) {
    sessionStorage.setItem(SESSION_KEY, '1')
    return true
  }
  return false
}

/** Clear the admin session (logout). */
export function adminLogout(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
