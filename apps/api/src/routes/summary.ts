import { Hono } from 'hono'
import { eq } from 'drizzle-orm'

import { createDb } from '../lib/db.js'
import { resolveWindow, summarizeTrips } from '../lib/dateMath.js'
import { requireUser } from '../lib/http.js'
import type { Bindings, Variables } from '../types.js'

import { homeCountries, trips } from '@nomad-counter/db'

export const summary = new Hono<{ Bindings: Bindings, Variables: Variables }>()

summary.use('*', requireUser)

summary.get('/', async c => {
  const db = createDb(c.env.DB)
  const window = resolveWindow(new URL(c.req.url).searchParams)
  const [tripRows, countries] = await Promise.all([
    db.select().from(trips).where(eq(trips.userId, c.get('userId'))),
    db.select().from(homeCountries).where(eq(homeCountries.userId, c.get('userId')))
  ])

  return c.json({
    countingRule: 'Any calendar day with presence in a country counts as one full day. Entry and exit dates are inclusive.',
    window,
    countries: summarizeTrips(tripRows, countries, window)
  })
})

summary.get('/stats', async c => {
  const db = createDb(c.env.DB)
  const tripRows = await db.select().from(trips).where(eq(trips.userId, c.get('userId')))
  const uniqueCountries = new Set(tripRows.map(trip => trip.countryCode))

  return c.json({
    stats: {
      totalTrips: tripRows.length,
      totalCountries: uniqueCountries.size,
      openTrips: tripRows.filter(trip => trip.exitDate === null).length
    }
  })
})
