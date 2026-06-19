export const radiusScaleValues = {
	sm: '4px',
	md: '8px',
	lg: '12px',
	xl: '16px',
	xxl: '24px',
	pill: 'calc(infinity * 1px)',
} as const;

export const radiusScale = {
	sm: 'var(--radius-sm)',
	md: 'var(--radius-md)',
	lg: 'var(--radius-lg)',
	xl: 'var(--radius-xl)',
	xxl: 'var(--radius-xxl)',
	pill: 'var(--radius-pill)',
} as const;

export const radiusCssTokens = Object.entries(radiusScaleValues)
	.map(([key, val]) => `--radius-${key}: ${val};`)
	.join('\n\t\t');
