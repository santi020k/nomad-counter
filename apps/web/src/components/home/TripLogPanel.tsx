import { iconSvg } from '../../lib/icons'
import { countryCodeToFlagEmoji } from '../../lib/tripForm'
import { formatDisplayDate, inclusiveDays, todayIso } from '../../lib/app/dateMath'
import type { Trip } from '../../lib/app/types'
import rowStyles from './Rows.module.css'
import styles from './TripLogPanel.module.css'

interface TripItemProps {
  trip: Trip
  onRemove: (id: string) => void
}

function TripItem({ trip, onRemove }: TripItemProps) {
  const titleId = `trip-log-title-${trip.id.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const exitLabel = trip.exitDate ? formatDisplayDate(trip.exitDate) : 'present'
  const days = inclusiveDays(trip.entryDate, trip.exitDate ?? todayIso())
  const flag = countryCodeToFlagEmoji(trip.countryCode)
  const note = trip.note?.trim()

  return (
    <li className={styles.item} data-trip-id={trip.id}>
      <article className={rowStyles.row} aria-labelledby={titleId}>
        <span className={rowStyles.accent} aria-hidden="true" />
        <div className={rowStyles.body}>
          <div className={rowStyles.info}>
            <h3 className={styles.tripTitle} id={titleId}>
              <span className={rowStyles.flagWrap} aria-hidden="true">
                <span className={`${rowStyles.flag} ${styles.tripFlag}`}>{flag}</span>
              </span>
              <span>{trip.countryName}</span>
            </h3>
            <div className={styles.tripDates} role="group" aria-label="Entry and exit dates" aria-describedby={titleId}>
              <time className={styles.datePill} dateTime={trip.entryDate}>
                <span className={styles.datePillAccent} aria-hidden="true" />
                <span className={styles.datePillText}>{formatDisplayDate(trip.entryDate)}</span>
              </time>
              <span className={styles.datesArrow} aria-hidden="true">→</span>
              {trip.exitDate ? (
                <time className={styles.datePill} dateTime={trip.exitDate}>
                  <span className={styles.datePillAccent} aria-hidden="true" />
                  <span className={styles.datePillText}>{exitLabel}</span>
                </time>
              ) : (
                <span className={`${styles.datePill} ${styles.datePillOpen}`} aria-label="Open stay (no exit date yet)">
                  <span className={styles.datePillAccent} aria-hidden="true" />
                  <span className={styles.datePillText}>{exitLabel}</span>
                </span>
              )}
            </div>
            {note && <p className={styles.note}>{note}</p>}
          </div>
          <div className={rowStyles.meta}>
            <span className={styles.tripDays} aria-label={`${days} days in ${trip.countryName}`}>
              <span aria-hidden="true">{`${days}d`}</span>
            </span>
            <button
              className={rowStyles.removeButton}
              type="button"
              title="Remove trip"
              aria-label={`Remove trip to ${trip.countryName}`}
              onClick={() => { onRemove(trip.id) }}
            >
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconSvg('trash') }} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </article>
    </li>
  )
}

interface Props {
  trips: Trip[]
  onRemoveTrip: (id: string) => void
  onExportCsv: () => void
  onImportCsv: (file: File) => void
}

export function TripLogPanel({ trips, onRemoveTrip, onExportCsv, onImportCsv }: Props) {
  const sorted = [...trips].sort((a, b) => b.entryDate.localeCompare(a.entryDate))

  return (
    <section className={`panel ${styles.panel}`} aria-labelledby="trip-log-heading">
      <div className={`panel-heading ${styles.heading}`}>
        <div className={`panel-title-stack ${styles.titleStack}`}>
          <span className="panel-icon" dangerouslySetInnerHTML={{ __html: iconSvg('route', { size: 22 }) }} />
          <div className={styles.titleBlock}>
            <p className="eyebrow">Trips</p>
            <h2 id="trip-log-heading">Travel log</h2>
            <p className={`muted ${styles.lede}`}>Newest stays first. Export or import CSV to move your history between devices.</p>
          </div>
        </div>
        <div className={`inline-actions ${styles.actions}`} role="group" aria-label="Trip data">
          <button className="btn secondary" type="button" onClick={onExportCsv}>Export CSV</button>
          <label className="btn secondary">
            Import CSV
            <input
              className="sr-only"
              type="file"
              accept=".csv,text/csv"
              onChange={e => {
                const file = e.currentTarget.files?.[0]
                if (file) { onImportCsv(file); e.currentTarget.value = '' }
              }}
            />
          </label>
        </div>
      </div>

      <ul id="trip-list" className={`list ${styles.list}`} aria-labelledby="trip-log-heading">
        {sorted.length === 0 ? (
          <li className={styles.emptyItem}>
            <p className="muted empty-state trip-log-empty" role="status">No trips yet. Add your first stay or import a CSV.</p>
          </li>
        ) : (
          sorted.map(trip => (
            <TripItem key={trip.id} trip={trip} onRemove={onRemoveTrip} />
          ))
        )}
      </ul>
    </section>
  )
}
