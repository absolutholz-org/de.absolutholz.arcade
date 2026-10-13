import type { JSX } from 'react';

export function CrownIcon({ className }: { className?: string }): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			fill="currentColor"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
			className={className}
		>
			<path d="M3 17h18l-2-10-5 5-2-7-2 7-5-5-2 10z" />
			<line x1="3" y1="19.5" x2="21" y2="19.5" strokeWidth={2.5} strokeLinecap="round" />
		</svg>
	);
}

export function XMarkIcon({ className }: { className?: string }): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
			className={className}
		>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}
