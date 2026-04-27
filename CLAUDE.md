# Claude / AI Assistant Notes

Use `AGENTS.md` as the canonical agent guide. This file exists so Claude-style tools and other assistants discover the same operating context quickly.

## Default Behavior

- Read `AGENTS.md`, `README.md`, and relevant files before changing code.
- Preserve the guest-first product model.
- Keep the Cloudflare-native architecture.
- Respect the brand system in `docs/brand-guidelines.md`.
- Run the quality gate listed in `AGENTS.md` after changes.

## Strong Preferences

- Small, focused changes over broad rewrites.
- Clear product copy over clever tax language.
- Server-rendered SEO metadata.
- Accessible UI with visible focus, semantic headings, and reduced-motion support.
- Local-first counter behavior, with account sync as an enhancement.

## Avoid

- Supabase or Vercel-specific architecture.
- Requiring sign-in before the user can count days.
- New icon libraries without checking sibling repo conventions.
- Date math that depends on local timezone conversion.
- Brand changes that drift away from the violet route-stamp identity.
