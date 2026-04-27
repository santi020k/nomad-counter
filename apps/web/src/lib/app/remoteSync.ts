import { request } from './apiClient'
import { currentWindow } from './dateMath'
import { saveLocalState } from './localStore'
import { renderAuth, renderHomeCountries, renderSummary, renderTrips } from './render'
import type { CountrySummary, HomeCountry, State, Trip } from './types'

export const renderSyncedState = (state: State) => {
  renderAuth(state)
  renderSummary(state.summary, state.windowLabel)
  renderTrips(state.trips)
  renderHomeCountries(state.countries)
}

export const refreshRemote = async (state: State) => {
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

  saveLocalState(state.trips, state.countries)
  renderSyncedState(state)
}

const tripSyncKey = (trip: {
  countryCode: string
  entryDate: string
  exitDate: string | null
  note: string | null
}) => `${trip.countryCode}|${trip.entryDate}|${trip.exitDate ?? ''}|${trip.note?.trim() ?? ''}`

export const syncLocalToAccount = async (state: State) => {
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

    if (alreadySynced.has(key)) {
      continue
    }

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

  await refreshRemote(state)
}
