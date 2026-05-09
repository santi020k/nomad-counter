import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

import { request } from '../../lib/app/apiClient'
import { exportCsv, importCsv } from '../../lib/app/csv'
import { summarizeLocal } from '../../lib/app/dateMath'
import { getMessages, type Locale } from '../../lib/app/i18n'
import { saveLocalState } from '../../lib/app/localStore'
import { refreshRemote, syncLocalToAccount } from '../../lib/app/remoteSync'
import type { HomeCountry, PendingConfirmAction, State, Trip } from '../../lib/app/types'
import { getSnapshot, initStoreFromLocal, setState, subscribe } from '../../lib/store'

interface ConfirmState {
  open: boolean
  title: string
  description: string
  action: PendingConfirmAction | null
}

interface TripInput {
  countryCode: string
  countryName: string
  entryDate: string
  exitDate: string | null
  note: string | null
}

type CountryInput = Omit<HomeCountry, 'id'>

const closedConfirm: ConfirmState = { open: false, title: '', description: '', action: null }

function refreshLocalSummary(state: State, trips = state.trips, countries = state.countries, windowMode = state.windowMode) {
  const local = summarizeLocal(trips, countries, windowMode)
  setState(prev => ({ ...prev, summary: local.summary, windowLabel: local.windowLabel }))
}

function persistLocalState(trips: Trip[], countries: HomeCountry[], windowMode: State['windowMode']) {
  saveLocalState(trips, countries)
  const local = summarizeLocal(trips, countries, windowMode)
  setState(prev => ({ ...prev, summary: local.summary, windowLabel: local.windowLabel }))
}

function useScrollReveal() {
  useEffect(() => {
    document.documentElement.setAttribute('data-scroll-reveal', 'ready')
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          if (el.hasAttribute('data-stagger')) {
            const step = Number(el.dataset.stagger) || 60
            ;(Array.from(el.children) as HTMLElement[]).forEach((child, i) => {
              child.style.transitionDelay = `${String(i * step)}ms`
              child.classList.add('is-visible')
            })
          } else {
            el.classList.add('is-visible')
          }
          observer.unobserve(el)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -80px 0px' }
    )
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('[data-animate], [data-stagger]').forEach(el => { observer.observe(el) })
      })
    })
    return () => { observer.disconnect() }
  }, [])
}

function useInitialSync() {
  useEffect(() => {
    initStoreFromLocal()

    request<{ user: { email: string } }>('/api/auth/me')
      .then(res => {
        setState(prev => ({ ...prev, authenticated: true, userEmail: res.user.email }))
        return refreshRemote()
      })
      .catch(() => {
        setState(prev => ({ ...prev, authenticated: false, userEmail: null }))
      })
  }, [])
}

export function useCounterWorkspace() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const [confirm, setConfirm] = useState<ConfirmState>(closedConfirm)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [tripFormStatus, setTripFormStatus] = useState('')
  const messages = getMessages(state.locale)

  useInitialSync()
  useScrollReveal()

  // Sync locale when the navbar LocaleToggle fires the custom event
  useEffect(() => {
    const handler = (e: Event) => {
      const locale = (e as CustomEvent<Locale>).detail
      setState(prev => ({ ...prev, locale }))
    }
    window.addEventListener('nomad-counter:locale-change', handler)
    return () => { window.removeEventListener('nomad-counter:locale-change', handler) }
  }, [])

  const openConfirm = useCallback((title: string, description: string, action: PendingConfirmAction) => {
    setConfirm({ open: true, title, description, action })
  }, [])

  const closeConfirm = useCallback(() => {
    setConfirm(prev => ({ ...prev, open: false, action: null }))
  }, [])

  const handleWindowChange = useCallback(async (mode: string) => {
    const windowMode = mode as State['windowMode']
    setState(prev => ({ ...prev, windowMode }))
    if (getSnapshot().authenticated) {
      await refreshRemote()
    } else {
      const s = getSnapshot()
      refreshLocalSummary(s, s.trips, s.countries, windowMode)
    }
  }, [])

  const handleAddTrip = useCallback(async (input: TripInput) => {
    const trip: Trip = { id: `local_${crypto.randomUUID()}`, ...input }
    const s = getSnapshot()
    if (s.authenticated) {
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
      return
    }

    const newTrips = [...s.trips, trip]
    setState(prev => ({ ...prev, trips: newTrips }))
    persistLocalState(newTrips, s.countries, s.windowMode)
  }, [])

  const handleEditTrip = useCallback((tripId: string) => {
    const trip = getSnapshot().trips.find(t => t.id === tripId)
    if (!trip) return
    setEditingTrip(trip)
    document.querySelector('#trip-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingTrip(null)
  }, [])

  const handleUpdateTrip = useCallback(async (input: TripInput) => {
    const current = editingTrip
    if (!current) return

    const s = getSnapshot()
    if (s.authenticated && !current.id.startsWith('local_')) {
      await request(`/api/trips/${current.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          countryCode: input.countryCode,
          countryName: input.countryName,
          entryDate: input.entryDate,
          exitDate: input.exitDate,
          note: input.note
        })
      })
      setEditingTrip(null)
      await refreshRemote()
      return
    }

    const newTrips = s.trips.map(trip => trip.id === current.id ? { ...trip, ...input } : trip)
    setState(prev => ({ ...prev, trips: newTrips }))
    setEditingTrip(null)
    persistLocalState(newTrips, s.countries, s.windowMode)
  }, [editingTrip])

  const handleAddCountry = useCallback(async (input: CountryInput) => {
    const country: HomeCountry = { id: `local_${crypto.randomUUID()}`, ...input }
    const s = getSnapshot()
    if (s.authenticated) {
      await request('/api/home-countries', { method: 'POST', body: JSON.stringify(input) })
      await refreshRemote()
      return
    }

    const newCountries = [...s.countries.filter(c => c.countryCode !== country.countryCode), country]
    setState(prev => ({ ...prev, countries: newCountries }))
    persistLocalState(s.trips, newCountries, s.windowMode)
  }, [])

  const handleRemoveTrip = useCallback((tripId: string) => {
    const trip = getSnapshot().trips.find(t => t.id === tripId)
    if (!trip) return
    const exitLabel = trip.exitDate ?? 'present'
    openConfirm(
      messages.removeTrip,
      messages.removeTripConfirm(trip.entryDate, exitLabel, trip.countryName),
      { kind: 'trip', tripId }
    )
  }, [messages, openConfirm])

  const handleRemoveSummaryCountry = useCallback((countryCode: string) => {
    const s = getSnapshot()
    const name = s.summary.find(r => r.countryCode === countryCode)?.countryName ?? countryCode
    const tripCount = s.trips.filter(t => t.countryCode === countryCode).length
    const hasTracked = s.countries.some(c => c.countryCode === countryCode)
    const desc = hasTracked && tripCount > 0 ?
      messages.deleteCountryTrips(name, tripCount) :
      hasTracked ?
        messages.stopTrackingSummary(name) :
        messages.deleteCountryTripsOnly(name, tripCount)

    openConfirm(messages.removeFromDashboard, desc, { kind: 'summary-country', countryCode })
  }, [messages, openConfirm])

  const handleRemoveTrackedCountry = useCallback((countryId: string) => {
    const country = getSnapshot().countries.find(c => c.id === countryId)
    if (!country) return
    openConfirm(
      messages.stopTracking,
      messages.stopTrackingConfirm(country.countryName),
      { kind: 'tracked-country', countryId }
    )
  }, [messages, openConfirm])

  const handleConfirm = useCallback(async () => {
    const { action } = confirm
    if (!action) return
    closeConfirm()

    const s = getSnapshot()
    try {
      if (action.kind === 'trip') {
        if (editingTrip?.id === action.tripId) {
          setEditingTrip(null)
        }
        if (s.authenticated && !action.tripId.startsWith('local_')) {
          await request(`/api/trips/${action.tripId}`, { method: 'DELETE' })
          await refreshRemote()
        } else {
          const newTrips = s.trips.filter(t => t.id !== action.tripId)
          setState(prev => ({ ...prev, trips: newTrips }))
          persistLocalState(newTrips, s.countries, s.windowMode)
        }
      } else if (action.kind === 'tracked-country') {
        if (s.authenticated && !action.countryId.startsWith('local_')) {
          await request(`/api/home-countries/${action.countryId}`, { method: 'DELETE' })
          await refreshRemote()
        } else {
          const newCountries = s.countries.filter(c => c.id !== action.countryId)
          setState(prev => ({ ...prev, countries: newCountries }))
          persistLocalState(s.trips, newCountries, s.windowMode)
        }
      } else {
        const { countryCode } = action
        if (s.authenticated) {
          await Promise.all(
            s.trips.filter(t => t.countryCode === countryCode && !t.id.startsWith('local_'))
              .map(t => request(`/api/trips/${t.id}`, { method: 'DELETE' }))
          )
          const tracked = s.countries.find(c => c.countryCode === countryCode)
          if (tracked && !tracked.id.startsWith('local_')) {
            await request(`/api/home-countries/${tracked.id}`, { method: 'DELETE' })
          }
          await refreshRemote()
        } else {
          const newTrips = s.trips.filter(t => t.countryCode !== countryCode)
          const newCountries = s.countries.filter(c => c.countryCode !== countryCode)
          setState(prev => ({ ...prev, trips: newTrips, countries: newCountries }))
          persistLocalState(newTrips, newCountries, s.windowMode)
        }
      }
    } catch (err) {
      setTripFormStatus(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }, [closeConfirm, confirm, editingTrip])

  const handleExportCsv = useCallback(() => { exportCsv() }, [])

  const handleImportCsv = useCallback(async (file: File) => {
    const result = await importCsv(file, { syncLocalToAccount })
    const [tone, msg] = result.split(':') as [string, string]
    if (msg) setTripFormStatus(`${tone === 'error' ? 'Warning: ' : ''}${msg}`)
  }, [])

  return {
    confirm,
    editingTrip,
    handleCancelEdit,
    state,
    messages,
    tripFormStatus,
    closeConfirm,
    handleAddCountry,
    handleAddTrip,
    handleEditTrip,
    handleConfirm,
    handleExportCsv,
    handleImportCsv,
    handleRemoveSummaryCountry,
    handleRemoveTrackedCountry,
    handleRemoveTrip,
    handleUpdateTrip,
    handleWindowChange
  }
}
