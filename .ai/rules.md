# Global AI Development Rules

This document outlines the global rules and operational boundaries that all AI agents must follow when working in this monorepo.

## 1. Build and Compilation Constraints

- **No Production Builds**: Do not run production build/compilation commands (such as `pnpm build`, `pnpm -r build`, or package-specific build scripts) during local development or validation steps. Production builds are slow and generate unnecessary artifacts in build directories (`dist/`).
- **Validation Alternatives**: To verify compilation, syntax, or TypeScript type-safety, run `pnpm typecheck` or `pnpm check-all` instead of building.

## 2. Git Operations Safety

- **Local Commits Only**: Do not perform any remote git push operations. All commits must be made locally.
- **Do Not Bypass Hooks**: Never use `--no-verify` or bypass git pre-commit/commit-msg hooks.
