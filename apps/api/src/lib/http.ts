import { getCookie, setCookie } from 'hono/cookie'
import type { Context, Env, MiddlewareHandler } from 'hono'

import { and, eq, gt } from 'drizzle-orm'

import { createDb } from './db.js'
import type { Bindings, Variables } from '../types.js'

import { sessions, users } from '@nomad-counter/db'

const encoder = new TextEncoder()

export const now = () => new Date()

export const makeId = (prefix: string) => `${prefix}_${crypto.randomUUID().replaceAll('-', '')}`

export const hashSecret = async (secret: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(secret))

  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('')
}

type BoundEnv = Env & { Bindings: Bindings }

export const getSessionCookieName = <T extends BoundEnv>(c: Context<T>) => c.env.SESSION_COOKIE_NAME ?? 'nomad_session'

export const setSessionCookie = <T extends BoundEnv>(c: Context<T>, sessionId: string, expiresAt: Date) => {
  const requestUrl = new URL(c.req.url)

  setCookie(c, getSessionCookieName(c), sessionId, {
    httpOnly: true,
    secure: requestUrl.protocol === 'https:',
    sameSite: requestUrl.hostname.endsWith('workers.dev') ? 'None' : 'Lax',
    path: '/',
    expires: expiresAt
  })
}

export const clearSessionCookie = <T extends BoundEnv>(c: Context<T>) => {
  const requestUrl = new URL(c.req.url)

  setCookie(c, getSessionCookieName(c), '', {
    httpOnly: true,
    secure: requestUrl.protocol === 'https:',
    sameSite: requestUrl.hostname.endsWith('workers.dev') ? 'None' : 'Lax',
    path: '/',
    maxAge: 0
  })
}

export const requireUser: MiddlewareHandler<{ Bindings: Bindings, Variables: Variables }> = async (c, next) => {
  const sessionId = getCookie(c, getSessionCookieName(c))

  if (!sessionId) {
    return c.json({ error: 'Authentication required.' }, 401)
  }

  const db = createDb(c.env.DB)
  const sessionRows = await db
    .select({
      userId: sessions.userId,
      userEmail: users.email
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, now())))
    .limit(1)
  const session = sessionRows.at(0)

  if (!session) {
    clearSessionCookie(c)

    return c.json({ error: 'Session expired.' }, 401)
  }

  c.set('userId', session.userId)
  c.set('userEmail', session.userEmail)

  return next()
}
