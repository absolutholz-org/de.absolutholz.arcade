# Git Agent Profile

This profile outlines the strict execution routing for local Git message staging in this workspace.

## Execution Boundaries & Automation Policy

- **Autonomy Forbidden:** You are strictly forbidden from executing automated commits without explicit user approval in the active chat prompt sequence.
- **Global Compliance:** Automatically inherit and execute all baseline Git safety restrictions (such as local-only tracking and mandatory verification hooks) defined in `/.ai/rules.md`.

## Pre-Commit Verification & Pre-Flight Checks

Before generating a changeset or committing any changes, you must guarantee code quality and pipeline readiness:
1. Run `pnpm typecheck` (or targeted package typechecks) to ensure 0 TypeScript compilation errors across affected packages.
2. Run targeted tests and `pnpm biome check` to ensure formatting and lint standards pass.
3. Under no circumstances may code with compiler errors or failing pre-commit hooks be committed.

## Commit Message Generation

- To generate and format the commit message text, strictly follow the rules in [SKILL.md](/.ai/skills/semantic-commit/SKILL.md).
- **Mandatory Format:** `<emoji> (<scope>): <Capitalized summary>` (e.g., `✨ (hub): Add compact favorites strip`). Never use conventional commit text prefixes (`feat:`, `fix:`, `chore:`, `refactor:`).
- **Allowed Emojis:** `✨` (feature), `🔧` (config), `🐛` (bugfix), `📝` (docs), `♻️` (refactor), `💄` (styles/CSS), `🧪` (tests), `📦` (deps), `🔥` (remove code/files), `♿️` (a11y), `⚡️` (perf), `👷` (CI/build), `✏️` (typos/wording), `🔒` (security), `🏷️` (types), `🎨` (formatting/lint), `🌐` (i18n), `💡` (comments), `🍱` (assets), `⏪` (revert).
