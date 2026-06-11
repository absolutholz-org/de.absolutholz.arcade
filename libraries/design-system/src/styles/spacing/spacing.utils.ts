import { spacingScale } from './spacing.constants';

export type SpacingKey = keyof typeof spacingScale;

/**
 * Type-safe helper utility to convert spacing keys into a space-separated
 * raw REM value shorthand string (up to 4 arguments).
 */
export function space(...keys: SpacingKey[]): string {
	const activeKeys = keys.slice(0, 4);

	return activeKeys
		.map((key) => {
			if (!(key in spacingScale)) {
				throw new Error(`Invalid spacing key: "${key}"`);
			}
			return spacingScale[key];
		})
		.join(' ');
}
