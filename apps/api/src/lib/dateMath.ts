import { Temporal } from '@js-temporal/polyfill'

import type { HomeCountry, Trip } from '@nomad-counter/db'

type WindowMode = 'calendar-year' | 'rolling-365' | 'custom'

interface SummaryWindow {
  endDate: string
  mode: WindowMode
  startDate: string
}

interface CountrySummary {
  countryCode: string
  countryName: string
  daysPresent: number
  daysRemaining: number
  exposureLevel: 'ok' | 'warning' | 'exceeded'
  thresholdDays: number
  warningDays: number
}

const parseDate = (value: string) => Temporal.PlainDate.from(value)

const isoToday = () => Temporal.Now.plainDateISO().toString()

export const resolveWindow = (params: URLSearchParams): SummaryWindow => {
  const mode = (params.get('mode') ?? 'calendar-year') as WindowMode
  const today = parseDate(params.get('today') ?? isoToday())

  if (mode === 'rolling-365') {
    return {
      mode,
      startDate: today.subtract({ days: 364 }).toString(),
      endDate: today.toString()
    }
  }

  if (mode === 'custom') {
    const startDate = params.get('startDate')
    const endDate = params.get('endDate')

    if (!startDate || !endDate) {
      throw new Error('Custom windows require startDate and endDate.')
    }

    return { mode, startDate, endDate }
  }

  return {
    mode: 'calendar-year',
    startDate: Temporal.PlainDate.from({ year: today.year, month: 1, day: 1 }).toString(),
    endDate: Temporal.PlainDate.from({ year: today.year, month: 12, day: 31 }).toString()
  }
}

const countInclusiveDays = (startDate: string, endDate: string) => {
  const start = parseDate(startDate)
  const end = parseDate(endDate)

  return start.until(end).days + 1
}

const overlapDays = (trip: Trip, window: SummaryWindow, today = isoToday()) => {
  const exitDate = trip.exitDate ?? today
  const start = Temporal.PlainDate.compare(trip.entryDate, window.startDate) >= 0 ? trip.entryDate : window.startDate
  const end = Temporal.PlainDate.compare(exitDate, window.endDate) <= 0 ? exitDate : window.endDate

  if (Temporal.PlainDate.compare(start, end) > 0) {
    return 0
  }

  return countInclusiveDays(start, end)
}

export const summarizeTrips = (trips: Trip[], trackedCountries: HomeCountry[], window: SummaryWindow): CountrySummary[] => {
  const thresholds = new Map(trackedCountries.map(country => [country.countryCode, country]))
  const countryNames = new Map<string, string>()
  const counts = new Map<string, number>()

  for (const trip of trips) {
    countryNames.set(trip.countryCode, trip.countryName)
    counts.set(trip.countryCode, (counts.get(trip.countryCode) ?? 0) + overlapDays(trip, window))
  }

  for (const country of trackedCountries) {
    countryNames.set(country.countryCode, country.countryName)
    counts.set(country.countryCode, counts.get(country.countryCode) ?? 0)
  }

  return [...counts.entries()]
    .map(([countryCode, daysPresent]) => {
      const config = thresholds.get(countryCode)
      const thresholdDays = config?.thresholdDays ?? 183
      const warningDays = config?.warningDays ?? 14
      const daysRemaining = thresholdDays - daysPresent
      const exposureLevel: CountrySummary['exposureLevel'] = daysRemaining <= 0 ? 'exceeded' : daysRemaining <= warningDays ? 'warning' : 'ok'

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
}
