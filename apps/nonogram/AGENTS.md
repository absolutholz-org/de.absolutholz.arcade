# @arcade/nonogram — Local Agent Invariants

- **Puzzle Engine (`src/engine/`):** Binary matrix (`1` filled, `0` empty) with unique, guess-free catalog puzzles across Easy (5×5), Medium (10×10), Hard (15×15). Auto-dim matched line clues; trigger victory when filled cells match solution (extra `X` marks do not block win).
- **Accessibility & Styling:** WAI-ARIA `grid` with arrow keys, `Space`/`Enter` fill, `X` cross, `Backspace`/`Delete` erase. Suppress grid context menu for `X` marking, render thicker grid lines every 5 cells, and obscure board when paused.
- **Namespaces:** i18n `nonogram`; storage `createGameStorage('nonogram')`.
