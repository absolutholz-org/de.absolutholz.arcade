import { css } from '@linaria/core';

export const ShowcaseContainer = css`
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
	border-radius: 0.75rem;
	border: 1px solid var(--color-container-2);
	background: var(--color-surface);
	text-align: center;
	gap: 0.25rem;

	&[data-tier='gold'] {
		border-color: #eab308;
		background: color-mix(in srgb, #eab308 8%, var(--color-surface));
	}

	&[data-tier='silver'] {
		border-color: #94a3b8;
		background: color-mix(in srgb, #94a3b8 8%, var(--color-surface));
	}

	&[data-tier='bronze'] {
		border-color: #b45309;
		background: color-mix(in srgb, #b45309 8%, var(--color-surface));
	}
`;

export const TrophyCount = css`
	font-size: 1.5rem;
	font-weight: 700;
	line-height: 1.2;
`;

export const TrophyLabel = css`
	font-size: 0.8125rem;
	font-weight: 500;
	color: var(--color-text-2);
	text-transform: capitalize;
`;

export const MedalsGrid = css`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
	gap: 1.25rem;
	width: 100%;
`;

export const EmptyState = css`
	padding: 3rem 1rem;
	text-align: center;
	color: var(--color-text-2);
	font-size: 1rem;
	grid-column: 1 / -1;
`;
