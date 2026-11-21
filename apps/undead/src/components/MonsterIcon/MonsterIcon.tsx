import type { JSX } from 'react';
import type { MirrorType, MonsterType } from '../../engine/types';

export interface MonsterIconProps {
	readonly monster: MonsterType;
	readonly className?: string;
}

/**
 * Distinct high-contrast geometric silhouettes for each Undead monster type
 * so every entity is recognizable by shape as well as color (WCAG 1.4.1 / BITV 2.0).
 */
export function MonsterIcon({ monster, className }: MonsterIconProps): JSX.Element {
	if (monster === 'ghost') {
		return (
			<svg viewBox="0 0 32 32" className={className} aria-hidden="true">
				<path
					d="M16 4C10.5 4 7 8.2 7 14v12.5c0 .7.8 1.1 1.4.7l2.6-1.9c.5-.4 1.2-.4 1.7 0l2.4 1.8c.5.4 1.3.4 1.8 0l2.4-1.8c.5-.4 1.2-.4 1.7 0l2.6 1.9c.6.4 1.4 0 1.4-.7V14c0-5.8-3.5-10-9-10Z"
					fill="currentColor"
					fillOpacity="0.2"
					stroke="currentColor"
					strokeWidth="2.2"
					strokeLinejoin="round"
				/>
				<circle cx="12.5" cy="14" r="2" fill="currentColor" />
				<circle cx="19.5" cy="14" r="2" fill="currentColor" />
				<ellipse cx="16" cy="19.2" rx="2.1" ry="1.6" fill="currentColor" />
			</svg>
		);
	}

	if (monster === 'vampire') {
		return (
			<svg viewBox="0 0 32 32" className={className} aria-hidden="true">
				{/* High pointed cape collar */}
				<path
					d="M5 12.5 9.5 25h13L27 12.5l-5.5 3.2-5.5-2.2-5.5 2.2L5 12.5Z"
					fill="currentColor"
					fillOpacity="0.2"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
				{/* Widow's peak head */}
				<path
					d="M16 7.2c-2.2-1.8-5.5-1.2-6.5 1.8-.4 1.2-.5 2.5-.5 4 0 4 3.1 7.2 7 7.2s7-3.2 7-7.2c0-1.5-.1-2.8-.5-4-1-3-4.3-3.6-6.5-1.8Z"
					fill="currentColor"
					fillOpacity="0.16"
					stroke="currentColor"
					strokeWidth="2.1"
					strokeLinejoin="round"
				/>
				{/* Eyes */}
				<path d="M12 13l2.2.8M20 13l-2.2.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				{/* Twin fangs */}
				<path d="M13.2 17.3l.9 2.6.9-2.6M17 17.3l.9 2.6.9-2.6" fill="currentColor" />
			</svg>
		);
	}

	// Zombie: stitched angular head with scar & uneven eyes
	return (
		<svg viewBox="0 0 32 32" className={className} aria-hidden="true">
			<rect
				x="7.5"
				y="6"
				width="17"
				height="19.5"
				rx="4"
				fill="currentColor"
				fillOpacity="0.2"
				stroke="currentColor"
				strokeWidth="2.2"
			/>
			{/* Forehead stitch scar */}
			<path d="M11 10.5h7M13 9v3M16 9v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
			{/* Asymmetric zombie eyes */}
			<circle cx="12.5" cy="15.8" r="2.1" fill="currentColor" />
			<circle cx="19.5" cy="15.4" r="1.5" fill="currentColor" />
			{/* Stitched mouth */}
			<path
				d="M11.5 21h9M14 19.8v2.4M18 19.8v2.4"
				stroke="currentColor"
				strokeWidth="1.7"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export interface MirrorIconProps {
	readonly mirror: MirrorType;
	readonly className?: string;
}

export function MirrorIcon({ mirror, className }: MirrorIconProps): JSX.Element {
	const isForward = mirror === '/';
	return (
		<svg viewBox="0 0 32 32" className={className} aria-hidden="true">
			{isForward ? (
				<>
					<line x1="6" y1="26" x2="26" y2="6" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" />
					<line
						x1="10"
						y1="19"
						x2="19"
						y2="10"
						stroke="currentColor"
						strokeOpacity="0.45"
						strokeWidth="1.6"
						strokeLinecap="round"
					/>
				</>
			) : (
				<>
					<line x1="6" y1="6" x2="26" y2="26" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" />
					<line
						x1="10"
						y1="13"
						x2="19"
						y2="22"
						stroke="currentColor"
						strokeOpacity="0.45"
						strokeWidth="1.6"
						strokeLinecap="round"
					/>
				</>
			)}
		</svg>
	);
}
