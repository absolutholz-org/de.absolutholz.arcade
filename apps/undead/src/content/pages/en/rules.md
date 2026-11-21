---
title: How to Play Undead
description: Rules, mirror reflection mechanics, and monster visibility guidelines for Undead.
---

## Objective

Fill every empty cell of the haunted mirror grid with a **Ghost**, **Vampire**, or **Zombie** so that:

1. The total number of each monster matches the exact inventory shown above the grid.
2. Every number around the perimeter matches how many monsters are visible when looking straight into the grid from that edge position.

## Monster Visibility Rules

Diagonal mirrors (`/` and `\`) reflect your line of sight by 90 degrees:

- **Vampire (`V`):** Visible **only directly** (before the line of sight hits any mirror). Vampires cast no reflection!
- **Ghost (`G`):** Visible **only after at least one mirror reflection**. Ghosts are invisible to direct sight!
- **Zombie (`Z`):** **Always visible**, both directly and in reflections.

If a reflected sightline passes through the same monster cell twice, that monster is counted on each pass where it is visible.

## Controls & Tips

- **Ray Preview:** Hover or focus any edge clue number to trace its exact direct (solid) and reflected (dashed) sightline across the grid.
- **Mark Clues Done:** Click any edge clue number to dim it once you have finished analyzing that ray.
- **Keyboard Navigation:** Use **Arrow keys** to move between cells, press **`G`**, **`V`**, or **`Z`** to place a monster, and **`Backspace` / `Delete`** to clear a cell.
- **Pencil-Mark Notes:** Toggle **Notes** (press **`N`**), hold **`Shift + G / V / Z`**, or **right-click** a cell to track possible monster candidates.
