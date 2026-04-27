import { useRef, useState } from 'react'
import { iconSvg } from '../../lib/icons'
import { validateTripForm } from '../../lib/tripForm'
import { CountryCombobox } from './CountryCombobox'
import styles from './TripFormPanel.module.css'

interface TripInput {
  countryCode: string
  countryName: string
  entryDate: string
  exitDate: string | null
  note: string | null
}

interface Props {
  onAddTrip: (input: TripInput) => Promise<void>
}

export function TripFormPanel({ onAddTrip }: Props) {
  const [countryCode, setCountryCode] = useState('')
  const [countryName, setCountryName] = useState('')
  const [entryDate, setEntryDate] = useState('')
  const [exitDate, setExitDate] = useState('')
  const [openEnded, setOpenEnded] = useState(false)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')
  const [statusTone, setStatusTone] = useState<'ok' | 'error'>('ok')
  const [submitting, setSubmitting] = useState(false)

  const entryRef = useRef<HTMLInputElement>(null)
  const exitRef = useRef<HTMLInputElement>(null)

  const handleOpenEndedChange = (checked: boolean) => {
    setOpenEnded(checked)
    if (checked) {
      setExitDate('')
    }
  }

  const handleEntryChange = (value: string) => {
    setEntryDate(value)
    if (exitRef.current && value && exitDate && exitDate < value) {
      setExitDate(value)
    }
  }

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const input = ref.current
    if (!input || input.disabled) return
    try {
      if (typeof input.showPicker === 'function') {
        input.showPicker()
      } else {
        input.focus()
      }
    } catch {
      input.focus()
    }
  }

  const reset = () => {
    setCountryCode('')
    setCountryName('')
    setEntryDate('')
    setExitDate('')
    setOpenEnded(false)
    setNote('')
    setStatus('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('')

    const validated = validateTripForm({ entryDate, exitDate, openEnded })

    if (!validated.ok) {
      setStatus(validated.error)
      setStatusTone('error')
      return
    }

    setSubmitting(true)
    try {
      await onAddTrip({ countryCode, countryName, entryDate, exitDate: validated.exitDate, note: note || null })
      reset()
      if (validated.hint) {
        setStatus(validated.hint)
        setStatusTone('ok')
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Something went wrong.')
      setStatusTone('error')
    } finally {
      setSubmitting(false)
    }
  }

  const calendarIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )

  return (
    <form className={`panel form-panel ${styles.panel}`} onSubmit={handleSubmit} noValidate>
      <div className={`${styles.heading}`}>
        <span
          className={`${styles.headingIcon}`}
          dangerouslySetInnerHTML={{ __html: iconSvg('route') }}
        />
        <div>
          <p className="eyebrow">New stay</p>
          <h2 className={styles.headingTitle}>Add trip</h2>
        </div>
      </div>

      <CountryCombobox
        id="trip-country"
        name="countryCode"
        label="Country"
        onSelect={(code, name) => { setCountryCode(code); setCountryName(name) }}
      />

      <fieldset className={styles.datesBlock}>
        <legend className="sr-only">Stay dates</legend>
        <div className={`grid-fit ${styles.dateGrid}`}>
          <div className="field">
            <label htmlFor="trip-entry">Entry date</label>
            <div className={styles.dateShell} data-date-shell="">
              <input
                ref={entryRef}
                id="trip-entry"
                className={`ui-input ui-input--date ${styles.dateInput}`}
                type="date"
                required
                value={entryDate}
                onChange={e => handleEntryChange(e.target.value)}
              />
              <span className={styles.dateAccent} aria-hidden="true" />
              <button type="button" className={styles.dateOpen} aria-label="Open date picker" onClick={() => openDatePicker(entryRef)}>
                {calendarIcon}
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="trip-exit">Exit date</label>
            <small id="trip-exit-help" className="field-hint">Required for completed stays. Disabled while "Currently there" is checked.</small>
            <div className={styles.dateShell} data-date-shell="">
              <input
                ref={exitRef}
                id="trip-exit"
                className={`ui-input ui-input--date ${styles.dateInput}`}
                type="date"
                required={!openEnded}
                disabled={openEnded}
                min={entryDate || undefined}
                value={exitDate}
                aria-describedby="trip-exit-help"
                onChange={e => setExitDate(e.target.value)}
              />
              <span className={styles.dateAccent} aria-hidden="true" />
              <button type="button" className={styles.dateOpen} aria-label="Open date picker" onClick={() => openDatePicker(exitRef)} disabled={openEnded}>
                {calendarIcon}
              </button>
            </div>
          </div>
        </div>

        <label className={`ui-checkbox ${styles.openEndedCheckbox}`}>
          <input
            id="trip-open-ended"
            name="openEnded"
            type="checkbox"
            className="ui-checkbox-native"
            checked={openEnded}
            onChange={e => handleOpenEndedChange(e.target.checked)}
          />
          <span className="ui-checkbox-row">
            <span className="ui-checkbox-switch" aria-hidden="true">
              <span className="ui-checkbox-knob" />
            </span>
            <span className="ui-checkbox-label">Currently there</span>
          </span>
        </label>

        <p id="trip-open-ended-help" className={styles.openEndedHint}>
          When checked, exit date is optional until the stay ends.
        </p>
      </fieldset>

      <div className="field">
        <label htmlFor="trip-note">Note</label>
        <small id="trip-note-help" className="field-hint">Avoid sensitive tax, immigration, or identity details.</small>
        <textarea
          id="trip-note"
          className="ui-input"
          name="note"
          rows={3}
          placeholder="Optional"
          aria-describedby="trip-note-help"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      <div className={styles.footer}>
        {status && (
          <p className={`form-status ${styles.status}`} role="status" data-tone={statusTone === 'error' ? 'error' : undefined}>
            {status}
          </p>
        )}
        <button className="btn" type="submit" disabled={submitting}>Add trip</button>
      </div>
    </form>
  )
}
