import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { css } from '@linaria/core';

export const Container = css`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
`;

export const TrophyBar = css`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	width: 100%;

	@media (min-width: 640px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;

export const TrophyCard = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	border-radius: var(--radius-md, 0.75rem);
	border: 1px solid ${themeColor('container-2')};
	background: ${themeColor('surface')};
	text-align: center;
	gap: 0.25rem;

	&[data-tier='gold'] {
		border-color: #eab308;
		background: color-mix(in srgb, #eab308 8%, var(--color-surface, #ffffff));
	}

	&[data-tier='silver'] {
		border-color: #94a3b8;
		background: color-mix(in srgb, #94a3b8 8%, var(--color-surface, #ffffff));
	}

	&[data-tier='bronze'] {
		border-color: #b45309;
		background: color-mix(in srgb, #b45309 8%, var(--color-surface, #ffffff));
	}
`;

export const TrophyCount = css`
	font-size: 1.5rem;
	font-weight: 700;
	line-height: 1.2;
	color: ${themeColor('text-1')};
`;

export const TrophyLabel = css`
	font-size: 0.8125rem;
	font-weight: 500;
	color: ${themeColor('text-2')};
	text-transform: capitalize;
`;

export const MedalsGrid = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;

	@media (min-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 1024px) {
		grid-template-columns: repeat(3, 1fr);
	}
`;

export const MedalCard = css`
	display: flex;
	flex-direction: column;
	gap: 0.875rem;
	padding: 1.25rem;
	border-radius: var(--radius-md, 0.75rem);
	border: 1px solid ${themeColor('container-2')};
	background: ${themeColor('surface')};
	position: relative;
	transition: border-color 200ms ease, box-shadow 200ms ease, transform 150ms ease;

	&[data-status='locked'] {
		opacity: 0.65;
		filter: grayscale(85%);

		&:hover {
			opacity: 0.85;
			filter: grayscale(40%);
			transform: translateY(-2px);
		}
	}

	&[data-status='unlocked'] {
		opacity: 1;
		filter: none;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

		&:hover {
			transform: translateY(-2px);
		}

		&[data-tier='gold'] {
			border-color: #eab308;
			background: color-mix(in srgb, #eab308 5%, var(--color-surface, #ffffff));
		}

		&[data-tier='silver'] {
			border-color: #94a3b8;
			background: color-mix(in srgb, #94a3b8 5%, var(--color-surface, #ffffff));
		}

		&[data-tier='bronze'] {
			border-color: #b45309;
			background: color-mix(in srgb, #b45309 5%, var(--color-surface, #ffffff));
		}
	}
`;

export const MedalHeader = css`
	display: flex;
	align-items: center;
	gap: 0.75rem;
`;

export const MedalBadge = css`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.75rem;
	height: 2.75rem;
	border-radius: 9999px;
	flex-shrink: 0;

	&[data-tier='gold'] {
		background: #fef08a;
		color: #854d0e;
	}

	&[data-tier='silver'] {
		background: #e2e8f0;
		color: #475569;
	}

	&[data-tier='bronze'] {
		background: #fed7aa;
		color: #7c2d12;
	}
`;

export const MedalMeta = css`
	display: flex;
	flex-direction: column;
	min-width: 0;
	gap: 0.125rem;
`;

export const MedalTierBadge = css`
	font-size: 0.6875rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: ${themeColor('text-2')};
`;

export const MedalTitle = css`
	font-size: 1.0625rem;
	font-weight: 700;
	line-height: 1.3;
	margin: 0;
	color: ${themeColor('text-1')};
`;

export const MedalDescription = css`
	font-size: 0.875rem;
	line-height: 1.45;
	color: ${themeColor('text-2')};
	margin: 0;
	flex-grow: 1;
`;

export const MedalFooter = css`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	padding-top: 0.75rem;
	border-top: 1px solid ${themeColor('container-2')};
	margin-top: auto;
`;

export const UnlockedDate = css`
	font-size: 0.75rem;
	font-weight: 600;
	color: var(--color-success, #16a34a);
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
`;

export const ProgressContainer = css`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	width: 100%;
`;

export const ProgressBarTrack = css`
	width: 100%;
	height: 0.5rem;
	border-radius: 9999px;
	background: ${themeColor('container-2')};
	overflow: hidden;
`;

export const ProgressBarFill = css`
	height: 100%;
	border-radius: 9999px;
	background: ${themeColor('accent')};
	transition: width 300ms ease;
`;

export const ProgressLabel = css`
	font-size: 0.75rem;
	font-weight: 500;
	color: ${themeColor('text-2')};
`;

export const Actions = css`
	display: flex;
	justify-content: center;
	margin-top: 1.5rem;
`;
