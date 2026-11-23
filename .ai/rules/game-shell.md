# Arcade Game Layout, Breadcrumbs & Shell Architecture (ADR 0006 & ADR 0008)

This rule defines the mandatory 6-route layout hierarchy, 3-tier layout & breadcrumb rules, dual-mode overlay patterns, and WAI-ARIA canvas grid standards for all game and tool applications per [ADR 0006](/docs/adr/0006-explicit-layout-and-template-hierarchy.md) and [ADR 0008](/docs/adr/0008-game-shell-and-subsystem-contract.md).

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

## 2. 3-Tier Layout & Breadcrumb Taxonomy (ADR 0006)

- **Tier 1 (`libraries/ui/src/layouts/*`):** Document scaffolding (`BaseLayout`, `BaseLayoutWithSiteFooter`, `BaseLayoutWithSiteHeaderAndSiteFooter`, `GameLayout`). **Open Slot Invariant:** Tier 1 layouts must **NEVER** bake an internal `<PageContainer>`; `{children}` remains unconstrained.
- **Tier 2 (`libraries/ui/src/layouts/*Template/`):** Structural templates (`GameLandingTemplate`, `ArticleTemplate`, `ShowcaseTemplate`) wrapping internal zones in `<PageContainer>` (`slim`, `standard`, `wide`). Never manage `<!doctype html>`, `<html>`, `<body>`, or skip links.
- **Tier 3 (`apps/*/src/pages/*`):** Concrete Astro routes assembling Tier 2 templates inside Tier 1 layouts.
- **Breadcrumbs:**
  - Never render breadcrumbs on `game.astro`, `apps/hub/src/pages/[lang]/index.astro`, or game lobbies (`apps/[game]/src/pages/[lang]/index.astro`).
  - Root home item (`isHome: true`) must use `${currentCommon.app.shortTitle} ${currentCommon.navigation.home}` (e.g. `"Arcade home"`), never `currentCommon.app.title`.
  - **Games vs. Tools:** Games live at `/<gameId>` (`base: '/<gameId>'`). Tools live under `/tools/<toolId>` (`TOOL_REGISTRY`, `base: '/tools/<toolId>'`) with breadcrumb trail `Arcade home / Tools / <Tool Title>`.

---

## 3. Subsystem Integration Contracts (ADR 0008)

### A. Rules Dual-Mode Delivery (Zero Client-Side Markdown Parser)
- **Single Source of Truth:** Rules prose must be authored strictly in `src/content/pages/[lang]/rules.md`.
- **Standalone Page (`/[lang]/rules.astro`):** Renders via `MarkdownPageTemplate`.
- **In-Game Modal (`/[lang]/game.astro`):** Pre-renders `<Content />` server-side at build time and injects it into the client React game root via `<MarkdownContent slot="rulesContent">`. In-game rules are triggered from `GameHeader` and displayed inside an accessible `<Dialog>` while pausing gameplay timers. Defining ad-hoc `<style>` blocks in page templates to style markdown tags is prohibited.

### B. Settings Contract (`src/config/settings.ts`)
- Declare game-specific options via `GameSettingsConfig` from `@arcade/lib-games` in `src/config/settings.ts`.
- Surface controls via `<GameSettingsPanel />` from `@arcade/lib-ui`: `mode="compact"` in-game `<Dialog>`, `mode="detailed"` on `/[lang]/settings.astro`.

### C. Statistics & Leaderboards Contract (`arcade::[gameId]::stats`)
- Declare `statsOutcomeModel` (`'win-loss' | 'no-loss' | 'match-draw'`) on the game's `GameMetadata` entry in `libraries/games/src/registry.ts` and register the `gameId` in `DEFAULT_REGISTERED_GAMES` (`libraries/storage/src/stats/store.ts`).
- Persist round telemetry via `@arcade/lib-storage` using `recordGameStats(roundResult)` only (never call `recordGameSession()` separately alongside `recordGameStats()`). Only pass metrics that are genuinely meaningful for the game; never hardcode `isFlawless: true`, and never record abandon/surrender as `won: false` on `'no-loss'` games.
- Surface historical metrics via `<GameStatsDashboard client:load gameId={gameId} lang={currentLanguage} hideTitle playHref={`/${gameId}/${currentLanguage}/game`} ... />` inside `GameSubpageTemplate` on `/[lang]/stats.astro`:
  - Pass `hideWinLossMetrics` for `'no-loss'` games, `displayMode="match-draw"` for `'match-draw'` games, and leave win/loss metrics visible for `'win-loss'` games.
  - Enable 0, 1, or multiple Top 10 leaderboards (`showFastestRuns`, `showTopScores`, `showFewestMoves`, optional `fewestMovesVariant="guesses"`) matching the game's core loop.
- **Mandatory Clarification Rule:** When planning a new game or revising an existing one, if anything is unclear about which statistics are meaningful to track, whether the game has a true defeat state, or which Top 10 leaderboard(s) should be displayed, **ask the user before implementing.**

### D. Consolidated Medals Showcase (`/[lang]/medals.astro`)
- Never maintain bespoke per-game `[Game]MedalGrid` components or inline custom threshold branching.
- Render `<GameMedalGrid gameId={gameId} lang={lang} />` directly from `@arcade/lib-ui`.

### E. Victory Dialog Contract (`VictoryDialog` from `@arcade/lib-ui`)
- Every game must provide `onPlayAgain`, `statsHref={`/${gameId}/${language}/stats`}`, `medalsHref={`/${gameId}/${language}/medals`}`, and `lobbyHref` (or `onLobby`).
- Provide `hasNextPuzzle` + `onNextPuzzle` **only** for sequential level/puzzle games; omit for match/duel or single-round games (e.g., Tic-Tac-Toe, Dice Bingo, Anagram).
- Do **not** pass Stats or Medals links manually via `secondaryActions`.

---

## 4. Interactive Canvas Grid & Accessibility Standards (WAI-ARIA & Biome Compliance)

All 2D puzzle games and canvas boards implementing interactive grids must adhere strictly to the monorepo WAI-ARIA Grid pattern and Biome a11y standards:

### A. ARIA Grid Semantics & Roving Tabindex
- Board container: `role="grid"` with `aria-label`, `aria-rowcount`, `aria-colcount`.
- Row containers: `role="row"` with `aria-rowindex={r + 1}`.
- Interactive cells: native `<button type="button">` with `role="gridcell"`, `aria-colindex={c + 1}`, `tabIndex={isFocused ? 0 : -1}`.

### B. Standard Biome Annotations for ARIA Grids
```tsx
// biome-ignore lint/a11y/useSemanticElements: [Game] is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern
<div ref={gridRef} role="grid" aria-label={boardAriaLabel} aria-rowcount={rows} aria-colcount={cols}>
  {grid.map((rowCells, r) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid coordinates serve as stable keys
    // biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
    // biome-ignore lint/a11y/useFocusableInteractive: Row element in ARIA grid delegates focus to cell children via roving tabIndex
    <div key={`${gameId}-row-${r}`} role="row" aria-rowindex={r + 1}>
      {rowCells.map((cell, c) => (
        <button
          key={cell.id}
          type="button"
          // biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
          role="gridcell"
          aria-colindex={c + 1}
          tabIndex={focusedRow === r && focusedCol === c ? 0 : -1}
          aria-label={getCellAriaLabel(cell)}
        >
          {/* Tile graphic */}
        </button>
      ))}
    </div>
  ))}
</div>
```

### C. Explicit Button Types & SVGs
- **Button Type (`useButtonType`):** Every interactive button must explicitly specify `type="button"`.
- **SVG Accessibility (`noSvgWithoutTitle`):** All inline SVGs must include `<title>...</title>` or `role="img"` with `aria-label`.
- **Row Keys (`noArrayIndexKey`):** Use structured coordinate keys (`key={`${gameId}-row-${r}`}`).
