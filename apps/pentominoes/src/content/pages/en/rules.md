---
title: "Pentominoes Rules & Strategy"
description: "Learn how to rotate, reflect, and pack canonical 5-cell pentominoes into exact cover rectangles and architectural silhouettes."
---

## Objective

In **Pentominoes**, your goal is to tile a target geometric frame completely using the provided set of polyomino pieces. Every playable cell on the board must be covered by exactly one square of a polyomino—with **no overlapping pieces** and **no empty gaps**.

## The 12 Canonical Pentominoes

A **pentomino** is a polygon formed by joining 5 equal squares edge to edge. Discovered and named by mathematician Solomon W. Golomb, there are exactly **12 free pentominoes**, identified by the Latin letters they resemble:

- **F, L, N, P, Y, Z** (Chiral pieces: can be rotated in 4 orientations and flipped across their mirror axis for up to 8 orientations)
- **I, T, U, V, W** (Symmetric pieces: rotations alone produce all distinct orientations)
- **X** (Fully symmetric cross: only 1 orientation)

Together, all 12 canonical pentominoes cover exactly $12 \times 5 = 60$ unit cells.

## Game Modes

1. **The Penta Ladder ($5 \times N$):** Progressively pack subsets of pentominoes from a compact $5 \times 3$ starter frame (3 pieces) all the way up to the classic $5 \times 12$ and $6 \times 10$ full-set rectangles (all 12 pieces).
2. **60-Cell Master Silhouettes & Sculptures:** Tackle the $8 \times 8$ Center Courtyard ($2 \times 2$ central void), $8 \times 8$ Corner Bastion, Greek Cross, Stepped Pyramid, and Roman Archway.
3. **Procedural Generator:** Generate fresh, deterministically solvable polyomino packing boards verified by Donald Knuth's Dancing Links (Algorithm X) exact-cover solver.

## Controls & Accessibility

- **Pointer & Touch:** Tap or click a piece in the tray to pick it up. Use the transform bar to **Rotate $90^\circ$** or **Flip**, then tap or drag onto any valid board cell to place it. Tap any placed piece on the board to pick it back up.
- **Full Keyboard Navigation:**
  - `Tab` / `Shift + Tab`: Move focus between the Polyomino Tray, Active Transform Bar, and the Board Grid.
  - `Arrow Keys`: Move the board cursor across rows and columns.
  - `R`: Rotate the active piece $90^\circ$ clockwise.
  - `F`: Flip (reflect) the active piece horizontally.
  - `Space` or `Enter`: Pick up a piece or place the active piece at the cursor anchor.
  - `Escape`: Return the active piece to the tray.
- **Colorblind Independence:** Every piece features both a distinct geometric surface texture and its canonical letter badge (`F`–`Z`) on its anchor cell.
