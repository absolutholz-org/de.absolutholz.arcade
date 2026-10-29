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
 * the contextual variable var(--icon-accent, currentColor), automatically falling
 * back to currentColor when no icon accent variable is defined.
 */
export const ICON_CATALOG: Record<string, () => JSX.Element> = {
	'arrow-left': () => (
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
			<line x1="19" y1="12" x2="5" y2="12" />
			<polyline points="12 19 5 12 12 5" />
		</svg>
	),
	user: () => (
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
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	),
	cloud: () => (
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
			<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
		</svg>
	),
	'hard-drive': () => (
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
			<line x1="22" y1="12" x2="2" y2="12" />
			<path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
			<line x1="6" y1="16" x2="6.01" y2="16" />
			<line x1="10" y1="16" x2="10.01" y2="16" />
		</svg>
	),
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
			<circle cx="12" cy="12" r="3" stroke="var(--icon-accent, currentColor)" />
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
			<line x1="12" y1="16" x2="12" y2="12" stroke="var(--icon-accent, currentColor)" />
			<line x1="12" y1="8" x2="12.01" y2="8" stroke="var(--icon-accent, currentColor)" />
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
			<line x1="12" y1="8" x2="12" y2="12" stroke="var(--icon-accent, currentColor)" />
			<line x1="12" y1="16" x2="12.01" y2="16" stroke="var(--icon-accent, currentColor)" />
		</svg>
	),
	trophy: () => (
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
			<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
			<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
			<path d="M4 22h16" />
			<path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34" />
			<path d="M18 4H6v7a6 6 0 0 0 12 0V4z" stroke="var(--icon-accent, currentColor)" />
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
			<circle cx="12" cy="12" r="4" stroke="var(--icon-accent, currentColor)" />
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
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" stroke="var(--icon-accent, currentColor)" />
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
			<path d="M12 3a9 9 0 0 1 0 18V3z" fill="var(--icon-accent, currentColor)" />
		</svg>
	),
	timer: () => (
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
			<line x1="10" x2="14" y1="2" y2="2" />
			<line x1="12" x2="15" y1="14" y2="11" stroke="var(--icon-accent, currentColor)" />
			<circle cx="12" cy="14" r="8" />
		</svg>
	),
	undo: () => (
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
			<path d="M3 7v6h6" />
			<path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" stroke="var(--icon-accent, currentColor)" />
		</svg>
	),
	redo: () => (
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
			<path d="M21 7v6h-6" />
			<path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" stroke="var(--icon-accent, currentColor)" />
		</svg>
	),
	eraser: () => (
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
			<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
			<path d="M22 21H7" stroke="var(--icon-accent, currentColor)" />
			<path d="m5 11 9 9" />
		</svg>
	),
	pencil: () => (
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
			<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
			<path d="m15 5 4 4" stroke="var(--icon-accent, currentColor)" />
		</svg>
	),
	pause: () => (
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
			<rect width="4" height="16" x="6" y="4" />
			<rect width="4" height="16" x="14" y="4" stroke="var(--icon-accent, currentColor)" />
		</svg>
	),
	play: () => (
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
			<polygon points="6 3 20 12 6 21 6 3" />
		</svg>
	),
	'rotate-ccw': () => (
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
			<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="var(--icon-accent, currentColor)" />
			<path d="M3 3v5h5" />
		</svg>
	),
	shuffle: () => (
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
			<polyline points="16 3 21 3 21 8" stroke="var(--icon-accent, currentColor)" />
			<line x1="4" y1="20" x2="21" y2="3" />
			<polyline points="21 16 21 21 16 21" stroke="var(--icon-accent, currentColor)" />
			<line x1="15" y1="15" x2="21" y2="21" />
			<line x1="4" y1="4" x2="9" y2="9" />
		</svg>
	),
	eye: () => (
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
			<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
			<circle cx="12" cy="12" r="3" stroke="var(--icon-accent, currentColor)" />
		</svg>
	),
	sparkles: () => (
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
			<path
				d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
				stroke="var(--icon-accent, currentColor)"
			/>
			<path d="M5 3v4" />
			<path d="M19 17v4" />
			<path d="M3 5h4" />
			<path d="M17 19h4" />
		</svg>
	),
	lightbulb: () => (
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
			<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
			<path d="M9 18h6" />
			<path d="M10 22h4" stroke="var(--icon-accent, currentColor)" />
		</svg>
	),
} as const;
