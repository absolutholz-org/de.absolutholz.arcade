import type { spacingDefinitions } from './_spacing.constants';

/**
 * Union type of all valid spacing keys in the scale.
 */
export type SpacingKey = keyof typeof spacingDefinitions;
