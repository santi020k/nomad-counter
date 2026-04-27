---
name: Testing Infrastructure
description: Guidelines for writing and running Playwright tests and future focused unit tests in Nomad Counter.
---

# Testing Skill

Use this skill when adding new features or fixing bugs to ensure regression testing is in place.

## Test Types

### 1. E2E Tests (Playwright)

- **Location**: `apps/web/tests/*.spec.ts`
- **Purpose**: Test public UI, accessibility, SEO metadata, and guest-first counter flows.
- **Commands**:
  - `pnpm --filter @nomad-counter/web test`: Run web Playwright tests.
  - `pnpm test`: Run the workspace test pipeline.

### 2. Future Unit Tests

- **Likely locations**:
  - `apps/web/src/**/*.test.ts` for web date helpers and UI logic.
  - `apps/api/src/**/*.test.ts` for API date math and route helpers.
- **Purpose**: Test pure date/counting logic without requiring a browser.
- **Commands**:
  - Add scripts before relying on them; this repo currently has Playwright tests as the active suite.

## Best Practices

- **Isolation**: Pure utility functions should be tested close to their implementation.
- **Naming**: Use descriptive `describe` and `it`/`test` blocks.
- **Timezones**: Use ISO `YYYY-MM-DD` strings and existing helpers. Do not introduce ad hoc `Date` arithmetic for residency counts.
- **Astro Components**: For component testing, prefer E2E tests for now as they validate the full rendered output in a real browser.
