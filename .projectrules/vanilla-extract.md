# Vanilla Extract Styling Manual

This document defines the rules and patterns for styling using Vanilla Extract CSS-in-JS.

## General Styling Principles

- **Zero Runtime Overhead**: Vanilla Extract compiles styles to static CSS files at build time. Avoid dynamic JavaScript evaluations inside `.css.ts` files that cannot be statically determined.
- **Style Isolation**: All component styles must reside in a companion file named `[ComponentName].css.ts` next to the component file.
- **No Inline Styles**: Avoid inline styles (`style={{ ... }}`) unless rendering truly dynamic values like runtime-calculated offsets, percentages, or absolute positions.

## Style Declarations

- **Use `style()`**: Define base styles using the `style` function from `@vanilla-extract/css`.
  ```typescript
  import { style } from '@vanilla-extract/css';

  export const container = style({
    display: 'flex',
    padding: '16px',
    backgroundColor: '#f5f5f5',
  });
  ```
- **Use `styleVariants()`**: For components with multiple visual states (e.g., sizes, colors, variants), use `styleVariants` to keep code clean and type-safe.
  ```typescript
  import { style, styleVariants } from '@vanilla-extract/css';

  const baseButton = style({
    borderRadius: '4px',
    border: 'none',
  });

  export const buttonVariants = styleVariants({
    primary: [baseButton, { backgroundColor: 'blue', color: 'white' }],
    secondary: [baseButton, { backgroundColor: 'gray', color: 'black' }],
  });
  ```

## Themes & Design Tokens

- **Theme Usage**: Access design tokens and theme variables via defined theme contracts. Do not hardcode magic numbers or hex codes directly unless they are local constants.
- **Global Styles**: Minimize the use of `globalStyle()`. Keep styles localized to components. Only use global styles for base resets, typography, and root configurations.
- **Naming Conventions**: Style classes should be camelCase. E.g., `buttonWrapper`, `activeTab`.
