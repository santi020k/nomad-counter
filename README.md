# Nomad Counter

Personal web app for tracking calendar days spent in countries where tax residency exposure matters.

## Stack

- pnpm 10 workspaces + Turborepo
- Node 22+, TypeScript 6, ESLint 10
- `apps/web`: Astro 6, Tailwind 4, Cloudflare Pages
- `apps/api`: Hono on Cloudflare Workers
- `packages/db`: Drizzle schema for Cloudflare D1
- Auth: first-party private access code + D1-backed HTTP-only sessions

The app intentionally has no Supabase, no Vercel, and no external auth provider. The access-code auth is the simplest production-usable option for a personal private tool: set one Cloudflare Worker secret and sign in with your email plus that code.

## Local Dev

```sh
pnpm install
cp .env.example .env
cp apps/api/.dev.vars.example apps/api/.dev.vars
pnpm dev
```

The web app runs on `http://localhost:4321`; the API runs on `http://localhost:8787`.

## Environment

Root `.env`:

```sh
PUBLIC_API_URL=http://localhost:8787
```

`apps/api/.dev.vars`:

```sh
NOMAD_LOGIN_SECRET=change-me-locally
ALLOWED_ORIGINS=http://localhost:4321
```

Production secrets:

```sh
pnpm --filter @nomad-counter/api exec wrangler secret put NOMAD_LOGIN_SECRET
```

Cloudflare deploy variables/secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_D1_DATABASE_ID`
- `PUBLIC_API_URL=https://api.nomad.santi020k.com`

## Day Counting Rule

Nomad Counter uses an inclusive calendar-day rule: any calendar day with presence in a country counts as one full day. Entry and exit dates both count. Open-ended trips count through today.

Date math uses `Temporal` in the API and ISO `YYYY-MM-DD` strings end to end, avoiding timezone-sensitive JavaScript `Date` arithmetic for residency counts.

## Features

- Track one or more home/exposure countries
- Per-country threshold and warning range
- Trips with entry date, exit date, country, and open-ended “currently there” support
- Current calendar-year and rolling-365-day views
- CSV import and export
- `/stats` placeholder for future non-PII aggregate stats

Deferred: iCal/Google Calendar import, map heatmap, PWA offline sync, and richer “what if?” planning.

## Deploy

Create D1 once:

```sh
pnpm --filter @nomad-counter/api exec wrangler d1 create nomad-counter-db
```

Put the returned database id into `apps/api/wrangler.toml` or provide it to CI as `CLOUDFLARE_D1_DATABASE_ID`.

Deploy both API and web:

```sh
pnpm deploy
```

Cloudflare targets:

- Web: `nomad.santi020k.com` via Cloudflare Pages project `nomad-counter`
- API: Worker `nomad-counter-api`, route such as `api.nomad.santi020k.com/*`
- DB: Cloudflare D1 `nomad-counter-db`

## Quality

```sh
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm spellcheck
pnpm knip
```
