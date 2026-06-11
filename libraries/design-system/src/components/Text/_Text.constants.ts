export const typographyScale = {
	small: { size: '0.875rem', lineHeight: 1.5 },
	base: { size: '1rem', lineHeight: 1.5 },
	h3: { size: '1.25rem', lineHeight: 1.4 },
	h2: { size: '1.75rem', lineHeight: 1.3 },
	h1: { size: '2.5rem', lineHeight: 1.2 },
	display: { size: '3.75rem', lineHeight: 1.1 },
} as const;

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
