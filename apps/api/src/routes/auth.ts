import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { createDb } from '../lib/db.js'
import { clearSessionCookie, getSessionCookieName, hashSecret, makeId, now, requireUser, setSessionCookie } from '../lib/http.js'
import type { Bindings, Variables } from '../types.js'

import { sessions, users } from '@nomad-counter/db'

export const auth = new Hono<{ Bindings: Bindings, Variables: Variables }>()

const loginSchema = z.object({
  email: z.email().transform(value => value.toLowerCase().trim()),
  accessCode: z.string().min(1)
})

auth.post('/login', zValidator('json', loginSchema), async c => {
  const configuredSecret = c.env.NOMAD_LOGIN_SECRET

  if (!configuredSecret) {
    return c.json({ error: 'NOMAD_LOGIN_SECRET is not configured.' }, 500)
  }

  const body = c.req.valid('json')
  const [givenHash, expectedHash] = await Promise.all([
    hashSecret(body.accessCode),
    hashSecret(configuredSecret)
  ])

  if (givenHash !== expectedHash) {
    return c.json({ error: 'Invalid access code.' }, 401)
  }

  const db = createDb(c.env.DB)
  const timestamp = now()
  const existingUsers = await db.select().from(users).where(eq(users.email, body.email)).limit(1)
  const existingUser = existingUsers.at(0)
  const user = existingUser ?? {
    id: makeId('usr'),
    email: body.email,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  if (!existingUser) {
    await db.insert(users).values(user)
  }

  const expiresAt = new Date(timestamp.getTime() + 1000 * 60 * 60 * 24 * 90)
  const sessionId = makeId('ses')

  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt,
    createdAt: timestamp
  })

  setSessionCookie(c, sessionId, expiresAt)

  return c.json({ user: { id: user.id, email: user.email } })
})

auth.get('/me', requireUser, c => c.json({
  user: {
    id: c.get('userId'),
    email: c.get('userEmail')
  }
}))

auth.post('/logout', async c => {
  const sessionId = getCookie(c, getSessionCookieName(c))

  if (sessionId) {
    const db = createDb(c.env.DB)

    await db.delete(sessions).where(and(eq(sessions.id, sessionId)))
  }

  clearSessionCookie(c)

  return c.json({ ok: true })
})
