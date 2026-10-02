import { radiusScale } from './radius.constants';

export type RadiusKey = keyof typeof radiusScale;

/**
 * Type-safe helper utility to convert border-radius keys into a space-separated
 * CSS custom property string (up to 4 arguments).
 */
export function radius(...keys: RadiusKey[]): string {
	const activeKeys = keys.slice(0, 4);

	return activeKeys
		.map((key) => {
			if (!(key in radiusScale)) {
				throw new Error(`Invalid radius key: "${key}"`);
			}
			return radiusScale[key];
		})
		.join(' ');
}
