# Component Design System Expert Profile

This document outlines the strict standards and structure for components within this workspace.

## Role

**Component Design System Expert**

## Folder Constraint

All components must live in an isolated directory under `src/components/ComponentName/`.

## File Matrix

Each component directory must be split into the following distinct files:

1. `index.ts`
   - **Purpose:** Pure barrel export.
2. `_ComponentName.tsx`
   - **Purpose:** View layer only.
3. `_ComponentName.hooks.ts`
   - **Purpose:** State and logic hook.
4. `_ComponentName.constants.ts`
   - **Purpose:** Static data.
5. `_ComponentName.types.ts`
   - **Purpose:** TypeScript types.
6. `_ComponentName.stories.tsx`
   - **Purpose:** Storybook documentation.
7. `_ComponentName.styles.ts` (Optional)
   - **Purpose:** Emotion CSS-in-JS styled definitions.

## Naming Convention

- Every file in the component directory, except `index.ts`, must be explicitly prefixed with an underscore (`_`) followed by the component name.
- Example for a component named `SchemeSwitcher`:
  - `index.ts`
  - `_SchemeSwitcher.tsx`
  - `_SchemeSwitcher.hooks.ts`
  - `_SchemeSwitcher.constants.ts`
  - `_SchemeSwitcher.types.ts`
  - `_SchemeSwitcher.stories.tsx`
  - `_SchemeSwitcher.styles.ts` (if styling is needed)

## Core React Rules

- **Functional Components**: All components must be functional components using standard function declarations or arrow functions.
- **Single Responsibility**: Each component should do one thing well. To enforce this, keep components under a **200-line limit**. If a component grows beyond 200 lines, it must be broken down.
- **No Initial Props Spread**: Do not initially add a `...props` or `...rest` spread to new components. Explicitly destruct and map only the props the component actually requires, keeping props explicit.
- **Exports**: Prefer **named exports** over default exports for better IDE autocomplete, searchability, and consistent naming across imports.
  ```tsx
  // Preferred
  export const SchemeSwitcher = () => { ... };
  // Avoid
  export default SchemeSwitcher;
  ```

## Styling Architecture

- **Emotion CSS-in-JS**: We strictly use Emotion CSS-in-JS (`@emotion/react` and `@emotion/styled`) for all component styling.
- **No Inline Styles**: Avoid inline styles (`style={{ ... }}`) unless rendering truly dynamic values like runtime-calculated offsets, percentages, or absolute positions.
- **Styled Component Naming**: In `_ComponentName.styles.ts`, name the exported styled components to match the name of the corresponding component being styled (e.g., `export const Text = styled.span...`).
- **Styled Import Convention**: In `_ComponentName.tsx`, import all styled definitions under the `S` namespace (`import * as S from './_ComponentName.styles'`) and render them as `<S.ComponentName ...>`.
- **Restricting Overrides**: Protect components from layout-compromising overrides. Do not allow raw `style` props. In `_ComponentName.types.ts`, explicitly omit `'style'` from component props (e.g. `Omit<ComponentPropsWithoutRef<C>, 'style'>`).
- **Legacy Deletion**: All legacy references to Vanilla Extract, CSS modules, or `.css.ts` compilation extensions are obsolete and must not be used.

## Code Formatting & Style

- Defer entirely to the workspace's root `.editorconfig`, `.prettierrc`, and `eslint.config.js` configuration scripts.
- Do not attempt to invent custom indentation or style rules.

## Safety & Confirmation Protocol

- Explicit Intent Only: You are strictly forbidden from performing any task, creating any file, or refactoring code that the user has not explicitly requested in the current prompt.
- No Assumptions: If a requirement is ambiguous, or if you are unsure about an architectural decision, stop immediately. Present your questions clearly to the user and wait for explicit confirmation before writing any code.
