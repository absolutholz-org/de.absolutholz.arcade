export const spacingScaleCompact = {
	none: '0rem',
	'3xs': '0.125rem',
	'2xs': '0.25rem',
	xs: '0.5rem',
	sm: '0.75rem',
	md: '1rem',
	lg: '1.25rem',
	xl: '1.5rem',
	'2xl': '2rem',
	'3xl': '2.5rem',
} as const;

export const spacingScaleExpanded = {
	none: '0rem',
	'3xs': '0.125rem',
	'2xs': '0.25rem',
	xs: '0.5rem',
	sm: '0.75rem',
	md: '1rem',
	lg: '1.5rem',
	xl: '2rem',
	'2xl': '3rem',
	'3xl': '4rem',
} as const;

export const spacingScale = {
	none: 'var(--space-none)',
	'3xs': 'var(--space-3xs)',
	'2xs': 'var(--space-2xs)',
	xs: 'var(--space-xs)',
	sm: 'var(--space-sm)',
	md: 'var(--space-md)',
	lg: 'var(--space-lg)',
	xl: 'var(--space-xl)',
	'2xl': 'var(--space-2xl)',
	'3xl': 'var(--space-3xl)',
} as const;

export const spacingCssTokensCompact = Object.entries(spacingScaleCompact)
	.map(([key, val]) => `--space-${key}: ${val};`)
	.join('\n\t\t');

export const spacingCssTokensExpanded = Object.entries(spacingScaleExpanded)
	.filter(([key]) => ['lg', 'xl', '2xl', '3xl'].includes(key))
	.map(([key, val]) => `--space-${key}: ${val};`)
	.join('\n\t\t\t');
