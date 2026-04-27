---
name: web-design
description: UI/UX design, visual design system, and web animations for this Astro + vanilla TypeScript + Tailwind v4 website. Use this skill when designing or refining components, building animations and transitions, working on the design system (colors, typography, spacing), implementing scroll-triggered effects, micro-interactions, hover states, page transitions, or any task about how the site looks and feels. Trigger on mentions of design, animation, transition, hover effect, scroll animation, micro-interaction, UI component design, typography, color palette, layout, dark mode, or visual polish.
---

# Web Design + Animations Skill — Nomad Counter

Stack: **Astro 6 + vanilla TypeScript + Tailwind CSS v4**. Design tokens live in `apps/web/src/styles/global.css` as CSS custom properties. All animations should respect `prefers-reduced-motion` (see Accessibility skill).

---

## Design System

### Tokens — `apps/web/src/styles/global.css`

Core colors, spacing, radii, shadows, and effects are defined as CSS custom properties on `:root`, with dark-mode overrides in `@media (prefers-color-scheme: dark)`.

```css
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --text: #1f2937;
  --muted: #6b7280;
  --accent: #471aa0;
  --radius: 8px;
  --shadow-sm: 0 2px 8px rgb(71 26 160 / 8%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #17122a;
    --surface: #21183c;
    --text: #ffffff;
  }
}
```

### Typography Scale

Use Tailwind's built-in scale. Establish semantic patterns as `@utility` in `global.css`:

```css
@utility title {
  @apply text-3xl font-bold tracking-tight leading-tight;
}

@utility subtitle {
  @apply text-xl text-muted leading-relaxed;
}

@utility prose-link {
  @apply text-accent-base underline-offset-2 hover:underline;
}
```

### Spacing System

Stick to the Tailwind scale (4px base unit). For layout spacing, prefer:
- **Component padding**: `p-4` to `p-6`
- **Section gaps**: `gap-8` to `gap-16`
- **Page margins**: `px-4 md:px-6 lg:px-8`

---

## Component Design Patterns

### Cards

A consistent card pattern for repeated items, summaries, legal sections, and compact tool surfaces:

```astro
<article class="
  group relative flex flex-col gap-3
  rounded-xl border border-border bg-surface-raised
  p-5 shadow-soft
  transition-all duration-200
  hover:shadow-medium hover:-translate-y-0.5
  motion-reduce:transition-none motion-reduce:hover:translate-y-0
">
  <h2 class="text-lg font-semibold leading-snug group-hover:text-accent-base transition-colors">
    {title}
  </h2>
  <p class="text-sm text-muted leading-relaxed">{description}</p>
  <a href={href} class="absolute inset-0" aria-label={title}>
    <span class="sr-only">{title}</span>
  </a>
</article>
```

The `group-hover:` trick lets child elements react to the card hover without extra JS.

### Buttons

Define button variants as utilities so they're consistent everywhere:

```css
/* global.css */
@utility btn {
  @apply inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
         transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2;
}

@utility btn-primary {
  @apply btn bg-accent-base text-white hover:bg-accent-base/90 focus-visible:outline-accent-base;
}

@utility btn-ghost {
  @apply btn text-muted hover:bg-surface-raised hover:text-foreground;
}
```

### Badges / Tags

```astro
<span class="inline-flex items-center rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent-base">
  {tag}
</span>
```

---

## CSS Animations

### Keyframe Definitions — `global.css`

```css
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

Register them as theme animation values:
```css
@theme {
  --animate-fade-in: fade-in 0.3s ease-out both;
  --animate-slide-up: slide-up 0.4s ease-out both;
  --animate-scale-in: scale-in 0.2s ease-out both;
}
```

Use with Tailwind's `animate-*` class:
```html
<div class="animate-slide-up motion-reduce:animate-none">...</div>
```

### Staggered List Animation

For lists that should animate in one item at a time, use CSS custom property delay:
```astro
{items.map((item, i) => (
  <li
    class="animate-slide-up motion-reduce:animate-none"
    style={`animation-delay: ${i * 60}ms`}
  >
    {item.name}
  </li>
))}
```

---

## Vanilla TypeScript Transitions

Use CSS classes and attributes for state, then toggle them with small DOM scripts. Keep essential content visible without JavaScript where possible.

- Pair `[hidden]`, `aria-expanded`, and class toggles deliberately.
- Use CSS custom properties for tuneable animation values.
- Wrap motion in `@media (prefers-reduced-motion: no-preference)`.

---

## Scroll-Triggered Animations

Use the `IntersectionObserver` API with a simple Astro `<script>` block. This avoids any dependency and is tiny.

```astro
<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target) // animate once
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  document.querySelectorAll('[data-animate]').forEach((el) => {
    observer.observe(el)
  })
</script>
```

In `global.css`, define the before/after states:
```css
[data-animate] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

[data-animate].is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-animate] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

Use it on any element:
```astro
<section data-animate>
  ...
</section>
```

---

## Page Transitions (Astro View Transitions)

Astro has a built-in View Transitions API. Enable it in the root layout:

```astro
---
import { ViewTransitions } from 'astro:transitions'
---
<head>
  <ViewTransitions />
</head>
```

For custom per-element transitions, use `transition:name` and `transition:animate`:

```astro
<!-- Hero image slides in from the left -->
<Image
  src={hero}
  alt="..."
  transition:name="hero-image"
  transition:animate="slide"
/>

<!-- Blog post title morphs between list and detail page -->
<h1 transition:name={`post-title-${post.slug}`}>
  {post.data.title}
</h1>
```

For a custom fade transition:
```astro
<main transition:animate="fade">
  <slot />
</main>
```

View Transitions automatically respects `prefers-reduced-motion` when using the built-in animations.

---

## Micro-Interactions Checklist

Polish every interactive element with thoughtful micro-interactions:

- **Links in body text**: underline on hover with `transition-colors` (not instant)
- **Buttons**: slight scale down on `:active` (`active:scale-95`)
- **Cards**: lift on hover (`hover:-translate-y-0.5 hover:shadow-medium`)
- **Icon buttons**: color change on hover with transition
- **Form inputs**: border color change on focus, not just an outline
- **Checkboxes / toggles**: smooth color transition

All transitions should use `duration-150` to `duration-200` — snappy feels better than slow. Only use longer durations (300ms+) for large layout changes or reveals.

---

## Dark Mode

The site currently follows `prefers-color-scheme` in `apps/web/src/styles/global.css`. When designing components, test both light and dark variants and define colors through existing CSS variables so they automatically switch.

---

## Responsive Design

Design mobile-first. Start with base classes and layer up:

```html
<div class="
  grid grid-cols-1 gap-4
  sm:grid-cols-2
  lg:grid-cols-3
  xl:gap-6
">
```

**Key breakpoints (Tailwind default):**
- `sm`: 640px — small tablets, large phones
- `md`: 768px — tablets
- `lg`: 1024px — laptops
- `xl`: 1280px — desktops

Always verify designs at 375px (iPhone SE) and 1440px (standard desktop). Check that text never overflows, images scale, and navigation collapses correctly.
