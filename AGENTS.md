# Agent Router

This document serves as the central routing system for AI agents in this monorepo. It maps specific user intents to specialized agent profiles.

## Routing Registry

| Intent / Domain                                            | Target Agent Profile                                                           | Description                                                                                          |
| :--------------------------------------------------------- | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| Git operations                                             | [Git Agent Profile](/.ai/agents/git-agent.md)                                  | Handles preparing and executing local git commits according to repository quality guidelines.        |
| Component design & structure / Design system               | [Component Agent Profile](/libraries/ui/.ai/agents/component-agent.md)         | Enforces layout constraints, file split matrices, naming rules, and styling boundaries.              |
| UI components & layout implementation / Design system catalog | [Design System Catalog](/libraries/ui/CATALOG.md)                             | Mandatory UI inventory to audit before authoring interactive elements or layout containers in apps.  |
| Storybook stories & docs / Component playground            | [Storybook Agent Profile](/libraries/ui/.ai/agents/storybook-agent.md)         | Handles creation and updates of interactive Storybook stories and MDX documentation.                 |
| UI components / Accessibility / Styling                    | [Accessibility Agent Profile](/.ai/agents/accessibility-agent.md)              | Audits and builds UI components to guarantee strict WCAG 2.2 and BITV 2.0 compliance.                |
| Localization / Translations / Multilingual (i18n)          | [Localization Agent Profile](/.ai/agents/localization-agent.md)                | Manages translation schemas, dictionaries, and multilingual hooks across all apps and libraries.     |
| Storage architecture / State persistence / Storage drivers | [Storage Agent Profile](/libraries/storage/.ai/agents/storage-agent.md)        | Enforces asynchronous namespacing and driver contracts adhering to ADR 008 and ADR 012.              |
| Sudoku game engine & canvas / Puzzle gameplay              | [Sudoku Agent Profile](/apps/sudoku/.ai/agents/sudoku-agent.md)                | Manages puzzle engine, keyboard navigation, grid accessibility, and Sudoku state syncing.            |
| Minesweeper game engine & canvas / Puzzle gameplay         | [Minesweeper Agent Profile](/apps/minesweeper/.ai/agents/minesweeper-agent.md) | Manages minefield generation, keyboard navigation, grid accessibility, and state syncing.            |
| Nonogram game engine & canvas / Puzzle gameplay            | [Nonogram Agent Profile](/apps/nonogram/.ai/agents/nonogram-agent.md)          | Manages picture logic puzzle engine, clue derivation, grid accessibility, and state syncing.         |
| Queens game engine & canvas / Puzzle gameplay              | [Queens Agent Profile](/apps/queens/.ai/agents/queens-agent.md)                | Manages Star Battle / Queens puzzle engine, grid accessibility, rules validation, and state syncing. |
| Tracks game engine & canvas / Puzzle gameplay              | [Tracks Agent Profile](/apps/tracks/.ai/agents/tracks-agent.md)                | Manages Train Tracks puzzle engine, path connectivity, grid accessibility, and state syncing.        |
| Tents & Trees game engine & canvas / Puzzle gameplay       | [Tents Agent Profile](/apps/tents/.ai/agents/tents-agent.md)                  | Manages Tents & Trees puzzle engine, bipartite matching, grid accessibility, and state syncing.      |
| Anagram Scramble game engine & canvas / Puzzle gameplay    | [Anagram Agent Profile](/apps/anagram/.ai/agents/anagram-agent.md)            | Manages Anagram Scramble lexicon engine, signature indexing, rack accessibility, and state syncing.  |
| Intent / Domain                                            | Target Agent Profile / Skill                                                   | Description                                                                                          |
| :---                                                       | :---                                                                           | :---                                                                                                 |
| Scoped workflows / Quota-sensitive execution               | [Scoped Task Runner](/.ai/skills/scoped-task-runner/SKILL.md)                  | Enforces 8-call execution limits, forbids FS archeology, and stops iterative scratch loops.          |
| New game integration / Game planning                      | [New Game Skill](/.ai/skills/new-game/SKILL.md)                                | Standardized 6-phase workflow for specifying and integrating new arcade games per ADR 0005 & ADR 0008. |

## General Rules

All agents must automatically parse and adhere to the monorepo-wide constraints defined in `/.ai/rules.md` before executing any task mapped in this registry.
