---
name: Code Standards
description: Use this before making code adjustments in Nomad Counter. It summarizes the repository ESLint setup, TypeScript expectations, package-specific conventions, and verification commands agents must follow for web, API, DB, and test changes.
---

# Code Standards Skill

Use this skill at the start of any implementation, refactor, bug fix, or test change. Treat the local ESLint configs as the source of truth:

- `apps/web/eslint.config.js`
- `apps/api/eslint.config.js`
- `packages/db/eslint.config.js`
- `package.json` and the relevant workspace `package.json`

## Baseline

- Use the existing flat ESLint configs. Do not introduce a new shared lint config.
- Keep `@santi020k/eslint-config-basic` as the base standard.
- Add framework rules only through the existing package adapters:
  - Web: `@santi020k/eslint-config-astro`, `@santi020k/eslint-config-react`, and Playwright rules from `@santi020k/eslint-config-basic`.
  - API: `@santi020k/eslint-config-hono`.
  - DB: `@santi020k/eslint-config-basic`.
- Keep TypeScript project-aware linting enabled with the package `tsconfigRootDir`.
- Prefer fixing code to relaxing rules. Any rule override must be narrow, named, and justified by the surrounding package pattern.

## Coding Standards

- Write TypeScript-first code with explicit data shapes at module boundaries.
- Avoid `any`, unsafe casts, floating promises, unused exports, dead code, and broad exception swallowing.
- Keep imports tidy and use workspace packages instead of relative cross-package reaches.
- Keep functions small enough that validation, data mapping, and side effects are easy to inspect.
- Prefer existing helpers and local patterns before adding abstractions or dependencies.
- Do not add heavy dependencies unless they clearly reduce meaningful risk or complexity.
- Use ISO `YYYY-MM-DD` strings for calendar data. In API code, use Temporal helpers for date math. Do not use ad hoc JavaScript `Date` arithmetic for residency counts.

## Package Notes

### Web

- Astro pages should stay thin and compose components, shared controls, and `src/lib` behavior.
- Tailwind 4 class linting is configured through `better-tailwindcss`; unknown-class checking is currently disabled, so manually verify class names and responsive states.
- `.astro` files intentionally allow `@typescript-eslint/no-unsafe-return` because Astro template typing can be noisy. Do not expand that exception to other files.
- Playwright lint rules apply to `apps/web/tests/**/*.ts`.
- Run `astro sync` through the existing `prelint` flow before web linting.

### API

- Route code should match the Hono Worker style already in `apps/api/src`.
- Keep Cloudflare-native primitives, D1 persistence, and email-code auth behavior.
- Never return local `devCode` behavior from production paths.
- Validate request and response data at route boundaries.

### DB

- Keep Drizzle schema and migration source focused in `packages/db`.
- Use `packages/db/tsconfig.eslint.json` for project-aware linting.
- Avoid runtime dependencies in the DB package unless they belong in schema/query helpers.

## Verification

Use the narrowest relevant command while iterating:

```sh
pnpm --filter @nomad-counter/web lint
pnpm --filter @nomad-counter/api lint
pnpm --filter @nomad-counter/db lint
```

Before substantial work is complete, run the repo quality gate from `AGENTS.md`:

```sh
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm knip
pnpm spellcheck
```

For UI changes, also inspect mobile and desktop widths.
