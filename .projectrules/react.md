# React Development Manual

This document defines the constraints and patterns for React development in this project.

## Component Architecture

- **Functional Components**: All components must be functional components using arrow functions or standard function declarations.
- **Single Responsibility**: Each component should do one thing well. If a component grows beyond 200 lines, consider breaking it down.
- **Exports**: Prefer **named exports** over default exports for better IDE autocomplete, searchability, and consistent naming across imports.
  ```tsx
  // Preferred
  export const Button = () => { ... };
  // Avoid
  export default Button;
  ```

## File & Folder Conventions

- **PascalCase Folders**: Each component must be housed in its own PascalCase directory named after the component.
- **File Structure**: A component folder should contain:
  - `[ComponentName].tsx` (the component logic)
  - `[ComponentName].css.ts` (vanilla-extract styles, if applicable)
  - `[ComponentName].stories.tsx` (Storybook stories)
  - `[ComponentName].test.tsx` (unit tests)
  - `index.ts` (entry point for clean exports)
- **Props**: Define component props explicitly using TypeScript `interface` or `type`.
  ```tsx
  export interface ButtonProps {
    label: string;
    onClick?: () => void;
  }
  ```

## State & Hooks

- **Custom Hooks**: Extract complex stateful logic or side effects into custom hooks.
- **Naming**: Custom hooks must start with the prefix `use` (e.g., `useToggle`).
- **Placement**: Keep general-purpose hooks in a shared `hooks` directory, and component-specific hooks directly in the component's directory.
- **State Updates**: Always use the functional update pattern when the new state depends on the previous state:
  ```typescript
  setCount(prev => prev + 1);
  ```
