import { iconSvg } from '../../lib/icons'
import { countryCodeToFlagEmoji } from '../../lib/tripForm'
import type { CountrySummary, ExposureLevel } from '../../lib/app/types'
import styles from './SummaryPanel.module.css'

const DONUT_RADIUS = 36.5
const DONUT_STROKE = 7
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS

function progressPercent(country: CountrySummary) {
  if (country.thresholdDays <= 0) return 0
  return Math.min(100, Math.round((country.daysPresent / country.thresholdDays) * 100))
}

function statusText(country: CountrySummary) {
  return country.daysRemaining <= 0 ?
    `${Math.abs(country.daysRemaining)} days over threshold` :
    `${country.daysRemaining} days remaining`
}

function levelLabel(level: ExposureLevel) {
  if (level === 'exceeded') return 'Exceeded'
  if (level === 'warning') return 'Near limit'
  return 'On track'
}

interface CountryCardProps {
  country: CountrySummary
  onRemove: (countryCode: string) => void
}

function CountryCard({ country, onRemove }: CountryCardProps) {
  const progress = progressPercent(country)
  const dashOffset = DONUT_CIRCUMFERENCE * (1 - progress / 100)
  const gradId = `cc-donut-grad-${country.countryCode.toLowerCase()}`
  const flag = countryCodeToFlagEmoji(country.countryCode)
  const status = statusText(country)
  const ariaValueText = `${String(country.daysPresent)} of ${String(country.thresholdDays)} days. ${status}`

  return (
    <li className={styles.summaryItem}>
      <article className={styles.card} data-level={country.exposureLevel}>
        <div className={styles.cardTop}>
          <div className={styles.flagWrap} aria-hidden="true">
            <span className={styles.flag}>{flag}</span>
          </div>
          <div className={styles.cardMain}>
            <div className={styles.cardHeader}>
              <div className={styles.nameRow}>
                <h3 className={styles.title}>{country.countryName}</h3>
                <span className={styles.code}>{country.countryCode}</span>
              </div>
              <div className={styles.headerEnd}>
                <span className={styles.levelPill}>{levelLabel(country.exposureLevel)}</span>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.actionsBtn}
                    aria-haspopup="menu"
                    aria-label={`Actions for ${country.countryName}`}
                    onClick={e => {
                      const menu = (e.currentTarget as HTMLButtonElement).nextElementSibling as HTMLElement | null
                      if (!menu) return
                      const isOpen = !menu.hidden
                      document.querySelectorAll(`.${styles.actionsMenu}`).forEach(m => { (m as HTMLElement).hidden = true })
                      menu.hidden = isOpen
                    }}
                    dangerouslySetInnerHTML={{ __html: iconSvg('more') }}
                  />
                  <div className={styles.actionsMenu} role="menu" hidden>
                    <button
                      type="button"
                      className={styles.actionsMenuItem}
                      role="menuitem"
                      onClick={() => { onRemove(country.countryCode) }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className={styles.threshold}>
              <span className={styles.thresholdLabel}>Residency threshold</span>
              {' '}
              <span className={styles.thresholdValue}>{`${country.thresholdDays} days`}</span>
            </p>
          </div>
        </div>

        <div className={styles.countRow}>
          <div className={styles.donutWrap} aria-hidden="true">
            <svg className={styles.donut} viewBox="0 0 100 100" role="presentation">
              <defs>
                <linearGradient id={gradId} x1="8%" y1="12%" x2="92%" y2="88%">
                  <stop offset="0%" className={styles.gradStart} />
                  <stop offset="52%" className={styles.gradMid} />
                  <stop offset="100%" className={styles.gradEnd} />
                </linearGradient>
              </defs>
              <circle className={styles.donutFace} cx="50" cy="50" r="47" />
              <circle className={styles.donutRim} cx="50" cy="50" r="46" fill="none" />
              <circle className={styles.donutTrack} cx="50" cy="50" r={DONUT_RADIUS} fill="none" strokeWidth={DONUT_STROKE} />
              <circle
                className={styles.donutArc}
                cx="50"
                cy="50"
                r={DONUT_RADIUS}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={DONUT_STROKE}
                strokeLinecap="round"
                strokeDasharray={DONUT_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 50 50)"
              />
              <text className={styles.donutPct} x="50" y="50" textAnchor="middle" dominantBaseline="central">
                {`${progress}%`}
              </text>
            </svg>
          </div>
          <div className={styles.countBlock}>
            <p className={styles.count} aria-hidden="true">
              <span className={styles.countValue}>{country.daysPresent}</span>
              <span className={styles.countSuffix}>{`/ ${country.thresholdDays}`}</span>
            </p>
            <p className={styles.countPct}>Days in window vs threshold</p>
          </div>
        </div>

        <div
          className={styles.meter}
          role="progressbar"
          aria-valuenow={country.daysPresent}
          aria-valuemin={0}
          aria-valuemax={country.thresholdDays}
          aria-valuetext={ariaValueText}
        >
          <i style={{ '--w': `${progress}%` } as React.CSSProperties} />
        </div>
        <p className={styles.cardStatus}>{status}</p>
      </article>
    </li>
  )
}

interface Props {
  summary: CountrySummary[]
  windowLabel: string
  windowMode: string
  onWindowChange: (mode: string) => void
  onRemoveCountry: (countryCode: string) => void
}

export function SummaryPanel({ summary, windowLabel, windowMode, onWindowChange, onRemoveCountry }: Props) {
  return (
    <section className={`panel ${styles.panel}`}>
      <div className={`panel-heading ${styles.heading}`}>
        <div className={`panel-title-stack ${styles.titleStack}`}>
          <span
            className="panel-icon"
            dangerouslySetInnerHTML={{ __html: iconSvg('chart', { size: 22 }) }}
          />
          <div className={styles.titleContent}>
            <p className="eyebrow">Exposure</p>
            <h2 id="summary-panel-heading">Country day counts</h2>
            <p id="window-label" className={`muted ${styles.windowLede}`}>{windowLabel}</p>
          </div>
        </div>
        <div className={`field compact ${styles.windowField}`}>
          <label htmlFor="window-mode">Window</label>
          <select
            id="window-mode"
            className="ui-select"
            aria-describedby="window-help"
            value={windowMode}
            onChange={e => { onWindowChange(e.target.value) }}
          >
            <option value="calendar-year">Calendar year</option>
            <option value="rolling-365">Rolling 365 days</option>
          </select>
          <small id="window-help">Choose the date range used for exposure counts.</small>
        </div>
      </div>

      <ul className={styles.list} aria-labelledby="summary-panel-heading">
        {summary.length === 0 ? (
          <li className={styles.emptyItem}>
            <p className="muted empty-state">Add a trip to see your residency exposure by country.</p>
          </li>
        ) : (
          summary.map(country => (
            <CountryCard key={country.countryCode} country={country} onRemove={onRemoveCountry} />
          ))
        )}
      </ul>

      <p className={styles.rule}>
        Counting rule: any calendar day with presence in a country counts as one full day. Entry and exit dates are inclusive. This is a tracking aid, not tax advice.
      </p>
    </section>
  )
}
