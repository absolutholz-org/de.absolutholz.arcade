# Arcade Monorepo — Agent Instructions

## 1. Non-Negotiable Global Invariants

- **Stack:** `pnpm` workspaces (never manually edit `node_modules/`), `Biome` (never ESLint/Prettier), `Linaria` with `rem` units and static `data-*` selectors (never Tailwind, inline `style={{}}`, or `${({ $prop }) => ...}`), `Astro` (SSG) + `React` (`client:only="react"` for games).
- **Validation & Builds:** Never run `pnpm build` / `pnpm -r build` during dev. Validate with package-scoped `pnpm --filter <pkg> typecheck`, `pnpm biome check <path>`, and targeted test files (`--reporter=dot`).
- **Git Safety:** Local commits only (never `git push`). Never use `--no-verify`. Never auto-commit without explicit user approval in the active prompt.
- **DRY, Minimal Exports & Native Web (`browserslist` SSOT):** Audit shared `libraries/*` before writing utilities (propose new abstractions to the user first). Export only symbols imported elsewhere. Treat [`.browserslistrc`](/.browserslistrc) as the single source of truth for feature support: prefer native HTML, CSS, and Web APIs supported by those targets (`Popover`, `<dialog>`, `light-dark()`, `oklch()`) over third-party libraries or polyfills.
- **Budget & Fail-Fast:** Cap autonomous turns at 8 tool calls and retries at 1 attempt. Never run FS archeology in `node_modules`/home dirs or iterative scratchpad loops; halt and report if blocked.

## 2. Imperative Pre-Flight Gates (`IF -> THEN`)

| IF your task involves... | THEN you MUST... |
| :--- | :--- |
| **Editing inside `apps/<pkg>/` or `libraries/<pkg>/`** | Read `<pkg>/AGENTS.md` first (if present). |
| **Implementing interactive UI, dialogs/popovers, animations, theming, or forms** | Consult [`modern-web-guidance`](/.agents/skills/modern-web-guidance/SKILL.md) first, aligned with [`.browserslistrc`](/.browserslistrc) targets. |
| **Creating/styling UI, cards, buttons, overlays, or layouts in `apps/*`** | Read [`libraries/ui/CATALOG.md`](/libraries/ui/CATALOG.md) first. Custom `styled.button`/card wrappers and `box-sizing: border-box` are forbidden; use `@arcade/lib-ui` primitives + `<PageContainer>`. |
| **Adding/changing user-facing text or rules prose** | Route interactive UI strings through `@arcade/lib-i18n` across all locales (zero hardcoded strings). Author static prose in `src/content/pages/[lang]/`. Read [`localization-engineering`](/.ai/skills/localization-engineering/SKILL.md). |
| **Persisting browser/game state in `apps/*`** | Use `@arcade/lib-storage` (`createGameStorage`, `arcade::<app>::<key>`). Never call raw `localStorage`/`sessionStorage`/`indexedDB`. Read [`storage-namespacing`](/.ai/skills/storage-namespacing/SKILL.md). |
| **Preparing or executing a `git commit`** | Run targeted `typecheck` + `biome check`, obtain explicit user approval, and format strictly as `<emoji> (<scope>): <Capitalized summary>` (never `feat:`/`fix:`/`chore:`). Full emoji tokens: [`semantic-commit`](/.ai/skills/semantic-commit/SKILL.md). |
| **Astro pages, layouts, breadcrumbs, 6-route game shells, or canvas grids** | Follow [`game-shell.md`](/.ai/rules/game-shell.md), [`rendering-boundaries.md`](/.ai/rules/rendering-boundaries.md), and [`metadata.md`](/.ai/rules/metadata.md). |
| **Styling with Linaria or editing Storybook stories** | Follow [`linaria-styling`](/.ai/skills/linaria-styling/SKILL.md) / [`libraries/ui/AGENTS.md`](/libraries/ui/AGENTS.md). |
| **Adding a new game or preset levels** | Follow [`new-game`](/.ai/skills/new-game/SKILL.md) or [`add-levels`](/.ai/skills/add-levels/SKILL.md), and verify with `pnpm test:conformance`. |
| **Architectural rationale / formal contracts** | Consult the ADR Master Index at [`docs/adr/architecture-decision-records.md`](/docs/adr/architecture-decision-records.md). |
