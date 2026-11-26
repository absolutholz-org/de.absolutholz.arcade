---
id: linaria-styling
name: Linaria Styling Enforcement
description: Enforce Linaria as the sole styling engine, ban runtime CSS-in-JS and Vanilla Extract, and govern theme tokens and rem units under ADR 014
targets: ['**/*.css.ts', 'libraries/ui/**/*.tsx']
---

# Linaria Styling Enforcement Skill

This skill enforces Linaria as the sole styling engine across all applications and libraries in accordance with ADR 014 (Styling Engine) and ADR 011 (CSS Architecture and Theming).

## 1. Prohibited Styling Frameworks & Engines

Agents are strictly forbidden from introducing, importing, or configuring alternative styling frameworks or runtime CSS-in-JS engines:
- **Banned:** Vanilla Extract (`@vanilla-extract/css`).
- **Banned:** Tailwind CSS (utility classes, directives like `@apply`, `@tailwind`).
- **Banned:** CSS Modules (`*.module.css`).
- **Banned:** Runtime CSS-in-JS libraries including standard Emotion (`@emotion/react`, `@emotion/styled`) and styled-components.
- **Banned:** Inline style objects (`style={{ ... }}`) for static component styling (reserved strictly for purely dynamic, runtime-computed values such as animation coordinates or progress bars).

## 2. Component Styling Declarations

- All styles must be authored using standard CSS strings inside template literals with Linaria (`@linaria/core` and `@linaria/react`):
  - `css` tagged template literal for class names and static styles.
  - `styled` tagged template literal for styled components.
- **Syntax Standard**: Never use JavaScript object syntax for styles. Write standard, native CSS declarations inside template literals.
- **Zero Runtime Prop Interpolations / Zero Generated Inline CSS Variables**: Agents are strictly forbidden from passing dynamic component props into template literal interpolation functions (`${({ $variant }) => ...}`). In Linaria, runtime prop functions compile into dynamic CSS custom properties rendered as inline `style="..."` attributes on the DOM node. All component variants, layout options, orientations, and sizes must be matched statically via CSS `data-*` attribute selectors (e.g., `&[data-variant='primary']`, `&[data-size='sm']`, `&[data-direction='row']`).

## 3. Theme Variables & Color Token Consumption

- **Zero Hardcoded or New Raw Colors**: Agents must **never** add new raw colors or use hex (`#ffffff`, `#000000`), `rgb()`/`rgba()`, `hsl()`, Tailwind color palettes, raw `oklch(...)` literals, or raw `var(--color-*, <fallback>)` strings in component/app styles. All concrete OKLCH color definitions live exclusively in `libraries/ui/src/styles/theme/themeset-*.css.ts`.
- **Mandatory `themeColor()` Utility**: All visual tokens (surfaces, containers, text, accents, 12-color `rainbow-1..12` game palettes, `status-{success,warning,danger,info}`, and `medal-{gold,silver,bronze}`) must be consumed via the type-safe `themeColor()` utility from `@arcade/lib-ui/styles/theme/theme.utils` (never raw `var(--color-*)` strings in `.ts`/`.tsx`):
  ```ts
  import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
  import { css } from '@linaria/core';

  export const card = css`
    background-color: ${themeColor('surface')};
    color: ${themeColor('text-1')};
    border-color: ${themeColor('container-2')};
  `;
  ```
- **Deriving Variants in CSS**: Derive alpha, contrasting ink, borders, or subtle tints directly from `themeColor()` tokens using native CSS:
  - Alpha: `oklch(from ${themeColor('accent')} l c h / 0.25)`
  - Contrasting ink on solid fills: `oklch(from ${themeColor('rainbow-1')} clamp(0.12, (0.62 - l) * 100, 0.98) 0.02 h)`
  - Subtle surface tint: `color-mix(in oklch, ${themeColor('status-danger')} 14%, ${themeColor('surface')})`
  - Never use `color-mix(in srgb, ...)` or `color-mix(in oklab, ...)`; always use `in oklch`.
- In accordance with ADR 011, the design system utilizes `oklch` and `light-dark()` at the root level; consuming `themeColor()` tokens guarantees seamless support for dark mode, themesets, and high-contrast modes (`@media (prefers-contrast: more)`).

## 4. CSS Units Constraint (Prefer `rem`)

In accordance with `.ai/rules.md` (Section 5):
- **Prefer REM**: Always use `rem` units for typography (`font-size`, `line-height`), spacing (`margin`, `padding`, `gap`), and dimensions (`width`, `height`, `max-width`, `min-height`).
- **Prohibited PX**: Do not use `px` units except for:
  1. Media queries (where `px` or `em` is standard).
  2. Border widths (e.g., `1px solid ...` to preserve pixel-level sharpness).
  3. Strict accessibility minimums (e.g., `24px` by `24px` minimum interactive touch targets per WCAG 2.2 AA).

## 5. Self-Documenting Style Contracts & Comments

- **Semantic Class & Variant Identifiers**: Style classes, variant keys, and component definitions must be named descriptively (e.g., `primaryActionButton`, `compactBoardGrid`).
- **Concise Styling Comments**: Add brief, focused comments when declaring non-obvious CSS calculations, intricate media queries, or specificity overrides. Avoid redundant comments for standard visual properties.
