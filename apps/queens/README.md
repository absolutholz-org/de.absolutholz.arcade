# @arcade/queens

Queens (Star Battle) logic puzzle game for the Absolutholz Arcade.

## Features

- **4 Difficulty Tiers & Board Sizes:**
  - Easy: 6×6 grid (6 regions, 6 crowns)
  - Medium: 8×8 grid (8 regions, 8 crowns)
  - Hard: 10×10 grid (10 regions, 10 crowns)
  - Expert: 12×12 grid (12 regions, 12 crowns)
- **Rules & Validation:**
  - Exactly 1 crown per row and column
  - Exactly 1 crown per contiguous color region
  - King's distance rule: crowns cannot touch horizontally, vertically, or diagonally
  - Real-time soft error collision highlighting for row, column, region, and adjacency violations
- **Interactions:**
  - Tap / click to toggle marks (X)
  - Double tap / secondary click to place crowns
  - Drag to bulk-eliminate empty squares with X
  - Mode switch toggle for mobile touch play (Crown Mode vs Mark Mode)
  - Undo and Redo history stack
  - Reset board button
  - Optional Auto-cross helper
- **Accessibility & i18n:**
  - WAI-ARIA grid pattern with full keyboard navigation
  - 100% localized in English, German, French, and Portuguese via `@arcade/lib-i18n`
  - High-contrast OKLCH theme colors supporting light, dark, and custom themes
- **Storage & State:**
  - Local persistence via `@arcade/lib-storage` with `arcade::queens::*` namespacing
  - Track completed status, solve times, and best times
