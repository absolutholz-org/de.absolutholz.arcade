/**
 * Single source of truth configuration for the design system's spacing scale.
 * Defines both the base compact (mobile) value and optional expanded (desktop) overrides.
 */
export const spacingDefinitions = {
	none: { compact: '0rem' },
	'3xs': { compact: '0.125rem' },
	'2xs': { compact: '0.25rem' },
	xs: { compact: '0.5rem' },
	sm: { compact: '0.75rem' },
	md: { compact: '1rem' },
	lg: { compact: '1.25rem', expanded: '1.5rem' },
	xl: { compact: '1.5rem', expanded: '2rem' },
	'2xl': { compact: '2rem', expanded: '3rem' },
	'3xl': { compact: '2.5rem', expanded: '4rem' },
} as const;

/**
 * A runtime array of all valid spacing scale keys.
 */
export const spacingKeys = Object.keys(spacingDefinitions) as Array<
	keyof typeof spacingDefinitions
>;

/**
 * CSS custom property declarations for the compact (mobile) layout breakpoint.
 * Declares all spacing keys mapped to their compact values.
 */
export const spacingCssTokensCompact = (
	Object.entries(spacingDefinitions) as Array<
		[
			keyof typeof spacingDefinitions,
			(typeof spacingDefinitions)[keyof typeof spacingDefinitions],
		]
	>
)
	.map(([key, def]) => `--space-${key}: ${def.compact};`)
	.join('\n\t\t');

/**
 * CSS custom property declarations for the expanded (desktop) layout breakpoint.
 * Overwrites only the spacing keys that have distinct expanded values defined.
 */
export const spacingCssTokensExpanded = (
	Object.entries(spacingDefinitions) as Array<
		[
			keyof typeof spacingDefinitions,
			(typeof spacingDefinitions)[keyof typeof spacingDefinitions],
		]
	>
)
	.filter(
		(
			entry,
		): entry is [
			keyof typeof spacingDefinitions,
			Extract<
				(typeof spacingDefinitions)[keyof typeof spacingDefinitions],
				{ readonly expanded: string }
			>,
		] => 'expanded' in entry[1],
	)
	.map(([key, def]) => `--space-${key}: ${def.expanded};`)
	.join('\n\t\t\t');
