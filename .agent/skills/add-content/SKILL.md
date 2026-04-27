---
name: Add New Content
description: Guidelines for adding future static content to Nomad Counter.
---

# Add New Content Skill

Use this skill only if Nomad Counter grows static content such as docs, help pages, or guides. The app does not currently use Astro content collections.

## Prerequisite

Check the current app structure first. If content collections are introduced, define the schema before adding entries.

## Steps

### 1. Create the File

- Prefer simple `.astro` pages under `apps/web/src/pages/` for small static pages.
- If a real content system is needed, create `apps/web/src/content.config.ts` and typed collections deliberately.
- Filename convention: `kebab-case-title.md`.

### 2. Define Frontmatter

Ensure the frontmatter matches the schema. Example for a post:

```markdown
---
title: "My New Post"
description: "Brief summary of the post"
publishDate: "18 Mar 2026"
tags: ["tag1", "tag2"]
---
```

### 3. Add Content

- Use standard Markdown or MDX elements.
- For images, place them in the same directory as the content file and reference them relatively (e.g., `./image.png`).
- Use custom components if needed (e.g., `<Icon name="..." />`).

### 4. Verify

- Run `pnpm --filter @nomad-counter/web dev` to preview the new content.
- Check for accessibility and proper formatting.
- Ensure the build passes without errors.
