---
id: astro-react-islands
name: Astro and React Islands Separation
description: Enforce strict architectural separation between Astro static page shells and React interactive islands under ADR 002
targets: ['apps/hub/**/*.astro', 'apps/**/*.tsx']
---

# Astro & React Islands Separation Skill

This skill enforces strict boundaries between Astro static page shells and React interactive islands across the monorepo, in accordance with ADR 002 (Build Tools and Static Output Generation).

## 1. Architectural Separation of Concerns

- **Astro Files (`.astro`)**:
  - Exclusively responsible for server-level routing, layout scaffolding, static HTML shells, and SEO metadata (`<title>`, `<meta>`, OpenGraph, structured data).
  - Must never contain complex client-side interactive game state, canvas animations, or reactive UI loops.
- **React Files (`.tsx`)**:
  - Exclusively responsible for interactive game logic, stateful UI controls, game canvas rendering, and client-side interactions.
  - Must remain completely decoupled from Astro server-side execution contexts.

## 2. Prohibition of Astro APIs in React Components

- React components (`.tsx`) must never import or consume Astro-specific runtime APIs or packages.
  - **Forbidden in `.tsx`:** `Astro.props`, `astro:transitions`, `astro:content`, `astro:assets`, or any other Astro runtime module.
- All initial static data required by a React component must be passed explicitly via standard React props serialized as JSON-compatible primitives or objects.
- React components must remain framework-agnostic and fully functional within standard Vite SPA or test environments without Astro dependencies.

## 3. Mandatory Client Hydration Directive (`client:only="react"`)

When mounting a React game or stateful island inside an Astro page (`.astro`), agents must always specify the `client:only="react"` hydration directive:

```astro
---
import { SudokuGame } from '@arcade/sudoku';
---

<main>
  <SudokuGame client:only="react" />
</main>
```

### Why `client:only="react"` is Mandatory (ADR 002):
1. **Static Deployment Target**: Our production servers (Apache/Nginx) serve pure static assets without Node.js runtime environments.
2. **SSR Prevention**: Game engines, canvas contexts, WebGL, and browser APIs (`window`, `localStorage`, `AudioContext`, `requestAnimationFrame`) will throw execution errors if evaluated during Astro's static pre-rendering phase.
3. **No Partial Server Rendering**: Do not use `client:load`, `client:idle`, or standard unhydrated tags for stateful game components, as they attempt to evaluate component markup on the server/build step. Always enforce `client:only="react"`.

## 4. Self-Documenting Game Logic & Concise Comments

- **Self-Explanatory Identifiers**: Interactive game mechanics, state machines, props, and hooks in `.tsx` files must use descriptive, self-explanatory variable and function names.
- **Concise Logic Commentary**: Accompany complex game logic (such as game loop ticks, board validation algorithms, coordinate transforms, or canvas rendering routines) with brief, focused comments that directly explain the non-obvious rationale. Avoid verbose or redundant commentary on self-evident code.
