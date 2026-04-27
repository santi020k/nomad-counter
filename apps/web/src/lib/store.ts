import { summarizeLocal } from './app/dateMath'
import { readLocalCountries, readLocalTrips } from './app/localStore'
import type { State } from './app/types'

const initial: State = {
  authenticated: false,
  countries: [],
  trips: [],
  summary: [],
  userEmail: null,
  windowLabel: 'Current calendar year',
  windowMode: 'calendar-year'
}

let _state: State = { ...initial }
const _listeners = new Set<() => void>()

export const getSnapshot = (): State => _state

export const subscribe = (fn: () => void): (() => void) => {
  _listeners.add(fn)
  return () => void _listeners.delete(fn)
}

export const setState = (updater: (prev: State) => State): void => {
  _state = updater(_state)
  _listeners.forEach(fn => { fn() })
}

export const initStoreFromLocal = (): void => {
  const trips = readLocalTrips()
  const countries = readLocalCountries()
  const local = summarizeLocal(trips, countries, _state.windowMode)
  setState(() => ({ ..._state, trips, countries, summary: local.summary, windowLabel: local.windowLabel }))
}
