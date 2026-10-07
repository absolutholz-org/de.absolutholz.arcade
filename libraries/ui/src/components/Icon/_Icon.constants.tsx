import type { JSX } from 'react';

/**
 * Dedicated sizing scale for the Icon component using REM units (and 1em for inherit).
 */
export const ICON_SIZES = {
	xs: '0.75rem',
	sm: '1rem',
	md: '1.5rem',
	lg: '2rem',
	xl: '3rem',
	inherit: '1em',
} as const;

/**
 * Catalog of inline SVG components.
 * Base paths use currentColor stroke/fill, while accent elements use
 * the theme variable var(--color-accent, currentColor), automatically falling
 * back to currentColor when no accent theme variable is defined.
 */
export const ICON_CATALOG: Record<string, () => JSX.Element> = {
	settings: () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" stroke="var(--color-accent, currentColor)" />
		</svg>
	),
	check: () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	),
	close: () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	),
	'chevron-down': () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	),
	'chevron-up': () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<polyline points="18 15 12 9 6 15" />
		</svg>
	),
	'chevron-left': () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<polyline points="15 18 9 12 15 6" />
		</svg>
	),
	'chevron-right': () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<polyline points="9 18 15 12 9 6" />
		</svg>
	),
	info: () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="16" x2="12" y2="12" stroke="var(--color-accent, currentColor)" />
			<line x1="12" y1="8" x2="12.01" y2="8" stroke="var(--color-accent, currentColor)" />
		</svg>
	),
	'alert-circle': () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" stroke="var(--color-accent, currentColor)" />
			<line x1="12" y1="16" x2="12.01" y2="16" stroke="var(--color-accent, currentColor)" />
		</svg>
	),
	light_mode: () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" stroke="var(--color-accent, currentColor)" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</svg>
	),
	dark_mode: () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" stroke="var(--color-accent, currentColor)" />
		</svg>
	),
	contrast: () => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 3a9 9 0 0 1 0 18V3z" fill="var(--color-accent, currentColor)" />
		</svg>
	),
} as const;
