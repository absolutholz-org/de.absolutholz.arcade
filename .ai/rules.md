# Global AI Development Rules

This document outlines the global rules and operational boundaries that all AI agents must follow when working in this monorepo.

## 1. Build and Compilation Constraints

- **No Production Builds**: Do not run production build/compilation commands (such as `pnpm build`, `pnpm -r build`, or package-specific build scripts) during local development or validation steps. Production builds are slow and generate unnecessary artifacts in build directories (`dist/`).
- **Validation Alternatives**: To verify compilation, syntax, or TypeScript type-safety, run `pnpm typecheck` or `pnpm check-all` instead of building.

## 2. Git Operations Safety

- **Local Commits Only**: Do not perform any remote git push operations. All commits must be made locally.
- **Do Not Bypass Hooks**: Never use `--no-verify` or bypass git pre-commit/commit-msg hooks.

## 3. Core Architectural Principles (DRY & SOLID)

All code generated, refactored, or organized across apps and libraries must strictly adhere to clean software engineering principles:
* **DRY (Don't Repeat Yourself):** Actively audit the workspace for existing utilities, constants, or hooks before writing new ones. Abstract shared logic into common internal libraries rather than duplicating code across distinct package boundaries.
* **SOLID Principles:** - *Single Responsibility:* Every function, hook, and component must have exactly one reason to change.
	- *Open/Closed:* Design modules to be open for extension but closed for modification (e.g., utilize clean configuration objects or extensible token maps).
	- *Interface Segregation:* Keep TypeScript prop types and argument interfaces lean and purposeful; do not force components to depend on fat interfaces containing unused properties.
	- *Dependency Inversion:* High-level application logic must depend on abstractions (like generic functional token keys), never on hardcoded low-level implementation details.
* **Scope Efficiency:** When assisting with new library or application scoping, always propose a minimal, modular architecture footprint. Break complex features into isolated, highly testable domains.
