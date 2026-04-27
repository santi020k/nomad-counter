---
name: Project Maintenance
description: Standard workflows for dependency updates, security audits, and linting.
---

# Project Maintenance Skill

Use this skill when performing general project cleanup, dependency updates, or security audits.

## Workflows

### 1. Dependency Updates

- Check for outdated packages: `pnpm outdated`.
- Update specific packages in the right workspace: `pnpm --filter @nomad-counter/web add [package]@latest`.
- Avoid heavy dependencies unless they remove real risk or complexity.
- Always run `pnpm lint` and `pnpm check` after updates.

### 2. Security Audits

- Run `pnpm audit`.
- Attempt automatic fixes: `pnpm audit --fix`.
- Manually review high-severity vulnerabilities if no automatic fix is available.

### 3. Linting and Fixing

- Check for style/convention issues: `pnpm lint`.
- Auto-fix fixable issues: `pnpm exec eslint --fix .`.
- Manually address remaining errors (e.g., `no-unknown-classes`, `no-nested-ternary`).
- Verify TypeScript consistency: `pnpm check`.

### 4. Deployment Check

- Web deploys to Cloudflare Pages from `apps/web/dist`.
- API deploys to Cloudflare Workers; DB is Cloudflare D1.
- Ensure `apps/web/astro.config.ts`, `apps/web/wrangler.toml`, and `apps/api/wrangler.toml` stay aligned with the deployment target.
- Production email-code auth must not rely on local `devCode` behavior.

### 5. Full Quality Gate

Before substantial work is complete, run:

```sh
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm knip
pnpm spellcheck
```
