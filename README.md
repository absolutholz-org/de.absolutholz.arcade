# 🕹️ Arcade Web App

Welcome to the Arcade Web App monorepo! This project is a unified Progressive Web App (PWA) hosting a collection of classic, highly accessible games (Minesweeper, Sudoku, Connect Four, etc.). 

Our guiding philosophy is **progressive enhancement, mobile-first design, and strict accessibility standards.**

## 🏗️ Architecture Overview

This project is structured as a strict multi-app monorepo utilizing `pnpm workspaces`. The target deployment environment is a static server (Apache/Nginx) with zero Node.js runtime. 

*   **`apps/`**: Contains all deployable, user-facing applications.
    *   `apps/hub`: The main portal, routing, and static pages (Accessibility, Legal), built with **Astro**.
    *   `apps/sudoku`: Classic Sudoku puzzle game with accessible 9×9 grid, timer, and settings, built with **Astro** and interactive React canvas.
    *   `apps/minesweeper`: Classic Minesweeper game with 5 board sizes, safe first click, chording, accessible grid, timer, and high scores, built with **Astro** and interactive React canvas.
    *   `apps/nonogram`: Nonogram (picture logic) game with 3 difficulty tiers (5×5, 10×10, 15×15), 15 deterministic starter puzzles, dual-mode line drawing, accessible grid, timer, and pixel art reveal, built with **Astro** and interactive React canvas.
    *   `apps/queens`: Queens / Star Battle logic puzzle game with 4 difficulty tiers (6×6, 8×8, 10×10, 12×12), 20 uniquely solvable puzzles, dual-mode inputs (Crown / X-mark), auto-cross helper, accessible grid, and timer, built with **Astro** and interactive React canvas.
    *   `apps/[game]`: Additional interactive game canvases built as pure **React/Vite** Single Page Applications (or Astro Islands).
*   **`libraries/`**: Contains all shared business logic, UI components, and infrastructure.
    *   `libraries/ui`: Shared design system components styled exclusively with **Linaria**.
    *   `libraries/i18n`: Shared localization engine, language constants, dictionaries, and React hook abstraction (`useI18n`).
    *   `libraries/storage`: Namespaced wrappers for LocalStorage/IndexedDB to prevent cross-game data collisions.

## 🤖 AI Agent Instructions (READ FIRST)

If you are an AI agent or LLM assisting in this repository, **you must read and adhere to the following files before generating any code or commands:**

1.  **`docs/adr/architecture-decision-records.md`**: The absolute source of truth for architectural constraints (No SSR, No Tailwind, No Module Federation).
2.  **`.ai/rules.md`**: Global development rules regarding code deduplication, DRY principles, and self-documenting code standards.
3.  **`AGENTS.md`**: The routing registry to find specific skill files based on your current task.

## 🛠️ Tech Stack

*   **Package Manager:** `pnpm`
*   **Frameworks:** Astro (Hub/SSG) & React (Interactive Games)
*   **Internationalization (i18n):** i18next & react-i18next with unified namespaced persistence
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

# Lint and format check (via Biome)
pnpm check

# Typecheck workspace
pnpm typecheck

# Start Sudoku dev server
pnpm dev:sudoku

# Start Minesweeper dev server
pnpm dev:minesweeper

# Start Nonogram dev server
pnpm dev:nonogram

# Start Queens dev server
pnpm dev:queens

# Start Hub dev server
pnpm dev:hub

# Start Storybook for libraries/ui
pnpm storybook

# Production builds
pnpm build:hub
pnpm build:sudoku
pnpm build:minesweeper
pnpm build:nonogram
pnpm build:queens
pnpm build:storybook
pnpm build:all
```

## 🚢 Deployment Architecture (Webgo)

Deployments are automated via GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`.

### Server Topology & Routing
- **Primary Domain (`arcade.absolutholz.de`)**: DocumentRoot `/home/www/de.absolutholz.arcade`
  - `/`: Hub (`apps/hub`)
  - `/sudoku`: Sudoku puzzle game (`apps/sudoku`)
  - `/minesweeper`: Minesweeper puzzle game (`apps/minesweeper`)
  - `/nonogram`: Nonogram picture logic game (`apps/nonogram`)
  - `/queens`: Queens logic puzzle game (`apps/queens`)
  - `/storybook`: Component design system documentation (`libraries/ui`)
- **Game Subdomains (`[gamename].absolutholz.de`)**: Pointed in Webgo to `/home/www/de.absolutholz.arcade`. The root `.htaccess` transparently 301-redirects requests to `https://arcade.absolutholz.de/[gamename]/` (preserving paths and query parameters).

### Required GitHub Secrets
Configure the following secrets in GitHub Repository Settings (`Settings -> Secrets and variables -> Actions`):
- `SSH_PRIVATE_KEY`: Private SSH key authorized for the Webgo hosting account.
- `WEBGO_SFTP_HOST`: Server SSH/SFTP host address (e.g., `swoo.webgo.de`).
- `WEBGO_SFTP_USERNAME`: Webgo SSH username.
- `WEBGO_SFTP_PORT`: Webgo SSH port (defaults to `22` if omitted).

