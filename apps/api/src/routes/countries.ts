import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { createDb } from '../lib/db.js'
import { makeId, now, requireUser } from '../lib/http.js'
import type { Bindings, Variables } from '../types.js'

import { homeCountries } from '@nomad-counter/db'

export const countries = new Hono<{ Bindings: Bindings, Variables: Variables }>()

const countrySchema = z.object({
  countryCode: z.string().min(2).max(3).transform(value => value.toUpperCase()),
  countryName: z.string().min(2).max(80),
  thresholdDays: z.number().int().min(1).max(366).default(183),
  warningDays: z.number().int().min(0).max(90).default(14)
})

countries.use('*', requireUser)

countries.get('/', async c => {
  const db = createDb(c.env.DB)
  const rows = await db.select().from(homeCountries).where(eq(homeCountries.userId, c.get('userId')))

  return c.json({ countries: rows })
})

countries.post('/', zValidator('json', countrySchema), async c => {
  const db = createDb(c.env.DB)
  const body = c.req.valid('json')
  const timestamp = now()
  const row = {
    id: makeId('hco'),
    userId: c.get('userId'),
    ...body,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  await db.insert(homeCountries).values(row).onConflictDoUpdate({
    target: [homeCountries.userId, homeCountries.countryCode],
    set: {
      countryName: row.countryName,
      thresholdDays: row.thresholdDays,
      warningDays: row.warningDays,
      updatedAt: timestamp
    }
  })

  return c.json({ country: row }, 201)
})

countries.delete('/:id', async c => {
  const db = createDb(c.env.DB)

  await db.delete(homeCountries).where(and(eq(homeCountries.id, c.req.param('id')), eq(homeCountries.userId, c.get('userId'))))

  return c.json({ ok: true })
})
