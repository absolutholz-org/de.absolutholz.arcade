---
id: storybook-documentation
name: Storybook Component Documentation
description: Rules for authoring interactive Storybook stories and MDX documentation focusing on interactive-first args and layout decorators
targets: ['**/*.stories.tsx', '**/*.mdx']
---

# Storybook Documentation Skill

This skill outlines the strict rules and standards for authoring interactive Storybook stories and companion MDX documentation within the design system.

## 1. Interactive First

- Focus heavily on interactive play routines and complete `args` support over static code blocks.
- Every story must be built so that the component can be dynamically manipulated live inside the Storybook UI controls panel.
- Avoid creating static, non-interactive stories (e.g. Gallery or Nested Themes layouts) in the stories files. Instead, keep stories files focused purely on interactive controls. If static representation is needed, document it centrally in design system documentation (e.g., `Themes.mdx`) rather than component stories.
- **Do not merge multiple prop variants into a single composite story**: Never render multiple variations of a component side-by-side with hardcoded props inside a single story's custom render function (as this renders the Storybook controls panel useless for that story). Instead, split each variant into its own dedicated story export using specific `args`. If a layout context (like a constrained container width) is required to showcase a state (e.g., truncation), wrap the story using a custom decorator.
- **Story Descriptions**: Document the purpose of each individual story using the `parameters.docs.description.story` parameter. This renders explanatory text for that specific variant/state directly in the Storybook Docs panel.

## 2. Existing Component Reuse

- **Prefer Library Components in Demos**: When constructing interactive showcases, demo layouts, cards, wrappers, lists, or headers within story CSF files and MDX documentation files, **always** prefer components from this library (like `<Text>` and `<Theme>`) over raw HTML elements (`<h3>`, `<p>`, `<span>`, `<div>`) or duplicate custom styled-components.
- **Normal Markdown for Docs Text**: Standard MDX documentation text (such as article headings, lists, and body paragraphs) should be written in standard Markdown, without using system components or styled wrappers, to align with other MDX files in the workspace.
- **Theming Integration**: For custom layout sections, cards, or story wrappers that showcase color combinations, wrap the layout in the `<Theme>` component, passing the appropriate `name` prop (e.g., `<Theme name="secondary">` or `<Theme name={args.themeName}>`). Avoid manual CSS variable binding or theme class names.
- **Typography Integration**: For descriptive labels, titles, notes, descriptions, headers, or metadata in story examples, import and use the `<Text>` component with an appropriate semantic `variant` (e.g. `'display'`, `'h1'`, `'h2'`, `'h3'`, `'base'`, `'small'`) and optionally configure the wrapping element via the `as` prop (e.g. `<Text variant="h3" as="h3">`).
- **Relative Imports**: Ensure existing library components are imported relatively from their respective folders.
  - E.g., `import { Text } from '../Text';`
  - E.g., `import { Theme } from '../Theme';`
- **Storybook MDX Imports**: When creating or updating MDX documentation files (`.mdx`), always import `Meta` from `@storybook/addon-docs/blocks` (e.g., `import { Meta } from '@storybook/addon-docs/blocks';`). Do NOT import `Meta` from `@storybook/blocks`.

### Code Example (Stories File)

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Theme } from '../Theme';
import { Text } from '../Text';
import { Button } from './_Button';

const meta = {
	component: Button,
	title: 'Components/Button',
} satisfies Meta<typeof Button>;

export default meta;

export const ThemedExample: StoryObj<typeof meta> = {
	render: (args) => (
		<Theme name="secondary">
			<div
				style={{
					padding: '1.5rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '0.75rem',
				}}
			>
				<Text variant="h3" as="h3">
					Themed Button Preview
				</Text>
				<Text variant="base">
					The button below inherits styling from the secondary theme context.
				</Text>
				<Button {...args} />
			</div>
		</Theme>
	),
};
```

### Code Example (MDX File)

```mdx
import { Meta } from '@storybook/addon-docs/blocks';
import { Theme } from '../Theme';
import { Text } from '../Text';

<Meta title="Foundations/Documentation Example" />

<Theme name="contrast">
	<div style={{ padding: '1.5rem' }}>
		<Text variant="h1" as="h1">
			Documentation Header
		</Text>
		<Text variant="base">
			This is a custom documentation block that uses design system components to
			ensure layout alignment and visual consistency.
		</Text>
	</div>
</Theme>
```

## 3. Type-Driven Controls & Validation

- Automatically leverage TypeScript component prop interfaces (e.g., `ComponentProps<typeof MyComponent>`) or strict types to generate auto-documented Storybook control inputs.
- Avoid hardcoding manual control configurations unless an explicit custom override (like a specialized color picker or select dropdown mapping) is absolutely required for clarity.
- **No Hardcoded Control Options**: For controls with options (such as `select` or `radio`), do not duplicate or hardcode option string arrays in story files. Instead, import and reuse the constants, type arrays, or mapping keys:
  - Reuse component-specific variants using `CAROUSEL_VARIANTS` or `Object.keys(SEMANTIC_VARIANTS)`.
  - Reuse global styles or design tokens using `spacingKeys` or standard theme/spacing constants from the design system styles (e.g., `../../styles/spacing`).
- Author multiple purposeful story states (e.g., `Default`, `Loading`, `Disabled`, `WithError`) to thoroughly document how a component adapts to business logic, edge cases, and accessibility boundaries.
- Defer completely to the workspace's root `.editorconfig`, `.prettierrc`, and `eslint.config.js` files for all code spacing and syntax formatting. Do not include explicit `.ts` or `.tsx` file extensions inside your `import` paths. Do not execute any production compilation commands (`pnpm build`).
