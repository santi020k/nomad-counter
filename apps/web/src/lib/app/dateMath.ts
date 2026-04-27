import { endOfYear, format, parseISO, startOfYear, subDays } from 'date-fns'

import type { CountrySummary, ExposureLevel, HomeCountry, Trip } from './types'

import { formatIsoDisplayDate, inclusiveCalendarDays, todayIsoDate } from '../isoDate'

export const currentWindow = (mode: string = 'calendar-year') => {
  const today = todayIsoDate()
  const todayDate = parseISO(today)
  const startDate = mode === 'rolling-365' ? subDays(todayDate, 364) : startOfYear(todayDate)
  const endDate = mode === 'rolling-365' ? today : endOfYear(todayDate)

  return {
    mode,
    startDate: todayIsoDateFromDate(startDate),
    endDate: todayIsoDateFromDate(endDate)
  }
}

const todayIsoDateFromDate = (date: Date | string) => typeof date === 'string' ? date : format(date, 'yyyy-MM-dd')

export const todayIso = todayIsoDate

export const inclusiveDays = inclusiveCalendarDays

export const formatDisplayDate = formatIsoDisplayDate

const overlapDays = (trip: Trip, startDate: string, endDate: string) => {
  const exitDate = trip.exitDate ?? todayIso()
  const start = trip.entryDate > startDate ? trip.entryDate : startDate
  const end = exitDate < endDate ? exitDate : endDate

  return start > end ? 0 : inclusiveDays(start, end)
}

export const summarizeLocal = (trips: Trip[], countries: HomeCountry[], windowMode?: string): {
  summary: CountrySummary[]
  windowLabel: string
} => {
  const window = currentWindow(windowMode)
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
