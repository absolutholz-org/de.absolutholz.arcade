# Global AI Development Rules

This document outlines the global rules and operational boundaries that all AI agents must follow when working in this monorepo.

## 1. Build and Compilation Constraints

- **No Production Builds**: Do not run production build/compilation commands (such as `pnpm build`, `pnpm -r build`, or package-specific build scripts) during local development or validation steps. Production builds are slow and generate unnecessary artifacts in build directories (`dist/`).
- **Validation Alternatives**: To verify compilation, syntax, or TypeScript type-safety, run `pnpm typecheck` or `pnpm check` (via Biome) instead of building.

## 2. Git Operations Safety

- **Local Commits Only**: Do not perform any remote git push operations. All commits must be made locally.
- **Do Not Bypass Hooks**: Never use `--no-verify` or bypass git pre-commit/commit-msg hooks.

## 3. Core Architectural Principles (DRY & SOLID)

All code generated, refactored, or organized across apps and libraries must strictly adhere to clean software engineering principles:

- **DRY & Abstraction:** No code duplication. Actively audit the workspace for existing utilities, constants, or hooks before writing new ones. Code that can be used in multiple locations should be abstracted and moved to a shared library (`libraries/*`), where possible and appropriate. **Crucially: This architectural decision must be proposed to the human developer for approval before being implemented.**
- **SOLID Principles:**
    - _Single Responsibility:_ Every function, hook, and component must have exactly one reason to change.
    - _Open/Closed:_ Design modules to be open for extension but closed for modification (e.g., utilize clean configuration objects or extensible token maps).
    - _Interface Segregation:_ Keep TypeScript prop types and argument interfaces lean and purposeful; do not force components to depend on fat interfaces containing unused properties.
    - _Dependency Inversion:_ High-level application logic must depend on abstractions (like generic functional token keys), never on hardcoded low-level implementation details.
- **Scope Efficiency:** When assisting with new library or application scoping, always propose a minimal, modular architecture footprint. Break complex features into isolated, highly testable domains.

## 4. Stack and Tooling Enforcement

Agents are strictly forbidden from introducing alternative tooling. You must adhere to the following stack:

- **Package Manager:** `pnpm` (Workspaces).
- **Formatting & Linting:** `Biome` (Respecting `.editorconfig`). Do not generate or assume `ESLint` or `Prettier` configurations.
- **Styling:** `Vanilla Extract` (`@vanilla-extract/css`). Do not use Tailwind, CSS Modules, styled-components, or Emotion.
- **Frameworks:** `Astro` for the `apps/hub`, and `React` (via Vite or Astro integrations) for interactive games.

## 5. CSS and Styling Units Constraint

- **Prefer REM Units**: When generating or modifying component styles or writing CSS declarations across the monorepo, always prefer `rem` units for typography, spacing, dimensions (width, height, max-width, max-height), margins, and paddings. Avoid using `px` units except for:
    - Media queries (where `px` or `em` is appropriate).
    - Border widths (e.g., `1px solid ...` is acceptable to preserve pixel-level crispness).
    - Accessibility minimums (e.g., enforcing the `24px` by `24px` minimum touch target size for WCAG 2.2 AA).

## 6. Code Quality & Documentation Standard

- **Self-Documenting Code:** All generated code must be as self-documenting as possible. Prioritize highly self-explanatory variable, function, and component names.
- **Targeted Comments:** Only use comments to clearly and as briefly as possible explain complex, non-obvious, or domain-specific logic. Do not write redundant comments that merely repeat what the code obviously does.
