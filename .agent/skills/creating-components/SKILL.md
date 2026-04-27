---
name: Creating Components
description: Guidelines for creating reusable Astro components, accepting props, and matching Nomad Counter styles.
---

# Creating Components Skill

Use this skill when tasked with building a new UI component or refactoring an existing one in `apps/web/src/components/`.

## Best Practices

### 1. Component Placement

- Place generic UI elements directly in `apps/web/src/components/`.
- If the component belongs to a specific feature or layout section, nest it appropriately.

### 2. File Structure

An `.astro` file consists of two main parts: the Component Script (between `---`) and the Component Template.

```astro
---
// Component Script: Imports and Logic
// Always define expected props using a TypeScript interface
interface Props {
  title: string
  isActive?: boolean
}

const { title, isActive = false } = Astro.props
---

<!-- Component Template: HTML and JSX-like syntax -->
<div
  class="flex items-center rounded-lg p-4"
  class:list={[{ 'bg-blue-500 text-white': isActive }, { 'bg-gray-100': !isActive }]}
>
  <span>{title}</span>
</div>
```

### 3. Styling Rules

- **Project CSS**: Prefer existing CSS variables from `apps/web/src/styles/global.css` and page-local/component-local styles.
- **Tailwind**: Tailwind 4 is available, but this app currently leans on semantic CSS classes and custom properties.
- **Icons**: Use existing brand assets or small inline SVGs. Do not add an icon package just for one icon.
- **Formatting**: Keep class/style strings readable and scoped. Avoid unrelated design-system rewrites.

### 4. Interactive Components

If a component requires client-side interactivity:

- Prefer vanilla TypeScript in `apps/web/src/lib/app.ts` for app behavior.
- Use Astro `<script>` blocks for page-local progressive enhancement.
- Do not make the counter require sign-in or client JavaScript for basic content visibility.
