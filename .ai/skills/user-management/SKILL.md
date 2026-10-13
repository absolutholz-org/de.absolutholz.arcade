---
name: user-management
description: Rules and architectural boundaries for the headless @arcade/user package and data sovereignty.
---

# User Management & Storage Architecture

## Scope Boundaries

- Headless TypeScript only. Never generate React components, JSX, or CSS in `packages/user`.
- Adhere strictly to the monorepo boundaries defined in `.ai/skills/codebase-structure`.
- Respect namespacing rules defined in `.ai/skills/storage-namespacing`.

## Core Principles

1. **Data Sovereignty First**: Users choose between offline-only (`localStorage`) and cloud-synced (`Firestore`).
2. **Adapter Decoupling**: All storage operations must go through the `IStorageAdapter` contract. Never import or call `localStorage` or Firestore SDK directly outside their respective adapter classes.
3. **No MCP / No Direct Cloud Connections**: Generate pure, self-contained TypeScript files. Do not invoke external cloud tooling or remote MCP servers.
