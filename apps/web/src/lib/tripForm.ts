import { isValidIsoDate, todayIsoDate } from './isoDate'
import type { Messages } from './app/i18n'

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

interface TripFormInput {
  entryDate: string
  exitDate: string
  messages?: Messages
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
  const messages = input.messages
  const entryDate = input.entryDate.trim()
  const exitRaw = input.exitDate.trim()
  const openEnded = input.openEnded

  if (!entryDate) {
    return { ok: false, error: messages?.entryDateRequired ?? 'Entry date is required.' }
  }

  if (!isValidIsoDate(entryDate)) {
    return { ok: false, error: messages?.entryDateInvalid ?? 'Entry date is not a valid calendar date.' }
  }

  if (openEnded) {
    if (entryDate > todayIsoDate()) {
      return { ok: true, exitDate: null, hint: messages?.futureEntryHint ?? 'Future entry; double-check.' }
    }

    return { ok: true, exitDate: null }
  }

  if (!exitRaw) {
    return { ok: false, error: messages?.exitDateRequired ?? 'Exit date is required unless "Currently there" is checked.' }
  }

  if (!isValidIsoDate(exitRaw)) {
    return { ok: false, error: messages?.exitDateInvalid ?? 'Exit date is not a valid calendar date.' }
  }

  if (exitRaw < entryDate) {
    return { ok: false, error: messages?.exitDateBeforeEntry ?? 'Exit date must be on or after entry date.' }
  }

  if (entryDate > todayIsoDate()) {
    return { ok: true, exitDate: exitRaw, hint: messages?.futureEntryHint ?? 'Future entry; double-check.' }
  }

  return { ok: true, exitDate: exitRaw }
}
