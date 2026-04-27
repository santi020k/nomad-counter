# AI Collaboration Guide

This document helps future AI assistants work on Nomad Counter without rediscovering the product and engineering constraints every time.

## Start Here

Read these files first:

1. `AGENTS.md`
2. `README.md`
3. `llms.txt`
4. `docs/brand-guidelines.md`
5. `.agent/skills/seo/SKILL.md` for SEO work

For implementation, inspect the relevant app files after reading the docs. Do not rely only on this guide.

## Good AI Prompts For This Repo

Use prompts that name the target surface and quality expectations:

```text
Update the homepage hero copy using the Nomad Counter brand guide. Keep the app guest-first, preserve SEO metadata, and run lint/check/test/build.
```

```text
Add a D1-backed endpoint for exporting my trips. Match the existing Hono route style and keep guest mode unaffected.
```

```text
Review the date-counting logic for timezone bugs. Do not change behavior unless you find a real issue. Include tests if you patch it.
```

```text
Improve mobile layout on the counter screen. Use the brand guidelines, respect reduced motion, and verify with a 390px screenshot.
```

## Context To Give An AI

When starting a new thread, include:

- The current goal.
- Whether code changes are expected.
- Whether deployment is expected.
- Any custom domain or Cloudflare constraints.
- Whether auth changes should affect guest mode.

Helpful short brief:

```text
Nomad Counter is a Cloudflare-native Astro + Hono + D1 app. It tracks inclusive calendar days for tax residency exposure. Guest mode must work without auth. Email-code auth only syncs data. Follow AGENTS.md and docs/brand-guidelines.md.
```

## Implementation Checklist

Before editing:

- Check current git status.
- Read nearby code.
- Prefer existing patterns.
- Identify whether the change affects web, API, DB, docs, or deployment.

While editing:

- Keep changes scoped.
- Use timezone-safe date logic.
- Keep auth optional.
- Keep UI accessible and responsive.
- Avoid unnecessary dependencies.
- Update docs when behavior changes.

Before final response:

- Run the relevant quality gate.
- For UI work, capture or inspect mobile and desktop.
- Mention anything not run or blocked.

## High-Risk Areas

Date math:

- Inclusive counting is product-critical.
- Avoid timezone conversion bugs.
- Treat `YYYY-MM-DD` as calendar data, not timestamp data.

Auth:

- Do not require auth for the main counter.
- Do not expose production login codes in API responses.
- Local `devCode` behavior is only acceptable when email sending is not configured.

Deployment:

- Cloudflare is the target platform.
- D1 is the database.
- Production email requires `RESEND_API_KEY`.

Brand:

- Do not drift back to the old logo.
- Use the violet route-stamp identity.
- Keep the UI practical and product-led.

## Suggested AI Task Boundaries

Small task:

- One page or one route.
- One bug fix plus a test.
- One doc update.

Medium task:

- One feature touching web and API.
- A UI polish pass plus tests.
- A deployment/config update plus docs.

Large task:

- Schema migration plus API plus UI.
- Auth provider changes.
- Offline/PWA sync.
- Calendar import.

Large tasks should be planned explicitly before implementation.

## Review Checklist For AI-Generated Changes

- Does guest mode still work?
- Does the app still explain the counting rule?
- Are entry and exit dates still inclusive?
- Is the UI readable at 390px and desktop widths?
- Does reduced motion still work?
- Did SEO metadata stay valid?
- Did tests or docs need updates?
- Are new environment variables documented?
- Did the change add a dependency? If yes, is it justified?

## Useful Commands

```sh
pnpm install
pnpm dev
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm knip
pnpm spellcheck
```

For a quick mobile screenshot:

```sh
pnpm --filter @nomad-counter/web exec playwright screenshot --viewport-size=390,844 http://localhost:4321/ /tmp/nomad-counter-mobile.png
```

For a quick desktop screenshot:

```sh
pnpm --filter @nomad-counter/web exec playwright screenshot --viewport-size=1440,1000 http://localhost:4321/ /tmp/nomad-counter-desktop.png
```

## Documentation Map

- `README.md`: setup, stack, environment, deploy, quality.
- `AGENTS.md`: canonical AI agent instructions.
- `CLAUDE.md`: Claude-compatible pointer to the same rules.
- `llms.txt`: compact crawler/LLM project summary.
- `docs/brand-guidelines.md`: brand, UI, copy, logo, accessibility.
- `docs/ai-collaboration.md`: practical AI workflow.
