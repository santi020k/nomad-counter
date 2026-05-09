import type { CountrySummary, HomeCountry, Trip } from './types'

/**
 * Data fetched server-side for authenticated users and passed as props
 * to the CounterWorkspace island. When present, the island skips its
 * own client-side init and populates the store immediately, eliminating
 * the flash of empty panels on first paint.
 *
 * Guest users (no valid session) always receive `null` and fall back to
 * the normal localStorage-based init path.
 */
export interface SSRInitialData {
  authenticated: true
  userEmail: string
  trips: Trip[]
  countries: HomeCountry[]
  summary: CountrySummary[]
  windowLabel: string
  windowMode: 'calendar-year' | 'rolling-365'
}
