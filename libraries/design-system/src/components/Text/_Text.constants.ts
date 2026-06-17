export const typographyScaleCompact = {
	small: { size: '0.875rem', lineHeight: '1.5' },
	base: { size: '1rem', lineHeight: '1.5' },
	h3: { size: '1.125rem', lineHeight: '1.4' },
	h2: { size: '1.4rem', lineHeight: '1.3' },
	h1: { size: '2rem', lineHeight: '1.2' },
	display: { size: '2.75rem', lineHeight: '1.1' },
} as const;

export const typographyScaleExpanded = {
	small: { size: '0.875rem', lineHeight: '1.5' },
	base: { size: '1rem', lineHeight: '1.5' },
	h3: { size: '1.25rem', lineHeight: '1.4' },
	h2: { size: '1.75rem', lineHeight: '1.3' },
	h1: { size: '2.5rem', lineHeight: '1.2' },
	display: { size: '3.75rem', lineHeight: '1.1' },
} as const;

export const typographyScale = {
	small: {
		size: 'var(--font-size-small)',
		lineHeight: 'var(--line-height-small)',
	},
	base: {
		size: 'var(--font-size-base)',
		lineHeight: 'var(--line-height-base)',
	},
	h3: { size: 'var(--font-size-h3)', lineHeight: 'var(--line-height-h3)' },
	h2: { size: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)' },
	h1: { size: 'var(--font-size-h1)', lineHeight: 'var(--line-height-h1)' },
	display: {
		size: 'var(--font-size-display)',
		lineHeight: 'var(--line-height-display)',
	},
} as const;

export const typographyCssTokensCompact = Object.entries(typographyScaleCompact)
	.map(
		([key, val]) =>
			`--font-size-${key}: ${val.size};\n\t\t--line-height-${key}: ${val.lineHeight};`,
	)
	.join('\n\t\t');

export const typographyCssTokensExpanded = Object.entries(
	typographyScaleExpanded,
)
	.filter(([key]) => ['h3', 'h2', 'h1', 'display'].includes(key))
	.map(
		([key, val]) =>
			`--font-size-${key}: ${val.size};\n\t\t\t--line-height-${key}: ${val.lineHeight};`,
	)
	.join('\n\t\t\t');

export const fontWeights = {
	regular: '400',
	bold: '700',
} as const;

export const SEMANTIC_VARIANTS = {
	small: { scale: 'small', weight: 'regular' },
	base: { scale: 'base', weight: 'regular' },
	h3: { scale: 'h3', weight: 'bold' },
	h2: { scale: 'h2', weight: 'bold' },
	h1: { scale: 'h1', weight: 'bold' },
	display: { scale: 'display', weight: 'bold' },
} as const;

export const DEFAULT_FONT_STACK =
	"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const TEXT_WRAP_OPTIONS = [
	'pretty',
	'balance',
	'truncate',
	'normal',
] as const;
