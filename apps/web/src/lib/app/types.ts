export type ExposureLevel = 'ok' | 'warning' | 'exceeded'

export interface Trip {
  id: string
  countryCode: string
  countryName: string
  entryDate: string
  exitDate: string | null
  note: string | null
}

export interface HomeCountry {
  id: string
  countryCode: string
  countryName: string
  thresholdDays: number
  warningDays: number
}

export interface CountrySummary {
  countryCode: string
  countryName: string
  daysPresent: number
  daysRemaining: number
  exposureLevel: ExposureLevel
  thresholdDays: number
  warningDays: number
}

export interface State {
  authenticated: boolean
  countries: HomeCountry[]
  locale: 'en' | 'es'
  trips: Trip[]
  summary: CountrySummary[]
  userEmail: null | string
  windowLabel: string
  windowMode: 'calendar-year' | 'rolling-365'
}

export type PendingConfirmAction =
  | { kind: 'summary-country', countryCode: string } |
  { kind: 'trip', tripId: string } |
  { kind: 'tracked-country', countryId: string }
