# Agent Router

This document serves as the central routing system for AI agents in this monorepo. It maps specific user intents to specialized agent profiles.

## Routing Registry

| Intent / Domain                         | Target Agent Profile                                              | Description                                                                                   |
| :-------------------------------------- | :---------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| Git operations                          | [Git Agent Profile](/.ai/agents/git-agent.md)                     | Handles preparing and executing local git commits according to repository quality guidelines. |
| UI components / Accessibility / Styling | [Accessibility Agent Profile](/.ai/agents/accessibility-agent.md) | Audits and builds UI components to guarantee strict WCAG 2.2 and BITV 2.0 compliance.         |
