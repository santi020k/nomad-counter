---
name: Content Collections Architecture
description: Guidance for introducing Astro Content Collections if Nomad Counter needs structured docs/content.
---

# Content Collections Skill

Use this skill only if Nomad Counter introduces structured markdown/MDX content. It currently does not use Astro Content Collections.

## Architecture

If added, Astro Content Collections should live in `apps/web/src/content.config.ts`. The schema uses Zod (`astro:content`'s exported `z`) to ensure strict typing and validation.

Possible future collections:

- `guide`: Tax-residency tracking explainers (`apps/web/src/content/guide/`)
- `changelog`: Product updates (`apps/web/src/content/changelog/`)

## Modifying a Schema

When adding a new frontmatter field to a collection type:

1. Open `apps/web/src/content.config.ts`.
2. Locate the relevant `defineCollection` block.
3. Add the field using Zod validation.

    ```any
      // Example: Adding an optional 'featured' boolean
      featured: z.boolean().default(false).optional()
    ```

4. If the field is a reference to another collection or a complex type, consider using `.transform()` to sanitize or format the data on load. Run `pnpm --filter @nomad-counter/web check` to verify types.

## Fetching Content

Always use the built-in `getCollection` and `getEntry` methods from `astro:content`.

```any
import { getCollection, getEntry } from 'astro:content'

// Fetch all entries in a collection
const allPosts = await getCollection('post', ({ data }) => {
  // Filter out drafts automatically
  return data.draft !== true
})

// Sort by date (descending)
const sortedPosts = allPosts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())

// Fetch a single entry by ID
const specificProject = await getEntry('project', 'my-cool-project')
```

## Referencing Images

When defining `coverImage` or `ogImage` schemas, the collection uses Astro's `image()` helper to natively resolve relative image assets into processed `<Image />` objects. Always ensure image paths in markdown resolve correctly relative to the markdown file itself.
