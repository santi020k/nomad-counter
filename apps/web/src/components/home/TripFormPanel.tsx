import { type SyntheticEvent, useRef, useState } from 'react'

import { CountryCombobox } from './CountryCombobox'

import { iconSvg } from '../../lib/icons'
import type { Messages } from '../../lib/app/i18n'
import type { Trip } from '../../lib/app/types'
import { validateTripForm } from '../../lib/tripForm'

import styles from './TripFormPanel.module.css'

interface TripInput {
  countryCode: string
  countryName: string
  entryDate: string
  exitDate: string | null
  note: string | null
}

interface Props {
  editingTrip: Trip | null
  messages: Messages
  onAddTrip: (input: TripInput) => Promise<void>
  onCancelEdit: () => void
  onUpdateTrip: (input: TripInput) => Promise<void>
}

export function TripFormPanel({ editingTrip, messages, onAddTrip, onCancelEdit, onUpdateTrip }: Props) {
  const [countryCode, setCountryCode] = useState(editingTrip?.countryCode ?? '')
  const [countryName, setCountryName] = useState(editingTrip?.countryName ?? '')
  const [entryDate, setEntryDate] = useState(editingTrip?.entryDate ?? '')
  const [exitDate, setExitDate] = useState(editingTrip?.exitDate ?? '')
  const [openEnded, setOpenEnded] = useState(editingTrip?.exitDate === null)
  const [note, setNote] = useState(editingTrip?.note ?? '')
  const [status, setStatus] = useState('')
  const [statusTone, setStatusTone] = useState<'ok' | 'error'>('ok')
  const [submitting, setSubmitting] = useState(false)
  const entryRef = useRef<HTMLInputElement>(null)
  const exitRef = useRef<HTMLInputElement>(null)
  const isEditing = editingTrip !== null

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

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
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
      const input = { countryCode, countryName, entryDate, exitDate: validated.exitDate, note: note || null }

      if (isEditing) {
        await onUpdateTrip(input)
      } else {
        await onAddTrip(input)
      }

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
    <form id="trip-form" className={`panel form-panel ${styles.panel}`} onSubmit={handleSubmit} noValidate>
      <div className={`${styles.heading}`}>
        <span
          className={`${styles.headingIcon}`}
          dangerouslySetInnerHTML={{ __html: iconSvg('route') }}
        />
        <div>
          <p className="eyebrow">{messages.newStay}</p>
          <h2 className={styles.headingTitle}>{isEditing ? messages.editTrip : messages.addTrip}</h2>
        </div>
      </div>

      <CountryCombobox
        id="trip-country"
        name="countryCode"
        label={messages.country}
        initialCode={countryCode}
        onSelect={(code, name) => {
          setCountryCode(code)

          setCountryName(name)
        }}
      />

      <fieldset className={styles.datesBlock}>
        <legend className="sr-only">Stay dates</legend>
        <div className={`grid-fit ${styles.dateGrid}`}>
          <div className="field">
            <label htmlFor="trip-entry">{messages.entryDate}</label>
            <div className={styles.dateShell} data-date-shell="">
              <input
                ref={entryRef}
                id="trip-entry"
                className={`ui-input ui-input--date ${styles.dateInput}`}
                type="date"
                required
                value={entryDate}
                onChange={e => {
                  handleEntryChange(e.target.value)
                }}
              />
              <span className={styles.dateAccent} aria-hidden="true" />
              <button
                type="button"
                className={styles.dateOpen}
                aria-label="Open date picker"
                onClick={() => {
                  openDatePicker(entryRef)
                }}
              >
                {calendarIcon}
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="trip-exit">{messages.exitDate}</label>
            <small id="trip-exit-help" className="field-hint">{messages.exitDateHelp}</small>
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
                onChange={e => {
                  setExitDate(e.target.value)
                }}
              />
              <span className={styles.dateAccent} aria-hidden="true" />
              <button
                type="button"
                className={styles.dateOpen}
                aria-label="Open date picker"
                onClick={() => {
                  openDatePicker(exitRef)
                }}
                disabled={openEnded}
              >
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
            onChange={e => {
              handleOpenEndedChange(e.target.checked)
            }}
          />
          <span className="ui-checkbox-row">
            <span className="ui-checkbox-switch" aria-hidden="true">
              <span className="ui-checkbox-knob" />
            </span>
            <span className="ui-checkbox-label">{messages.currentThere}</span>
          </span>
        </label>

        <p id="trip-open-ended-help" className={styles.openEndedHint}>
          {messages.openEndedHelp}
        </p>
      </fieldset>

      <div className="field">
        <label htmlFor="trip-note">{messages.note}</label>
        <small id="trip-note-help" className="field-hint">{messages.noteHelp}</small>
        <textarea
          id="trip-note"
          className="ui-input"
          name="note"
          rows={3}
          placeholder={messages.optional}
          aria-describedby="trip-note-help"
          value={note}
          onChange={e => {
            setNote(e.target.value)
          }}
        />
      </div>

      <div className={styles.footer}>
        {status ?
          (
            <p id="trip-form-status" className={`form-status ${styles.status}`} role="status" data-tone={statusTone === 'error' ? 'error' : undefined}>
              {status}
            </p>
          ) :
          null}
        {isEditing && (
          <button
            className="btn secondary"
            type="button"
            disabled={submitting}
            onClick={() => {
              reset()
              onCancelEdit()
            }}
          >
            {messages.cancel}
          </button>
        )}
        <button className="btn" type="submit" disabled={submitting}>
          {isEditing ? messages.updateTrip : messages.addTrip}
        </button>
      </div>
    </form>
  )
}
