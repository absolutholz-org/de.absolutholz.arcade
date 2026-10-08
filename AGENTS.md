# Agent Router

This document serves as the central routing system for AI agents in this monorepo. It maps specific user intents to specialized agent profiles.

## Routing Registry

| Intent / Domain                                 | Target Agent Profile                                                              | Description                                                                                   |
| :---------------------------------------------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| Git operations                                  | [Git Agent Profile](/.ai/agents/git-agent.md)                                     | Handles preparing and executing local git commits according to repository quality guidelines. |
| Component design & structure / Design system    | [Component Agent Profile](/libraries/ui/.ai/agents/component-agent.md) | Enforces layout constraints, file split matrices, naming rules, and styling boundaries.       |
| Storybook stories & docs / Component playground | [Storybook Agent Profile](/libraries/ui/.ai/agents/storybook-agent.md) | Handles creation and updates of interactive Storybook stories and MDX documentation.          |
| UI components / Accessibility / Styling         | [Accessibility Agent Profile](/.ai/agents/accessibility-agent.md)                 | Audits and builds UI components to guarantee strict WCAG 2.2 and BITV 2.0 compliance.         |
| Localization / Translations / Multilingual (i18n) | [Localization Agent Profile](/.ai/agents/localization-agent.md)                 | Manages translation schemas, dictionaries, and multilingual hooks across all apps and libraries. |
| Storage architecture / State persistence / Storage drivers | [Storage Agent Profile](/libraries/storage/.ai/agents/storage-agent.md)          | Enforces asynchronous namespacing and driver contracts adhering to ADR 008 and ADR 012.     |
| Sudoku game engine & canvas / Puzzle gameplay   | [Sudoku Agent Profile](/apps/sudoku/.ai/agents/sudoku-agent.md)                  | Manages puzzle engine, keyboard navigation, grid accessibility, and Sudoku state syncing.    |

## General Rules

All agents must automatically parse and adhere to the monorepo-wide constraints defined in `/.ai/rules.md` before executing any task mapped in this registry.
