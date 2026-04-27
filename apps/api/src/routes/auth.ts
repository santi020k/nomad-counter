import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { createDb } from '../lib/db.js'
import { sendLoginCode } from '../lib/email.js'
import { clearSessionCookie, getSessionCookieName, hashSecret, makeId, now, requireUser, setSessionCookie } from '../lib/http.js'
import type { Bindings, Variables } from '../types.js'

import { loginCodes, sessions, users } from '@nomad-counter/db'

export const auth = new Hono<{ Bindings: Bindings, Variables: Variables }>()

const emailSchema = z.object({
  email: z.email().transform(value => value.toLowerCase().trim())
})

const verifyCodeSchema = emailSchema.extend({
  code: z.string().regex(/^\d{6}$/)
})

const legacyLoginSchema = z.object({
  email: z.email().transform(value => value.toLowerCase().trim()),
  accessCode: z.string().min(1)
})

const upsertUserAndCreateSession = async (db: ReturnType<typeof createDb>, email: string) => {
  const timestamp = now()
  const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const existingUser = existingUsers.at(0)
  const user = existingUser ?? {
    id: makeId('usr'),
    email,
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

  return { user, sessionId, expiresAt }
}

const createSixDigitCode = () => String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0')

auth.post('/request-code', zValidator('json', emailSchema), async c => {
  const { email } = c.req.valid('json')
  const db = createDb(c.env.DB)
  const code = createSixDigitCode()
  const timestamp = now()
  const expiresAt = new Date(timestamp.getTime() + 1000 * 60 * 10)
  const codeHash = await hashSecret(`${email}:${code}`)
  const status = await sendLoginCode({ code, email, env: c.env })

  await db.insert(loginCodes).values({
    id: makeId('cod'),
    email,
    codeHash,
    expiresAt,
    createdAt: timestamp
  })

  const devExpose =
    c.env.NOMAD_DEV_EXPOSE_LOGIN_CODE === 'true'

  return c.json({
    ok: true,
    delivery: status,
    devCode: status === 'skipped' && devExpose ? code : undefined
  })
})

auth.post('/verify-code', zValidator('json', verifyCodeSchema), async c => {
  const { email, code } = c.req.valid('json')
  const db = createDb(c.env.DB)
  const codeHash = await hashSecret(`${email}:${code}`)
  const codeRows = await db
    .select()
    .from(loginCodes)
    .where(and(eq(loginCodes.email, email), eq(loginCodes.codeHash, codeHash)))
    .limit(1)
  const loginCode = codeRows.at(0)

  if (!loginCode || loginCode.consumedAt || loginCode.expiresAt <= now()) {
    return c.json({ error: 'Invalid or expired code.' }, 401)
  }

  await db.update(loginCodes).set({ consumedAt: now() }).where(eq(loginCodes.id, loginCode.id))

  const { user, sessionId, expiresAt } = await upsertUserAndCreateSession(db, email)

  setSessionCookie(c, sessionId, expiresAt)

  return c.json({ user: { id: user.id, email: user.email } })
})

auth.post('/login', zValidator('json', legacyLoginSchema), async c => {
  const configuredSecret = c.env.NOMAD_LOGIN_SECRET

  if (!configuredSecret) {
    return c.json({ error: 'Email code sign-in is enabled. Request a code first.' }, 400)
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
  const { user, sessionId, expiresAt } = await upsertUserAndCreateSession(db, body.email)

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
