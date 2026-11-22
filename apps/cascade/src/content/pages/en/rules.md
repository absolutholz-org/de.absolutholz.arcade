---
title: How to Play Cascade
description: Rules, scoring formula, gravity physics, and strategy tips for Cascade.
---

## Objective

Clear connected groups of matching tiles from the **15×10** board to score as many points as possible. Try to clear every single tile for a **+1,000 Perfect Clear** bonus!

## Rules & Controls

1. **Select a Group (First Tap/Click):** Click or tap any tile connected orthogonally (up, down, left, or right) to at least one other tile of the same color. The entire connected cluster highlights and previews its point value.
2. **Clear the Group (Second Tap/Click):** Click or tap any tile in the highlighted cluster a second time to remove all tiles in the group. Tapping a different valid group switches your selection; isolated single tiles cannot be selected.
3. **Gravity & Column Shift:** After tiles are removed, tiles above the gaps fall straight down. Whenever an entire column becomes empty, all columns to its right shift left to close the gap.
4. **End of Round:** After every move, the board is scanned automatically. When no connected groups of 2 or more matching tiles remain, the round ends and any remaining isolated orphan tiles are highlighted.

## Scoring Formula

Larger groups award dramatically more points:

- **Cluster Points:** `(tiles - 2)²`
  - 2 tiles = `0 pts`
  - 3 tiles = `1 pt`
  - 5 tiles = `9 pts`
  - 10 tiles = `64 pts` (Mega Clear!)
  - 20 tiles = `324 pts`
- **Perfect Clear Bonus:** `+1,000 pts` if 0 tiles remain on the board.

## Difficulty Tiers

- **Beginner:** 5×5 grid, 3 colors (quick warm-up)
- **Easy:** 10×5 grid, 3 colors (relaxed chains)
- **Normal:** 15×10 grid, 3 colors (classic 3-color board)
- **Hard:** 15×10 grid, 4 colors (classic strategic balance)
- **Expert:** 20×15 grid, 4 colors (marathon board)

## Keyboard Shortcuts

- **Arrow Keys:** Move focus across the 15×10 grid
- **Enter / Space:** Select a cluster, then press again to clear it
- **Escape:** Deselect the current cluster
- **Ctrl/Cmd + Z:** Undo move
- **Ctrl/Cmd + Shift + Z:** Redo move
- **P:** Pause / Resume
