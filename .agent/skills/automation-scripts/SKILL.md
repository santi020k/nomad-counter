---
name: Automation Scripts
description: Guidelines for using Nomad Counter utility scripts for assets and maintenance.
---

# Automation Scripts Skill

Use this skill when you need to run, modify, or troubleshoot utility scripts used for generated web assets.

## Directory Structure

Current scripts live near the package that uses them:

- `apps/web/scripts/generate-assets.mjs`: generates favicon/brand/OG assets with Sharp.

## JavaScript Scripts (pnpm shortcuts)

Most JS scripts are integrated into the package workflow.

| Task | Command | Script Path |
| --- | --- | --- |
| **Generate Web Assets** | `pnpm --filter @nomad-counter/web run generate:assets` | `apps/web/scripts/generate-assets.mjs` |
| **Build Web** | `pnpm --filter @nomad-counter/web build` | runs asset generation first |

### Prerequisites
- Node.js 22+
- `pnpm install` dependencies

## Troubleshooting

- **Path Errors**: Ensure you run all commands from the **project root**.
- **Sharp Issues**: If image generation fails, confirm `sharp` installed correctly for the current platform.
- **Dependency Issues**: If a script fails to import a module, check that `pnpm install` was executed.
