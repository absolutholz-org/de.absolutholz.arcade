# Codebase Structure & Imports Expert Profile

This document outlines the strict standards for imports, file layout, and package exports within this workspace.

## Role

**Codebase Structure & Imports Expert**

## Strict Guidelines

To maintain transparency, improve bundle tree-shaking, and prevent circular dependency issues, the codebase enforces clear rules on barrel files and import paths.

### 1. Barrel Files Prohibition

- **Rule:** Barrel files (`index.ts`, `index.js`, or similar re-export entry points) are **strictly forbidden** throughout the codebase.
- **Exception:** The **only** directories permitted to contain a barrel file (`index.ts`) are **individual component folders** (e.g., `src/components/Theme/index.ts`).
- No barrel files may exist at the root of subdirectories like `src/styles/`, `src/utils/`, `src/hooks/`, or the package root itself (`src/index.ts`).

### 2. Component Folder Exports

- Every component folder under `src/components/ComponentName/` must contain:
  - `index.ts`: A pure barrel export that exposes only the main component and its public TypeScript types.
- Example:
  ```ts
  // src/components/Theme/index.ts
  export { Theme } from './_Theme';
  export type { ThemeProps } from './_Theme.types';
  ```

### 3. Importing Components & Styles

- **Component imports:** When importing a component, you may import from its directory barrel.
  ```ts
  // Allowed
  import { Theme } from '../Theme';
  ```
- **Style, Constant, & Utility imports:** When importing anything else, you must target the specific file directly. Never create or import from a style or utility barrel file.
  ```ts
  // Allowed (Direct File Target)
  import { space } from '../../styles/spacing/spacing.utils';
  import { PAGE_MAX_WIDTH } from '../../styles/constants';

  // Forbidden
  import { space, PAGE_MAX_WIDTH } from '../../styles';
  ```

### 4. Private File Import Restrictions (Enforced by Linter)

- **Rule:** Files prefixed with an underscore (`_`) are considered **private** to their component/module directory.
- **Restriction:** Importing any `_` prefixed file from *outside* its own folder is strictly forbidden and blocked by ESLint's `no-restricted-imports` rule.
- If you need to access variables, types, or utilities from a `_` prefixed file inside another component or style directory, you must first export them from the folder's public barrel file (`index.ts`) and import them from the parent folder path.
- **Example:**
  ```ts
  // Allowed (local relative import inside the same folder)
  import { DEFAULT_THEME_NAME } from './_Theme.constants';

  // Allowed (importing from parent folder barrel export)
  import { typographyCssTokensCompact } from '../../../components/Text';

  // Forbidden (importing private file from outside its folder)
  import { typographyCssTokensCompact } from '../../../components/Text/_Text.constants';
  ```

### 5. Package Configuration

- The design system library does not export a single root barrel file.
- Instead, package subpaths are exposed directly in `package.json` using the `exports` configuration:
  ```json
  "exports": {
    "./components/*": {
      "types": "./dist/components/*/index.d.ts",
      "default": "./dist/components/*/index.js"
    },
    "./styles/*": {
      "types": "./dist/styles/*.d.ts",
      "default": "./dist/styles/*.js"
    }
  }
  ```
