---
name: accessibility
description: Web accessibility (a11y) for this Astro + vanilla TypeScript + Tailwind website. Use this skill when auditing pages for accessibility, adding ARIA attributes, fixing keyboard navigation, improving color contrast, writing semantic HTML, making interactive vanilla TypeScript components accessible, or any task related to WCAG compliance, screen reader compatibility, or inclusive design. Trigger on mentions of accessibility, a11y, WCAG, ARIA, screen reader, keyboard navigation, focus management, color contrast, or inclusive design.
---

# Accessibility Skill — Nomad Counter

Target: **WCAG 2.2 Level AA** conformance throughout the site. Accessibility is not an audit checkbox — it makes the site better for everyone (better keyboard nav, better SEO, better mobile UX).

---

## Core Principles (POUR)

- **Perceivable**: All non-text content has text alternatives. Content isn't conveyed by color alone.
- **Operable**: Everything works with a keyboard. No time limits. Enough time to read content.
- **Understandable**: Language is set. Error messages are clear. Navigation is predictable.
- **Robust**: HTML is valid. ARIA is used correctly. Works with current and future assistive tech.

---

## Semantic HTML First

The best accessibility code is correct HTML. Before reaching for ARIA, ask: *is there a native element for this?*

| Use this... | Not this... |
|---|---|
| `<button>` | `<div onclick>` or `<a>` with no href |
| `<nav>` | `<div class="nav">` |
| `<main>` | `<div id="main">` |
| `<h1>`–`<h6>` in order | Bold text in divs |
| `<ul>`/`<ol>` | Divs with bullet styling |
| `<label for="id">` | Text near an input |

### Heading hierarchy
One `<h1>` per page (the page title). Never skip levels (`<h1>` → `<h3>` is wrong). Headings communicate document outline — not visual size. For visual sizing, use Tailwind classes on correct semantic headings.

---

## Images

```astro
<!-- Informative image -->
<Image src={photo} alt="Screenshot of the dashboard showing real-time analytics" />

<!-- Decorative image — empty alt, no role needed with <Image /> -->
<Image src={decoration} alt="" />

<!-- Icon with text label — icon is decorative -->
<Icon name="mdi:github" aria-hidden="true" />
<span>View on GitHub</span>

<!-- Standalone icon button -->
<button type="button" aria-label="Open menu">
  <Icon name="mdi:menu" aria-hidden="true" />
</button>
```

---

## Keyboard Navigation

Every interactive element must be keyboard reachable and operable.

**Focus visibility** — ensure focus ring is always visible. In Tailwind v4 with `global.css`:
```css
/* Make sure focus is visible on all interactive elements */
:focus-visible {
  outline: 2px solid var(--color-accent-base);
  outline-offset: 2px;
}
```

**Skip link** — add a skip-to-content link as the very first focusable element in the layout:
```astro
<a
  href="#main-content"
  class="
    sr-only
    focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50
    focus:rounded-sm focus:bg-accent-base focus:px-4 focus:py-2 focus:text-white
  "
>
  Skip to main content
</a>
```

**Tab order** — follow reading order. Avoid `tabindex` values greater than 0. Use `tabindex="0"` only to make non-interactive elements focusable when necessary (rare). Use `tabindex="-1"` to manage programmatic focus.

---

## Vanilla TypeScript Accessible Patterns

Vanilla TypeScript components require manual ARIA when they become custom widgets. Prefer native elements first, then wire state with plain DOM APIs in `apps/web/src/lib/app.ts` or page-local scripts.

### Disclosure (show/hide)
```astro
<button type="button" aria-expanded="false" aria-controls="panel-id" data-disclosure>
  Toggle section
</button>
<div id="panel-id" hidden>
  Content here
</div>

<script>
  document.querySelectorAll('[data-disclosure]').forEach(button => {
    const controls = button.getAttribute('aria-controls')
    const panel = controls ? document.getElementById(controls) : null

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true'

      button.setAttribute('aria-expanded', String(!open))

      if (panel) {
        panel.hidden = open
      }
    })
  })
</script>
```

### Modal / Dialog
- Prefer the native `<dialog>` element for simple dialogs.
- Set `aria-labelledby`, provide a visible heading, and return focus to the opener when closing.
- Trap focus only when a true modal is open.

### Tabs
- Use `role="tablist"`, `role="tab"`, `aria-selected`, roving `tabindex`, and arrow-key navigation.
- Keep the selected panel visible without requiring animation to reveal essential content.

### Navigation with mobile toggle
- Use a real `<button>` for menu toggles.
- Keep `aria-expanded` synchronized with visibility.
- Ensure links remain reachable when CSS or JavaScript fails.

---

## Color & Contrast

WCAG AA requires:
- **4.5:1** contrast ratio for normal text (< 18px or < 14px bold)
- **3:1** contrast ratio for large text (≥ 18px or ≥ 14px bold)
- **3:1** for UI components and focus indicators

When defining colors in `apps/web/src/styles/global.css`, test them against your background colors before committing. Use tools like:
- [coolors.co/contrast-checker](https://coolors.co/contrast-checker)
- Chrome DevTools > Accessibility panel
- axe browser extension

Don't convey information by color alone — always pair color with an icon, label, or text pattern.

---

## Forms

```astro
<!-- Always associate labels with inputs -->
<label for="email">Email address</label>
<input
  type="email"
  id="email"
  name="email"
  required
  aria-required="true"
  aria-describedby="email-hint email-error"
/>
<p id="email-hint" class="text-muted text-sm">We'll never share your email.</p>
<p id="email-error" role="alert" class="text-sm text-red-600" hidden>
  Please enter a valid email address.
</p>
```

Use `role="alert"` or `aria-live="polite"` for dynamic error messages so screen readers announce them.

---

## Live Regions & Dynamic Content

When content updates dynamically (vanilla TypeScript shows/hides, notifications appear, etc.), screen readers need to be notified:

```html
<!-- Polite: announces when user is idle (most cases) -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Update this text when status changes -->
  <span x-text="statusMessage"></span>
</div>

<!-- Assertive: interrupts immediately (errors, critical alerts only) -->
<div role="alert">
  An error occurred. Please try again.
</div>
```

---

## Screen Reader Only Utility

Tailwind's `sr-only` class hides content visually but keeps it accessible. Use it for:
- Extra context for icon-only buttons
- Labels that would be redundant visually but needed for assistive tech
- Skip links (before focus)

```html
<button>
  <Icon name="mdi:trash" aria-hidden="true" />
  <span class="sr-only">Delete post</span>
</button>
```

---

## Accessibility Audit Checklist

Run these checks before shipping any significant page change:

**Automated:**
- [ ] Run axe DevTools in browser (zero critical/serious violations)
- [ ] Run Lighthouse accessibility audit (score ≥ 95)
- [ ] Validate HTML at validator.w3.org (no errors)

**Manual:**
- [ ] Tab through the entire page — all interactive elements reachable
- [ ] Shift+Tab works correctly (reverse tab order)
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and dropdowns
- [ ] Screen reader reads all content meaningfully (VoiceOver on Mac or NVDA on Windows)
- [ ] No keyboard traps (you can always leave any interactive widget)
- [ ] Skip link is the first focusable element and works

**Visual:**
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast passes AA for all text
- [ ] No information conveyed by color alone
- [ ] Content readable at 200% zoom without horizontal scrolling
- [ ] Animations respect `prefers-reduced-motion`

---

## Reduced Motion

Always respect `prefers-reduced-motion`. In Tailwind, use the `motion-safe:` and `motion-reduce:` variants:

```html
<div class="transition-all duration-300 motion-reduce:transition-none">
  <!-- content -->
</div>
```

In vanilla TypeScript transitions, check the media query:
```js
// Disable transitions for users who prefer reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

In `global.css`, add a global rule as a safety net:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
