---
name: seo
description: SEO optimization for this Astro website. Use this skill whenever working on meta tags, Open Graph, structured data (JSON-LD), sitemaps, robots.txt, Core Web Vitals, image optimization, page speed, internal linking, or any task related to search engine visibility and ranking. Trigger on mentions of SEO, search ranking, Google, meta description, canonical URL, schema markup, page speed, Lighthouse score, or discoverability.
---

# SEO Skill — Astro / santi020k Website

This site uses `@astrojs/sitemap`, `astro-robots-txt`, and page-level metadata as the source of truth for discoverability.

## Quick Reference

| Concern | Where it lives |
|---|---|
| Site-wide metadata | `apps/web/src/pages/*.astro` |
| Sitemap | `@astrojs/sitemap` in `apps/web/astro.config.ts` |
| robots.txt | `astro-robots-txt` in `apps/web/astro.config.ts` |
| Open Graph images | Generated brand assets in `apps/web/public/` |
| Structured data | Inline `<script type="application/ld+json">` in pages |

## Meta Tags

Every public page should include:

- A unique `<title>`.
- A concise meta description.
- A canonical URL.
- Open Graph title, description, URL, image, type, and site name.
- Twitter card, title, description, and image.

## Structured Data

Inject JSON-LD server-side:

```astro
<script
  type="application/ld+json"
  set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Nomad Counter',
    applicationCategory: 'FinanceApplication',
  })}
/>
```

## Sitemap And Robots

Both are managed by Astro integrations. Exclude only pages that are intentionally private or non-indexable.

## Open Graph Images

OG images should:

- Be 1200 x 630 px.
- Include the page title and site branding.
- Have enough contrast to work as a small thumbnail.

## Core Web Vitals And Performance

- Keep above-the-fold UI text-rendered and visible without client JavaScript.
- Give fixed-format brand images explicit dimensions where possible.
- Respect `prefers-reduced-motion`.
- Keep app boot JavaScript lightweight; the counter should render usable empty states quickly.

## Content SEO

- Use one `<h1>` per page.
- Use descriptive link text.
- Keep headings in order.
- Explain domain-specific rules in normal page content, not only in scripts.

## SEO Audit Checklist

- [ ] Unique, descriptive `<title>`.
- [ ] Meta description present.
- [ ] Canonical URL set correctly.
- [ ] `og:image` points to a valid, fully-qualified URL.
- [ ] Structured data is server-rendered.
- [ ] No duplicate `<h1>` tags.
- [ ] All meaningful images have `alt` text.
- [ ] Page is in sitemap unless intentionally excluded.
- [ ] No broken internal links.
