# Nomad Counter Brand Guidelines

Nomad Counter is a practical tool for people who move across borders and need a calm way to understand day-count exposure. The brand should feel precise, portable, and trustworthy without becoming stiff or financial-institution cold.

## Brand Idea

Know your days before they count against you.

Nomad Counter turns travel history into a clear residency-risk dashboard. The identity combines travel cues, calendar precision, and the 183-day threshold.

## Personality

- Clear, not legalistic.
- Calm, not alarmist.
- Useful, not decorative.
- Personal, not enterprise-heavy.
- Precise, not fussy.

## Voice

Write like a careful travel companion with good spreadsheets.

Use:

- "Track your days."
- "Save to your account."
- "You are within 14 days of the threshold."
- "Entry and exit dates both count."
- "This is not tax advice."

Avoid:

- "Optimize your global tax footprint."
- "Guarantee compliance."
- "Hack residency."
- Dense legal phrasing.
- Fear-driven warnings.

## Color System

Primary palette:

| Token | Hex | Use |
|---|---:|---|
| Primary violet | `#471AA0` | Logo, primary buttons, key labels |
| Deep violet | `#4C1D95` | Dark accents, high-emphasis UI |
| Supporting purple | `#804BC4` | Gradients, secondary accents |
| Lavender | `#B579E6` | Soft surfaces and highlights |
| Background | `#F8FAFC` | Light app background |
| Surface | `#FFFFFF` | Cards and panels |
| Text | `#1F2937` | Primary copy |
| Muted text | `#6B7280` | Supporting copy |
| Border | `#E5E7EB` | Dividers and panel outlines |
| Warning | `#EAB308` | Near-threshold states |
| Success | `#14B8A6` | Healthy/safe states |
| Danger | `#DC2626` | Exceeded-threshold states |

Guidance:

- Use violet as the brand signal, not as a full-page wash.
- Keep surfaces light and readable.
- Use warning and danger only for actual state, never decoration.
- Dark mode should preserve the violet identity while keeping contrast high.

## Typography

Use Inter or the system sans fallback.

- Hero headlines: large, direct, tight but readable.
- App headings: compact and scannable.
- Form labels: short, bold, and muted.
- Numeric day counts: high contrast and easy to compare.

Do not use negative letter spacing. Do not scale fonts directly with viewport width except through bounded `clamp()` values already checked on mobile.

## Logo

The current identity uses a route-stamp mark with `183` as the central signal. It should feel like a travel stamp and a counter at the same time.

Source files live in:

- `assets/brand/brand-source.svg`
- `assets/brand/logo-mark.svg`
- `assets/brand/logo-light.svg`
- `assets/brand/logo-dark.svg`

Generated public assets live in:

- `apps/web/public/logo.svg`
- `apps/web/public/logo-dark.svg`
- `apps/web/public/favicon.svg`
- `apps/web/public/favicon.ico`
- `apps/web/public/favicon-16.png`
- `apps/web/public/favicon-32.png`
- `apps/web/public/favicon-48.png`
- `apps/web/public/apple-touch-icon.png`
- `apps/web/public/android-chrome-192.png`
- `apps/web/public/android-chrome-512.png`
- `apps/web/public/og-image.png`
- `apps/web/public/safari-pinned-tab.svg`

Logo rules:

- Keep the mark legible at favicon size.
- Use the wordmark when there is enough horizontal space.
- Use the mark only in tight UI.
- Do not stretch, rotate, recolor randomly, or add shadows.
- Maintain clear space around the logo equal to at least half the mark width.

## Layout

The first screen should show the product promise and the working counter path. Marketing should help users understand the tool, but the app itself remains the primary experience.

Use:

- Full-width sections with constrained inner shells.
- Compact panels for forms, summaries, and lists.
- 8px border radius for cards, panels, buttons, and inputs.
- Responsive grids that collapse cleanly to one column.
- Stable dimensions for controls so content does not shift.

Avoid:

- Cards inside cards.
- Oversized decorative sections.
- Decorative blobs or generic gradients that do not support the product.
- Hidden content that depends on JavaScript to appear.

## Motion

Motion should make the interface feel responsive, not theatrical.

- Use short entrance animations under 600ms.
- Respect `prefers-reduced-motion`.
- Never set important content to invisible until client JavaScript runs.
- Buttons can have subtle active states.
- Avoid looping animation in core app surfaces.

## SEO And Social

Open Graph images should be 1200 x 630 and include the logo, product name, and a clear promise. Keep thumbnails readable at small sizes.

The homepage should include:

- Canonical URL.
- Meta description.
- Open Graph metadata.
- Twitter card metadata.
- SoftwareApplication JSON-LD.
- Visible explanation of the day-counting rule.

## Accessibility

- Keep color contrast strong across light and dark modes.
- Use one `<h1>` per page.
- Keep form labels visible.
- Provide status regions for async auth and sync messages.
- Ensure keyboard users can skip to the counter.
- Run the accessibility Playwright test after UI changes.

## Examples

Good headline:

> Know your days before they count against you.

Good support copy:

> Explore your travel history, tally every day, and see when a country is getting close to a residency threshold.

Good warning:

> Spain is within 12 days of the 183-day threshold.

Good empty state:

> Add a trip to see your residency exposure instantly.
