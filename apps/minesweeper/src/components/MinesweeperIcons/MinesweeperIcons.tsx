import type { JSX } from 'react';

export function MineIcon({ className }: { className?: string }): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			fill="currentColor"
			focusable="false"
			aria-hidden="true"
			className={className}
		>
			<path d="M23 13v-2h-3.07a7.988 7.988 0 00-1.62-3.9l2.19-2.17-1.43-1.43-2.17 2.19A7.988 7.988 0 0013 4.07V1h-2v3.07c-1.42.18-2.77.74-3.9 1.62L4.93 3.5 3.5 4.93 5.69 7.1A7.988 7.988 0 004.07 11H1v2h3.07c.18 1.42.74 2.77 1.62 3.9L3.5 19.07l1.43 1.43 2.17-2.19c1.13.88 2.48 1.44 3.9 1.62V23h2v-3.07c1.42-.18 2.77-.74 3.9-1.62l2.17 2.19 1.43-1.43-2.19-2.17a7.988 7.988 0 001.62-3.9H23M12 8a4 4 0 00-4 4H6a6 6 0 016-6v2z" />
		</svg>
	);
}

export function FlagIcon({ className }: { className?: string }): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			fill="none"
			focusable="false"
			aria-hidden="true"
			className={className}
		>
			<path d="M19 9l-8 5V4l4 2.5z" fill="var(--color-accent, var(--color-interactive-primary, currentColor))" />
			<path d="M7 12V3h2v18H7z" fill="currentColor" />
		</svg>
	);
}

export function QuestionIcon({ className }: { className?: string }): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			fill="currentColor"
			focusable="false"
			aria-hidden="true"
			className={className}
		>
			<path d="M10 19h3v3h-3v-3m2-17c5.35.22 7.68 5.62 4.5 9.67-.83 1-2.17 1.66-2.83 2.5C13 15 13 16 13 17h-3c0-1.67 0-3.08.67-4.08.66-1 2-1.59 2.83-2.25C15.92 8.43 15.32 5.26 12 5a3 3 0 00-3 3H6a6 6 0 016-6z" />
		</svg>
	);
}

export function ZoomInIcon({ className }: { className?: string }): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
			className={className}
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
			<line x1="11" y1="8" x2="11" y2="14" />
			<line x1="8" y1="11" x2="14" y2="11" />
		</svg>
	);
}

export function ZoomOutIcon({ className }: { className?: string }): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
			className={className}
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
			<line x1="8" y1="11" x2="14" y2="11" />
		</svg>
	);
}
