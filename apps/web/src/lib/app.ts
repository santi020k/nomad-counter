import { request } from './app/apiClient'
import { leaveLoginCodeWaitState } from './app/authUi'
import { requestCode, verifyCode } from './app/authFlow'
import { countryNameFor, countryOptions, initCountryComboboxes, syncCountryComboFromSelect } from './app/countryCombobox'
import { formatDisplayDate, summarizeLocal } from './app/dateMath'
import { $, $, errorMessage, formString } from './app/dom'
import { exportCsv, importCsv } from './app/csv'
import { setHomeCountryFormStatus, setLoginStatus, setTripFormStatus } from './app/formStatus'
import { readLocalCountries, readLocalTrips, saveLocalState } from './app/localStore'
import { renderSyncedState, refreshRemote, syncLocalToAccount } from './app/remoteSync'
import { initScrollReveal } from './app/scrollReveal'
import { applyOpenEndedUi, initDateShellPickers, syncExitMinFromEntry, wireTripFormDates } from './app/tripDates'
import type { CountrySummary, HomeCountry, PendingConfirmAction, State, Trip } from './app/types'
import { validateTripForm } from './tripForm'

const state: State = {
  authenticated: false,
  countries: [],
  trips: [],
  summary: [],
  userEmail: null,
  windowLabel: 'Current calendar year'
}

let pendingConfirmAction: PendingConfirmAction | null = null
const getConfirmDialog = () => $<HTMLDialogElement>('#confirm-action-dialog')

const setConfirmDialogContent = (title: string, description: string) => {
  const titleEl = $('#confirm-action-dialog-title')
  const descEl = $('#confirm-action-dialog-desc')

  if (titleEl) {
    titleEl.textContent = title
  }

  if (descEl) {
    descEl.textContent = description
  }
}

const closeAllCcActionMenus = () => {
  $$('[data-cc-menu-for]').forEach(el => {
    el.setAttribute('hidden', '')
  })

  $$('[data-cc-actions]').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false')
  })
}

const openConfirmDialog = (title: string, description: string, action: PendingConfirmAction) => {
  pendingConfirmAction = action

  closeAllCcActionMenus()

  setConfirmDialogContent(title, description)

  getConfirmDialog()?.showModal()
}

const summaryRemoveDialogMessage = (countryCode: string) => {
  const name = state.summary.find(row => row.countryCode === countryCode)?.countryName ?? countryCode
  const tripCount = state.trips.filter(trip => trip.countryCode === countryCode).length
  const hasTracked = state.countries.some(country => country.countryCode === countryCode)

  if (hasTracked && tripCount > 0) {
    return `This will stop tracking ${name} and delete all ${String(tripCount)} trip${tripCount === 1 ? '' : 's'} for this country from your travel log. You cannot undo this.`
  }

  if (hasTracked) {
    return `This will stop tracking ${name} and remove its custom threshold from your settings. You cannot undo this.`
  }

  return `This will delete all ${String(tripCount)} trip${tripCount === 1 ? '' : 's'} to ${name} from your travel log. You cannot undo this.`
}

const openSummaryRemoveDialog = (countryCode: string) => {
  openConfirmDialog('Remove from dashboard', summaryRemoveDialogMessage(countryCode), {
    kind: 'summary-country',
    countryCode
  })
}

const tripRemoveDialogMessage = (trip: Trip) => {
  const exitLabel = trip.exitDate ? formatDisplayDate(trip.exitDate) : 'present'
  const entryLabel = formatDisplayDate(trip.entryDate)

  return `Remove this stay (${entryLabel} → ${exitLabel}) for ${trip.countryName}? You cannot undo this.`
}

const openTripRemoveDialog = (tripId: string) => {
  const trip = state.trips.find(row => row.id === tripId)

  if (!trip) {
    return
  }

  openConfirmDialog('Remove trip', tripRemoveDialogMessage(trip), { kind: 'trip', tripId })
}

const trackedCountryRemoveMessage = (country: HomeCountry) => `Stop tracking ${country.countryName}? Its custom threshold and warning settings will be removed. Trips in your travel log are not deleted. You cannot undo this.`

const openTrackedCountryRemoveDialog = (countryId: string) => {
  const country = state.countries.find(row => row.id === countryId)

  if (!country) {
    return
  }

  openConfirmDialog('Stop tracking country', trackedCountryRemoveMessage(country), {
    kind: 'tracked-country',
    countryId
  })
}

const removeTrackedCountryById = async (countryId: string) => {
  const dialog = getConfirmDialog()

  try {
    if (state.authenticated && !countryId.startsWith('local_')) {
      await request(`/api/home-countries/${countryId}`, { method: 'DELETE' })

      await refreshRemote(state)
    } else {
      state.countries = state.countries.filter(country => country.id !== countryId)

      saveLocalState(state.trips, state.countries)

      renderAll()
    }

    dialog?.close()

    pendingConfirmAction = null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong.'

    setHomeCountryFormStatus(message, 'error')
  }
}

const removeTripById = async (tripId: string) => {
  const dialog = getConfirmDialog()

  try {
    if (state.authenticated && !tripId.startsWith('local_')) {
      await request(`/api/trips/${tripId}`, { method: 'DELETE' })

      await refreshRemote(state)
    } else {
      state.trips = state.trips.filter(trip => trip.id !== tripId)

      saveLocalState(state.trips, state.countries)

      renderAll()
    }

    dialog?.close()

    pendingConfirmAction = null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong.'

    setTripFormStatus(message, 'error')
  }
}

const removeCountryFromDashboard = async (countryCode: string) => {
  const dialog = getConfirmDialog()
  const tripsForCountry = state.trips.filter(trip => trip.countryCode === countryCode)
  const tracked = state.countries.find(country => country.countryCode === countryCode)

  try {
    if (state.authenticated) {
      await Promise.all(
        tripsForCountry
          .filter(trip => !trip.id.startsWith('local_'))
          .map(trip => request(`/api/trips/${trip.id}`, { method: 'DELETE' }))
      )

      if (tracked && !tracked.id.startsWith('local_')) {
        await request(`/api/home-countries/${tracked.id}`, { method: 'DELETE' })
      }

      await refreshRemote(state)
    } else {
      state.trips = state.trips.filter(trip => trip.countryCode !== countryCode)

      state.countries = state.countries.filter(country => country.countryCode !== countryCode)

      saveLocalState(state.trips, state.countries)

      renderAll()
    }

    dialog?.close()

    pendingConfirmAction = null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong.'

    setTripFormStatus(message, 'error')

    setHomeCountryFormStatus(message, 'error')
  }
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

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeAllCcActionMenus()
    }
  })

  getConfirmDialog()?.addEventListener('close', () => {
    pendingConfirmAction = null
  })

  document.addEventListener('click', event => {
    const target = event.target as HTMLElement

    if (target.closest('#confirm-action-cancel')) {
      getConfirmDialog()?.close()

      return
    }

    if (target.closest('#confirm-action-confirm')) {
      event.preventDefault()

      const action = pendingConfirmAction

      if (action?.kind === 'summary-country') {
        void removeCountryFromDashboard(action.countryCode)
      } else if (action?.kind === 'trip') {
        void removeTripById(action.tripId)
      } else if (action?.kind === 'tracked-country') {
        void removeTrackedCountryById(action.countryId)
      }

      return
    }

    const openTrackedRemove = target.closest<HTMLElement>('[data-open-tracked-remove]')

    if (openTrackedRemove?.dataset.openTrackedRemove) {
      event.preventDefault()

      openTrackedCountryRemoveDialog(openTrackedRemove.dataset.openTrackedRemove)

      return
    }

    const openTripRemove = target.closest<HTMLElement>('[data-open-trip-remove]')

    if (openTripRemove?.dataset.openTripRemove) {
      event.preventDefault()

      openTripRemoveDialog(openTripRemove.dataset.openTripRemove)

      return
    }

    const openSummaryRemove = target.closest<HTMLElement>('[data-open-summary-remove]')

    if (openSummaryRemove?.dataset.openSummaryRemove) {
      event.preventDefault()

      openSummaryRemoveDialog(openSummaryRemove.dataset.openSummaryRemove)

      return
    }

    const ccActionsBtn = target.closest<HTMLElement>('[data-cc-actions]')

    if (ccActionsBtn?.dataset.ccActions) {
      event.preventDefault()

      const code = ccActionsBtn.dataset.ccActions
      const menu = document.querySelector(`[data-cc-menu-for="${code}"]`)
      const wasOpen = menu && !menu.hasAttribute('hidden')

      closeAllCcActionMenus()

      if (wasOpen) {
        return
      }

      if (menu) {
        menu.removeAttribute('hidden')

        ccActionsBtn.setAttribute('aria-expanded', 'true')
      }

      return
    }

    if (!target.closest('.cc-actions')) {
      closeAllCcActionMenus()
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
