import { css } from '@linaria/core';

export const WidgetContainer = css`
	width: 100%;
	margin-top: 1.5rem;
`;

export const BannerCard = css`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 1.25rem;
	padding: 1rem 1.25rem;

	@media (max-width: 640px) {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.875rem;
	}
`;

export const BannerLeft = css`
	display: flex;
	align-items: center;
	gap: 1rem;
	min-width: 0;
	flex-wrap: wrap;
`;

export const TrophyIcon = css`
	font-size: 1.75rem;
	line-height: 1;
	flex-shrink: 0;
`;

export const BannerTextGroup = css`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
`;

export const BannerTitle = css`
	font-size: 1rem;
	font-weight: 700;
	line-height: 1.3;
	margin: 0;
	color: var(--color-text-1, #0f172a);
`;

export const MedalsTally = css`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--color-text-2, #475569);
	flex-wrap: wrap;
`;

export const TallyItem = css`
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
`;

export const CtaBadge = css`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.8125rem;
	font-weight: 600;
	padding: 0.375rem 0.75rem;
	border-radius: var(--radius-sm, 0.375rem);
	background: var(--color-container-2, #e2e8f0);
	color: var(--color-text-1, #0f172a);
	flex-shrink: 0;
	transition:
		background-color 150ms ease,
		color 150ms ease;
`;
