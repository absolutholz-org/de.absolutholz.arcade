# @arcade/anagram

Lexicon anagram rack puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **4 Difficulty Tiers:** `easy` (5 tiles), `medium` (6 tiles), `hard` (7 tiles), and `expert` (8 tiles).
- **4 Lexicon Vocabularies:** English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`).
- **Dual Game Modes:**
  - **Zen Mode:** Untimed solving with optional word reveal helper.
  - **Timed Mode:** Countdown clock with time bonuses awarded for valid words found.
- **Accessible Letter Rack & Keyboard Controls:**
  - Typing directly stages letters from the rack into the input slot.
  - Clicking letters or slots stages or returns tiles.
  - Spacebar to shuffle the rack, Backspace to clear/recall, Enter to submit.
  - Clicking any uncovered word slot populates staged tiles.
- **State Persistence & Telemetry:**
  - `arcade::anagram::activeGame`: Preserves incomplete puzzle state, timer, and rack.
  - `arcade::anagram::settings`: Persists vocabulary language via `@arcade/lib-storage`.
  - `arcade::anagram::stats`: Telemetry recording win rate, words found, and time per tier and mode.
  - `@arcade/lib-medals`: Tracks achievements and progressive anagram badges.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/anagram/` | Root language redirector | Static SSG + Client redirect |
| `/anagram/[lang]/` | 1. Lobby / Landing with vocabulary, mode, and difficulty selectors | `<GameLandingTemplate>` + `<AnagramLobby client:load />` |
| `/anagram/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<AnagramGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/anagram/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/anagram/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/anagram/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/anagram/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Anagram dev server
pnpm dev:anagram

# Typecheck TypeScript code
pnpm --filter @arcade/anagram typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/anagram
```
