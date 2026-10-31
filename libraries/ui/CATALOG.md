# Design System Component Catalog

This document is the authoritative component inventory for `@arcade/lib-ui`. All AI agents and human developers must audit this catalog before implementing any UI element, card, button, dialog, or layout container in any application (`apps/*`) or shared library (`libraries/*`).

> [!IMPORTANT]
> **Mandatory UI Library Reuse Policy:**
> Creating custom `styled.button`, ad-hoc styled `<a>` cards, custom modal overlays, or hand-rolled form inputs in applications is strictly prohibited. You must consume the canonical primitives documented below.

---

## Component Taxonomy Matrix

```
@arcade/lib-ui
├── Cards & Surfaces       ── Interactive cards, game tiles, and content banners
├── Actions & Inputs       ── Buttons, form fields, toggles, and selectors
├── Overlays & Feedback    ── Modals, popovers, tooltips, and toast notifications
├── Layout & Structure     ── Responsive containers, stacks, heroes, and prose
├── Navigation & Shell     ── Headers, footers, breadcrumbs, and user session menus
└── Data & Display         ── Badges, icons, typography, timers, and theme wrappers
```

---

## 1. Cards & Surfaces

Components providing interactive or informational surfaces.

| Component | Export Path | Primary Purpose | Key Props & Patterns |
| :--- | :--- | :--- | :--- |
| **`ClickableCard`** | `@arcade/lib-ui` | Base interactive card primitive for all clickable tiles and banners. Enforces 3D bottom-depth elevation, hover/active transforms, WCAG touch target bounds, and suppresses link hover underlines on child elements. | `as="a" \| "button"`, `density="compact" \| "normal"`, `selected={boolean}`, `disabled={boolean}`. |
| **`GameSelectionCard`** | `@arcade/lib-ui` | Pre-styled card for game lobby levels, packs, and modes. Inherits from `ClickableCard`. | `title`, `subtitle`, `badge`, `icon`, `as="a" \| "button"`. |
| **`QuickPlayCard`** | `@arcade/lib-ui` | High-emphasis card for instant game launching and practice modes. Inherits from `ClickableCard`. | `title`, `subtitle`, `actionLabel`, `as="a" \| "button"`. |
| **`Banner`** | `@arcade/lib-ui/components/Banner` | Non-clickable informational callout for announcements, alerts, or status hints. | `variant="info" \| "warning" \| "success" \| "danger"`. |
| **`MedalCard`** | `@arcade/lib-ui` | Achievement card supporting standalone single-tier feats and progressive 3-tier ladders. Consumes `MedalIcon` and `TriadBadge`. | `mode="standalone" \| "progressive"`, `title`, `description`, `tier`, `unlocked`, `bronzeUnlocked`, `silverUnlocked`, `goldUnlocked`. |
| **`GameMedalGrid`** | `@arcade/lib-ui` | Consolidated ADR 0008 achievement showcase grid rendering all medals for a `gameId` on `/[lang]/medals.astro` with accessible `<ul role="list">` semantics, trophy summary bar, and live storage hydration (`<GameMedalGrid gameId="sudoku" definitions={SUDOKU_MEDAL_DEFINITIONS} lang={lang} />`). | `gameId: G`, `definitions: readonly MedalDefinition<G>[]`, `lang: SupportedLanguageCode \| string`, `className?: string`. |
| **`GameStatsDashboard`** | `@arcade/lib-ui` | Standardized ADR 0008 statistics & high scores dashboard rendering `arcade::[gameId]::stats` on `/[lang]/stats.astro` with summary metric cards (played, win rate, streaks, best time), segmented difficulty bucket switcher, empty state, and full WCAG 2.2 AA accessibility. | `gameId: GameId`, `lang: SupportedLanguageCode \| string`, `stats?: GameStats`, `bucketLabels?: Record<string, string>`, `playHref?: string`, `className?: string`. |

> [!CAUTION]
> **Anti-Pattern:** Never write `<a className={css\`display: flex; ...\`}>` or `styled.a` to create clickable cards. Always use `<ClickableCard as="a" href="...">`.

---

## 2. Actions & Inputs

Interactive controls for user commands, choices, and data input.

| Component | Export Path | Primary Purpose | Key Props & Patterns |
| :--- | :--- | :--- | :--- |
| **`Button`** | `@arcade/lib-ui/components/Button` | Primary action primitive. Supports polymorphic rendering as links. | `variant="primary" \| "secondary" \| "outline" \| "ghost" \| "danger"`, `size="sm" \| "md" \| "lg"`, `as="button" \| "a"`, `leadingIcon`, `trailingIcon`. |
| **`TextField`** | `@arcade/lib-ui` | Form input with built-in accessible labeling, error messaging, and helper text. | `label`, `error`, `helperText`, `fullWidth`, `type`, standard HTML input props. |
| **`Switch`** | `@arcade/lib-ui/components/Switch` | Accessible binary toggle switch for options and preferences. | `checked`, `onChange`, `label`, `disabled`. |
| **`SegmentedControl`** | `@arcade/lib-ui` | Pill-shaped radio group for mutually exclusive options (e.g. difficulty, modes). | `items: SegmentedControlItem[]`, `value`, `onChange`, `name`. |
| **`GameSegmentedControl`** | `@arcade/lib-ui` | Accessible horizontal game filter tab-bar implementing the WAI-ARIA tablist pattern with arrow-key roving tabindex, 44px touch targets, smooth mobile scrolling, and game emoji icon support. | `options: GameSegmentedOption[]`, `selectedId: string`, `onSelect: (id: string) => void`, `ariaLabel?: string`. |
| **`CollapsibleListbox`** | `@arcade/lib-ui/components/CollapsibleListbox` | Expandable single-select listbox with full keyboard arrow navigation. | `items`, `selectedValue`, `onSelect`. |
| **`Toolbar`** | `@arcade/lib-ui/components/Toolbar` | Container providing standardized gap, alignment, and wrapping for action groups. | `align="start" \| "center" \| "end"`, `children`. |
| **`GameSettingsPanel`** | `@arcade/lib-ui` | Dual-mode ADR 0008 declarative settings component rendering game options from `GameSettingsConfig`. In `mode="compact"` (in-game modal), renders only `availableInGame === true` toggles. In `mode="detailed"` (`/[lang]/settings.astro`), renders all options with descriptions, global appearance pickers (`SchemeSelector`, `ThemeSelector`, `LanguageSelector`), and destructive reset progress confirmation. | `config: GameSettingsConfig<T>`, `lang: SupportedLanguage`, `mode: "compact" \| "detailed"`, `onSettingsChange?: (settings: T) => void`, `onResetProgress?: () => void`, `className?: string`. |

---

## 3. Overlays & Feedback

Transient dialogs, drawers, floating popovers, and status notifications.

| Component | Export Path | Primary Purpose | Key Props & Patterns |
| :--- | :--- | :--- | :--- |
| **`Dialog`** | `@arcade/lib-ui/components/Dialog` | W3C APG compliant modal dialog with backdrop blur, focus trap, and Escape key dismissal. | `isOpen`, `onClose`, `title`, `description`, `children`, `footer`. |
| **`Popover`** | `@arcade/lib-ui/components/Popover` | Anchored floating overlay utilizing native HTML Popover APIs. | `trigger`, `content`, `placement`. |
| **`Tooltip`** | `@arcade/lib-ui/components/Tooltip` | Contextual microcopy displayed on focus or hover of compact icon buttons. | `content`, `position="top" \| "bottom" \| "left" \| "right"`. |
| **`Toast`** | `@arcade/lib-ui` | Global toast notification system with automatic queueing and auto-dismiss. | `toast.info()`, `toast.success()`, `toast.error()`, `toast.achievement()`. |
| **`PauseOverlay`** | `@arcade/lib-ui/components/PauseOverlay` | Fullscreen modal scrim pausing game canvas execution with resume/restart actions. | `onResume`, `onRestart`, `onExit`. |
| **`PauseDialog`** | `@arcade/lib-ui` | Standardized in-game pause dialog consuming canonical Dialog with Resume (primary) and Restart (outline) actions. | `isOpen`, `onResume`, `onRestart`. |
| **`VictoryDialog`** | `@arcade/lib-ui` | Post-game celebration dialog showing completion stats, medal progress, and next puzzle actions. | `isOpen`, `stats: VictoryStatItem[]`, `onPlayAgain`, `onNextPuzzle`. |
| **`UserProfileDialog`** | `@arcade/lib-ui` | Account dialog handling guest sessions, cloud sync switching, display name updates, and sign-in. | `isOpen`, `onClose`, `session`, `onSwitchStorageMode`. |
| **`ConsentBanner` / `ConsentDialog`** | `@arcade/lib-ui` | GDPR/ePrivacy compliant cookie and cloud telemetry consent management. | Managed via `@arcade/lib-consent`. |

---

## 4. Layout & Structure

Structural containers and layout primitives establishing consistent spacing and responsiveness.

| Component | Export Path | Primary Purpose | Key Props & Patterns |
| :--- | :--- | :--- | :--- |
| **`BaseLayout`** | `@arcade/lib-ui/layouts/BaseLayout` | Tier 1 root document shell (`<!doctype html>`, `<head>`, skip link, `<main id="main-content">`). | `title`, `description`, `lang`, `children`. |
| **`BaseLayoutWithSiteFooter`** | `@arcade/lib-ui/layouts/BaseLayoutWithSiteFooter` | Tier 1 layout scaffolding root document with `<SiteFooter />`. | `title`, `description`, `lang`, `currentSlug`, `children`. |
| **`BaseLayoutWithSiteHeaderAndSiteFooter`** | `@arcade/lib-ui/layouts/BaseLayoutWithSiteHeaderAndSiteFooter` | Tier 1 layout scaffolding root document with `<SiteHeader />` and `<SiteFooter />`. | `title`, `description`, `lang`, `hideBrand`, `hasBorder`, `currentSlug`, `children`. |
| **`GameLayout`** | `@arcade/lib-ui` | Tier 1 Document Layout for active puzzle sessions with mobile-first single-column flex shell and zero window scrolling. | `header`, `status`, `children`, `toolbar`, `footer`, `containerWidth="standard" \| "wide" \| "slim" \| "extraWide" \| "full"`. |
| **`PageContainer`** | `@arcade/lib-ui/components/PageContainer` | Standardized page width constraint and responsive gutter padding. | `variant="slim" \| "standard" \| "wide" \| "full"`, `children`. |
| **`Stack`** | `@arcade/lib-ui/components/Stack` | Linear layout primitive enforcing token-based spacing between children. | `direction="row" \| "column"`, `gap`, `align`, `justify`. |
| **`Divider`** | `@arcade/lib-ui/components/Divider` | Visual rule separating distinct content sections. | `orientation="horizontal" \| "vertical"`. |
| **`Hero`** | `@arcade/lib-ui/components/Hero` | Top-of-page landmark with display typography, tagline, and optional logo slot. | `title`, `tagline`, `logo`, `headingLevel`. |
| **`GameContainer`** | `@arcade/lib-ui/components/GameContainer` | Responsive aspect-ratio preserving frame for game canvases. | `children`, `aspectRatio`. |
| **`MarkdownContent`** | `@arcade/lib-ui/components/MarkdownContent` | Standardized typographic container rendering localized Astro Markdown content collections (used in `MarkdownPageTemplate` and `slot="rulesContent"` per ADR 0008). | `children` (rendered HTML). |
| **`MarkdownPageTemplate`** | `@arcade/lib-ui/templates/MarkdownPageTemplate` | Tier 2 template for standalone Markdown pages (`/[lang]/rules.astro`). | `title`, `description`, `lang`, `breadcrumbItems`, `currentSlug`. |

---

## 5. Navigation & Shell

App shell chrome, global navigation landmarks, and user identity controls.

| Component | Export Path | Primary Purpose | Key Props & Patterns |
| :--- | :--- | :--- | :--- |
| **`SiteHeader`** | `@arcade/lib-ui/components/SiteHeader` | Global landmark header bar containing brand logo, title, and action slots. | `currentSlug`, `variant="default" \| "minimal"`. |
| **`GameHeader`** | `@arcade/lib-ui` | Top landmark organism for active gameplay with strictly centered timer slot and balanced action tracks. | `backHref`, `backLabel`, `difficulty`, `timer`, `onOpenSettings`, `hasBorder`. |
| **`SiteFooter`** | `@arcade/lib-ui/components/SiteFooter` | Global landmark footer with navigation links, copyright, and language selectors. | `lang`, `currentSlug`. |
| **`Breadcrumb`** | `@arcade/lib-ui/components/Breadcrumb` | W3C APG compliant breadcrumb trail. | `items`, `lang`. |
| **`HeaderActions`** | `@arcade/lib-ui/components/HeaderActions` | Flex cluster anchoring theme, language, and user profile buttons in the header. | `children`. |
| **`HeaderUserMenu`** | `@arcade/lib-ui` | Trigger button and identity badge showing active session (`Guest` vs authenticated) and storage mode. | Integrates with `@arcade/lib-user`. |
| **`SkipLink`** | `@arcade/lib-ui/components/SkipLink` | Accessible jump link allowing keyboard users to bypass header navigation to `#main-content`. | Built into layouts. |
| **`Logo`** | `@arcade/lib-ui/components/Logo` | Vector arcade brand logo with wooden bezel and responsive scaling. | `size="sm" \| "md" \| "lg" \| "xl"`. |
| **`LanguageSelector` / `LanguageSwitcher`** | `@arcade/lib-ui/components/LanguageSelector` | Accessible dropdown/list for switching the active UI language locale. | `currentLanguage`, `onChange`. |
| **`SchemeSelector` / `SchemeSwitcher`** | `@arcade/lib-ui/components/SchemeSelector` | Color scheme switcher (Light, Dark, System) controlling `color-scheme`. | `compact={boolean}`. |
| **`ThemeSelector`** | `@arcade/lib-ui/components/ThemeSelector` | White-label seasonal theme selector applying active themeset tokens. | Scoped to settings/footer. |

---

## 6. Data & Display

Primitives for data presentation, micro-indicators, typography, and styling contexts.

| Component | Export Path | Primary Purpose | Key Props & Patterns |
| :--- | :--- | :--- | :--- |
| **`Badge`** | `@arcade/lib-ui` | Compact status indicator or category pill. | `variant="default" \| "accent" \| "neutral"`, `size="sm" \| "md"`. |
| **`Icon`** | `@arcade/lib-ui` | Accessible SVG icon component drawing from the central design system sprite. | `name: IconName`, `size="xs" \| "sm" \| "md" \| "lg"`, `aria-hidden`. |
| **`MedalIcon`** | `@arcade/lib-ui` | Parameterized vector award medal with hanging ribbons, circular medallion, dashed border, and customizable center emblem. | `tier="bronze" \| "silver" \| "gold"`, `state="locked" \| "unlocked"`, `size={number \| string}`. |
| **`TriadBadge`** | `@arcade/lib-ui` | Triangular 3-medal cluster badge (Silver, Bronze, Gold) for progressive ladder achievements. | `bronzeUnlocked`, `silverUnlocked`, `goldUnlocked`, `size`. |
| **`Text`** | `@arcade/lib-ui/components/Text` | Semantic typography wrapper enforcing the modular scale and line heights. | `variant="display" \| "h1" \| "h2" \| "h3" \| "base" \| "small"`, `as="p" \| "span" \| "h1"`. |
| **`Theme`** | `@arcade/lib-ui/components/Theme` | Scoped theme context wrapper applying theme token overrides to descendant trees. | `name: ThemesetId`, `children`. |
| **`Timer`** | `@arcade/lib-ui/components/Timer` | Monospaced digital clock/timer display for game runtimes and speed runs. | `seconds`, `isPaused`. |
| **`VisuallyHidden`** | `@arcade/lib-ui/components/VisuallyHidden` | Utility clipping content visually while preserving full accessibility tree exposure. | `children`. |

---

## 7. System Screens & Utility Pages

Standardized destination screens for error handling, network status, and gateways.

| Component | Export Path | Primary Purpose | Key Props & Patterns |
| :--- | :--- | :--- | :--- |
| **`NotFoundScreen`** | `@arcade/lib-ui` | Full-page 404 screen for missing pages or invalid routes. | `title`, `message`, `homeHref`, `homeLabel`, `action`. |
| **`ErrorScreen`** | `@arcade/lib-ui` | Full-page 500 error screen or React ErrorBoundary fallback container. | `title`, `message`, `onRetry`, `retryLabel`, `homeHref`, `homeLabel`, `action`. |
| **`OfflineScreen`** | `@arcade/lib-ui` | PWA offline fallback screen when network connection is unavailable. | `title`, `message`, `onRetry`, `retryLabel`, `homeHref`, `homeLabel`, `action`. |
| **`LanguageRedirectFallback`** | `@arcade/lib-ui` | Accessible non-JS fallback screen during language redirection. | `title`, `message`, `languagesAriaLabel`, `languages`. |

---

## Rules of Engagement for AI Agents

1. **Before writing any Linaria `css`...`` or `styled` block in `apps/*`**:
   - Check this catalog to see if a component already handles the use case.
   - For all card/tile designs, use `<ClickableCard>`.
   - For all action triggers, use `<Button>`.
   - For all layouts, use `<PageContainer>` and `<Stack>`.
2. **Storybook Synchronization**:
   - When introducing a new component, layout, or template in `@arcade/lib-ui`, you **must**:
     1. Add its story titled according to our architecture taxonomy:
        - `Components/<ComponentName>` for general reusable UI building blocks (Button, ClickableCard, Dialog, TextField, Stack, Timer, Hero, selectors, etc.).
        - `Layouts/<LayoutGroup>/<ComponentName>` for Tier 1 root document shells and their exclusive chrome children (e.g. `Base Layout`, `Game Layout`).
        - `Templates/<TemplateGroup>/<ComponentName>` for Tier 2 structural templates and their exclusive children (e.g. `Game Landing Template`, `Game Subpage Template`, `Markdown Page Template`).
        - `System Pages/<ScreenName>` for full-page system screens and utility views (e.g. `Language Redirect`, `404 Not Found`, `Unexpected Error`, `Offline`).
     2. Add an entry to this `CATALOG.md` under the appropriate category table.
