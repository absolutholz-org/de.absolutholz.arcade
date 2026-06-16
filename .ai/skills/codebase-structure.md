# Codebase Structure & Imports Skill

This skill defines the mandatory file layout, import architecture, and package export constraints required to maximize tree-shaking, preserve clarity, and prevent circular dependencies across the entire repository.

## 1. Barrel Files Prohibition

- Barrel files (index.ts, index.js, or similar re-export entry points) are strictly forbidden throughout the codebase.
- Exception: The only directories permitted to contain a barrel file are individual, isolated component folders (e.g., src/components/ComponentName/index.ts).
- No barrel files may exist at the root of subdirectories like src/styles/, src/utils/, src/hooks/, or at the root of a package.

## 2. Component Folder Exports

- Every individual component folder under src/components/ComponentName/ must contain a public index.ts file.
- The index.ts file must act as a pure barrel export exposing only the main component and its public TypeScript types. It must never expose internal implementation details.

## 3. Importing Components, Styles, & Utilities

- Component Imports: When importing a component from outside its folder, you are permitted to import directly from its directory barrel path.
- Style, Constant, & Utility Imports: When importing anything other than a component, target the specific file path directly. Never create or import from a style, utility, or constant barrel file.

## 4. Private File Import Restrictions

- Private Prefix: Files prefixed with an underscore (\_) are considered strictly private to their direct component or module directory.
- Restriction: Importing any underscore-prefixed file from outside its own folder is strictly prohibited (enforced natively by the local ESLint no-restricted-imports rule).
- Cross-Component Access: If variables, types, or utilities from an underscore-prefixed file are required elsewhere, they must be explicitly exposed via that folder's public index.ts barrel file first, and imported from the parent directory path.
