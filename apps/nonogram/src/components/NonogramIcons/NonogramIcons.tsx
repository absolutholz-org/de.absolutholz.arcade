import type { JSX } from 'react';

export function FillIcon(): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1.25em"
			height="1.25em"
			fill="currentColor"
			stroke="none"
			focusable="false"
			aria-hidden="true"
		>
			<rect x="3" y="3" width="18" height="18" rx="2" />
		</svg>
	);
}

export function CrossIcon(): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1.25em"
			height="1.25em"
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	);
}

export function PuzzleIcon(): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1.25em"
			height="1.25em"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			focusable="false"
			aria-hidden="true"
		>
			<path d="M19.439 7.85c0-1.571-1.274-2.85-2.846-2.85a2.849 2.849 0 0 0-2.846 2.85c0 .285.042.56.12.82H10.13c.078-.26.12-.535.12-.82a2.849 2.849 0 0 0-2.846-2.85c-1.572 0-2.846 1.279-2.846 2.85 0 .285.042.56.12.82H3v9.33h9.33a2.84 2.84 0 0 0 .82-.12 2.849 2.849 0 0 0 2.846 2.85c1.572 0 2.846-1.279 2.846-2.85a2.84 2.84 0 0 0-.12-.82h2.278V7.85h-1.661a2.84 2.84 0 0 0 .12-.82z" />
		</svg>
	);
}

export function TrophyIcon(): JSX.Element {
	return (
		<svg
			viewBox="0 0 24 24"
			width="1.25em"
			height="1.25em"
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
			<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
			<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
			<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
		</svg>
	);
}
