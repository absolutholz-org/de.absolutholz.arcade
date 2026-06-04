# Storybook Manual

This document outlines the rules and patterns for documenting and testing components in isolation using Storybook.

## Story Format

- **CSF 3 (Component Story Format 3)**: Use CSF 3 syntax for all stories. CSF 3 features object-based story definitions, reducing boilerplate code.
- **File Naming**: Story files must be named `[ComponentName].stories.tsx` and reside inside the component's PascalCase folder.

## Story Structure

- **Default Export (Meta)**: Define component metadata as the default export.
  ```tsx
  import type { Meta, StoryObj } from '@storybook/react';
  import { Button } from './Button';

  const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    argTypes: {
      onClick: { action: 'clicked' },
    },
  };

  export default meta;
  ```
- **Story Object (StoryObj)**: Define individual stories as named exports using the `StoryObj` helper.
  ```tsx
  type Story = StoryObj<typeof Button>;

  export const Primary: Story = {
    args: {
      label: 'Click Me',
      variant: 'primary',
    },
  };
  ```

## Best Practices

- **Use Args**: Always pass component inputs via `args` rather than hardcoding props inside the story render function, so controls work out-of-the-box.
- **Controls & Types**: Leverage TypeScript typings to automatically generate Storybook controls. Annotate optional/complex props using `argTypes` when needed.
- **Story Organization**: Group components logically in the sidebar using the `title` field (e.g., `'Design System/Atoms/Button'`).
- **Interactive Stories**: Use the Play function (`play`) and `@storybook/addon-interactions` for testing user interactions and visual states where applicable.
