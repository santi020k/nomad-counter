import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

import { request } from '../../lib/app/apiClient'
import { exportCsv, importCsv } from '../../lib/app/csv'
import { summarizeLocal } from '../../lib/app/dateMath'
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
  const [tripFormStatus, setTripFormStatus] = useState('')

  useInitialSync()
  useScrollReveal()

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
      'Remove trip',
      `Remove this stay (${trip.entryDate} -> ${exitLabel}) for ${trip.countryName}? You cannot undo this.`,
      { kind: 'trip', tripId }
    )
  }, [openConfirm])

  const handleRemoveSummaryCountry = useCallback((countryCode: string) => {
    const s = getSnapshot()
    const name = s.summary.find(r => r.countryCode === countryCode)?.countryName ?? countryCode
    const tripCount = s.trips.filter(t => t.countryCode === countryCode).length
    const hasTracked = s.countries.some(c => c.countryCode === countryCode)
    const desc = hasTracked && tripCount > 0 ?
      `This will stop tracking ${name} and delete all ${String(tripCount)} trip${tripCount === 1 ? '' : 's'} for this country from your travel log. You cannot undo this.` :
      hasTracked ?
        `This will stop tracking ${name} and remove its custom threshold from your settings. You cannot undo this.` :
        `This will delete all ${String(tripCount)} trip${tripCount === 1 ? '' : 's'} to ${name} from your travel log. You cannot undo this.`

    openConfirm('Remove from dashboard', desc, { kind: 'summary-country', countryCode })
  }, [openConfirm])

  const handleRemoveTrackedCountry = useCallback((countryId: string) => {
    const country = getSnapshot().countries.find(c => c.id === countryId)
    if (!country) return
    openConfirm(
      'Stop tracking country',
      `Stop tracking ${country.countryName}? Its custom threshold and warning settings will be removed. Trips in your travel log are not deleted. You cannot undo this.`,
      { kind: 'tracked-country', countryId }
    )
  }, [openConfirm])

  const handleConfirm = useCallback(async () => {
    const { action } = confirm
    if (!action) return
    closeConfirm()

    const s = getSnapshot()
    try {
      if (action.kind === 'trip') {
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
  }, [closeConfirm, confirm])

  const handleExportCsv = useCallback(() => { exportCsv() }, [])

  const handleImportCsv = useCallback(async (file: File) => {
    const result = await importCsv(file, { syncLocalToAccount })
    const [tone, msg] = result.split(':') as [string, string]
    if (msg) setTripFormStatus(`${tone === 'error' ? 'Warning: ' : ''}${msg}`)
  }, [])

  return {
    confirm,
    state,
    tripFormStatus,
    closeConfirm,
    handleAddCountry,
    handleAddTrip,
    handleConfirm,
    handleExportCsv,
    handleImportCsv,
    handleRemoveSummaryCountry,
    handleRemoveTrackedCountry,
    handleRemoveTrip,
    handleWindowChange
  }
}
