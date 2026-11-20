/**
 * Root semantic status color tokens using OKLCH and native light-dark() (BASE-11).
 * Injected into :root by globalStyles and getGlobalStyles.
 */
export const statusColorTokens = {
	success: 'light-dark(oklch(0.42 0.14 148), oklch(0.76 0.15 148))',
	'success-contrast': 'light-dark(oklch(0.98 0.01 148), oklch(0.12 0.02 148))',
	'success-subtle': 'light-dark(oklch(0.94 0.04 148), oklch(0.24 0.05 148))',
	'success-border': 'light-dark(oklch(0.72 0.1 148), oklch(0.48 0.1 148))',

	warning: 'light-dark(oklch(0.44 0.12 75), oklch(0.82 0.14 78))',
	'warning-contrast': 'light-dark(oklch(0.98 0.01 75), oklch(0.14 0.03 75))',
	'warning-subtle': 'light-dark(oklch(0.94 0.05 80), oklch(0.26 0.05 75))',
	'warning-border': 'light-dark(oklch(0.72 0.1 75), oklch(0.52 0.1 75))',

	danger: 'light-dark(oklch(0.46 0.19 25), oklch(0.76 0.17 25))',
	'danger-contrast': 'light-dark(oklch(0.98 0.01 25), oklch(0.12 0.02 25))',
	'danger-subtle': 'light-dark(oklch(0.94 0.04 25), oklch(0.25 0.06 25))',
	'danger-border': 'light-dark(oklch(0.72 0.12 25), oklch(0.52 0.12 25))',

	info: 'light-dark(oklch(0.44 0.14 245), oklch(0.76 0.14 245))',
	'info-contrast': 'light-dark(oklch(0.98 0.01 245), oklch(0.12 0.02 245))',
	'info-subtle': 'light-dark(oklch(0.94 0.04 245), oklch(0.24 0.05 245))',
	'info-border': 'light-dark(oklch(0.72 0.09 245), oklch(0.5 0.1 245))',
} as const;

export const statusVars = {
	success: 'var(--color-status-success)',
	'success-contrast': 'var(--color-status-success-contrast)',
	'success-subtle': 'var(--color-status-success-subtle)',
	'success-border': 'var(--color-status-success-border)',
	warning: 'var(--color-status-warning)',
	'warning-contrast': 'var(--color-status-warning-contrast)',
	'warning-subtle': 'var(--color-status-warning-subtle)',
	'warning-border': 'var(--color-status-warning-border)',
	danger: 'var(--color-status-danger)',
	'danger-contrast': 'var(--color-status-danger-contrast)',
	'danger-subtle': 'var(--color-status-danger-subtle)',
	'danger-border': 'var(--color-status-danger-border)',
	info: 'var(--color-status-info)',
	'info-contrast': 'var(--color-status-info-contrast)',
	'info-subtle': 'var(--color-status-info-subtle)',
	'info-border': 'var(--color-status-info-border)',
} as const;

export const statusCssTokens = Object.entries(statusColorTokens)
	.map(([key, val]) => `--color-status-${key}: ${val};`)
	.join('\n\t\t\t');
