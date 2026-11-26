---
id: accessibility-engineering
name: Accessibility Engineering
description: Project-specific BITV 2.0 / BFSG, Forced Colors Mode, OKLCH contrast, and non-color game cue constraints
targets: ['libraries/ui/src/components/*', 'apps/*/src/**/*']
---

# Accessibility Engineering Skill

This skill defines **project-specific** accessibility constraints beyond baseline web standards. For general ARIA, focus management, `<dialog>`, popover, and form accessibility patterns, consult [`modern-web-guidance`](/.agents/skills/modern-web-guidance/SKILL.md) first.

## 1. Regulatory & Target Compliance (BITV 2.0 / BFSG / WCAG 2.2 AA)

- All interactive controls, grid cells, and buttons must meet the **24×24 CSS pixel** minimum touch target size.
- Gameboards implementing 2D grids must follow the monorepo WAI-ARIA Grid + Biome pragma standard in [`game-shell.md`](/.ai/rules/game-shell.md#4-interactive-canvas-grid--accessibility-standards-wai-aria--biome-compliance).

## 2. Forced Colors Mode (`@media (forced-colors: active)`)

- Components in `@arcade/lib-ui` and game canvases must remain operable and clearly bounded in Windows High Contrast / Forced Colors Mode.
- Provide explicit `@media (forced-colors: active)` rules using CSS system color keywords (`buttonborder`, `highlight`, `mark`, `canvas`, `canvastext`) for borders, focus outlines, and invalid/selected states where background-only styling would be stripped.

## 3. Contrast Ratios & Non-Color Game Cues

- Theme tokens authored in `themeset-*.css.ts` (consumed via `themeColor()` per [`linaria-styling`](/.ai/skills/linaria-styling/SKILL.md#3-theme-variables--color-token-consumption)) must maintain `>= 4.5:1` text contrast and `>= 3:1` UI/graphical contrast across light and dark schemes.
- Puzzle and game states (e.g., color-sorting layers, intersecting graph edges, energized wires, region boundaries) must never rely on color alone—pair color with distinct geometric symbols, SVG patterns, letter badges, or `stroke-dasharray` styles.
