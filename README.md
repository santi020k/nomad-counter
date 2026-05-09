# Nomad Counter

Personal web app for tracking calendar days spent in countries where tax residency exposure matters.

## Stack

- pnpm 10 workspaces + Turborepo
- Node 22+, TypeScript 6, ESLint 10
- `apps/web`: Astro 6, Tailwind 4, Cloudflare Pages
- `apps/api`: Hono on Cloudflare Workers
- `packages/db`: Drizzle schema for Cloudflare D1
- Auth: guest-first local mode plus first-party email-code sessions backed by D1

The app intentionally has no Supabase and no Vercel. You can use the counter without signing in; trips stay in local browser storage. Email-code sign-in exists only to save that data to an account and sync it across devices.

## Architecture

```text
nomad-counter/
├── apps/
│   ├── web/                 # Astro frontend deployed to Cloudflare Pages
│   │   ├── src/pages/       # Route files; pages compose focused components
│   │   ├── src/components/  # Shared UI plus feature components
│   │   ├── src/lib/         # Browser behavior, validation, and country data
│   │   ├── src/styles/      # Global tokens and page-level CSS
│   │   └── tests/           # Playwright SEO, accessibility, and flow tests
│   └── api/                 # Hono Worker API deployed to Cloudflare Workers
│       ├── src/routes/      # Auth, countries, trips, and summary endpoints
│       └── src/lib/         # D1, email, HTTP, and timezone-safe date helpers
├── packages/
│   └── db/                  # Drizzle schema and D1 migration source
├── docs/                    # Brand and AI collaboration notes
└── .agent/skills/           # Project-local AI workflow guides
```

The frontend is guest-first. `apps/web/src/pages/index.astro` is deliberately thin: it imports the home feature components in `apps/web/src/components/home/`, the shared form controls in `apps/web/src/components/forms/`, and the behavior bootstrap in `apps/web/src/lib/app.ts`. The first screen remains the usable counter experience, with marketing sections kept secondary.

The API owns persistence and account sync. Route handlers use the shared Drizzle schema from `packages/db`, Cloudflare D1 for storage, and passwordless email-code sessions. Date-sensitive residency counting stays ISO-string based; API date math uses Temporal helpers, while frontend display and local summaries avoid ad hoc timezone-sensitive arithmetic.

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
ALLOWED_ORIGINS=http://localhost:4321
RESEND_API_KEY=
```

Production secrets:

```sh
pnpm --filter @nomad-counter/api exec wrangler secret put RESEND_API_KEY
```

If `RESEND_API_KEY` is missing in local development, `/api/auth/request-code` returns a `devCode` in the JSON response so the auth flow can be tested without sending email.

Cloudflare deploy variables/secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN` (requires: `Account.Pages:Edit`, `Account.Worker Scripts:Edit`, `Account.D1:Edit`, `User.User Details:Read`, `User.Memberships:Read`)
- `CLOUDFLARE_D1_DATABASE_ID`
- `PUBLIC_API_URL=https://api.nomad.santi020k.com`
- `RESEND_API_KEY`
- `AUTH_EMAIL_FROM`

## Day Counting Rule

Nomad Counter uses an inclusive calendar-day rule: any calendar day with presence in a country counts as one full day. Entry and exit dates both count. Open-ended trips count through today.

Date math uses `Temporal` in the API and ISO `YYYY-MM-DD` strings end to end, avoiding timezone-sensitive JavaScript `Date` arithmetic for residency counts.

## Features

- Track one or more home/exposure countries
- Per-country threshold and warning range
- Trips with entry date, exit date, country, and open-ended “currently there” support
- Current calendar-year and rolling-365-day views
- CSV import and export
- Guest mode with local browser storage
- Email-code sign-in for account sync
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
pnpm run deploy
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

## Project Guides

- `AGENTS.md`: canonical instructions for AI coding agents.
- `CLAUDE.md`: Claude-compatible pointer to the agent rules.
- `llms.txt`: compact LLM-readable project brief.
- `docs/brand-guidelines.md`: brand identity, voice, color, logo, UI, SEO, and accessibility guidance.
- `docs/ai-collaboration.md`: practical workflow for using AI on this project.
- `.agent/skills/seo/SKILL.md`: SEO skill adapted from the `unsaid` workflow.
