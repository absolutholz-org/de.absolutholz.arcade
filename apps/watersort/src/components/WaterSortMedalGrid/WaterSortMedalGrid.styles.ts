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

export const Actions = css`
	display: flex;
	justify-content: center;
	margin-top: 1.5rem;
`;
