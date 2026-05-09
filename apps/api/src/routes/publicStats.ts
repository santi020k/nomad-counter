import { Hono } from 'hono'
import { sql } from 'drizzle-orm'

import { createDb } from '../lib/db.js'
import type { Bindings, Variables } from '../types.js'

import { trips, users } from '@nomad-counter/db'

export const publicStats = new Hono<{ Bindings: Bindings, Variables: Variables }>()

publicStats.get('/', async c => {
  const db = createDb(c.env.DB)

  const [
    totalTripsResult,
    totalUsersResult,
    topCountriesResult,
    totalDaysResult
  ] = await Promise.all([
    // Total number of trips across all users
    db.select({ count: sql<number>`count(*)` }).from(trips),

    // Total number of registered users
    db.select({ count: sql<number>`count(*)` }).from(users),

    // Top 10 most visited countries by trip count (no user data exposed)
    db
      .select({
        countryCode: trips.countryCode,
        countryName: trips.countryName,
        tripCount: sql<number>`count(*)`
      })
      .from(trips)
      .groupBy(trips.countryCode, trips.countryName)
      .orderBy(sql`count(*) desc`)
      .limit(10),

    // Sum of all recorded trip durations in days (open trips counted to today)
    db
      .select({
        totalDays: sql<number>`
          sum(
            julianday(coalesce(${trips.exitDate}, date('now'))) -
            julianday(${trips.entryDate}) + 1
          )
        `
      })
      .from(trips)
  ])

  const totalTrips = totalTripsResult[0]?.count ?? 0
  const totalUsers = totalUsersResult[0]?.count ?? 0
  const totalDays = Math.round(totalDaysResult[0]?.totalDays ?? 0)
  const uniqueCountries = new Set(topCountriesResult.map(r => r.countryCode)).size

  return c.json({
    totalTrips,
    totalUsers,
    totalDays,
    uniqueCountriesInTopTen: uniqueCountries,
    topCountries: topCountriesResult.map(r => ({
      countryCode: r.countryCode,
      countryName: r.countryName,
      tripCount: r.tripCount
    })),
    generatedAt: new Date().toISOString()
  })
})
