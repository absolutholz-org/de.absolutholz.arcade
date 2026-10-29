# Arcade Game Layout & Routing Architecture (ADR 0006 & ADR 0008)

This rule defines the mandatory 6-route layout hierarchy, dual-mode overlay patterns, and subsystem container standards for all game applications within the Arcade monorepo per [ADR 0006](../../docs/adr/0006-explicit-layout-and-template-hierarchy.md) and [ADR 0008](../../docs/adr/0008-game-shell-and-subsystem-contract.md).

---

## 1. Mandatory 6-Route Game Page Hierarchy (ADR 0008)

Every game package (`apps/[gameId]/src/pages/`) must implement the root language redirect (`src/pages/index.astro`) and the following **6 canonical localized routes** under `src/pages/[lang]/`:

| Route Path | File Entry | Responsibility | Outer Layout / Template | Primary Component / Subsystem Contract |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `src/pages/index.astro` | Root language detection & redirect | Redirect script / meta | Redirects to `/[gameId]/[lang]/` |
| `/[lang]/` | `src/pages/[lang]/index.astro` | 1. Landing / Lobby Page | `<BaseLayoutWithSiteHeaderAndSiteFooter>` | `<[Game]Lobby client:load lang={lang} />` (`GameLandingTemplate`) |
| `/[lang]/game` | `src/pages/[lang]/game.astro` | 2. Gameplay Playfield & In-Game Overlays | `<GameLayout>` | `<[Game]Game client:only="react">` with server-rendered `<MarkdownContent slot="rulesContent">` |
| `/[lang]/rules` | `src/pages/[lang]/rules.astro` | 3. Standalone Rules & How-To-Play | `<MarkdownPageTemplate>` | Renders `src/content/pages/[lang]/rules.md` via `<MarkdownContent>` |
| `/[lang]/settings` | `src/pages/[lang]/settings.astro` | 4. Standalone Explanatory Settings | `<BaseLayoutWithSiteHeaderAndSiteFooter>` | `<PageContainer variant="slim">` + `<GameSettingsPanel mode="detailed" />` (`src/config/settings.ts`) |
| `/[lang]/stats` | `src/pages/[lang]/stats.astro` | 5. Standalone Statistics & High Scores | `<BaseLayoutWithSiteHeaderAndSiteFooter>` | `<PageContainer variant="standard">` + `<GameStatsDashboard gameId={gameId} />` (`arcade::[gameId]::stats`) |
| `/[lang]/medals` | `src/pages/[lang]/medals.astro` | 6. Standalone Medals Showcase | `<BaseLayoutWithSiteHeaderAndSiteFooter>` | `<PageContainer variant="wide">` + `<GameMedalGrid gameId={gameId} lang={lang} />` |

### Static Path Generation
All localized Astro routes must export `getStaticPaths()` using `SUPPORTED_LANGUAGES`:
```astro
---
import { SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';

export function getStaticPaths() {
  return SUPPORTED_LANGUAGES.map((item) => ({
    params: { lang: item.code },
  }));
}
---
```

---

## 2. Standard Layout Architecture (ADR 0006 & ADR 0008)

Game layouts follow the 3-Tier Layout and Template Hierarchy:

```text
Tier 1: Document Layouts (@arcade/lib-ui/layouts/)
  ├── GameLayout (built on BaseLayout)
  │     └── Used by: /[lang]/game.astro (Active Playfield + In-Game Overlays)
  ├── BaseLayoutWithSiteFooter
  │     └── Used by: apps/hub ───────────────────► /[lang]/index.astro (Hub Home)
  └── BaseLayoutWithSiteHeaderAndSiteFooter
        ├── Used by: Game Lobbies ───────────────► /[lang]/index.astro (GameLandingTemplate)
        ├── Used by: Rules Pages ────────────────► /[lang]/rules.astro (via MarkdownPageTemplate)
        ├── Used by: Settings Pages ─────────────► /[lang]/settings.astro (<PageContainer variant="slim">)
        ├── Used by: Statistics Pages ───────────► /[lang]/stats.astro (<PageContainer variant="standard">)
        └── Used by: Medals Showcase Pages ──────► /[lang]/medals.astro (<PageContainer variant="wide">)
```

---

## 3. Subsystem Integration Contracts (ADR 0008)

### A. Rules Dual-Mode Delivery (Zero Client-Side Markdown Parser)
- **Single Source of Truth:** Rules prose must be authored strictly in `src/content/pages/[lang]/rules.md`.
- **Standalone Page (`/[lang]/rules.astro`):** Renders via `MarkdownPageTemplate`.
- **In-Game Modal (`/[lang]/game.astro`):** Pre-renders `<Content />` server-side at build time and injects it into the client React game root via `<MarkdownContent slot="rulesContent">`. In-game rules are triggered from `GameHeader` and displayed inside an accessible `<Dialog>` while pausing gameplay timers.

### B. Settings Contract (`src/config/settings.ts`)
- Declare game-specific options via `GameSettingsConfig` from `@arcade/lib-games` in `src/config/settings.ts`.
- Surface controls via the shared `<GameSettingsPanel />` component from `@arcade/lib-ui`:
  - `mode="compact"` inside the in-game Settings `<Dialog>` (triggered from `GameHeader`).
  - `mode="detailed"` on the standalone `/[lang]/settings.astro` route.

### C. Statistics Contract (`arcade::[gameId]::stats`)
- Persist round telemetry via `@arcade/lib-storage` using `recordGameStats(gameId, roundResult)`.
- Surface historical metrics, streaks, win rates, and personal bests via `<GameStatsDashboard gameId={gameId} />` from `@arcade/lib-ui` on `/[lang]/stats.astro`.

### D. Consolidated Medals Showcase (`/[lang]/medals.astro`)
- `/[lang]/medals.astro` must **never** maintain bespoke per-game `[Game]MedalGrid` components or inline custom threshold branching.
- Render `<GameMedalGrid gameId={gameId} lang={lang} />` directly from `@arcade/lib-ui`.
