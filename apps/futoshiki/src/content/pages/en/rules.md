---
title: How to Play Futoshiki
description: Learn the rules, inequality signs, and deduction techniques for Futoshiki.
---

## Objective

Fill every cell of the **N × N** grid with digits from **1 to N** so that:

1. **Unique Rows & Columns:** Every digit from `1` to `N` appears **exactly once** in each row and each column (a Latin square).
2. **Inequality Signs:** Every inequality symbol (`<`, `>`, `∧`, `∨`) placed between two adjacent cells must be satisfied.
   - `A < B` means the left cell is **less than** the right cell.
   - `A > B` means the left cell is **greater than** the right cell.
   - `∧` between two stacked cells means the **top cell is less than the bottom cell**.
   - `∨` between two stacked cells means the **top cell is greater than the bottom cell**.

## Deduction Tips

- **Follow Chains:** In a chain like `A < B < C < D` on a 4×4 grid, the cells must be `1, 2, 3, 4` in order.
- **Limit Extremes:** A cell that is greater than a neighbor can never be `1`. A cell that is less than a neighbor can never be `N`.
- **Use Pencil Marks:** Toggle **Notes** (`N`) to track candidate digits in empty cells as you narrow down ranges.
- **No Guessing Required:** Every generated puzzle is verified to have a single unique solution solvable purely by logic.

## Controls

- **Arrow Keys:** Move across the grid.
- **1–N:** Enter a digit (or toggle a candidate note when Notes mode is active).
- **Backspace / Delete:** Clear the selected cell.
- **N:** Toggle Notes mode.
- **H:** Apply a logical hint.
- **U / Z:** Undo last move · **R / Y:** Redo.
- **P / Esc:** Pause game.
