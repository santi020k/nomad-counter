import { type FormEvent, useState } from 'react'
import { iconSvg } from '../../lib/icons'
import { countryCodeToFlagEmoji } from '../../lib/tripForm'
import type { HomeCountry } from '../../lib/app/types'
import { CountryCombobox } from './CountryCombobox'
import styles from './HomeCountryPanel.module.css'

interface TrackedRowProps {
  country: HomeCountry
  onRemove: (id: string) => void
}

function TrackedRow({ country, onRemove }: TrackedRowProps) {
  const flag = countryCodeToFlagEmoji(country.countryCode)

  return (
    <article className={`row row-tracked ${styles.trackedRow}`}>
      <span className="row-accent" />
      <div className="row-body">
        <div className="row-info">
          <strong>
            <span className="row-flag-wrap" aria-hidden="true">
              <span className="row-flag">{flag}</span>
            </span>
            {country.countryName}
          </strong>
          <div className={styles.trackedMeta}>
            <span className={styles.pill}>{country.thresholdDays}-day threshold</span>
            <span className={`${styles.pill} ${styles.pillWarn}`}>Warn at {country.warningDays} days</span>
          </div>
        </div>
        <div className="row-meta">
          <button
            className="row-remove-button"
            type="button"
            title="Remove tracked country"
            aria-label={`Stop tracking ${country.countryName}`}
            onClick={() => onRemove(country.id)}
          >
            <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvg('trash') }} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </article>
  )
}

interface CountryInput {
  countryCode: string
  countryName: string
  thresholdDays: number
  warningDays: number
}

interface Props {
  countries: HomeCountry[]
  onAddCountry: (input: CountryInput) => Promise<void>
  onRemoveCountry: (id: string) => void
}

export function HomeCountryPanel({ countries, onAddCountry, onRemoveCountry }: Props) {
  const [countryCode, setCountryCode] = useState('')
  const [countryName, setCountryName] = useState('')
  const [thresholdDays, setThresholdDays] = useState('183')
  const [warningDays, setWarningDays] = useState('14')
  const [status, setStatus] = useState('')
  const [statusTone, setStatusTone] = useState<'ok' | 'error'>('ok')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('')
    setSubmitting(true)
    try {
      await onAddCountry({
        countryCode,
        countryName,
        thresholdDays: Number(thresholdDays),
        warningDays: Number(warningDays)
      })
      setCountryCode('')
      setCountryName('')
      setThresholdDays('183')
      setWarningDays('14')
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Something went wrong.')
      setStatusTone('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={`panel form-panel ${styles.panel}`} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>
        <span className={styles.formIcon} dangerouslySetInnerHTML={{ __html: iconSvg('globe') }} />
        Tracked country
      </h2>

      <CountryCombobox
        id="home-country"
        name="countryCode"
        label="Country"
        onSelect={(code, name) => { setCountryCode(code); setCountryName(name) }}
      />

      <div className="grid-fit">
        <div className="field">
          <label htmlFor="threshold-days">Threshold</label>
          <input
            id="threshold-days"
            className="ui-input"
            name="thresholdDays"
            type="number"
            min="1"
            max="366"
            required
            aria-describedby="threshold-help"
            value={thresholdDays}
            onChange={e => setThresholdDays(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="warning-days">Warning</label>
          <input
            id="warning-days"
            className="ui-input"
            name="warningDays"
            type="number"
            min="0"
            max="90"
            required
            aria-describedby="warning-help"
            value={warningDays}
            onChange={e => setWarningDays(e.target.value)}
          />
        </div>
      </div>

      <p className="form-help">
        <span id="threshold-help">Threshold is the day limit you want to watch.</span>
        <span id="warning-help">Warning is how many days before the threshold should feel close.</span>
      </p>

      <button className="btn secondary" type="submit" disabled={submitting}>Track country</button>

      {status && (
        <p className={styles.status} role="status" data-tone={statusTone === 'error' ? 'error' : undefined}>
          {status}
        </p>
      )}

      <div className={`list tight ${styles.list}`}>
        {countries.length === 0 ? (
          <p className="muted empty-state">Track a country to customize its threshold and warning range.</p>
        ) : (
          countries.map(country => (
            <TrackedRow key={country.id} country={country} onRemove={onRemoveCountry} />
          ))
        )}
      </div>
    </form>
  )
}
