---
name: Adding Pages
description: Steps for creating new top-level routes and updating standard site navigation.
---

# Adding Pages Skill

Use this skill to create a new standalone route/page in the application.

## Workflow

### 1. Create the Route

- Add a new `.astro` file in `apps/web/src/pages/` (e.g., `apps/web/src/pages/privacy.astro`).
- Use file-based routing: the filename becomes the URL path (`/about/`).

### 2. Implement the Base Layout

Nomad Counter does not currently have one universal app layout. Match the closest existing pattern:

- Public app experience: follow `apps/web/src/pages/index.astro`.
- Legal/static pages: use `apps/web/src/layouts/LegalPage.astro`.
- Shared footer: use `apps/web/src/components/SiteFooter.astro`.

```astro
---
import LegalPage from '@/layouts/LegalPage.astro'

const title = 'Privacy policy'
const description = 'How Nomad Counter handles guest-first data.'
---

<LegalPage title={title} description={description}>
  <section>
    <h2>Summary</h2>
    <p>Page content.</p>
  </section>
</LegalPage>
```

### 3. Update Site Navigation

If the new page should be linked in the header/footer menus:

- Update the relevant page/component directly. Current navigation lives in page markup and `SiteFooter.astro`, not in a central `site.config.ts`.
- Keep the first screen focused on the counter experience. Do not turn the homepage into a detached marketing landing page.

### 4. Verify

Ensure the page builds without errors:

```sh
pnpm --filter @nomad-counter/web check
pnpm --filter @nomad-counter/web build
```
