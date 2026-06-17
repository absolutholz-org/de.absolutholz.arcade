# Agent Router

This document serves as the central routing system for AI agents in this monorepo. It maps specific user intents to specialized agent profiles.

## Routing Registry

| Intent / Domain                                 | Target Agent Profile                                                              | Description                                                                                   |
| :---------------------------------------------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| Git operations                                  | [Git Agent Profile](/.ai/agents/git-agent.md)                                     | Handles preparing and executing local git commits according to repository quality guidelines. |
| Component design & structure / Design system    | [Component Agent Profile](/libraries/design-system/.ai/agents/component-agent.md) | Enforces layout constraints, file split matrices, naming rules, and styling boundaries.       |
| Storybook stories & docs / Component playground | [Storybook Agent Profile](/libraries/design-system/.ai/agents/storybook-agent.md) | Handles creation and updates of interactive Storybook stories and MDX documentation.          |
| UI components / Accessibility / Styling         | [Accessibility Agent Profile](/.ai/agents/accessibility-agent.md)                 | Audits and builds UI components to guarantee strict WCAG 2.2 and BITV 2.0 compliance.         |

## General Rules

All agents must automatically parse and adhere to the monorepo-wide constraints defined in `/.ai/rules.md` before executing any task mapped in this registry.
