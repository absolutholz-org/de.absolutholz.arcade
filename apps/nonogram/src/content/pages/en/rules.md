---
title: "How to Play Nonogram"
description: "Rules, strategy, and controls for solving Nonogram picture logic puzzles."
---

# How to Play Nonogram

Nonograms (also known as Picross, Griddlers, or Paint by Numbers) are picture logic puzzles where cells in a grid must be filled or left blank according to numbers given at the side of the grid to reveal a hidden picture.

## The Objective

Your objective is to deduce which cells should be filled and which should remain empty (marked with an `X`) to uncover the pixel art image. Every puzzle in our arcade has a unique, deterministically solvable solution without any need for guessing.

## Reading the Clues

- **Row Clues:** Numbers displayed to the left of each row describe the runs of consecutive filled cells in that row, in order from left to right.
- **Column Clues:** Numbers displayed above each column describe the runs of consecutive filled cells in that column, in order from top to bottom.
- **Spacers:** Between two consecutive filled runs in the same row or column, there must be at least one empty space (`X`).
- **Single Run:** A clue of `5` on a 5-cell line means every cell in that line is filled.
- **Multiple Runs:** A clue of `2 1` on a 5-cell line means there is a block of 2 filled cells, followed by at least one empty space, followed by 1 filled cell.
- **Empty Line:** A clue of `0` indicates that no cells are filled in that line.

## Controls & Interaction

### Desktop Controls

- **Left Click:** Fill a cell (or drag to fill a line).
- **Right Click or Shift + Click:** Mark a cell with an `X` (or drag to cross a line).
- **Click-and-Drag:** Drag along rows or columns to draw or erase multiple cells smoothly in a single move.
- **Undo / Redo:** Use the toolbar buttons or standard keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`).

### Mobile & Touch Controls

- **Toggle Mode:** Use the floating toggle in the lower toolbar to switch between **Fill** and **Cross (X)** modes.
- **Tap & Drag:** Tap a cell or drag across a row or column. Default page scrolling is automatically prevented on the grid to ensure smooth drawing.

### Keyboard Controls

- **Arrow Keys:** Navigate focus across grid cells.
- **Space or Enter:** Fill the focused cell.
- **X:** Mark or unmark the focused cell with an `X`.
- **Backspace / Delete:** Erase the focused cell back to empty.

## Basic Deduction Strategies

1. **Full Lines:** Look for clues that match the total dimension (e.g. `5` on a 5×5 grid). Fill all cells immediately.
2. **Overlapping Runs:** If a block length is greater than half the grid dimension, the center cells must be filled regardless of where the block starts or ends. For example, a clue of `4` on a 5-cell line always fills the middle 3 cells (positions 2, 3, and 4).
3. **Marking Empty Cells:** When a row or column is partially completed, mark definitely empty cells with `X` to eliminate possibilities and unlock further deductions in intersecting lines.
