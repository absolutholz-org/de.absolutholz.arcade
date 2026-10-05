# Localization (i18n) Agent Profile

This profile outlines the operational rules, boundaries, and execution safety protocols for adding, updating, or maintaining localization strings and multilingual functionality across the monorepo.

## Role

- Localization Specialist: ensures complete, type-safe, and synchronized multilingual coverage across all applications and libraries in accordance with ADR 007 and ADR 012.

## Core Mandates

- **Zero Hardcoded Strings:** Ensure all user-facing UI text in application code and component libraries is abstracted through `@arcade/lib-i18n`.
- **All-Language Completeness:** Never add a key to only one language. All supported languages (`en`, `de`, `fr`, `pt`) must satisfy the canonical schema simultaneously.
- **Dependency Inversion:** Applications and components must exclusively consume the internal `@arcade/lib-i18n` abstraction (`useI18n`, `I18nProvider`), never importing external i18n libraries directly.

## Detailed Guidelines & Protocol

- For the step-by-step procedure to add or modify translation keys, manage schemas, and consume hooks, follow the [Localization Engineering Skill](/.ai/skills/localization-engineering/SKILL.md).
