# Arcade Game Layout & Routing Architecture

This rule defines the mandatory layout hierarchy, routing patterns, and container standards for all game applications within the Arcade monorepo.

---

## 1. Mandatory Game Page Routing Hierarchy

Every game package (`apps/<game>/src/pages/[lang]/`) must implement the following three canonical routes:

| Route Path | File Entry | Responsibility | Outer Layout | Primary Client Component |
| :--- | :--- | :--- | :--- | :--- |
| `/[lang]/` | `index.astro` | Game Lobby & Level/Difficulty Selection | `<BaseLayoutWithSiteHeaderAndSiteFooter>` | `<[Game]Lobby client:load lang={lang} />` |
| `/[lang]/game.astro` | `game.astro` | Active Gameplay View | `<[Game]BaseLayout>` | `<[Game]Game client:only="react" lang={lang} />` |
| `/[lang]/rules.astro` | `rules.astro` | Markdown Game Rules & Documentation | `<BaseLayoutWithSiteHeaderAndSiteFooter>` | `<PageContainer variant="slim">` + Static Astro Markdown (`<MarkdownContent>`) |
| `/[lang]/medals.astro` | `medals.astro` | Medals & Achievements Showcase | `<BaseLayoutWithSiteHeaderAndSiteFooter>` | `<PageContainer variant="wide">` + `<[Game]MedalGrid client:load />` |

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

## 2. Standard Layout Architecture (ADR 0006)

Game layouts follow the 3-Tier Layout and Template Hierarchy:

```text
Tier 1: Document Layouts (@arcade/lib-ui/layouts/)
  ├── BaseLayout
  │     └── Used by: [Game]BaseLayout.astro ─────► /[lang]/game.astro (Active Play)
  │                                                   └── <GameContainer>
  ├── BaseLayoutWithSiteFooter
  │     └── Used by: apps/hub ───────────────────► /[lang]/index.astro (Hub Home)
  │                                                   └── <PageContainer>
  └── BaseLayoutWithSiteHeaderAndSiteFooter
        ├── Used by: Game Lobbies ───────────────► /[lang]/index.astro (Lobby)
        ├── Used by: Rules Pages ────────────────► /[lang]/rules.astro
        │                                             └── <PageContainer variant="slim">
        └── Used by: Medals & Showcase Pages ────► /[lang]/medals.astro
                                                      └── <PageContainer variant="wide">
```

### 1. `BaseLayout` (`@arcade/lib-ui/layouts/BaseLayout`)
- Bare HTML scaffold (`<html>`, `<head>`, `<body>`, skip-links, global styles) without site header or footer.
- **Usage**: Used by `[Game]BaseLayout.astro` for `game.astro` to provide an unencumbered full-viewport canvas.

### 2. `BaseLayoutWithSiteFooter` (`@arcade/lib-ui/layouts/BaseLayoutWithSiteFooter`)
- Document scaffold with persistent `<SiteFooter>` and an unconstrained `<main id="main-content">` slot.
- **Usage**: Used by Arcade Hub homepage (`apps/hub/src/pages/[lang]/index.astro`).

### 3. `BaseLayoutWithSiteHeaderAndSiteFooter` (`@arcade/lib-ui/layouts/BaseLayoutWithSiteHeaderAndSiteFooter`)
- Standard public web shell with persistent `<SiteHeader>`, unconstrained `<main id="main-content">`, and `<SiteFooter>`.
- Supports `appTitle` and `appHomeHref` to configure brand title and home navigation per game.
- **Usage**: Used directly across game lobbies (`index.astro`), rules (`rules.astro`), and medals showcase (`medals.astro`).

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
<BaseLayoutWithSiteHeaderAndSiteFooter
  title={entry.data.title}
  lang={lang}
  appTitle={gameTitle}
  appHomeHref={`/${game}/${lang}/`}
  currentSlug="rules"
>
  <PageContainer variant="slim">
    <Stack align="center" spacing="3xl">
      <MarkdownContent>
        <Content />
      </MarkdownContent>
      <Button as="a" href={`/${game}/${lang}/`} variant="primary" size="md">
        {playLabel}
      </Button>
    </Stack>
  </PageContainer>
</BaseLayoutWithSiteHeaderAndSiteFooter>
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
