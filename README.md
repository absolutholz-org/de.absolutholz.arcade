# 🕹️ Arcade Web App

Welcome to the Arcade Web App monorepo! This project is a unified Progressive Web App (PWA) hosting a collection of classic, highly accessible games (Minesweeper, Sudoku, Connect Four, etc.). 

Our guiding philosophy is **progressive enhancement, mobile-first design, and strict accessibility standards.**

## 🏗️ Architecture Overview

This project is structured as a strict multi-app monorepo utilizing `pnpm workspaces`. The target deployment environment is a static server (Apache/Nginx) with zero Node.js runtime. 

*   **`apps/`**: Contains all deployable, user-facing applications.
    *   `apps/hub`: The main portal, routing, and static pages (Accessibility, Legal), built with **Astro**.
    *   `apps/[game]`: Individual, highly interactive game canvases built as pure **React/Vite** Single Page Applications (or Astro Islands).
*   **`libraries/`**: Contains all shared business logic, UI components, and infrastructure.
    *   `libraries/ui`: Shared design system components styled exclusively with **Linaria**.
    *   `libraries/storage`: Namespaced wrappers for LocalStorage/IndexedDB to prevent cross-game data collisions.

## 🤖 AI Agent Instructions (READ FIRST)

If you are an AI agent or LLM assisting in this repository, **you must read and adhere to the following files before generating any code or commands:**

1.  **`docs/adr/architecture-decision-records.md`**: The absolute source of truth for architectural constraints (No SSR, No Tailwind, No Module Federation).
2.  **`.ai/rules.md`**: Global development rules regarding code deduplication, DRY principles, and self-documenting code standards.
3.  **`AGENTS.md`**: The routing registry to find specific skill files based on your current task.

## 🛠️ Tech Stack

*   **Package Manager:** `pnpm`
*   **Frameworks:** Astro (Hub/SSG) & React (Interactive Games)
*   **Styling:** Linaria (`@linaria/core`, `@linaria/react`) natively using `oklch` & `light-dark()`
*   **Code Quality:** Biome (Formatting & Linting)
*   **Accessibility:** WCAG 2.2 Level AA / BITV 2.0 (Verified via `axe-core`)
*   **Testing:** Playwright (targeting latest Chrome, Edge, Firefox, Opera)

## 🚀 Quick Start (Development)

*(Note: Scripts to be finalized in Phase 1)*

```bash
# Install dependencies
pnpm install

# Format and lint code (via Biome)
pnpm format
pnpm lint

# Typecheck workspace
pnpm check

# Start Storybook for libraries/ui
pnpm storybook
```
