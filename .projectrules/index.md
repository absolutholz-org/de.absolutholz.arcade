# Project Preferences and Rules

Welcome to the `de-absolutholz` repository. This file serves as the master preference and project rules manual.

## Technology Stack

Our core frontend stack consists of the following tools:
- **UI Framework**: React (Functional Components, Hooks, TypeScript)
- **Styling**: Vanilla Extract (Static CSS compilation, type-safe styles)
- **Component Workbench**: Storybook (CSF 3)
- **Language**: TypeScript (Strict typing enabled)

For specific development manuals and guidelines on this stack, refer to the files in the `/.projectrules/` directory:
- [React Development Manual](file:///Users/swoo/Workspaces/de-absolutholz/.projectrules/react.md)
- [Vanilla Extract Styling Manual](file:///Users/swoo/Workspaces/de-absolutholz/.projectrules/vanilla-extract.md)
- [Storybook Manual](file:///Users/swoo/Workspaces/de-absolutholz/.projectrules/storybook.md)
- [Git Automation Agent](file:///Users/swoo/Workspaces/de-absolutholz/.projectrules/git-agent.md)

---

## Codebase Organization & Folder Naming

### Mandatory PascalCase Folder Structure

All React components must be placed within their own folder at the appropriate level (e.g., in design systems, apps, libraries).
- Folder name: **PascalCase** (e.g., `Button/`, `UserProfile/`, `NavigationMenu/`).
- Entry point: `index.ts` to export the component cleanly.
- Files inside the directory must use the folder name as their prefix:
  ```
  UserProfile/
  ├── UserProfile.tsx
  ├── UserProfile.css.ts
  ├── UserProfile.stories.tsx
  ├── UserProfile.test.tsx
  └── index.ts
  ```

---

## Guidelines for IDEs & AI Agents

When interacting with this repository, always:
1. Review code against the [React Manual](file:///Users/swoo/Workspaces/de-absolutholz/.projectrules/react.md) and [Vanilla Extract Manual](file:///Users/swoo/Workspaces/de-absolutholz/.projectrules/vanilla-extract.md) before writing or refactoring components.
2. Ensure any new components are documented with stories following the [Storybook Manual](file:///Users/swoo/Workspaces/de-absolutholz/.projectrules/storybook.md).
3. Follow the commit message format and pre-commit checks documented in the [Git Automation Agent Rules](file:///Users/swoo/Workspaces/de-absolutholz/.projectrules/git-agent.md).
