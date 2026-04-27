/* eslint-disable @stylistic/operator-linebreak, @typescript-eslint/no-confusing-void-expression, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/use-unknown-in-catch-callback-variable */
import { format, parseISO } from 'date-fns'

import { countries } from './countries'

const apiUrl = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8787'

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
  windowLabel: string
}

const state: State = {
  authenticated: false,
  countries: [],
  trips: [],
  summary: [],
  windowLabel: 'Current calendar year'
}

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)
const $$ = <T extends HTMLElement>(selector: string) => [...document.querySelectorAll<T>(selector)]

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

const setStatus = (message: string, tone: 'ok' | 'error' = 'ok') => {
  const status = $('#status')

  if (status) {
    status.textContent = message
    status.dataset.tone = tone
  }
}

const countryNameFor = (select: HTMLSelectElement) => select.selectedOptions[0]?.dataset.name ?? select.value

const renderAuth = () => {
  document.body.dataset.authenticated = String(state.authenticated)
}

const renderSummary = () => {
  const target = $('#summary-list')

  if (!target) {
    return
  }

  $('#window-label')!.textContent = state.windowLabel

  if (state.summary.length === 0) {
    target.innerHTML = '<p class="muted">Add trips to see your residency exposure.</p>'

    return
  }

  target.innerHTML = state.summary.map(country => {
    const progress = Math.min(100, Math.round((country.daysPresent / country.thresholdDays) * 100))

    return `<article class="country-card" data-level="${country.exposureLevel}">
      <div>
        <strong>${country.countryName}</strong>
        <span>${country.countryCode}</span>
      </div>
      <p><b>${country.daysPresent}</b> / ${country.thresholdDays} days</p>
      <div class="meter"><i style="width:${progress}%"></i></div>
      <small>${country.daysRemaining <= 0 ? `${Math.abs(country.daysRemaining)} days over threshold` : `${country.daysRemaining} days remaining`}</small>
    </article>`
  }).join('')
}

const renderTrips = () => {
  const target = $('#trip-list')

  if (!target) {
    return
  }

  target.innerHTML = state.trips.length === 0
    ? '<p class="muted">No trips yet. Add your first stay or import a CSV.</p>'
    : state.trips
      .sort((a, b) => b.entryDate.localeCompare(a.entryDate))
      .map(trip => `<article class="row">
        <div>
          <strong>${trip.countryName}</strong>
          <span>${format(parseISO(trip.entryDate), 'MMM d, yyyy')} to ${trip.exitDate ? format(parseISO(trip.exitDate), 'MMM d, yyyy') : 'present'}</span>
        </div>
        <button class="icon-button" data-delete-trip="${trip.id}" title="Delete trip" aria-label="Delete trip">×</button>
      </article>`)
      .join('')
}

const renderHomeCountries = () => {
  const target = $('#home-country-list')

  if (!target) {
    return
  }

  target.innerHTML = state.countries.length === 0
    ? '<p class="muted">Track a country to customize its threshold and warning range.</p>'
    : state.countries.map(country => `<article class="row">
      <div>
        <strong>${country.countryName}</strong>
        <span>${country.thresholdDays}-day threshold · warning at ${country.warningDays} days left</span>
      </div>
      <button class="icon-button" data-delete-country="${country.id}" title="Remove country" aria-label="Remove country">×</button>
    </article>`).join('')
}

const refresh = async () => {
  const windowMode = $('#window-mode')
  const mode = windowMode instanceof HTMLSelectElement ? windowMode.value : 'calendar-year'
  const [tripsResponse, countriesResponse, summaryResponse] = await Promise.all([
    request<{ trips: Trip[] }>('/api/trips'),
    request<{ countries: HomeCountry[] }>('/api/home-countries'),
    request<{ countries: CountrySummary[], window: { mode: string, startDate: string, endDate: string } }>(`/api/summary?mode=${mode}`)
  ])

  state.trips = tripsResponse.trips
  state.countries = countriesResponse.countries
  state.summary = summaryResponse.countries
  state.windowLabel = `${summaryResponse.window.startDate} to ${summaryResponse.window.endDate}`
  renderSummary()
  renderTrips()
  renderHomeCountries()
}

const login = async (form: HTMLFormElement) => {
  const data = new FormData(form)

  await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: data.get('email'),
      accessCode: data.get('accessCode')
    })
  })

  state.authenticated = true
  renderAuth()
  setStatus('Signed in.')
  await refresh()
}

const addTrip = async (form: HTMLFormElement) => {
  const data = new FormData(form)
  const select = form.elements.namedItem('countryCode') as HTMLSelectElement

  await request('/api/trips', {
    method: 'POST',
    body: JSON.stringify({
      countryCode: data.get('countryCode'),
      countryName: countryNameFor(select),
      entryDate: data.get('entryDate'),
      exitDate: data.get('openEnded') === 'on' ? null : data.get('exitDate'),
      note: data.get('note') || null
    })
  })

  form.reset()
  await refresh()
}

const addHomeCountry = async (form: HTMLFormElement) => {
  const data = new FormData(form)
  const select = form.elements.namedItem('countryCode') as HTMLSelectElement

  await request('/api/home-countries', {
    method: 'POST',
    body: JSON.stringify({
      countryCode: data.get('countryCode'),
      countryName: countryNameFor(select),
      thresholdDays: Number(data.get('thresholdDays')),
      warningDays: Number(data.get('warningDays'))
    })
  })

  form.reset()
  await refresh()
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

  for (const line of lines) {
    const [countryCode = '', countryName = '', entryDate = '', exitDate = '', note = ''] = line
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map(value => value.replace(/^"|"$/g, '').replaceAll('""', '"'))

    if (countryCode && countryName && entryDate) {
      await request('/api/trips', {
        method: 'POST',
        body: JSON.stringify({ countryCode, countryName, entryDate, exitDate: exitDate || null, note: note || null })
      })
    }
  }

  await refresh()
}

const boot = async () => {
  $$('#trip-country, #home-country').forEach(select => {
    select.innerHTML = countryOptions()
  })

  try {
    await request('/api/auth/me')
    state.authenticated = true
    renderAuth()
    await refresh()
  } catch {
    state.authenticated = false
    renderAuth()
  }

  $('#login-form')?.addEventListener('submit', event => {
    event.preventDefault()
    void login(event.currentTarget as HTMLFormElement).catch(error => setStatus(error.message, 'error'))
  })

  $('#trip-form')?.addEventListener('submit', event => {
    event.preventDefault()
    void addTrip(event.currentTarget as HTMLFormElement).catch(error => setStatus(error.message, 'error'))
  })

  $('#home-country-form')?.addEventListener('submit', event => {
    event.preventDefault()
    void addHomeCountry(event.currentTarget as HTMLFormElement).catch(error => setStatus(error.message, 'error'))
  })

  $('#window-mode')?.addEventListener('change', () => void refresh().catch(error => setStatus(error.message, 'error')))
  $('#export-csv')?.addEventListener('click', exportCsv)
  $('#import-csv')?.addEventListener('change', event => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0]

    if (file) {
      void importCsv(file).catch(error => setStatus(error.message, 'error'))
    }
  })

  document.addEventListener('click', event => {
    const target = event.target as HTMLElement
    const tripId = target.dataset.deleteTrip
    const countryId = target.dataset.deleteCountry

    if (tripId) {
      void request(`/api/trips/${tripId}`, { method: 'DELETE' }).then(refresh).catch(error => setStatus(error.message, 'error'))
    }

    if (countryId) {
      void request(`/api/home-countries/${countryId}`, { method: 'DELETE' }).then(refresh).catch(error => setStatus(error.message, 'error'))
    }
  })
}

void boot()
