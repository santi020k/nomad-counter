import { format, isValid, parseISO } from 'date-fns'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export const escapeHtml = (s: string): string => s
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

/** Regional-indicator pair for ISO 3166-1 alpha-2 (e.g. AR → 🇦🇷). */
export const countryCodeToFlagEmoji = (code: string): string => {
  const normalized = code.trim().toUpperCase()

  if (normalized.length !== 2) {
    return ''
  }

  const a = normalized.codePointAt(0)
  const b = normalized.codePointAt(1)

  if (a === undefined || b === undefined) {
    return ''
  }

  if (a < 65 || a > 90 || b < 65 || b > 90) {
    return ''
  }

  const base = 0x1F1E6 - 65

  return String.fromCodePoint(base + a, base + b)
}

const isValidIsoDateString = (value: string): boolean => {
  if (!ISO_DATE.test(value.trim())) {
    return false
  }

  const d = parseISO(value.trim())

  return isValid(d) && format(d, 'yyyy-MM-dd') === value.trim()
}

const todayYmd = (): string => format(new Date(), 'yyyy-MM-dd')

interface TripFormInput {
  entryDate: string
  exitDate: string
  openEnded: boolean
}

type TripFormResult = { ok: true, exitDate: string | null, hint?: string } | {
  ok: false
  error: string
}

/**
 * Client-side rules aligned with API `tripSchema` in apps/api/src/routes/trips.ts
 * (exit on or after entry when exit is set).
 */
export const validateTripForm = (input: TripFormInput): TripFormResult => {
  const entryDate = input.entryDate.trim()
  const exitRaw = input.exitDate.trim()
  const openEnded = input.openEnded

  if (!entryDate) {
    return { ok: false, error: 'Entry date is required.' }
  }

  if (!isValidIsoDateString(entryDate)) {
    return { ok: false, error: 'Entry date is not a valid calendar date.' }
  }

  if (openEnded) {
    if (entryDate > todayYmd()) {
      return { ok: true, exitDate: null, hint: 'Future entry—double-check.' }
    }

    return { ok: true, exitDate: null }
  }

  if (!exitRaw) {
    return { ok: false, error: 'Exit date is required unless “Currently there” is checked.' }
  }

  if (!isValidIsoDateString(exitRaw)) {
    return { ok: false, error: 'Exit date is not a valid calendar date.' }
  }

  if (exitRaw < entryDate) {
    return { ok: false, error: 'Exit date must be on or after entry date.' }
  }

  if (entryDate > todayYmd()) {
    return { ok: true, exitDate: exitRaw, hint: 'Future entry—double-check.' }
  }

  return { ok: true, exitDate: exitRaw }
}
