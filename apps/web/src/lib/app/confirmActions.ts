import { request } from './apiClient'
import { formatDisplayDate } from './dateMath'
import { $, $$ } from './dom'
import { setHomeCountryFormStatus, setTripFormStatus } from './formStatus'
import { saveLocalState } from './localStore'
import type { HomeCountry, PendingConfirmAction, State, Trip } from './types'

interface ConfirmActionOptions {
  refreshRemote: () => Promise<void>
  renderAll: () => void
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

const summaryRemoveDialogMessage = (state: State, countryCode: string) => {
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

const tripRemoveDialogMessage = (trip: Trip) => {
  const exitLabel = trip.exitDate ? formatDisplayDate(trip.exitDate) : 'present'
  const entryLabel = formatDisplayDate(trip.entryDate)

  return `Remove this stay (${entryLabel} → ${exitLabel}) for ${trip.countryName}? You cannot undo this.`
}

const trackedCountryRemoveMessage = (country: HomeCountry) =>
  `Stop tracking ${country.countryName}? Its custom threshold and warning settings will be removed. Trips in your travel log are not deleted. You cannot undo this.`

const removeTrackedCountryById = async (state: State, countryId: string, options: ConfirmActionOptions) => {
  const dialog = getConfirmDialog()

  try {
    if (state.authenticated && !countryId.startsWith('local_')) {
      await request(`/api/home-countries/${countryId}`, { method: 'DELETE' })
      await options.refreshRemote()
    } else {
      state.countries = state.countries.filter(country => country.id !== countryId)
      saveLocalState(state.trips, state.countries)
      options.renderAll()
    }

    dialog?.close()
    pendingConfirmAction = null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong.'
    setHomeCountryFormStatus(message, 'error')
  }
}

const removeTripById = async (state: State, tripId: string, options: ConfirmActionOptions) => {
  const dialog = getConfirmDialog()

  try {
    if (state.authenticated && !tripId.startsWith('local_')) {
      await request(`/api/trips/${tripId}`, { method: 'DELETE' })
      await options.refreshRemote()
    } else {
      state.trips = state.trips.filter(trip => trip.id !== tripId)
      saveLocalState(state.trips, state.countries)
      options.renderAll()
    }

    dialog?.close()
    pendingConfirmAction = null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong.'
    setTripFormStatus(message, 'error')
  }
}

const removeCountryFromDashboard = async (state: State, countryCode: string, options: ConfirmActionOptions) => {
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

      await options.refreshRemote()
    } else {
      state.trips = state.trips.filter(trip => trip.countryCode !== countryCode)
      state.countries = state.countries.filter(country => country.countryCode !== countryCode)
      saveLocalState(state.trips, state.countries)
      options.renderAll()
    }

    dialog?.close()
    pendingConfirmAction = null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong.'
    setTripFormStatus(message, 'error')
    setHomeCountryFormStatus(message, 'error')
  }
}

export const initConfirmActions = (state: State, options: ConfirmActionOptions) => {
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
        void removeCountryFromDashboard(state, action.countryCode, options)
      } else if (action?.kind === 'trip') {
        void removeTripById(state, action.tripId, options)
      } else if (action?.kind === 'tracked-country') {
        void removeTrackedCountryById(state, action.countryId, options)
      }

      return
    }

    const openTrackedRemove = target.closest<HTMLElement>('[data-open-tracked-remove]')

    if (openTrackedRemove?.dataset.openTrackedRemove) {
      event.preventDefault()
      const country = state.countries.find(row => row.id === openTrackedRemove.dataset.openTrackedRemove)

      if (country) {
        openConfirmDialog('Stop tracking country', trackedCountryRemoveMessage(country), {
          kind: 'tracked-country',
          countryId: country.id
        })
      }

      return
    }

    const openTripRemove = target.closest<HTMLElement>('[data-open-trip-remove]')

    if (openTripRemove?.dataset.openTripRemove) {
      event.preventDefault()
      const trip = state.trips.find(row => row.id === openTripRemove.dataset.openTripRemove)

      if (trip) {
        openConfirmDialog('Remove trip', tripRemoveDialogMessage(trip), {
          kind: 'trip',
          tripId: trip.id
        })
      }

      return
    }

    const openSummaryRemove = target.closest<HTMLElement>('[data-open-summary-remove]')

    if (openSummaryRemove?.dataset.openSummaryRemove) {
      event.preventDefault()
      const countryCode = openSummaryRemove.dataset.openSummaryRemove

      openConfirmDialog('Remove from dashboard', summaryRemoveDialogMessage(state, countryCode), {
        kind: 'summary-country',
        countryCode
      })

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
}
