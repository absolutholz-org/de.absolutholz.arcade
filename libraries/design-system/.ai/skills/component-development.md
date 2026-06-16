# Component Development Skill

This skill defines the technical standards, folder constraints, naming conventions, and styling architectures required to build and maintain design system components in this workspace.

## 1. Folder Constraint & File Matrix

All components must live in an isolated directory under `src/components/ComponentName/`.

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
   - **Purpose:** Storybook documentation. Ensure every component state/prop variant is written as its own story export using `args` to keep Storybook's interactive controls functional. Avoid composite layouts that render multiple variations side-by-side inside a single story. Document each story's purpose using the `parameters.docs.description.story` parameter.
7. `_ComponentName.styles.ts` (Optional)
   - **Purpose:** Emotion CSS-in-JS styled definitions.

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

## 3. Core React Rules

- **Functional Components**: All components must be functional components using standard function declarations or arrow functions.
- **Single Responsibility**: Each component should do one thing well. To enforce this, keep components under a **200-line limit**. If a component grows beyond 200 lines, it must be broken down.
- **No Initial Props Spread**: Do not initially add a `...props` or `...rest` spread to new components. Explicitly destruct and map only the props the component actually requires, keeping props explicit.
- **Exports**: Prefer **named exports** over default exports for better IDE autocomplete, searchability, and consistent naming across imports.

## 4. Styling Architecture

- **Emotion CSS-in-JS**: We strictly use Emotion CSS-in-JS (`@emotion/react` and `@emotion/styled`) for all component styling.
- **No Inline Styles**: Avoid inline styles (`style={{ ... }}`) unless rendering truly dynamic values like runtime-calculated offsets, percentages, or absolute positions.
- **Styled Component Naming**: In `_ComponentName.styles.ts`, name the exported styled components to match the name of the corresponding component being styled (e.g., `export const Text = styled.div...`).
- **Styled Import Convention**: In `_ComponentName.tsx`, import all styled definitions under the `S` namespace (`import * as S from './_ComponentName.styles'`) and render them as `<S.ComponentName ...>`.
- **Restricting Overrides**: Protect components from layout-compromising overrides. Do not allow raw `style` props. In `_ComponentName.types.ts`, explicitly omit `'style'` from component props (e.g. `Omit<ComponentPropsWithoutRef<C>, 'style'>`).
- **Legacy Deletion**: All legacy references to Vanilla Extract, CSS modules, or `.css.ts` compilation extensions are obsolete and must not be used.
- **Respect Global Reset & Styles**: Do not add redundant styles that are already defined in the global reset or global styles. For example, do not declare `box-sizing: border-box;` in styled components, as it is already handled globally by the reset layer.
