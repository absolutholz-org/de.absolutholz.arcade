# @arcade/lib-user — Local Agent Invariants

- **Headless TypeScript Only:** Never generate React components, JSX, or CSS in `libraries/user`.
- **Data Sovereignty First:** Users choose between offline-only (`localStorage`) and cloud-synced (`Firestore`).
- **Adapter Decoupling:** All storage operations must go through the `IStorageAdapter` contract. Never import or call `localStorage` or the Firestore SDK directly outside their respective adapter classes.
- **No Direct Cloud Tooling:** Generate self-contained TypeScript; do not invoke external cloud tooling or remote MCP servers.
- **Boundaries:** Adhere to [`codebase-structure`](/.ai/skills/codebase-structure/SKILL.md) and [`storage-namespacing`](/.ai/skills/storage-namespacing/SKILL.md).
