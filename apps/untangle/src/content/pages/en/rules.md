---
title: "Untangle Rules"
description: "Learn how to play Untangle and rearrange planar graph vertices until no edges cross."
---

# Untangle Rules

Untangle (also known as *Planarity*) is a geometric puzzle played on a tangled planar graph of connected vertices and edges. Every puzzle is guaranteed to have a flat, non-intersecting layout.

## Objective

Rearrange the vertices on the canvas so that **zero edges cross each other**:

1. **Eliminate All Crossings:** Drag or move vertices to new positions until no two line segments intersect anywhere between their endpoints.
2. **Planar Guarantee:** Every generated graph is mathematically planar—it can always be untangled completely without adding, removing, or disconnecting any edges.
3. **Instant Victory:** As soon as the intersection count drops to **0**, the puzzle is solved!

## Difficulty Presets

Choose from three difficulty tiers that scale the number of vertices and connecting edges:

- **Beginner (Easy):** **6–8 vertices** — Ideal for learning basic planar patterns and quick untangling.
- **Intermediate (Medium):** **10–14 vertices** — Moderately dense graphs requiring multi-step outer face extraction.
- **Advanced (Hard):** **16–22 vertices** — Complex planar triangulation networks demanding systematic hub isolation.

## Visual Cues

- **Intersecting Edges (Dashed):** Edges that currently cross at least one other edge are rendered with a **dashed stroke** and warning accent color so you can spot tangles even without relying on color alone.
- **Resolved Edges (Solid):** Edges that do not cross any other edge are rendered as **solid lines**.
- **Connected Neighborhood Highlight:** Selecting or dragging a vertex highlights its directly connected edges and neighboring nodes, making it easy to see where its connections pull across the canvas.

## How to Play

- **Pointer / Touch Dragging:** Click or touch any vertex and drag it smoothly across the canvas. Edge crossings recalculate in real time as you move.
- **Undo / Redo / Reset:** Use the toolbar controls to step backward or forward through your moves, or reset the graph to its initial ring arrangement.
- **Hint:** Request a hint to move a tangled vertex toward its guaranteed planar solution position.

## Keyboard Controls

You can focus, select, and reposition every vertex entirely with the keyboard:

| Key | Action |
| --- | --- |
| **Tab** / **Shift + Tab** | Move focus between graph vertices and game controls |
| **Enter** / **Space** | Select or deselect the currently focused vertex for movement |
| **Arrow Keys** | Move the focused or selected vertex by a fine step (`10` units) |
| **Shift + Arrow Keys** | Move the focused or selected vertex by a coarse step (`40` units) |
| **Z** / **U** *(or Ctrl/⌘+Z)* | Undo the previous vertex move |
| **Y** *(or Ctrl/⌘+Shift+Z)* | Redo the previously undone move |
| **H** | Trigger a planar hint |
| **Esc** / **P** | Deselect vertex or pause/resume the puzzle |
