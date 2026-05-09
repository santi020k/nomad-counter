import { type Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { auth } from './routes/auth.js'
import { countries } from './routes/countries.js'
import { publicStats } from './routes/publicStats.js'
import { summary } from './routes/summary.js'
import { tripsRoute } from './routes/trips.js'
import type { Bindings, Variables } from './types.js'

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()

const parseOrigins = (raw: string | undefined): string[] => raw?.split(',').map(origin => origin.trim()).filter(Boolean) ?? []

const resolveCorsOrigin = (origin: string, c: Context<{ Bindings: Bindings }>): string | null => {
  const allowedOrigins = [
    ...parseOrigins(c.env.ALLOWED_ORIGINS),
    ...parseOrigins(c.env.ALLOWED_ORIGIN)
  ]

  return allowedOrigins.includes(origin) ? origin : null
}

app.use('*', logger())
app.use('/api/*', cors({
  origin: resolveCorsOrigin,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  credentials: true,
  maxAge: 86400
}))

app.get('/api/health', c => c.json({ status: 'ok' }))
app.route('/api/auth', auth)
app.route('/api/home-countries', countries)
app.route('/api/trips', tripsRoute)
app.route('/api/summary', summary)
app.route('/api/public-stats', publicStats)

app.notFound(c => c.json({ error: 'Not found.' }, 404))

app.onError((err, c) => {
  console.error(err)

  return c.json({ error: err.message || 'Internal server error.' }, 500)
})

export default app
