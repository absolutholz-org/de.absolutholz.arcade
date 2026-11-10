# Tic-Tac-Toe (`@arcade/tictactoe`)

Classic turn-based alignment duel for two players on an accessible $3 \times 3$ grid, built for the Absolute Holz Arcade monorepo.

## Overview

Tic-Tac-Toe is the foundational multiplayer and pass-and-play pilot application adhering to [ADR 0008](docs/adr/0008-game-shell-and-subsystem-contract.md), [ADR 0009](docs/adr/0009-game-taxonomy-and-metadata-architecture.md), and [ADR 0011](docs/adr/0011-multiplayer-architecture.md).

## Rules Summary

- Two players ($X$ and $O$) take turns placing their mark in open grid cells.
- The first player to form a continuous horizontal, vertical, or diagonal line of 3 marks wins the match.
- If all 9 cells are filled with no 3-in-a-row alignment, the game ends in a draw.
- In Pass & Play mode, the starting mark rotates automatically between rounds ($X \leftrightarrow O$) to guarantee competitive equity.

## Architecture & Subsystems

- `src/engine/`: Pure deterministic reducer completely decoupled from DOM and rendering.
- `src/components/`:
  - `TicTacToeBoard`: Accessible WAI-ARIA grid implementation (`role="grid"`, `role="row"`, `role="gridcell"`) with roving `tabIndex` keyboard navigation.
  - `TicTacToeGame`: Gameplay shell mounted inside `@arcade/lib-ui`'s `GameLayout`.
  - `TicTacToeLobby`: Mode selection view offering Pass & Play and upcoming online modes with player customization.
- `src/pages/`: 6 canonical localized Astro routes plus root language redirection.

## Development Commands

```bash
pnpm --filter @arcade/tictactoe dev
pnpm --filter @arcade/tictactoe test
pnpm --filter @arcade/tictactoe build
```
