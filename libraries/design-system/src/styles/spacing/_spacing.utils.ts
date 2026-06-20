import { spacingDefinitions } from './_spacing.constants';
import type { SpacingKey } from './_spacing.types';

/**
 * Re-export of the SpacingKey type for consumer convenience.
 */
export type { SpacingKey };

/**
 * Type-safe helper utility to convert spacing keys into a space-separated
 * CSS variable shorthand string (up to 4 arguments).
 */
export function space(...keys: SpacingKey[]): string {
	const activeKeys = keys.slice(0, 4);

	return activeKeys
		.map((key) => {
			if (!(key in spacingDefinitions)) {
				throw new Error(`Invalid spacing key: "${key}"`);
			}
			return `var(--space-${key})`;
		})
		.join(' ');
}
