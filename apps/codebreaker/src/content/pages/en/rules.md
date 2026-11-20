---
title: How to Play Codebreaker
description: Learn the rules, scoring clues, difficulty presets, and keyboard controls for Codebreaker.
---

## Objective

Crack the hidden sequence of colored pegs before you run out of attempts. After each submitted guess, you receive grouped feedback pegs showing how close your sequence is to the secret code.

## Difficulty Presets

- **Easy:** 4 pegs, 6 colors, 10 attempts
- **Medium:** 4 pegs, 8 colors, 10 attempts
- **Hard:** 5 pegs, 8 colors, 12 attempts

By default, secret codes may contain repeated colors. You can toggle **Allow Duplicate Colors** in Settings before starting a new round.

## Feedback Clues

Feedback pegs are always displayed **grouped** (exact matches first, then color-only matches, then empty sockets), so their order never reveals which specific slot matched:

- **Exact Match (solid dark peg):** Right color in the exact right position.
- **Color-Only Match (hollow ring peg):** Right color, but placed in the wrong position.
- **No Match (empty socket):** Color does not match any remaining peg in the secret code.

Each peg in the secret code is counted at most once, so duplicate colors are never double-counted.

## Logical Hints

Press **Hint** (or `H`) at any time:

- If your current unsubmitted row contradicts a previous guess's feedback, Codebreaker flags the conflicting row.
- Otherwise, Codebreaker suggests a logically consistent color for the next empty slot (or confirms that your completed draft is consistent with all prior clues).

## Controls

- **Tap / Click:** Tap a color in the palette to place it in the active slot, tap a filled slot to select or clear it, and press **Check Guess** once the row is full.
- **Keyboard:**
  - `←` / `→` — Move between slots in the active row
  - `1`–`8` — Place the corresponding color peg
  - `Backspace` / `Delete` — Clear the active or previous slot
  - `Enter` — Submit a complete guess row
  - `H` — Request a logical consistency hint
  - `U` / `Z` — Undo active-row placement; `R` / `Y` — Redo
  - `Esc` / `P` — Pause or resume the game
