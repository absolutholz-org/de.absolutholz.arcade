# `@arcade/lib-games`

Central game registry, taxonomy schemas, validation contracts, and subsystem type definitions for all applications in the Arcade monorepo.

## Architectural Role

`@arcade/lib-games` is a **zero-runtime-dependency** domain library adhering to:

- **[ADR 0005: Standard Arcade Game Integration Contract](../../docs/adr/0005-standard-game-contract.md)** — Canonical `GameId` union, `GAME_REGISTRY`, and phased Hub activation.
- **[ADR 0008: Standard Game Shell & Per-Game Subsystem Contracts](../../docs/adr/0008-game-shell-and-subsystem-contract.md)** — Declarative `GameSettingsConfig` and universal `GameStats` contracts.
- **[ADR 0009: Game Taxonomy and Metadata Architecture](../../docs/adr/0009-game-taxonomy-and-metadata-architecture.md)** — Multi-faceted `GameCategory`, `TaxonomyTags`, `GameMetadata`, and schema validators.

## Module Structure

- `src/taxonomy.ts`: Frozen `as const` taxonomy vocabularies (`GAME_CATEGORIES`, `MECHANIC_TAGS`, `INPUT_TAGS`, `PACING_TAGS`, `MODE_TAGS`, `SESSION_LENGTH_TAGS`), derived literal union types, narrow type guards, and zero-dependency structural validators (`validateGameMetadata`, `isValidGameMetadata`, `assertValidGameMetadata`, `validateGameRegistry`).
- `src/types.ts`: Canonical `GameId`, `GameMetadata` (`GameDefinition` alias), `ToolDefinition`, `GameStats`, and `GameSettingsConfig` contracts.
- `src/registry.ts`: Exhaustive `GAME_REGISTRY` (`Readonly<Record<GameId, GameMetadata>>`), `ALL_GAMES`, `GAME_IDS`, `getGame`, and `TOOL_REGISTRY`.

## Localization Boundary (ADR 007)

`GameMetadata` contains strictly structural and taxonomy metadata (`id`, `route`, `assets`, `i18nNamespace`, `category`, `tags`). Localized game titles, descriptions, instructions, and taxonomy labels are decoupled and resolved exclusively from `@arcade/lib-i18n` using `game.i18nNamespace` and the `taxonomy` namespace. User-facing Astro pages and React components must never render raw taxonomy enum slugs directly as UI text.

## Verification

```bash
# Typecheck library
pnpm --filter @arcade/lib-games typecheck

# Run monorepo architecture & taxonomy conformance suite
pnpm test:conformance
```
