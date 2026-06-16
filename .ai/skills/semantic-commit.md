# Semantic Commit Skill

This skill defines the formatting rules and template for commit messages in this monorepo workspace.

## Commit Message Template

Commit messages must strictly follow the format:
emoji (scope): summary

## Vocabulary Tokens

Use the following standard, clean emojis based on the nature of the change:

- ✨ Sparkles: for new features or scaffolding files
- 🔧 Wrench: for configurations (such as package.json, tsconfig.json, or tooling configs)
- 🐛 Bug: for bug fixes
- 📝 Memo: for documentation

## Scoping Rules

- The scope must be the target monorepo workspace/package or logical area of the work enclosed in parentheses (e.g., `(root)` for monorepo-level changes, or `(design-system)` for libraries/design-system).

## Description Formatting

- The summary/description must be a clear explanation of the changes.
- The first letter of the description must be capitalized.
- Examples:
  - ✨ (design-system): Add scheme switcher component matrix
  - 🔧 (root): Configure project tooling, ESLint rules
