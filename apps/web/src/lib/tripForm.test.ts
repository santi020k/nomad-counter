import { describe, expect, it, vi } from 'vitest'

import { countryCodeToFlagEmoji, escapeHtml, validateTripForm } from './tripForm'

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('a<b>"c"')).toBe('a&lt;b&gt;&quot;c&quot;')
  })
})

describe('countryCodeToFlagEmoji', () => {
  it('returns regional indicators for alpha-2 codes', () => {
    expect(countryCodeToFlagEmoji('AR')).toBe('🇦🇷')
    expect(countryCodeToFlagEmoji('us')).toBe('🇺🇸')
  })

  it('returns empty for invalid input', () => {
    expect(countryCodeToFlagEmoji('')).toBe('')
    expect(countryCodeToFlagEmoji('A')).toBe('')
    expect(countryCodeToFlagEmoji('12')).toBe('')
  })
})

describe('validateTripForm', () => {
  it('accepts open-ended trips without exit date', () => {
    expect(validateTripForm({
      entryDate: '2026-01-15',
      exitDate: '',
      openEnded: true
    })).toEqual({ ok: true, exitDate: null })
  })

  it('rejects closed trip without exit date', () => {
    expect(validateTripForm({
      entryDate: '2026-01-15',
      exitDate: '',
      openEnded: false
    })).toEqual({
      ok: false,
      error: 'Exit date is required unless "Currently there" is checked.'
    })
  })

  it('rejects exit before entry', () => {
    expect(validateTripForm({
      entryDate: '2026-02-10',
      exitDate: '2026-02-01',
      openEnded: false
    })).toEqual({
      ok: false,
      error: 'Exit date must be on or after entry date.'
    })
  })

  it('accepts exit equal to entry (single inclusive day)', () => {
    expect(validateTripForm({
      entryDate: '2026-03-01',
      exitDate: '2026-03-01',
      openEnded: false
    })).toEqual({ ok: true, exitDate: '2026-03-01' })
  })

  it('rejects empty entry', () => {
    expect(validateTripForm({
      entryDate: '',
      exitDate: '2026-01-01',
      openEnded: false
    })).toEqual({
      ok: false,
      error: 'Entry date is required.'
    })
  })

  it('rejects malformed calendar dates', () => {
    expect(validateTripForm({
      entryDate: '2026-02-31',
      exitDate: '2026-02-28',
      openEnded: false
    })).toEqual({
      ok: false,
      error: 'Entry date is not a valid calendar date.'
    })
  })

  it('adds hint when entry is in the future', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-01T12:00:00Z'))

    expect(validateTripForm({
      entryDate: '2026-05-01',
      exitDate: '2026-05-10',
      openEnded: false
    })).toEqual({
      ok: true,
      exitDate: '2026-05-10',
      hint: 'Future entry; double-check.'
    })

    vi.useRealTimers()
  })
})
