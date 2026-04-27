import { formatDisplayDate, inclusiveDays, todayIso } from './dateMath'
import { $ } from './dom'
import type { CountrySummary, ExposureLevel, HomeCountry, State, Trip } from './types'

import { countryCodeToFlagEmoji, escapeHtml } from '../tripForm'

export const renderAuth = (state: State) => {
  document.body.dataset.authenticated = String(state.authenticated)

  const syncState = $('#sync-state')

  if (syncState) {
    syncState.textContent = state.authenticated && state.userEmail ?
      `Synced to ${state.userEmail}` :
      'Guest mode. Your data stays in this browser until you save it to an account.'
  }

  const form = $<HTMLFormElement>('#login-form')
  const title = $('#login-card-title')
  const sub = $('#login-card-sub')
  const emailField = $('#login-email-field')
  const codeField = $('#code-field')
  const pending = $('#login-pending-banner')
  const changeEmail = $('#login-change-email')
  const primary = $('#login-primary-btn')
  const signOutBtn = $('#login-sign-out')

  if (state.authenticated && state.userEmail) {
    if (title) {
      title.textContent = 'You are signed in'
    }

    if (sub) {
      sub.textContent = 'Trips and tracked countries sync to your account. Sign out anytime — your saved data stays on this account.'
    }

    emailField?.setAttribute('hidden', '')

    codeField?.setAttribute('hidden', '')

    pending?.setAttribute('hidden', '')

    changeEmail?.setAttribute('hidden', '')

    primary?.setAttribute('hidden', '')

    signOutBtn?.removeAttribute('hidden')
  } else {
    if (title) {
      title.textContent = 'Save to your account'
    }

    if (sub) {
      sub.textContent = 'Enter your email when you want to sync trips across devices. We will send a one-time code — no password to remember.'
    }

    emailField?.removeAttribute('hidden')

    pending?.setAttribute('hidden', '')

    changeEmail?.setAttribute('hidden', '')

    primary?.removeAttribute('hidden')

    signOutBtn?.setAttribute('hidden', '')

    if (primary) {
      primary.textContent = form?.dataset.codeRequested === 'true' ? 'Sign in and sync' : 'Email me a code'
    }

    if (form?.dataset.codeRequested === 'true') {
      codeField?.removeAttribute('hidden')

      pending?.removeAttribute('hidden')

      changeEmail?.removeAttribute('hidden')
    } else {
      codeField?.setAttribute('hidden', '')
    }
  }
}

const summaryEmptyStateMarkup = '<li class="summary-list-empty"><p class="muted empty-state">Add a trip to see your residency exposure by country.</p></li>'
const summaryDonutRadius = 36.5
const summaryDonutStroke = 7
const summaryDonutCircumference = 2 * Math.PI * summaryDonutRadius

const summaryProgressPercent = (country: CountrySummary) => {
  if (country.thresholdDays <= 0) {
    return 0
  }

  return Math.min(100, Math.round((country.daysPresent / country.thresholdDays) * 100))
}

const summaryStatusText = (country: CountrySummary) => country.daysRemaining <= 0 ?
  `${Math.abs(country.daysRemaining)} days over threshold` :
  `${country.daysRemaining} days remaining`

const summaryLevelLabel = (level: ExposureLevel) => {
  if (level === 'exceeded') {
    return 'Exceeded'
  }

  if (level === 'warning') {
    return 'Near limit'
  }

  return 'On track'
}

export const renderCountryCard = (country: CountrySummary) => {
  const progress = summaryProgressPercent(country)
  const dashOffset = summaryDonutCircumference * (1 - progress / 100)
  const donutGradId = `cc-donut-grad-${country.countryCode.toLowerCase()}`
  const flag = countryCodeToFlagEmoji(country.countryCode)
  const levelLabel = summaryLevelLabel(country.exposureLevel)
  const status = summaryStatusText(country)
  const ariaValueText = `${String(country.daysPresent)} of ${String(country.thresholdDays)} days. ${status}`

  return `<li class="summary-list-item">
    <article class="country-card" data-level="${country.exposureLevel}">
      <div class="cc-top">
        <div class="cc-flag-wrap" aria-hidden="true"><span class="cc-flag">${flag}</span></div>
        <div class="cc-main">
          <div class="cc-header">
            <div class="cc-name-row">
              <h3 class="cc-title">${escapeHtml(country.countryName)}</h3>
              <span class="cc-code">${escapeHtml(country.countryCode)}</span>
            </div>
            <div class="cc-header-end">
              <span class="cc-level-pill">${levelLabel}</span>
              <div class="cc-actions">
                <button
                  type="button"
                  class="cc-actions-btn"
                  aria-expanded="false"
                  aria-haspopup="true"
                  aria-label="Actions for ${escapeHtml(country.countryName)}"
                  data-cc-actions="${escapeHtml(country.countryCode)}"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.75" /><circle cx="12" cy="12" r="1.75" /><circle cx="12" cy="19" r="1.75" /></svg>
                </button>
                <div class="cc-actions-menu" role="menu" hidden data-cc-menu-for="${escapeHtml(country.countryCode)}">
                  <button type="button" class="cc-actions-menu-item" role="menuitem" data-open-summary-remove="${escapeHtml(country.countryCode)}">Remove</button>
                </div>
              </div>
            </div>
          </div>
          <p class="cc-threshold"><span class="cc-threshold-label">Residency threshold</span> <span class="cc-threshold-value">${String(country.thresholdDays)} days</span></p>
        </div>
      </div>
      <div class="cc-count-row">
        <div class="cc-donut-wrap" aria-hidden="true">
          <svg class="cc-donut" viewBox="0 0 100 100" role="presentation">
            <defs>
              <linearGradient id="${donutGradId}" x1="8%" y1="12%" x2="92%" y2="88%">
                <stop offset="0%" class="cc-donut-grad-start" />
                <stop offset="52%" class="cc-donut-grad-mid" />
                <stop offset="100%" class="cc-donut-grad-end" />
              </linearGradient>
            </defs>
            <circle class="cc-donut-face" cx="50" cy="50" r="47" />
            <circle class="cc-donut-rim" cx="50" cy="50" r="46" fill="none" />
            <circle class="cc-donut-track" cx="50" cy="50" r="${String(summaryDonutRadius)}" fill="none" stroke-width="${String(summaryDonutStroke)}" />
            <circle
              class="cc-donut-arc"
              cx="50"
              cy="50"
              r="${String(summaryDonutRadius)}"
              fill="none"
              stroke="url(#${donutGradId})"
              stroke-width="${String(summaryDonutStroke)}"
              stroke-linecap="round"
              stroke-dasharray="${String(summaryDonutCircumference)}"
              stroke-dashoffset="${String(dashOffset)}"
              transform="rotate(-90 50 50)"
            />
            <text class="cc-donut-pct" x="50" y="50" text-anchor="middle" dominant-baseline="central">${String(progress)}%</text>
          </svg>
        </div>
        <div class="cc-count-block">
          <p class="cc-count" aria-hidden="true">
            <span class="cc-count-value">${String(country.daysPresent)}</span>
            <span class="cc-count-suffix">/ ${String(country.thresholdDays)}</span>
          </p>
          <p class="cc-pct">Days in window vs threshold</p>
        </div>
      </div>
      <div
        class="meter"
        role="progressbar"
        aria-valuenow="${String(country.daysPresent)}"
        aria-valuemin="0"
        aria-valuemax="${String(country.thresholdDays)}"
        aria-valuetext="${escapeHtml(ariaValueText)}"
      >
        <i style="--w:${String(progress)}%"></i>
      </div>
      <p class="cc-status">${escapeHtml(status)}</p>
    </article>
  </li>`
}

export const renderSummary = (summary: CountrySummary[], windowLabelText: string) => {
  const target = $('#summary-list')
  const windowLabel = $('#window-label')

  if (!target) {
    return
  }

  if (windowLabel) {
    windowLabel.textContent = windowLabelText
  }

  target.innerHTML = summary.length === 0 ?
    summaryEmptyStateMarkup :
    summary.map(renderCountryCard).join('')
}

const tripLogTitleDomId = (tripId: string): string => `trip-log-title-${tripId.replace(/[^a-zA-Z0-9_-]/g, '')}`

export const renderTrips = (trips: Trip[]) => {
  const target = $('#trip-list')

  if (!target) {
    return
  }

  if (trips.length === 0) {
    target.innerHTML =
      '<li class="trip-log-empty-item"><p class="muted empty-state trip-log-empty" role="status">No trips yet. Add your first stay or import a CSV.</p></li>'

    return
  }

  target.innerHTML = [...trips]
    .sort((a, b) => b.entryDate.localeCompare(a.entryDate))
    .map(trip => {
      const titleId = tripLogTitleDomId(trip.id)
      const exitLabel = trip.exitDate ? formatDisplayDate(trip.exitDate) : 'present'
      const days = inclusiveDays(trip.entryDate, trip.exitDate ?? todayIso())
      const flag = countryCodeToFlagEmoji(trip.countryCode)
      const note = trip.note?.trim()
      const exitOpenAria = trip.exitDate ? '' : ' aria-label="Open stay (no exit date yet)"'

      return `<li class="trip-log-item">
        <article class="row row-trip" aria-labelledby="${titleId}" data-trip-id="${escapeHtml(trip.id)}">
          <span class="row-accent" aria-hidden="true"></span>
          <div class="row-body">
            <div class="row-info">
              <h3 class="trip-card-title" id="${titleId}">
                <span class="row-flag-wrap" aria-hidden="true"><span class="row-flag cc-flag">${flag}</span></span>
                <span class="trip-card-title__name">${escapeHtml(trip.countryName)}</span>
              </h3>
              <div class="trip-dates trip-dates--log" role="group" aria-label="Entry and exit dates" aria-describedby="${titleId}">
                <time class="date-pill date-pill--log" datetime="${escapeHtml(trip.entryDate)}"><span class="date-pill__accent" aria-hidden="true"></span><span class="date-pill__text">${formatDisplayDate(trip.entryDate)}</span></time>
                <span class="trip-dates-arrow" aria-hidden="true">→</span>
                ${trip.exitDate ?
                  `<time class="date-pill date-pill--log" datetime="${escapeHtml(trip.exitDate)}"><span class="date-pill__accent" aria-hidden="true"></span><span class="date-pill__text">${exitLabel}</span></time>` :
                  `<span class="date-pill date-pill--log date-pill--open"${exitOpenAria}><span class="date-pill__accent" aria-hidden="true"></span><span class="date-pill__text">${exitLabel}</span></span>`}
              </div>
              ${note ? `<p class="trip-note">${escapeHtml(note)}</p>` : ''}
            </div>
            <div class="row-meta">
              <span class="trip-days" aria-label="${days} days in ${escapeHtml(trip.countryName)}"><span aria-hidden="true">${days}d</span></span>
              <button class="row-remove-button" type="button" data-open-trip-remove="${escapeHtml(trip.id)}" title="Remove trip" aria-label="Remove trip to ${escapeHtml(trip.countryName)}">
                <span aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                </span>
                <span>Remove</span>
              </button>
            </div>
          </div>
        </article>
      </li>`
    })
    .join('')
}

export const renderHomeCountries = (countries: HomeCountry[]) => {
  const target = $('#home-country-list')

  if (!target) {
    return
  }

  target.innerHTML = countries.length === 0 ?
    '<p class="muted empty-state">Track a country to customize its threshold and warning range.</p>' :
    countries.map(country => {
      const flag = countryCodeToFlagEmoji(country.countryCode)

      return `<article class="row row-tracked">
      <span class="row-accent"></span>
      <div class="row-body">
      <div class="row-info">
        <strong><span class="row-flag-wrap" aria-hidden="true"><span class="row-flag cc-flag">${flag}</span></span> ${escapeHtml(country.countryName)}</strong>
        <div class="tracked-meta">
          <span class="tracked-pill">${country.thresholdDays}-day threshold</span>
          <span class="tracked-pill tracked-pill--warning">Warn at ${country.warningDays} days</span>
        </div>
      </div>
      <div class="row-meta">
        <button class="row-remove-button" type="button" data-open-tracked-remove="${escapeHtml(country.id)}" title="Remove tracked country" aria-label="Stop tracking ${escapeHtml(country.countryName)}">
          <span aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></svg>
          </span>
          <span>Remove</span>
        </button>
      </div>
      </div>
    </article>`
    }).join('')
}
