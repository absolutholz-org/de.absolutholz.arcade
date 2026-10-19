import type { JSX, ReactNode } from 'react';
import * as S from './MedalIcon.styles';

export type MedalTier = 'bronze' | 'silver' | 'gold';
export type MedalState = 'locked' | 'unlocked';

export interface MedalEmblemProps {
	tier?: MedalTier;
	state?: MedalState;
	className?: string;
	fill?: string;
}

/**
 * Default center emblem rendering a crisp 5-point star centered in the medallion.
 * Can be swapped or extended with custom artwork via MedalIcon's children slot.
 */
export function MedalEmblem({ fill = 'currentColor', className }: MedalEmblemProps): JSX.Element {
	return (
		<polygon
			className={className}
			points="24,22.8 25.65,26.73 29.9,27.08 26.66,29.87 27.64,34.02 24,31.8 20.36,34.02 21.34,29.87 18.1,27.08 22.35,26.73"
			fill={fill}
		/>
	);
}

export interface MedalIconProps {
	tier: MedalTier;
	state?: MedalState;
	size?: number | string;
	className?: string;
	children?: ReactNode;
}

const TIER_PALETTES = {
	bronze: {
		ribbonMain: '#92400E',
		ribbonStripe: '#CD7F32',
		connector: '#B87333',
		medallionBody: '#CD7F32',
		medallionRim: '#8B4513',
		medallionInner: '#B87333',
		dashedBorder: '#F6AD55',
		emblem: '#FBD38D',
	},
	silver: {
		ribbonMain: '#475569',
		ribbonStripe: '#CBD5E1',
		connector: '#94A3B8',
		medallionBody: '#C0C0C0',
		medallionRim: '#64748B',
		medallionInner: '#A0AEC0',
		dashedBorder: '#F1F5F9',
		emblem: '#FFFFFF',
	},
	gold: {
		ribbonMain: '#B45309',
		ribbonStripe: '#FDE68A',
		connector: '#D97706',
		medallionBody: '#F59E0B',
		medallionRim: '#B45309',
		medallionInner: '#D97706',
		dashedBorder: '#FEF08A',
		emblem: '#FFD700',
	},
	locked: {
		ribbonMain: '#334155',
		ribbonStripe: '#475569',
		connector: '#475569',
		medallionBody: '#1E293B',
		medallionRim: '#475569',
		medallionInner: '#0F172A',
		dashedBorder: '#64748B',
		emblem: '#64748B',
	},
} as const;

/**
 * Parameterized vector medal component with hanging ribbons, outer circular medallion,
 * dashed inner accent border, and modular center emblem slot.
 */
export function MedalIcon({ tier, state = 'unlocked', size = 48, className, children }: MedalIconProps): JSX.Element {
	const isLocked = state === 'locked';
	const palette = isLocked ? TIER_PALETTES.locked : TIER_PALETTES[tier];

	return (
		<S.SvgMedal
			viewBox="0 0 48 48"
			width={size}
			height={size}
			className={className}
			data-tier={tier}
			data-state={state}
			aria-hidden="true"
			focusable="false"
		>
			{/* Ribbons hanging from the top */}
			<g data-slot="ribbons">
				{/* Left Ribbon */}
				<polygon points="15,2 23,2 23,18 19,15 15,18" fill={palette.ribbonMain} />
				<polygon points="18,2 20,2 20,15.8 18,15.8" fill={palette.ribbonStripe} />

				{/* Right Ribbon */}
				<polygon points="25,2 33,2 33,18 29,15 25,18" fill={palette.ribbonMain} />
				<polygon points="28,2 30,2 30,15.8 28,15.8" fill={palette.ribbonStripe} />

				{/* Ribbon Connector Ring */}
				<rect
					x="19"
					y="11"
					width="10"
					height="4"
					rx="2"
					fill={palette.connector}
					stroke={palette.medallionRim}
					strokeWidth="0.75"
				/>
			</g>

			{/* Circular Outer Medallion */}
			<g data-slot="medallion">
				{/* Outer rim */}
				<circle
					cx="24"
					cy="29"
					r="14.5"
					fill={palette.medallionBody}
					stroke={palette.medallionRim}
					strokeWidth="1.5"
				/>

				{/* Inner face */}
				<circle cx="24" cy="29" r="12.5" fill={palette.medallionInner} />

				{/* Dashed inner accent border */}
				<circle
					cx="24"
					cy="29"
					r="10.5"
					fill="none"
					stroke={palette.dashedBorder}
					strokeWidth="1"
					strokeDasharray="2.5 2"
				/>
			</g>

			{/* Center Emblem Slot */}
			<g data-slot="emblem">{children ?? <MedalEmblem tier={tier} state={state} fill={palette.emblem} />}</g>
		</S.SvgMedal>
	);
}
