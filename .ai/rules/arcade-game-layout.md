# Arcade Game Layout & Routing Architecture

This rule defines the mandatory layout hierarchy, routing patterns, and container standards for all game applications within the Arcade monorepo.

---

## 1. Mandatory Game Page Routing Hierarchy

Every game package (`apps/<game>/src/pages/[lang]/`) must implement the following three canonical routes:

| Route Path | File Entry | Responsibility | Outer Layout | Primary Client Component |
| :--- | :--- | :--- | :--- | :--- |
| `/[lang]/` | `index.astro` | Game Lobby & Level/Difficulty Selection | `<[Game]PageLayout>` | `<[Game]Lobby client:load lang={lang} />` |
| `/[lang]/game.astro` | `game.astro` | Active Gameplay View | `<[Game]BaseLayout>` | `<[Game]Game client:only="react" lang={lang} />` |
| `/[lang]/rules.astro` | `rules.astro` | Markdown Game Rules & Documentation | `<[Game]StaticPageLayout>` | Static Astro Markdown (`<MarkdownContent>`) |

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

## 2. Standard Layout Wrapping Pipeline

Game layouts follow a strict three-tier inheritance model:

```text
@arcade/lib-ui/layouts/BaseLayout
  │
  ├── Used directly by: [Game]BaseLayout.astro ──► /game.astro (Active Play)
  │                                                  └── <GameContainer> (pins in-game header & overlay)
  │
  └── @arcade/lib-ui/layouts/PageLayout
        │
        ├── Used by: [Game]PageLayout.astro ─────► /[lang]/index.astro (Lobby)
        │                                           └── <GameLandingTemplate> (Hero + Main + Footer)
        │
        └── @arcade/lib-ui/layouts/StaticPageLayout
              │
              └── Used by: [Game]StaticPageLayout.astro ─► /[lang]/rules.astro (Rules)
                                                            └── <Breadcrumb> + <MarkdownContent>
```

### 1. `BaseLayout` (`@arcade/lib-ui/layouts/BaseLayout/BaseLayout.astro`)
- Lowest-level HTML scaffold (`<html>`, `<head>`, `<body>`, skip-links, global styles).
- **Usage**: Used by `[Game]BaseLayout.astro` for `game.astro` to provide an unencumbered full-viewport canvas without outer site headers or footers.

### 2. `PageLayout` (`@arcade/lib-ui/layouts/PageLayout/PageLayout.astro`)
- Standard public web shell with persistent `<SiteHeader>` and `<SiteFooter>`.
- Slots:
  - `header-actions`: Slots `<HeaderUserMenu client:load lang={lang} />` next to `<HeaderActions>` (i18n switcher + theme toggle).
  - Default slot: Enclosed within `<main id="main-content">`.
- **Usage**: Used by `[Game]PageLayout.astro` for the game lobby (`index.astro`).

### 3. `StaticPageLayout` (`@arcade/lib-ui/layouts/StaticPageLayout/StaticPageLayout.astro`)
- Specialized layout for text-heavy prose and help pages.
- Inherits all `PageLayout` features and injects:
  - Slim centered container (`<PageContainer variant="slim">`) for optimal typographic reading length.
  - Automatic breadcrumb navigation (`<Breadcrumb>`).
- **Usage**: Used by `[Game]StaticPageLayout.astro` for `rules.astro`.

---

## 3. Component Mounting & Container Standards

### A. Active Gameplay: `<GameContainer>`
Active gameplay pages (`game.astro`) mount React clients via `client:only="react"`. The root React component must mount directly inside `<GameContainer>` from `@arcade/lib-ui`:

```tsx
<GameContainer
  id="main-content"
  header={
    <[Game]GameHeader
      elapsedSeconds={...}
      isPaused={...}
      onTogglePause={...}
      onOpenSettings={...}
    />
  }
  overlay={
    <PauseOverlay
      isOpen={isPaused && !isComplete}
      onResume={...}
      onRestart={...}
    />
  }
  dialogs={
    <>
      <SettingsDialog isOpen={isSettingsOpen} onClose={...} />
      <VictoryDialog isOpen={isVictoryOpen} onClose={...} />
    </>
  }
>
  <PlayColumn>
    <[Game]Board ... />
    <[Game]Controls ... />
  </PlayColumn>
</GameContainer>
```

- **Header Zone**: Dedicated slot for in-game persistent header (back link to lobby, timer, difficulty, pause, settings).
- **Overlay Layer**: Dedicated slot for modal overlays covering the active board (e.g. `PauseOverlay`).
- **Dialogs Layer**: Dedicated slot for non-modal or secondary dialogs (`SettingsDialog`, `VictoryDialog`).
- **Children**: The interactive board and control inputs.

### B. Game Lobby: `<GameLandingTemplate>`
Game lobbies (`index.astro`) mount React clients via `client:load`. The lobby UI must utilize `<GameLandingTemplate>` from `@arcade/lib-ui`:

- **Zone 1 (Header/Intro)**: `<Hero>` with game title, description, and an optional resume `<Banner>`.
- **Zone 2 (Main Area)**: Difficulty tabs, level selection grids, and progress indicators.
- **Zone 3 (Footer Links)**: Navigation links to rules (`/${game}/${lang}/rules`) and related game resources.

### C. Game Rules: Astro Content Collection
Rules pages (`rules.astro`) fetch markdown content from Astro content collections (`src/content/pages/[lang]/rules.md`) and render it via `<MarkdownContent>`:

```astro
<[Game]StaticPageLayout title={entry.data.title} lang={lang} currentSlug="rules">
  <Stack align="center" spacing="3xl">
    <MarkdownContent>
      <Content />
    </MarkdownContent>
    <Button as="a" href={`/${game}/${lang}/`} variant="primary" size="md">
      {playLabel}
    </Button>
  </Stack>
</[Game]StaticPageLayout>
```

---

## 4. Header Actions & Breadcrumb Wiring Rules

1. **Global Site Header (Lobby & Rules)**:
   - Brand link always points to the monorepo root Arcade Hub (`/${lang}/`).
   - Action controls must always include `<HeaderActions>` (theme toggle + language switcher) and `<HeaderUserMenu client:load>` for user auth.
2. **Breadcrumb Wiring**:
   - In `StaticPageLayout`, breadcrumbs are resolved automatically via the `basePath` prop:
     `[Arcade Home] / [Game Title] / [Rules (current)]`.
   - Individual games must NEVER manually render or duplicate breadcrumb markup.
3. **In-Game Header (Active Gameplay)**:
   - Must contain a prominent home/back link pointing to the game lobby (`/${game}/${lang}/`).
   - Must feature a `<Timer>` component displaying elapsed time with pause support.
   - In-game language or theme switches must be routed through the in-game `<SettingsDialog>` rather than cluttering the active game board.

---

## 5. Zero Duplication & Anti-Patterns

- **No Custom HTML Shells**: Game packages must not implement custom `<html>`, `<head>`, or `<body>` wrappers. All layout shells must wrap `@arcade/lib-ui/layouts/*`.
- **No Custom Site Headers/Footers**: Games must not write custom site header, footer, or breadcrumb components.
- **No Local Shell CSS**: Local layout files (`apps/<game>/src/layouts/*.astro`) must remain thin pass-through adapters under 40 lines of code, passing only `basePath`, `appTitle`, and localized strings.
- **No Inline Page Layout in Game Views**: Active game canvases must strictly use `BaseLayout` + `<GameContainer>`. Wrapping an active game in `PageLayout` is an anti-pattern as the outer header and footer compress the gameplay viewport.
