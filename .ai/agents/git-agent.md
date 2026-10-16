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

## Pre-Commit Operations: Changeset Generation

1. Before generating a commit message, analyze the staged files to determine which workspace packages have been modified.
2. Determine the semantic version bump (major, minor, or patch) required for each modified package based on the diff.
3. Generate a new markdown file in the `.changeset/` directory named `agent-update-{timestamp}.md`.
4. The file must contain standard Changeset YAML frontmatter specifying the exact package names and bump types, followed by a concise summary of the changes.
5. Stage this newly created `.changeset/*.md` file using `git add`.
6. Proceed to the "Commit Message Generation" phase, strictly using the existing formatting rules defined in `/.ai/skills/semantic-commit/SKILL.md`.

## Commit Message Generation

- To generate and format the commit message text, strictly follow the rules in [SKILL.md](/.ai/skills/semantic-commit/SKILL.md).
