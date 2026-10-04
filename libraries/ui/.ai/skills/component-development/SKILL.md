---
id: component-development
name: Component Development
description: Guidelines for creating and structuring UI component matrices in the design system
targets: ['libraries/design-system/src/components/*']
---

# Component Development Skill

This skill defines the technical standards, folder constraints, naming conventions, and styling architectures required to build and maintain design system components in this workspace.

## 1. Folder Constraint & File Matrix

All components must live in an isolated directory under `src/components/ComponentName/`.

Each component directory must be split into the following distinct files:

1. `index.ts`
   - **Purpose:** Pure barrel export.
     For a component named Accordion, the public index.ts barrel file must look exactly like this minimal setup, with absolutely zero type or internal sub-exports:
     ```typescript
     export { Accordion } from './_Accordion';
     ```
2. `_ComponentName.tsx`
   - **Purpose:** View layer only.
3. `_ComponentName.hooks.ts`
   - **Purpose:** State and logic hook.
4. `_ComponentName.constants.ts`
   - **Purpose:** Static data.
5. `_ComponentName.types.ts`
   - **Purpose:** TypeScript types.
6. `_ComponentName.stories.tsx`
   - **Purpose:** Storybook documentation. Ensure every component state/prop variant is written as its own story export using `args` to keep Storybook's interactive controls functional. Avoid composite layouts that render multiple variations side-by-side inside a single story. Document each story's purpose using the `parameters.docs.description.story` parameter.
7. `_ComponentName.styles.ts` (Optional)
   - **Purpose:** Linaria zero-runtime styled definitions and CSS template literals.
8. `_ComponentName.functions.ts` (Optional)
   - **Purpose:** Pure utility and helper functions.

## 2. Naming Convention

- Every file in the component directory, except `index.ts`, must be explicitly prefixed with an underscore (`_`) followed by the component name.
- Example for a component named `SchemeSwitcher`:
  - `index.ts`
  - `_SchemeSwitcher.tsx`
  - `_SchemeSwitcher.hooks.ts`
  - `_SchemeSwitcher.constants.ts`
  - `_SchemeSwitcher.types.ts`
  - `_SchemeSwitcher.stories.tsx`
  - `_SchemeSwitcher.styles.ts` (if styling is needed)
  - `_SchemeSwitcher.functions.ts` (if utility/helper functions are needed)

## 3. Core React Rules

- **Functional Components**: All components must be functional components using standard function declarations or arrow functions.
- **Single Responsibility**: Each component should do one thing well. To enforce this, keep components under a **200-line limit**. If a component grows beyond 200 lines, it must be broken down.
- **No Initial Props Spread**: Do not initially add a `...props` or `...rest` spread to new components. Explicitly destruct and map only the props the component actually requires, keeping props explicit.
- **Exports**: Prefer **named exports** over default exports for better IDE autocomplete, searchability, and consistent naming across imports.

## 4. Styling Architecture

- **Linaria Styling**: We strictly use Linaria (`@linaria/core` and `@linaria/react`) for all component styling using standard CSS strings inside template literals (`css`...`` and `styled`...``).
- **No Inline Styles**: Avoid inline styles (`style={{ ... }}`) unless rendering truly dynamic values like runtime-calculated offsets, percentages, or absolute positions.
- **Styled Component Naming**: In `_ComponentName.styles.ts`, name the exported styled components to match the name of the corresponding component being styled (e.g., `export const Text = styled.div...`).
- **CSS Nesting Over Child Styled Components**: Adhere to the Minimal Exports Principle in `/.ai/rules.md` by styling child elements using CSS nesting (e.g., `> span`) inside the parent styled component rather than creating and exporting extra standalone styled sub-components (such as `Content = styled.span`). Only export styled components directly rendered by the view layer.
- **Styled Component Props Destructuring**: Always destructure component props when passing them to styling functions inside styled components.
  - **No**: `max-width: ${(props) => PAGE_CONTAINER_VARIANTS[props.$variant]};`
  - **Yes**: `max-width: ${({$variant}) => PAGE_CONTAINER_VARIANTS[$variant]};`
- **Styled Import Convention**: In `_ComponentName.tsx`, import all styled definitions under the `S` namespace (`import * as S from './_ComponentName.styles'`) and render them as `<S.ComponentName ...>`.
- **Restricting Overrides**: Protect components from layout-compromising overrides. Do not allow raw `style` props. In `_ComponentName.types.ts`, explicitly omit `'style'` from component props (e.g. `Omit<ComponentPropsWithoutRef<C>, 'style'>`).
- **Legacy Deletion**: All legacy references to Vanilla Extract, CSS modules, or runtime CSS-in-JS (such as standard Emotion) are obsolete and forbidden.
- **Respect Global Reset & Styles**: Do not add redundant styles that are already defined in the global reset or global styles. For example, do not declare `box-sizing: border-box;` in styled components, as it is already handled globally by the reset layer.
- **Prefer REM Units**: Always prefer `rem` units for typography, spacing, dimensions (width, height, max-width, max-height), margins, and paddings. Avoid using `px` units unless defining media queries (where `px` or `em` is preferred) or border widths (e.g., `1px solid ...` to keep lines crisp).

## 5. DRY Types & Component Constants

To prevent duplication and enforce a single source of truth, follow this pattern when defining component options (such as layout variants, size keys, themes, or wrap styles):

- **Define in Constants**: Define options as a readonly `const` array (using `as const`) or a mapping object in `_ComponentName.constants.ts`.
  - Example: `export const WRAP_OPTIONS = ['pretty', 'balance', 'truncate', 'normal'] as const;`
- **Derive in Types**: In `_ComponentName.types.ts`, derive the corresponding TypeScript union types from these constants.
  - Example: `export type WrapOption = typeof WRAP_OPTIONS[number];`
- **Import for Stories**: In `_ComponentName.stories.tsx`, import the constants or mapping keys directly and pass them to the control's `options` array.
- **Type-Only Imports for Derivations**: When importing constants into type files (`.types.ts`) solely for type derivation (using `typeof CONSTANT`), always use a type-only import (`import type { CONSTANT }` or `import type { typographyScale }`) to prevent duplicate import errors and comply with strict type-import lint rules.
- **Idiomatic Property Defaults**: Do not create separate, isolated constants for default component properties (such as DEFAULT_VARIANT). Assign fallback values directly within the component function's parameter destructuring signature. Never document default values inside JSDoc prop annotations, as this causes documentation drift when implementations change.
- **Storybook-Only Data Isolation**: Keep all variables, mock strings, helper components, or utility functions that are used exclusively for Storybook stories and MDX documentation directly inside the `.stories.tsx` or `.mdx` files. Do not declare them in the component's core `_ComponentName.constants.ts`, `_ComponentName.tsx`, or implementation files to prevent polluting the production codebase with testing-only concerns (e.g., standard lorem ipsum test text blocks).
