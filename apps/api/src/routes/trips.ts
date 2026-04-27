import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { createDb } from '../lib/db.js'
import { makeId, now, requireUser } from '../lib/http.js'
import type { Bindings, Variables } from '../types.js'

import { trips } from '@nomad-counter/db'

const tripSchema = z.object({
  countryCode: z.string().min(2).max(3).transform(value => value.toUpperCase()),
  countryName: z.string().min(2).max(80),
  entryDate: z.iso.date(),
  exitDate: z.iso.date().nullable().optional(),
  note: z.string().max(240).nullable().optional()
}).refine(value => !value.exitDate || value.exitDate >= value.entryDate, {
  message: 'Exit date must be on or after entry date.',
  path: ['exitDate']
})

export const tripsRoute = new Hono<{ Bindings: Bindings, Variables: Variables }>()

tripsRoute.use('*', requireUser)

tripsRoute.get('/', async c => {
  const db = createDb(c.env.DB)
  const rows = await db.select().from(trips).where(eq(trips.userId, c.get('userId')))

  return c.json({ trips: rows })
})

tripsRoute.post('/', zValidator('json', tripSchema), async c => {
  const db = createDb(c.env.DB)
  const body = c.req.valid('json')
  const timestamp = now()
  const row = {
    id: makeId('trp'),
    userId: c.get('userId'),
    ...body,
    exitDate: body.exitDate ?? null,
    note: body.note ?? null,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  await db.insert(trips).values(row)

  return c.json({ trip: row }, 201)
})

tripsRoute.put('/:id', zValidator('json', tripSchema), async c => {
  const db = createDb(c.env.DB)
  const body = c.req.valid('json')

  await db.update(trips)
    .set({
      ...body,
      exitDate: body.exitDate ?? null,
      note: body.note ?? null,
      updatedAt: now()
    })
    .where(and(eq(trips.id, c.req.param('id')), eq(trips.userId, c.get('userId'))))

  return c.json({ ok: true })
})

tripsRoute.delete('/:id', async c => {
  const db = createDb(c.env.DB)

  await db.delete(trips).where(and(eq(trips.id, c.req.param('id')), eq(trips.userId, c.get('userId'))))

  return c.json({ ok: true })
})
