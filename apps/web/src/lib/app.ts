import { request } from './app/apiClient'
import { requestCode, verifyCode } from './app/authFlow'
import { leaveLoginCodeWaitState } from './app/authUi'
import { initConfirmActions } from './app/confirmActions'
import { countryNameFor, countryOptions, initCountryComboboxes, syncCountryComboFromSelect } from './app/countryCombobox'
import { exportCsv, importCsv } from './app/csv'
import { summarizeLocal } from './app/dateMath'
import { $, $$, errorMessage, formString } from './app/dom'
import { setHomeCountryFormStatus, setLoginStatus, setTripFormStatus } from './app/formStatus'
import { readLocalCountries, readLocalTrips, saveLocalState } from './app/localStore'
import { refreshRemote, renderSyncedState, syncLocalToAccount } from './app/remoteSync'
import { initScrollReveal } from './app/scrollReveal'
import { applyOpenEndedUi, initDateShellPickers, syncExitMinFromEntry, wireTripFormDates } from './app/tripDates'
import type { HomeCountry, State, Trip } from './app/types'
import { validateTripForm } from './tripForm'

const state: State = {
  authenticated: false,
  countries: [],
  trips: [],
  summary: [],
  userEmail: null,
  windowLabel: 'Current calendar year'
}

const renderAll = () => {
  const localSummary = summarizeLocal(state.trips, state.countries)

  state.summary = localSummary.summary

  state.windowLabel = localSummary.windowLabel

  renderSyncedState(state)
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

    await refreshRemote(state)
  } else {
    state.trips.push(trip)

    saveLocalState(state.trips, state.countries)

    renderAll()
  }

  form.reset()

  syncCountryComboFromSelect('trip-country')

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

    await refreshRemote(state)
  } else {
    state.countries = state.countries.filter(item => item.countryCode !== country.countryCode)

    state.countries.push(country)

    saveLocalState(state.trips, state.countries)

    renderAll()
  }

  form.reset()

  syncCountryComboFromSelect('home-country')
}

const boot = async () => {
  $$('#trip-country, #home-country').forEach(select => {
    select.innerHTML = countryOptions()
  })

  initCountryComboboxes()

  wireTripFormDates()

  initDateShellPickers()

  initConfirmActions(state, {
    refreshRemote: () => refreshRemote(state),
    renderAll
  })

  state.trips = readLocalTrips()

  state.countries = readLocalCountries()

  $('#login-form')?.addEventListener('submit', event => {
    event.preventDefault()

    if (state.authenticated) {
      return
    }

    const form = event.currentTarget as HTMLFormElement

    void (form.dataset.codeRequested === 'true' ? verifyCode(form, state, () => syncLocalToAccount(state)) : requestCode(form))
      .catch((error: unknown) => {
        setLoginStatus(errorMessage(error), 'error')
      })
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

      const form = $<HTMLFormElement>('#login-form')

      if (form) {
        leaveLoginCodeWaitState(form, { clearEmail: true })
      }

      setLoginStatus('', 'info')

      renderAll()
    })()
  })

  $('#login-change-email')?.addEventListener('click', () => {
    const form = $<HTMLFormElement>('#login-form')

    if (!form) {
      return
    }

    leaveLoginCodeWaitState(form, { clearEmail: false })

    $('#login-card-sub')!.textContent = 'Enter your email when you want to sync trips across devices. We will send a one-time code — no password to remember.'

    const emailInput = $<HTMLInputElement>('#login-email')

    emailInput?.focus()

    emailInput?.select()
  })

  $('#trip-form')?.addEventListener('submit', event => {
    event.preventDefault()

    void addTrip(event.currentTarget as HTMLFormElement).catch((error: unknown) => {
      setTripFormStatus(errorMessage(error), 'error')
    })
  })

  $('#home-country-form')?.addEventListener('submit', event => {
    event.preventDefault()

    void addHomeCountry(event.currentTarget as HTMLFormElement).catch((error: unknown) => {
      setHomeCountryFormStatus(errorMessage(error), 'error')
    })
  })

  $('#window-mode')?.addEventListener('change', () => {
    if (state.authenticated) {
      void refreshRemote(state).catch((error: unknown) => {
        setLoginStatus(errorMessage(error), 'error')
      })
    } else {
      renderAll()
    }
  })

  $('#export-csv')?.addEventListener('click', () => {
    exportCsv(state)
  })

  $('#import-csv')?.addEventListener('change', event => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0]

    if (file) {
      void importCsv(state, file, { renderAll, syncLocalToAccount: () => syncLocalToAccount(state) }).catch((error: unknown) => {
        setTripFormStatus(errorMessage(error), 'error')
      })
    }
  })

  try {
    const response = await request<{ user: { email: string } }>('/api/auth/me')

    state.authenticated = true

    state.userEmail = response.user.email

    await refreshRemote(state)
  } catch {
    state.authenticated = false

    state.userEmail = null

    renderAll()
  }

  initScrollReveal()
}

void boot()
