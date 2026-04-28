# Nomad Counter Agent Guide

This file is for AI coding agents working in this repository. Treat it as the fastest source of local context before making changes.

## Product

Nomad Counter is a personal travel-day tracker for tax residency exposure. It helps a user count calendar days spent in countries, compare those counts against configurable thresholds, and see when they are close to the common 183-day rule.

The app is not tax advice. Keep copy clear, practical, and cautious.

## Current Architecture

- Monorepo using pnpm 10 workspaces and Turborepo.
- `apps/web`: Astro 6, Tailwind 4, static Cloudflare Pages frontend.
- `apps/api`: Hono Worker API on Cloudflare Workers.
- `packages/db`: Drizzle schema for Cloudflare D1.
- Auth is guest-first. The counter works locally without sign-in; email-code auth only saves and syncs data to an account.
- No Supabase, no Vercel, no external hosted database.

## Working Rules

- Before making any code adjustment, read and apply `.agent/skills/code-standards/SKILL.md`; it captures the repo ESLint and TypeScript standards agents must follow.
- Match the conventions from the sibling santi020k repos, especially `fenix`, `private-website`, and `unsaid`.
- Use `@santi020k/eslint-config-basic`; do not create a new shared lint config.
- Prefer Cloudflare-native services.
- Keep date math timezone-safe. Use ISO `YYYY-MM-DD`, Temporal in API code, and established date helpers in web code.
- Do not use ad hoc JavaScript `Date` arithmetic for residency counts.
- Keep the app useful in guest mode.
- Avoid heavy dependencies unless they clearly remove meaningful risk or complexity.
- Do not ship half-baked integrations. Stub future features in docs or TODOs only when useful.

## UX Principles

- First screen should be the actual counter experience, not a detached marketing landing page.
- Marketing copy should support the tool, not interrupt it.
- UI should feel calm, precise, travel-aware, and trustworthy.
- Keep panels compact, scannable, and efficient for repeat use.
- Cards use 8px radius unless a specific brand element needs a pill.
- Respect `prefers-reduced-motion`.
- Ensure content is visible without client JavaScript. Animation must enhance, not gate, content.

## Brand Anchors

- Primary violet: `#471AA0`.
- Deep violet: `#4C1D95`.
- Supporting purple: `#804BC4`.
- Lavender: `#B579E6`.
- Background: `#F8FAFC`.
- Text: `#1F2937`.
- Muted text: `#6B7280`.
- Warning: `#EAB308`.
- Success: `#14B8A6`.
- Danger: `#DC2626`.
- Font direction: Inter/system sans.

See `docs/brand-guidelines.md` for the fuller brand system.

## Auth Model

The preferred auth flow is passwordless email code:

1. User can use the counter without signing in.
2. User enters email only when they want account sync.
3. API creates and stores a short-lived one-time code.
4. If `RESEND_API_KEY` is configured, the code is emailed.
5. In local development only, missing email configuration may return `devCode` for testing.
6. Successful verification creates a D1-backed session cookie.

Do not make auth a prerequisite for using core counter features.

## Day Counting Rule

Nomad Counter uses inclusive calendar-day counting:

- Any calendar day with presence in a country counts as one full day.
- Entry and exit dates both count.
- Open-ended trips count through today.
- The default threshold is 183 days, but each tracked country can override it.

## Quality Gate

Before considering work complete, run:

```sh
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm knip
pnpm spellcheck
```

For UI changes, also inspect at mobile and desktop widths.

## Project Skills

Project-local skills live in `.agent/skills/`. They were copied from the `unsaid` workflow and adapted for Nomad Counter where the app differs:

- `code-standards` for the mandatory ESLint, TypeScript, and package convention workflow before code adjustments.
- `seo`, `accessibility`, `testing`, and `maintenance` for quality workflows.
- `web-design`, `ui-ux-pro-max`, `creating-components`, and accessibility lint skills for UI implementation and review.
- `adding-pages`, `add-content`, and `content-collections` for future static pages or structured content.
- `automation-scripts` for generated assets and project utilities.

Prefer these local skills before inventing a new workflow.

## Deployment Notes

- Web deploys to Cloudflare Pages.
- API deploys to Cloudflare Workers.
- DB is Cloudflare D1.
- Production email-code auth requires `RESEND_API_KEY`.
- Do not deploy a production auth flow that relies on local `devCode` behavior.

## Useful Files

- `README.md`: project setup and deployment.
- `docs/brand-guidelines.md`: brand, palette, tone, logo use.
- `docs/ai-collaboration.md`: AI workflow and prompting notes.
- `.agent/skills/`: project-local workflows copied from `unsaid` and adapted for this app.
- `llms.txt`: compact LLM-readable project brief.
