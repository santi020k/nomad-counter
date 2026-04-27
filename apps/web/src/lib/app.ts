/* eslint-disable @stylistic/operator-linebreak, @typescript-eslint/no-confusing-void-expression, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/use-unknown-in-catch-callback-variable */
import { differenceInCalendarDays, format, parseISO, subDays } from 'date-fns'

import { countries } from './countries'
import { countryCodeToFlagEmoji, escapeHtml, validateTripForm } from './tripForm'

const apiUrl = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8787'
const tripsKey = 'nomad-counter:trips'
const countriesKey = 'nomad-counter:home-countries'

type ExposureLevel = 'ok' | 'warning' | 'exceeded'

interface Trip {
  id: string
  countryCode: string
  countryName: string
  entryDate: string
  exitDate: string | null
  note: string | null
}

interface HomeCountry {
  id: string
  countryCode: string
  countryName: string
  thresholdDays: number
  warningDays: number
}

interface CountrySummary {
  countryCode: string
  countryName: string
  daysPresent: number
  daysRemaining: number
  exposureLevel: ExposureLevel
  thresholdDays: number
  warningDays: number
}

interface State {
  authenticated: boolean
  countries: HomeCountry[]
  trips: Trip[]
  summary: CountrySummary[]
  userEmail: null | string
  windowLabel: string
}

const state: State = {
  authenticated: false,
  countries: [],
  trips: [],
  summary: [],
  userEmail: null,
  windowLabel: 'Current calendar year'
}

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)
const $$ = <T extends HTMLElement>(selector: string) => [...document.querySelectorAll<T>(selector)]

const readLocal = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key)

  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const saveLocal = () => {
  localStorage.setItem(tripsKey, JSON.stringify(state.trips))
  localStorage.setItem(countriesKey, JSON.stringify(state.countries))
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers)

  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${apiUrl}${path}`, {
    credentials: 'include',
    ...init,
    headers
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Request failed.' })) as { error?: string }

    throw new Error(body.error ?? 'Request failed.')
  }

  return response.json() as Promise<T>
}

const countryOptions = () => countries.map(([code, name]) => `<option value="${code}" data-name="${name}">${name}</option>`).join('')

const formString = (data: FormData, key: string) => {
  const value = data.get(key)

  return typeof value === 'string' ? value : ''
}

const setLoginStatus = (message: string, tone: 'info' | 'error' | 'success' = 'info') => {
  const status = $('#status')

  if (!status) {
    return
  }

  status.textContent = message

  if (!message) {
    status.removeAttribute('data-tone')
  } else {
    status.dataset.tone = tone
  }
}

/** Partially mask email for on-screen confirmation after requesting a code. */
const maskEmailForDisplay = (email: string): string => {
  const trimmed = email.trim()
  const [localPart, domain] = trimmed.split('@')

  if (!domain || localPart === undefined) {
    return trimmed
  }

  if (localPart.length <= 1) {
    return `*@${domain}`
  }

  if (localPart.length === 2) {
    return `${localPart[0]}*@${domain}`
  }

  return `${localPart.slice(0, 2)}…@${domain}`
}

const leaveLoginCodeWaitState = (form: HTMLFormElement, options: { clearEmail: boolean, clearStatus?: boolean }) => {
  form.dataset.codeRequested = 'false'
  form.dataset.loginStep = 'email'
  delete form.dataset.pendingEmail
  $('#login-pending-banner')?.setAttribute('hidden', '')
  $('#login-change-email')?.setAttribute('hidden', '')
  $('#code-field')?.setAttribute('hidden', '')
  const emailInput = $('#login-email') as HTMLInputElement | null

  if (emailInput) {
    emailInput.readOnly = false

    if (options.clearEmail) {
      emailInput.value = ''
    }
  }

  const codeInput = $('#login-code') as HTMLInputElement | null

  if (codeInput) {
    codeInput.value = ''
    codeInput.required = false
  }

  const primary = $('#login-primary-btn')

  if (primary) {
    primary.textContent = 'Email me a code'
  }

  if (options.clearStatus !== false) {
    setLoginStatus('', 'info')
  }
}

const setTripFormStatus = (message: string, tone: 'ok' | 'error' = 'ok') => {
  const el = $('#trip-form-status')

  if (!el) {
    return
  }

  el.textContent = message

  if (!message) {
    el.removeAttribute('data-tone')
  } else {
    el.dataset.tone = tone
  }
}

const setHomeCountryFormStatus = (message: string, tone: 'ok' | 'error' = 'ok') => {
  const el = $('#home-country-form-status')

  if (!el) {
    return
  }

  el.textContent = message

  if (!message) {
    el.removeAttribute('data-tone')
  } else {
    el.dataset.tone = tone
  }
}

const getTripFormEls = () => ({
  open: $('#trip-open-ended') as HTMLInputElement | null,
  exit: $('#trip-exit') as HTMLInputElement | null,
  entry: $('#trip-entry') as HTMLInputElement | null
})

const syncExitMinFromEntry = () => {
  const { entry, exit } = getTripFormEls()

  if (!entry || !exit) {
    return
  }

  const v = entry.value

  if (v) {
    exit.min = v
  } else {
    exit.removeAttribute('min')
  }
}

const applyOpenEndedUi = (checked: boolean) => {
  const { exit } = getTripFormEls()

  if (!exit) {
    return
  }

  if (checked) {
    if (exit.value) {
      exit.dataset.lastExit = exit.value
    }

    exit.value = ''
    exit.disabled = true
    exit.removeAttribute('required')
  } else {
    exit.disabled = false
    exit.setAttribute('required', '')
    const last = exit.dataset.lastExit

    if (last) {
      exit.value = last
      delete exit.dataset.lastExit
    }
  }

  syncExitMinFromEntry()
}

const wireTripFormDates = () => {
  const { open, entry, exit } = getTripFormEls()

  open?.addEventListener('change', () => applyOpenEndedUi(open.checked))

  entry?.addEventListener('change', () => {
    syncExitMinFromEntry()

    if (exit && !exit.disabled && entry.value && exit.value && exit.value < entry.value) {
      exit.value = entry.value
    }
  })

  if (open?.checked) {
    applyOpenEndedUi(true)
  } else {
    syncExitMinFromEntry()
  }
}

const countryNameFor = (select: HTMLSelectElement) => select.selectedOptions[0]?.dataset.name ?? select.value

const currentWindow = () => {
  const windowMode = $('#window-mode')
  const mode = windowMode instanceof HTMLSelectElement ? windowMode.value : 'calendar-year'
  const today = new Date()
  const year = today.getFullYear()
  const startDate = mode === 'rolling-365' ? subDays(today, 364) : new Date(year, 0, 1)
  const endDate = mode === 'rolling-365' ? today : new Date(year, 11, 31)

  return {
    mode,
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd')
  }
}

const inclusiveDays = (startDate: string, endDate: string) => differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1
const formatDisplayDate = (date: string) => format(parseISO(date), 'MMM d, yyyy')

const overlapDays = (trip: Trip, startDate: string, endDate: string) => {
  const exitDate = trip.exitDate ?? format(new Date(), 'yyyy-MM-dd')
  const start = trip.entryDate > startDate ? trip.entryDate : startDate
  const end = exitDate < endDate ? exitDate : endDate

  return start > end ? 0 : inclusiveDays(start, end)
}

const summarizeLocal = () => {
  const window = currentWindow()
  const thresholds = new Map(state.countries.map(country => [country.countryCode, country]))
  const countryNames = new Map<string, string>()
  const counts = new Map<string, number>()

  for (const trip of state.trips) {
    countryNames.set(trip.countryCode, trip.countryName)
    counts.set(trip.countryCode, (counts.get(trip.countryCode) ?? 0) + overlapDays(trip, window.startDate, window.endDate))
  }

  for (const country of state.countries) {
    countryNames.set(country.countryCode, country.countryName)
    counts.set(country.countryCode, counts.get(country.countryCode) ?? 0)
  }

  state.summary = [...counts.entries()]
    .map(([countryCode, daysPresent]) => {
      const config = thresholds.get(countryCode)
      const thresholdDays = config?.thresholdDays ?? 183
      const warningDays = config?.warningDays ?? 14
      const daysRemaining = thresholdDays - daysPresent
      const exposureLevel: ExposureLevel = daysRemaining <= 0 ? 'exceeded' : daysRemaining <= warningDays ? 'warning' : 'ok'

      return {
        countryCode,
        countryName: countryNames.get(countryCode) ?? countryCode,
        daysPresent,
        daysRemaining,
        exposureLevel,
        thresholdDays,
        warningDays
      }
    })
    .sort((a, b) => b.daysPresent - a.daysPresent || a.countryName.localeCompare(b.countryName))

  state.windowLabel = `${formatDisplayDate(window.startDate)} to ${formatDisplayDate(window.endDate)}`
}

const renderAuth = () => {
  document.body.dataset.authenticated = String(state.authenticated)
  const syncState = $('#sync-state')

  if (syncState) {
    syncState.textContent = state.authenticated && state.userEmail
      ? `Synced to ${state.userEmail}`
      : 'Guest mode. Your data stays in this browser until you save it to an account.'
  }

  const form = $('#login-form') as HTMLFormElement | null
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

const renderSummary = () => {
  const target = $('#summary-list')

  if (!target) {
    return
  }

  $('#window-label')!.textContent = state.windowLabel

  if (state.summary.length === 0) {
    target.innerHTML = '<p class="muted empty-state">Add a trip to see your residency exposure instantly.</p>'

    return
  }

  target.innerHTML = state.summary.map(country => {
    const progress = Math.min(100, Math.round((country.daysPresent / country.thresholdDays) * 100))
    const statusText = country.daysRemaining <= 0
      ? `${Math.abs(country.daysRemaining)} days over threshold`
      : `${country.daysRemaining} days remaining`
    const flag = countryCodeToFlagEmoji(country.countryCode)
    const donutR = 15.5
    const donutC = 2 * Math.PI * donutR
    const dashOffset = donutC * (1 - progress / 100)

    return `<article class="country-card" data-level="${country.exposureLevel}">
      <div class="cc-top">
        <div class="cc-flag-wrap" aria-hidden="true"><span class="cc-flag">${flag}</span></div>
        <div class="cc-main">
          <div class="cc-header">
            <strong>${escapeHtml(country.countryName)}</strong>
            <span class="cc-code">${escapeHtml(country.countryCode)}</span>
          </div>
          <div class="cc-count-row">
            <svg class="cc-donut" width="44" height="44" viewBox="0 0 40 40" aria-hidden="true">
              <circle class="cc-donut-track" cx="20" cy="20" r="${String(donutR)}" fill="none" stroke-width="3.25" />
              <circle class="cc-donut-arc" cx="20" cy="20" r="${String(donutR)}" fill="none" stroke-width="3.25" stroke-linecap="round"
                stroke-dasharray="${String(donutC)}"
                stroke-dashoffset="${String(dashOffset)}"
                transform="rotate(-90 20 20)" />
            </svg>
            <div class="cc-count"><b>${country.daysPresent}</b><span>/ ${country.thresholdDays}</span></div>
          </div>
        </div>
      </div>
      <div class="meter" role="progressbar" aria-valuenow="${country.daysPresent}" aria-valuemin="0" aria-valuemax="${country.thresholdDays}"><i style="--w:${progress}%"></i></div>
      <p class="cc-status">${statusText}</p>
    </article>`
  }).join('')
}

const renderTrips = () => {
  const target = $('#trip-list')

  if (!target) {
    return
  }

  target.innerHTML = state.trips.length === 0
    ? '<p class="muted empty-state">No trips yet. Add your first stay or import a CSV.</p>'
    : state.trips
      .sort((a, b) => b.entryDate.localeCompare(a.entryDate))
      .map(trip => {
        const exitLabel = trip.exitDate ? formatDisplayDate(trip.exitDate) : 'present'
        const days = inclusiveDays(trip.entryDate, trip.exitDate ?? format(new Date(), 'yyyy-MM-dd'))
        const flag = countryCodeToFlagEmoji(trip.countryCode)

        return `<article class="row row-trip">
          <span class="row-accent"></span>
          <div class="row-body">
          <div class="row-info">
            <strong><span class="row-flag-wrap" aria-hidden="true"><span class="row-flag cc-flag">${flag}</span></span> ${escapeHtml(trip.countryName)}</strong>
            <div class="trip-dates" role="group" aria-label="Entry and exit dates">
              <time class="date-pill" datetime="${escapeHtml(trip.entryDate)}">${formatDisplayDate(trip.entryDate)}</time>
              <span class="trip-dates-arrow">→</span>
              ${trip.exitDate
            ? `<time class="date-pill" datetime="${escapeHtml(trip.exitDate)}">${exitLabel}</time>`
            : `<span class="date-pill date-pill--open" role="text">${exitLabel}</span>`}
            </div>
          </div>
          <div class="row-meta">
            <span class="trip-days">${days}d</span>
            <button class="icon-button" data-delete-trip="${escapeHtml(trip.id)}" title="Delete trip" aria-label="Delete trip">×</button>
          </div>
          </div>
        </article>`
      })
      .join('')
}

const renderHomeCountries = () => {
  const target = $('#home-country-list')

  if (!target) {
    return
  }

  target.innerHTML = state.countries.length === 0
    ? '<p class="muted empty-state">Track a country to customize its threshold and warning range.</p>'
    : state.countries.map(country => {
      const flag = countryCodeToFlagEmoji(country.countryCode)

      return `<article class="row row-tracked">
      <span class="row-accent"></span>
      <div class="row-body">
      <div class="row-info">
        <strong><span class="row-flag-wrap" aria-hidden="true"><span class="row-flag cc-flag">${flag}</span></span> ${escapeHtml(country.countryName)}</strong>
        <span>${country.thresholdDays}-day threshold · warning at ${country.warningDays} days left</span>
      </div>
      <div class="row-meta">
        <button class="icon-button" data-delete-country="${escapeHtml(country.id)}" title="Remove country" aria-label="Remove country">×</button>
      </div>
      </div>
    </article>`
    }).join('')
}

const renderAll = () => {
  summarizeLocal()
  renderAuth()
  renderSummary()
  renderTrips()
  renderHomeCountries()
}

const refreshRemote = async () => {
  const mode = currentWindow().mode
  const [tripsResponse, countriesResponse, summaryResponse] = await Promise.all([
    request<{ trips: Trip[] }>('/api/trips'),
    request<{ countries: HomeCountry[] }>('/api/home-countries'),
    request<{ countries: CountrySummary[], window: { startDate: string, endDate: string } }>(`/api/summary?mode=${mode}`)
  ])

  state.trips = tripsResponse.trips
  state.countries = countriesResponse.countries
  state.summary = summaryResponse.countries
  state.windowLabel = `${summaryResponse.window.startDate} to ${summaryResponse.window.endDate}`
  saveLocal()
  renderAuth()
  renderSummary()
  renderTrips()
  renderHomeCountries()
}

const syncLocalToAccount = async () => {
  for (const country of state.countries) {
    await request('/api/home-countries', {
      method: 'POST',
      body: JSON.stringify({
        countryCode: country.countryCode,
        countryName: country.countryName,
        thresholdDays: country.thresholdDays,
        warningDays: country.warningDays
      })
    })
  }

  for (const trip of state.trips) {
    await request('/api/trips', {
      method: 'POST',
      body: JSON.stringify({
        countryCode: trip.countryCode,
        countryName: trip.countryName,
        entryDate: trip.entryDate,
        exitDate: trip.exitDate,
        note: trip.note
      })
    })
  }

  await refreshRemote()
}

const requestCode = async (form: HTMLFormElement) => {
  const data = new FormData(form)
  const email = formString(data, 'email')
  setLoginStatus('Sending code…', 'info')

  const response = await request<{ devCode?: string }>('/api/auth/request-code', {
    method: 'POST',
    body: JSON.stringify({ email })
  })

  form.dataset.codeRequested = 'true'
  form.dataset.loginStep = 'code'
  form.dataset.pendingEmail = email
  $('#code-field')?.removeAttribute('hidden')
  $('#login-pending-banner')?.removeAttribute('hidden')
  $('#login-change-email')?.removeAttribute('hidden')

  const masked = $('#login-email-masked')

  if (masked) {
    masked.textContent = maskEmailForDisplay(email)
  }

  const emailInput = $('#login-email') as HTMLInputElement | null

  if (emailInput) {
    emailInput.readOnly = true
  }

  const codeInput = form.elements.namedItem('code')
  const primaryBtn = $('#login-primary-btn')

  if (codeInput instanceof HTMLInputElement) {
    codeInput.required = true
    codeInput.focus()
  }

  if (primaryBtn) {
    primaryBtn.textContent = 'Sign in and sync'
  }

  $('#login-card-sub')!.textContent = 'Enter the code from your email, then sign in to upload this browser’s trips.'

  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

  if (response.devCode) {
    setLoginStatus(`Dev mode: your code is ${response.devCode}`, 'success')
  } else {
    setLoginStatus('Code sent. Enter the digits below when they arrive.', 'success')
  }
}

const verifyCode = async (form: HTMLFormElement) => {
  const data = new FormData(form)
  setLoginStatus('Verifying code…', 'info')

  const response = await request<{ user: { email: string } }>('/api/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({
      email: data.get('email'),
      code: data.get('code')
    })
  })

  state.authenticated = true
  state.userEmail = response.user.email
  setLoginStatus('Saving trips and settings to your account…', 'info')
  await syncLocalToAccount()
  leaveLoginCodeWaitState(form, { clearEmail: false, clearStatus: false })
  setLoginStatus('Signed in. Your counter is synced.', 'success')
  $('#trip-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

const addTrip = async (form: HTMLFormElement) => {
  setTripFormStatus('', 'ok')
  const data = new FormData(form)
  const select = form.elements.namedItem('countryCode') as HTMLSelectElement
  const openEnded = data.get('openEnded') === 'on'
  const entryDate = formString(data, 'entryDate')
  const exitDateRaw = formString(data, 'exitDate')
  const validated = validateTripForm({ entryDate, exitDate: exitDateRaw, openEnded })

  if (!validated.ok) {
    setTripFormStatus(validated.error, 'error')
    return
  }

  setTripFormStatus('', 'ok')

  const trip: Trip = {
    id: `local_${crypto.randomUUID()}`,
    countryCode: formString(data, 'countryCode'),
    countryName: countryNameFor(select),
    entryDate,
    exitDate: validated.exitDate,
    note: formString(data, 'note') || null
  }

  if (state.authenticated) {
    await request('/api/trips', {
      method: 'POST',
      body: JSON.stringify({
        countryCode: trip.countryCode,
        countryName: trip.countryName,
        entryDate: trip.entryDate,
        exitDate: trip.exitDate,
        note: trip.note
      })
    })
    await refreshRemote()
  } else {
    state.trips.push(trip)
    saveLocal()
    renderAll()
  }

  form.reset()
  applyOpenEndedUi(false)
  syncExitMinFromEntry()

  if (validated.hint) {
    setTripFormStatus(validated.hint, 'ok')
  }
}

const addHomeCountry = async (form: HTMLFormElement) => {
  setHomeCountryFormStatus('', 'ok')
  const data = new FormData(form)
  const select = form.elements.namedItem('countryCode') as HTMLSelectElement
  const country: HomeCountry = {
    id: `local_${crypto.randomUUID()}`,
    countryCode: formString(data, 'countryCode'),
    countryName: countryNameFor(select),
    thresholdDays: Number(data.get('thresholdDays')),
    warningDays: Number(data.get('warningDays'))
  }

  if (state.authenticated) {
    await request('/api/home-countries', { method: 'POST', body: JSON.stringify(country) })
    await refreshRemote()
  } else {
    state.countries = state.countries.filter(item => item.countryCode !== country.countryCode)
    state.countries.push(country)
    saveLocal()
    renderAll()
  }

  form.reset()
}

const exportCsv = () => {
  const rows = [
    ['countryCode', 'countryName', 'entryDate', 'exitDate', 'note'],
    ...state.trips.map(trip => [trip.countryCode, trip.countryName, trip.entryDate, trip.exitDate ?? '', trip.note ?? ''])
  ]
  const csv = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
  const link = document.createElement('a')

  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  link.download = 'nomad-counter-trips.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

const importCsv = async (file: File) => {
  const text = await file.text()
  const [, ...lines] = text.trim().split(/\r?\n/)
  let imported = 0
  let skipped = 0

  for (const line of lines) {
    const [countryCode = '', countryName = '', entryDate = '', exitDate = '', note = ''] = line
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map(value => value.replace(/^"|"$/g, '').replaceAll('""', '"'))

    if (!countryCode || !countryName || !entryDate.trim()) {
      skipped++
      continue
    }

    const entryTrim = entryDate.trim()
    const exitTrim = exitDate.trim()
    const openEnded = exitTrim.length === 0
    const rowValidation = validateTripForm({
      entryDate: entryTrim,
      exitDate: exitTrim,
      openEnded
    })

    if (!rowValidation.ok) {
      skipped++
      continue
    }

    state.trips.push({
      id: `local_${crypto.randomUUID()}`,
      countryCode,
      countryName,
      entryDate: entryTrim,
      exitDate: rowValidation.exitDate,
      note: note || null
    })
    imported++
  }

  saveLocal()

  if (state.authenticated) {
    await syncLocalToAccount()
  } else {
    renderAll()
  }

  if (imported === 0 && skipped > 0) {
    setTripFormStatus('No valid trips imported. Check dates (exit on or after entry) and required columns.', 'error')
  } else if (skipped > 0) {
    setTripFormStatus(`Imported ${String(imported)} trip(s). Skipped ${String(skipped)} invalid row(s).`, 'ok')
  } else if (imported > 0) {
    setTripFormStatus(`Imported ${String(imported)} trip(s).`, 'ok')
  }
}

const boot = async () => {
  $$('#trip-country, #home-country').forEach(select => {
    select.innerHTML = countryOptions()
  })

  wireTripFormDates()

  state.trips = readLocal<Trip[]>(tripsKey, [])
  state.countries = readLocal<HomeCountry[]>(countriesKey, [])

  $('#login-form')?.addEventListener('submit', event => {
    event.preventDefault()

    if (state.authenticated) {
      return
    }

    const form = event.currentTarget as HTMLFormElement

    void (form.dataset.codeRequested === 'true' ? verifyCode(form) : requestCode(form))
      .catch(error => setLoginStatus(error.message, 'error'))
  })

  $('#login-sign-out')?.addEventListener('click', () => {
    void (async () => {
      try {
        await request('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) })
      } catch {
        // Still reset UI; session may clear on next full load.
      }

      state.authenticated = false
      state.userEmail = null
      const form = $('#login-form') as HTMLFormElement | null

      if (form) {
        leaveLoginCodeWaitState(form, { clearEmail: true })
      }

      setLoginStatus('', 'info')
      renderAll()
    })()
  })

  $('#login-change-email')?.addEventListener('click', () => {
    const form = $('#login-form') as HTMLFormElement | null

    if (!form) {
      return
    }

    leaveLoginCodeWaitState(form, { clearEmail: false })
    $('#login-card-sub')!.textContent = 'Enter your email when you want to sync trips across devices. We will send a one-time code — no password to remember.'
    const emailInput = $('#login-email') as HTMLInputElement | null

    emailInput?.focus()
    emailInput?.select()
  })

  $('#trip-form')?.addEventListener('submit', event => {
    event.preventDefault()
    void addTrip(event.currentTarget as HTMLFormElement).catch(error => setTripFormStatus(error.message, 'error'))
  })

  $('#home-country-form')?.addEventListener('submit', event => {
    event.preventDefault()
    void addHomeCountry(event.currentTarget as HTMLFormElement).catch(error => setHomeCountryFormStatus(error.message, 'error'))
  })

  $('#window-mode')?.addEventListener('change', () => {
    if (state.authenticated) {
      void refreshRemote().catch(error => setLoginStatus(error.message, 'error'))
    } else {
      renderAll()
    }
  })

  $('#export-csv')?.addEventListener('click', exportCsv)
  $('#import-csv')?.addEventListener('change', event => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0]

    if (file) {
      void importCsv(file).catch(error => setTripFormStatus(error.message, 'error'))
    }
  })

  document.addEventListener('click', event => {
    const target = event.target as HTMLElement
    const tripId = target.dataset.deleteTrip
    const countryId = target.dataset.deleteCountry

    if (tripId) {
      if (state.authenticated && !tripId.startsWith('local_')) {
        void request(`/api/trips/${tripId}`, { method: 'DELETE' }).then(refreshRemote).catch(error => setTripFormStatus(error.message, 'error'))
      } else {
        state.trips = state.trips.filter(trip => trip.id !== tripId)
        saveLocal()
        renderAll()
      }
    }

    if (countryId) {
      if (state.authenticated && !countryId.startsWith('local_')) {
        void request(`/api/home-countries/${countryId}`, { method: 'DELETE' }).then(refreshRemote).catch(error => setHomeCountryFormStatus(error.message, 'error'))
      } else {
        state.countries = state.countries.filter(country => country.id !== countryId)
        saveLocal()
        renderAll()
      }
    }
  })

  try {
    const response = await request<{ user: { email: string } }>('/api/auth/me')

    state.authenticated = true
    state.userEmail = response.user.email
    await refreshRemote()
  } catch {
    state.authenticated = false
    state.userEmail = null
    renderAll()
  }

  const revealElement = (el: HTMLElement) => {
    if (el.hasAttribute('data-stagger')) {
      const step = Number(el.dataset.stagger) || 60
      ;(Array.from(el.children) as HTMLElement[]).forEach((child, i) => {
        child.style.transitionDelay = `${i * step}ms`
        child.classList.add('is-visible')
      })
    } else {
      el.classList.add('is-visible')
    }

    scrollObserver.unobserve(el)
  }

  const scrollObserver = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) revealElement(entry.target as HTMLElement)
      }
    },
    { threshold: 0, rootMargin: '0px 0px -80px 0px' }
  )

  const observeAll = () => {
    document.querySelectorAll<HTMLElement>('[data-animate], [data-stagger]').forEach(el => scrollObserver.observe(el))
  }

  // Double-rAF: first frame sets data-scroll-reveal="ready" so CSS hides
  // elements; second frame observes so IO and CSS transitions fire correctly.
  document.documentElement.setAttribute('data-scroll-reveal', 'ready')
  requestAnimationFrame(() => { requestAnimationFrame(observeAll) })
}

void boot()
