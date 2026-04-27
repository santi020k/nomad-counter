import { request } from './apiClient'
import { currentWindow } from './dateMath'
import { saveLocalState } from './localStore'
import { getSnapshot, setState } from '../store'
import type { CountrySummary, HomeCountry, Trip } from './types'

export const refreshRemote = async (): Promise<void> => {
  const { windowMode } = getSnapshot()
  const { mode } = currentWindow(windowMode)

  const [tripsResponse, countriesResponse, summaryResponse] = await Promise.all([
    request<{ trips: Trip[] }>('/api/trips'),
    request<{ countries: HomeCountry[] }>('/api/home-countries'),
    request<{ countries: CountrySummary[], window: { startDate: string, endDate: string } }>(`/api/summary?mode=${mode}`)
  ])

  setState(prev => ({
    ...prev,
    trips: tripsResponse.trips,
    countries: countriesResponse.countries,
    summary: summaryResponse.countries,
    windowLabel: `${summaryResponse.window.startDate} to ${summaryResponse.window.endDate}`
  }))

  const s = getSnapshot()
  saveLocalState(s.trips, s.countries)
}

const tripSyncKey = (trip: {
  countryCode: string
  entryDate: string
  exitDate: string | null
  note: string | null
}) => `${trip.countryCode}|${trip.entryDate}|${trip.exitDate ?? ''}|${trip.note?.trim() ?? ''}`

export const syncLocalToAccount = async (): Promise<void> => {
  const state = getSnapshot()

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

  const { trips: existingRemote } = await request<{ trips: Trip[] }>('/api/trips')
  const alreadySynced = new Set(existingRemote.map(trip => tripSyncKey(trip)))

  for (const trip of state.trips) {
    const key = tripSyncKey(trip)

    if (alreadySynced.has(key)) continue

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

    alreadySynced.add(key)
  }

  await refreshRemote()
}
