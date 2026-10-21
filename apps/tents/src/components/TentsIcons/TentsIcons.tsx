import type { JSX } from 'react';

export function TreeIcon({ className }: { className?: string }): JSX.Element {
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
			<path d="M12 2 5.5 8.5h3L4 14h4l-2.5 4.5h13L16 14h4l-4.5-5.5h3L12 2Z" />
			<rect x="10.5" y="18.5" width="3" height="4" rx="0.5" />
		</svg>
	);
}

export function TentIcon({ className }: { className?: string }): JSX.Element {
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
			<path d="M12 3 2 19h20L12 3Z" opacity="0.85" />
			<path d="M12 3 7 19h10L12 3Z" />
			<line x1="12" y1="3" x2="12" y2="19" stroke="var(--color-surface, #ffffff)" strokeWidth="1.5" />
		</svg>
	);
}

export function GrassIcon({ className }: { className?: string }): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.2"
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
			className={className}
		>
			<path d="M7 19c1-4 3-7 6-9" />
			<path d="M12 19c0-6 2-10 6-12" />
			<path d="M11 19c-1-3-2-6-6-7" />
		</svg>
	);
}
