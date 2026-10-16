---
title: "Tracks Rules"
description: "Learn how to play Tracks and build a continuous railway from Start A to Finish B using row and column clues."
---

# Tracks Rules

Tracks (also known as *Train Tracks*) is a logical pathfinding puzzle played on a rectangular grid bordered by numeric clues.

## Objective

Build a **single continuous railway track** from the **Start station (A)** to the **Finish station (B)** such that:

1. **Continuous Path:** The track forms one unbroken path connecting **A** to **B** with no dead ends, branches, or isolated loops.
2. **Row & Column Clues:** Every number along the top and left borders indicates the **exact number of cells** containing track segments in that column or row.
3. **No Crossings:** The railway track may never cross or overlap itself, and each cell may contain at most one straight or curved track segment.

## Row & Column Clues

- **Clue Numbers:** A clue of `5` means exactly 5 cells in that row or column must contain railway segments.
- **Fixed Track Hints:** Some cells already contain pre-placed track pieces (including Start **A** and Finish **B**). Your path must incorporate every pre-placed track segment and align with its open rail ends.
- **Visual Feedback:** When clue highlighting is enabled, satisfied row and column clues dim automatically, while clues or cells that exceed their target count are highlighted as errors.

## How to Play

- **Click & Drag to Lay Track:** Click and drag across orthogonally adjacent cells to smoothly lay connected straight and curved railway segments—existing neighbors automatically bend to join your path.
- **Click or Tap:** Click a cell to place, cycle, or clear a track segment using the active input mode.
- **Right-Click / Cross (X):** Right-click (or switch to Cross Mode) to mark a cell with an **X** when you deduce that no track can pass through it.
- **Auto-Cross Helper:** Enable Auto-Cross in settings to automatically fill remaining empty cells in a row or column with **X** marks as soon as its track clue is satisfied.

## Keyboard Controls

You can navigate the railway grid and construct tracks entirely with the keyboard:

| Key | Action |
| --- | --- |
| **Arrow Keys** | Move focus between cells across the grid |
| **Home / End** | Jump to the first or last column of the current row |
| **Space** / **Enter** | Place or toggle cell state using the active mode, or cycle track orientation |
| **Shift + Arrow Keys** | Extend the railway track into the adjacent cell in that direction |
| **R** / **T** | Cycle through straight and curved track orientations in the focused cell |
| **X** / **M** | Place or remove a ruled-out **X** mark |
| **C** | Toggle a candidate / guide marker |
| **Backspace** / **Delete** | Clear the current non-fixed cell back to empty |
| **Z** / **U** *(or Ctrl/⌘+Z)* | Undo the previous move |
| **Y** *(or Ctrl/⌘+Shift+Z)* | Redo the previously undone move |
| **Esc** / **P** | Pause or resume the puzzle |
