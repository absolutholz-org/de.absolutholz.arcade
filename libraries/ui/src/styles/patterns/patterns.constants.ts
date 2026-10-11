export const PATTERN_KEYS = [
	'diagonal-forward',
	'diagonal-reverse',
	'horizontal-stripes',
	'vertical-stripes',
	'cross-hatch',
	'fine-dots',
	'checker-dots',
	'cross-diagonal',
	'chevron',
	'diamond-mesh',
	'brick',
	'solid',
] as const;

export type PatternKey = (typeof PATTERN_KEYS)[number];

const STROKE_COLOR = 'color-mix(in srgb, currentColor 20%, transparent)';
const LIGHT_STROKE_COLOR = 'color-mix(in srgb, currentColor 18%, transparent)';
const DOTS_COLOR = 'color-mix(in srgb, currentColor 22%, transparent)';
const BRICK_COLOR = 'color-mix(in srgb, currentColor 20%, transparent)';

/**
 * 12 scalable native CSS background gradient patterns for high-contrast / accessible region distinction.
 * Built using native CSS gradients (repeating-linear-gradient, linear-gradient, and radial-gradient)
 * with robust stroke widths (2px–2.5px), 25%–35% duty cycle, and 18%–22% currentColor mix opacity
 * to guarantee clear visibility and distinction across both light and dark themes.
 */
export const patternGradients: Record<PatternKey, string> = {
	// 1. Diagonal lines (45deg forward): 2.5px stroke, 8px pitch (~31% duty cycle)
	'diagonal-forward': `repeating-linear-gradient(45deg, ${STROKE_COLOR} 0, ${STROKE_COLOR} 2.5px, transparent 2.5px, transparent 8px)`,

	// 2. Diagonal lines (135deg / -45deg reverse): 2.5px stroke, 8px pitch (~31% duty cycle)
	'diagonal-reverse': `repeating-linear-gradient(-45deg, ${STROKE_COLOR} 0, ${STROKE_COLOR} 2.5px, transparent 2.5px, transparent 8px)`,

	// 3. Horizontal striping: 2px stroke, 7px pitch (~29% duty cycle)
	'horizontal-stripes': `repeating-linear-gradient(0deg, ${STROKE_COLOR} 0, ${STROKE_COLOR} 2px, transparent 2px, transparent 7px)`,

	// 4. Vertical striping: 2px stroke, 7px pitch (~29% duty cycle)
	'vertical-stripes': `repeating-linear-gradient(90deg, ${STROKE_COLOR} 0, ${STROKE_COLOR} 2px, transparent 2px, transparent 7px)`,

	// 5. Cross-hatch / small grid: overlapping 2px horizontal and vertical lines, 8px pitch
	'cross-hatch': `repeating-linear-gradient(0deg, ${LIGHT_STROKE_COLOR} 0, ${LIGHT_STROKE_COLOR} 2px, transparent 2px, transparent 8px), repeating-linear-gradient(90deg, ${LIGHT_STROKE_COLOR} 0, ${LIGHT_STROKE_COLOR} 2px, transparent 2px, transparent 8px)`,

	// 6. Fine polka dots (regular): explicit circle with 2px radius and 8px 8px background size
	'fine-dots': `radial-gradient(circle, ${DOTS_COLOR} 2px, transparent 2px) 0 0 / 8px 8px`,

	// 7. Staggered dots / checker dots: dual offset radial gradients with clear 2px radii and 8px 8px background size
	'checker-dots': `radial-gradient(circle at 2px 2px, ${DOTS_COLOR} 2px, transparent 2px) 0 0 / 8px 8px, radial-gradient(circle at 6px 6px, ${DOTS_COLOR} 2px, transparent 2px) 0 0 / 8px 8px`,

	// 8. Diagonal hatch / cross-diagonal: overlapping 45deg and -45deg lines, 2px stroke, 9px pitch
	'cross-diagonal': `repeating-linear-gradient(45deg, ${LIGHT_STROKE_COLOR} 0, ${LIGHT_STROKE_COLOR} 2px, transparent 2px, transparent 9px), repeating-linear-gradient(-45deg, ${LIGHT_STROKE_COLOR} 0, ${LIGHT_STROKE_COLOR} 2px, transparent 2px, transparent 9px)`,

	// 9. Small chevron / zig-zag: distinct overlapping angled bands forming crisp zig-zag peaks
	chevron: `linear-gradient(135deg, transparent 35%, ${STROKE_COLOR} 35% 65%, transparent 65%) 0 0 / 10px 10px, linear-gradient(225deg, transparent 35%, ${STROKE_COLOR} 35% 65%, transparent 65%) 0 0 / 10px 10px`,

	// 10. Concentric / diamond mesh: crossing 45deg and -45deg diagonal grid with 2px stroke, 10px pitch
	'diamond-mesh': `repeating-linear-gradient(45deg, ${LIGHT_STROKE_COLOR} 0, ${LIGHT_STROKE_COLOR} 2px, transparent 2px, transparent 10px), repeating-linear-gradient(-45deg, ${LIGHT_STROKE_COLOR} 0, ${LIGHT_STROKE_COLOR} 2px, transparent 2px, transparent 10px)`,

	// 11. Brick / dashed line pattern: crisp horizontal beds with alternating vertical seams
	brick: `linear-gradient(0deg, ${BRICK_COLOR} 2px, transparent 2px) 0 0 / 16px 8px, linear-gradient(90deg, ${BRICK_COLOR} 2px, transparent 2px) 0 0 / 16px 8px, linear-gradient(90deg, ${BRICK_COLOR} 2px, transparent 2px) 8px 4px / 16px 8px`,

	// 12. Clean solid / non-patterned base
	solid: 'none',
};

/**
 * Backward compatibility alias for pattern gradient definitions.
 */
export const patternSvgDataUris = patternGradients;

/**
 * CSS custom property tokens map for pattern background images.
 * E.g., `var(--pattern-diagonal-forward)`
 */
export const patternVars = Object.fromEntries(PATTERN_KEYS.map((key) => [key, `var(--pattern-${key})`])) as Record<
	PatternKey,
	string
>;

/**
 * Returns a CSS `var(--pattern-<key>)` token reference for a given pattern key.
 */
export function pattern(key: PatternKey): string {
	return patternVars[key];
}

/**
 * Generates the raw CSS variable definitions for injection into :root.
 */
export const patternCssTokens = Object.entries(patternGradients)
	.map(([key, val]) => `--pattern-${key}: ${val};`)
	.join('\n\t\t');
