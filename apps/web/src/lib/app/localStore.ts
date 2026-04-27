import type { HomeCountry, Trip } from './types'

const tripsKey = 'nomad-counter:trips'
const countriesKey = 'nomad-counter:home-countries'

const readLocal = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key)

  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const readLocalTrips = () => readLocal<Trip[]>(tripsKey, [])

export const readLocalCountries = () => readLocal<HomeCountry[]>(countriesKey, [])

export const saveLocalState = (trips: Trip[], countries: HomeCountry[]) => {
  localStorage.setItem(tripsKey, JSON.stringify(trips))

  localStorage.setItem(countriesKey, JSON.stringify(countries))
}
