# @arcade/tents

Tents campsite logic puzzle web application for the absolutholz Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **4 Difficulty Tiers:** `easy`, `medium`, `hard`, and `expert`.
- **Unique Solution Guarantee:** Bipartite matching solver verifies unique solution campsite layouts.
- **Accessible Grid & Controls:** WAI-ARIA grid navigation, row/col clue auto-grassing, and keyboard shortcuts.
- **Auto-Grass Helper:** Automatically surrounds placed tents with grass tiles and auto-fills satisfied lines (configurable in Settings).
- **Violation Highlighting:** Highlights adjacent tents, clue overflows, and unpaired trees (configurable in Settings).
- **Undo / Redo / Reset:** Full history navigation and hints.
- **State Persistence & Telemetry:**
  - `arcade::tents::activeGame`: Preserves ongoing puzzle progress.
  - `arcade::tents::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::tents::stats`: Tracks overall and per-difficulty games played, win rate, best streaks, and best times.
  - `@arcade/lib-medals`: Tracks achievements and progressive campsite badges.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture

Implements the standard 6-route shell and subsystem contracts defined in [ADR 0008](../../docs/adr/0008-game-shell-and-subsystem-contract.md).

---

## 💻 Development Commands

```bash
# Start Tents dev server
pnpm dev:tents

# Typecheck TypeScript code
pnpm --filter @arcade/tents typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/tents
```
