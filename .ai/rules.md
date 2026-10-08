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
- **Zero Hardcoded UI Strings (ADR 007):** Hardcoding user-facing text strings in applications or components is strictly forbidden. All UI strings must route through the shared localization package (`@arcade/lib-i18n`) and be registered across all supported languages in accordance with [Localization Engineering](/.ai/skills/localization-engineering/SKILL.md).
- **Minimal Exports Principle:** Never export variables, constants, functions, types, or styled components unless they are actively imported and used outside the defining file. Avoid speculative or preemptive exports. Keep internal helpers, intermediate variables, and styled child elements unexported (e.g., leverage CSS nesting for child elements rather than creating and exporting extraneous styled sub-components).
- **Native Web Standards & Browser Support Matrix:** The targeted browser matrix strictly targets modern browsers with native baseline web platform features (such as the HTML Popover API, `light-dark()`, and top-layer CSS). Never implement speculative or custom JavaScript polyfills, manual fallbacks, or simulated legacy behavior for browsers lacking these native APIs. Simple, native solutions must always take precedence over custom logic.

## 4. Stack and Tooling Enforcement

Agents are strictly forbidden from introducing alternative tooling. You must adhere to the following stack:

- **Package Manager:** `pnpm` (Workspaces).
- **Formatting & Linting:** `Biome` (Respecting `.editorconfig`). Do not generate or assume `ESLint` or `Prettier` configurations.
- **Styling:** `Linaria` (`@linaria/core`, `@linaria/react`). Styles must be written using standard CSS strings inside template literals (`css`...``). Do not use Tailwind, CSS Modules, styled-components, standard Emotion, or Vanilla Extract.
  - **Zero Inline Styles & Zero Runtime Prop Interpolations:** Inline styles (`style={{ ... }}`) are strictly prohibited except for purely dynamic, continuous runtime calculations (such as real-time animation coordinates). Agents must never use dynamic prop interpolation functions (`${({ $prop }) => ...}`) inside Linaria styled components because Linaria compiles them into dynamic CSS custom properties rendered as inline `style="..."` attributes on the DOM element. All component variants, sizes, orientations, and states must be implemented using static CSS with `data-*` attribute selectors (e.g., `&[data-variant='primary']`, `&[data-size='sm']`).
- **Frameworks:** `Astro` for the `apps/hub`, and `React` (via Vite or Astro integrations) for interactive games.

### Workspace Dependency & Package Management Integrity

- **Canonical Package Management Only:** All dependency installations, workspace linking, and binary execution shims (`node_modules/.bin`) must be handled natively and exclusively by `pnpm`.
- **Zero Manual `node_modules` Manipulation:** Agents are strictly forbidden from manually creating, modifying, copying, or symlinking files or directories inside any `node_modules/` or `.bin/` folder (e.g., via `ln -s`, `cp`, or `mkdir`). Never attempt ad-hoc mock symlinks to simulate package installation or bypass tooling.
- **Sandbox Boundary Protocol:** The AI execution sandbox isolates external network access. When scaffolding a new package or modifying `package.json` dependencies:
  - Declare package manifests (`package.json`, `pnpm-workspace.yaml`) cleanly and accurately.
  - Never attempt destructive re-installations in the sandbox that prompt to wipe modules, and never create ad-hoc manual symlink workarounds.
  - If `pnpm install` is required to link new workspace packages or binaries into the dependency graph, instruct the human developer to run `pnpm install` in their unconstrained host terminal.

## 5. CSS and Styling Units Constraint

- **Prefer REM Units**: When generating or modifying component styles or writing CSS declarations across the monorepo, always prefer `rem` units for typography, spacing, dimensions (width, height, max-width, max-height), margins, and paddings. Avoid using `px` units except for:
    - Media queries (where `px` or `em` is appropriate).
    - Border widths (e.g., `1px solid ...` is acceptable to preserve pixel-level crispness).
    - Accessibility minimums (e.g., enforcing the `24px` by `24px` minimum touch target size for WCAG 2.2 AA).

## 6. Code Quality & Documentation Standard

- **Self-Documenting Code:** All generated code must be as self-documenting as possible. Prioritize highly self-explanatory variable, function, and component names.
- **Targeted Comments:** Only use comments to clearly and as briefly as possible explain complex, non-obvious, or domain-specific logic. Do not write redundant comments that merely repeat what the code obviously does.
- **Living Documentation (README Maintenance):** The root `README.md` is our source of truth. Whenever you scaffold a new app/library in the workspace, add a new global command to `package.json`, or alter the tech stack, you **must** proactively propose an update to the `README.md` to reflect these changes.

## 7. Hybrid Rendering Architecture & Execution Boundaries

This project combines static pre-rendered content (Astro) with dynamic client-side content (React). Agents must strictly adhere to the following rendering boundaries:

- **Static Pre-Rendered Pages (`.astro`)**:
  - Execute exclusively during the static build/SSG step (Node.js).
  - Global stylesheet (`@arcade/lib-ui/styles/global.css`) must be imported once at the root layout (`BaseLayout.astro`).
  - Server-side text must be read directly from `@arcade/lib-i18n` resources without client hooks.
  - Must never execute client-side state loops or assume browser globals exist (`window`, `localStorage`, `document`).
- **Isomorphic UI Islands (`libraries/ui` in `.astro` with `client:load` / `client:idle`)**:
  - Evaluated on the server during SSG, then hydrated in the browser.
  - **Strict SSR Safety:** Never use `useLayoutEffect` (enforce `useEffect`). Guard all `window`, `document`, and `localStorage` accesses (`typeof window !== 'undefined'`).
  - Must consume `@arcade/lib-i18n` abstractions (`useI18n()`).
- **Client-Only Interactive Modules (Games & Canvas)**:
  - Must use `client:only="react"` per ADR 002.
  - Must never be evaluated on the server or use partial hydration directives.
- **Ambiguity Handling**:
  - Agents must follow this taxonomy automatically without asking on every routine prompt.
  - If a new feature is requested whose rendering tier is genuinely ambiguous (e.g., choosing between a static Astro component vs. an interactive React island), the agent must ask for clarification on the rendering strategy before implementing.

