# ADR 0012: Nested `AGENTS.md` & Imperative `IF -> THEN` Routing

## Status

Accepted (Supersedes [ADR 0001](./0001-agent-routing-architecture.md))

## Context

Under [ADR 0001](./0001-agent-routing-architecture.md), the root [`AGENTS.md`](/AGENTS.md) acted as a flat routing registry pointing to per-package `.ai/agents/*.md` profiles, while global rules lived in a 22 KB `.ai/rules.md` monolith. As the monorepo scaled to 15+ games and 12 libraries:

1. Root `AGENTS.md` became bloated with repetitive per-game rows, while `.ai/rules.md` consumed ~5.5k baseline tokens on every task.
2. Two-hop routing (`AGENTS.md` -> agent profile -> skill) caused mid-task operational rules (e.g. `CATALOG.md` checks, `semantic-commit` formatting, raw storage bans) to be bypassed on compound prompts.
3. Per-game agent profiles duplicated ~70% boilerplate across games while 2 games (`bridges`, `liquid-sort`) lacked profiles entirely.

## Decision

We replace the flat root router and thin agent wrappers with a **2-tier Nested `AGENTS.md` + Imperative `IF -> THEN` Architecture**:

1. **Lean Root [`AGENTS.md`](/AGENTS.md):** Holds only non-negotiable global invariants and an imperative `IF -> THEN` pre-flight table that triggers skills, `CATALOG.md`, and `.ai/rules/*` directly in one hop.
2. **Nested Package `AGENTS.md`:** Game and library packages declare only local invariants (engine math, keybindings, package-specific contracts) in `apps/<game>/AGENTS.md` and `libraries/<lib>/AGENTS.md`—zero restated global rules.
3. **Modular On-Demand Specs (`.ai/rules/*` & `.ai/skills/*`):** Deep domain specs (`game-shell.md`, `rendering-boundaries.md`, `metadata.md`) and task workflows live in `.ai/rules/` and `.ai/skills/` and are loaded only when triggered.
4. **Deterministic Enforcement:** Critical invariants (storage globals, commit format, `CATALOG.md` parity, AI doc link integrity) are enforced via Biome rules, git hooks, and `pnpm test:conformance` rather than prose repetition.
