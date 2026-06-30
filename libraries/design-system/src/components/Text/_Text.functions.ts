import {
	typographyScale,
	fontWeights,
	DEFAULT_FONT_STACK,
} from './_Text.constants';
import type { TypographyScaleKey, TypographyWeightKey } from './_Text.types';

/**
 * Utility to generate a compiled, locked CSS font shorthand string
 * based on the typography scale and font weights.
 */
export function generateFontShorthand(
	scaleKey: TypographyScaleKey,
	weightKey: TypographyWeightKey,
): string {
	const { size, lineHeight } = typographyScale[scaleKey];
	const weight = fontWeights[weightKey];

	// Choose font family based on the typography scale category (headings vs body text)
	const isHeading = ['h1', 'h2', 'h3', 'display'].includes(scaleKey);
	const family = isHeading
		? `'Outfit', ${DEFAULT_FONT_STACK}`
		: DEFAULT_FONT_STACK;

	return `${weight} ${size}/${lineHeight} ${family}`;
}

/**
 * Returns a type-safe CSS custom property variable for the given typography scale key.
 * e.g. fontSize('base') -> 'var(--font-size-base)'
 */
export function fontSize(scaleKey: TypographyScaleKey): string {
	if (!(scaleKey in typographyScale)) {
		throw new Error(`Invalid typography scale key: "${scaleKey}"`);
	}
	return `var(--font-size-${scaleKey})`;
}
