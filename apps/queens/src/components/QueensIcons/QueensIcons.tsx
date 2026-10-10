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
			<path d="M3 18h18l-2-11-5 5-2-7-2 7-5-5-2 11z" />
			<line x1="3" y1="19" x2="21" y2="19" strokeWidth={2.5} />
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
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	);
}
