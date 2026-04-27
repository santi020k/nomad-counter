import { differenceInCalendarDays, format, parseISO, subDays } from 'date-fns'

import { $ } from './dom'
import type { CountrySummary, ExposureLevel, HomeCountry, Trip } from './types'

export const currentWindow = () => {
  const windowMode = $<HTMLSelectElement>('#window-mode')
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

export const todayIso = () => format(new Date(), 'yyyy-MM-dd')

export const inclusiveDays = (startDate: string, endDate: string) => differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1

export const formatDisplayDate = (date: string) => format(parseISO(date), 'MMM d, yyyy')

const overlapDays = (trip: Trip, startDate: string, endDate: string) => {
  const exitDate = trip.exitDate ?? todayIso()
  const start = trip.entryDate > startDate ? trip.entryDate : startDate
  const end = exitDate < endDate ? exitDate : endDate

  return start > end ? 0 : inclusiveDays(start, end)
}

export const summarizeLocal = (trips: Trip[], countries: HomeCountry[]): {
  summary: CountrySummary[]
  windowLabel: string
} => {
  const window = currentWindow()
  const thresholds = new Map(countries.map(country => [country.countryCode, country]))
  const countryNames = new Map<string, string>()
  const counts = new Map<string, number>()

  for (const trip of trips) {
    countryNames.set(trip.countryCode, trip.countryName)

    counts.set(trip.countryCode, (counts.get(trip.countryCode) ?? 0) + overlapDays(trip, window.startDate, window.endDate))
  }

  for (const country of countries) {
    countryNames.set(country.countryCode, country.countryName)

    counts.set(country.countryCode, counts.get(country.countryCode) ?? 0)
  }

  const summary = [...counts.entries()]
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

  return {
    summary,
    windowLabel: `${formatDisplayDate(window.startDate)} to ${formatDisplayDate(window.endDate)}`
  }
}
