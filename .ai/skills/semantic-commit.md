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
- ♻️ Recycle: for code refactoring (restructuring without behavior changes)
- 💄 Lipstick: for visual styles, CSS adjustments, or theme design tweaks
- 🧪 Test Tube: for adding, updating, or correcting tests
- 📦 Package: for dependency additions, updates, or package management changes
- 🔥 Fire: for removing code, files, or deprecated features
- ♿️ Wheelchair: for accessibility (A11y) improvements or compliance fixes
- ⚡️ Zap: for performance optimizations and speed improvements
- 👷 Construction Worker: for CI/CD, build systems, or release workflows
- ✏️ Pencil: for fixing typos, grammar, or minor wording corrections
- 🔒 Lock: for security improvements, vulnerability patches, or secret management
- 🏷️ Label: for TypeScript types, interfaces, or type declaration refinements
- 🎨 Palette: for code formatting, linting fixes, or code style compliance adjustments
- 🌐 Globe: for internationalization (i18n), translation, or localization updates
- 💡 Light Bulb: for adding or updating comments, JSDoc definitions, or inline code explanations
- 🍱 Bento Box: for adding or updating static assets (icons, SVGs, images, fonts, or media files)
- ⏪ Fast-Reverse Button: for reverting previous commits, changes, or rollbacks

## Scoping Rules

- The scope must be the target monorepo workspace/package or logical area of the work enclosed in parentheses (e.g., `(root)` for monorepo-level changes, or `(design-system)` for libraries/design-system).

## Description Formatting

- The summary/description must be a clear explanation of the changes.
- The first letter of the description must be capitalized.
- Examples:
  - ✨ (design-system): Add scheme switcher component matrix
  - 🔧 (root): Configure project tooling, ESLint rules
