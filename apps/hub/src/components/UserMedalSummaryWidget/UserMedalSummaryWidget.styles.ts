import { css } from '@linaria/core';

export const WidgetContainer = css`
	width: 100%;
	margin-top: 1.5rem;
`;

export const BannerLink = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.25rem;
	padding: 1rem 1.25rem;
	border-radius: var(--radius-md, 0.75rem);
	border: 1px solid color-mix(in srgb, #eab308 30%, var(--color-container-2, #e2e8f0));
	background: color-mix(in srgb, #eab308 4%, var(--color-container-1, #ffffff));
	color: var(--color-text-1, #0f172a);
	text-decoration: none;
	transition:
		border-color 150ms ease,
		transform 150ms ease,
		box-shadow 150ms ease;

	&:hover {
		border-color: #eab308;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(234, 179, 8, 0.1);
	}

	&:focus-visible {
		outline: 2px solid var(--color-accent, #3b82f6);
		outline-offset: 2px;
	}

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
	transition: background-color 150ms ease;

	${BannerLink}:hover & {
		background: #eab308;
		color: #000000;
	}
`;

export const GuestTileLink = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.25rem;
	padding: 1rem 1.25rem;
	border-radius: var(--radius-md, 0.75rem);
	border: 1px solid var(--color-container-2, #e2e8f0);
	background: var(--color-container-1, #ffffff);
	color: var(--color-text-1, #0f172a);
	text-decoration: none;
	transition:
		border-color 150ms ease,
		transform 150ms ease;

	&:hover {
		border-color: var(--color-accent, #3b82f6);
		transform: translateY(-2px);
	}

	&:focus-visible {
		outline: 2px solid var(--color-accent, #3b82f6);
		outline-offset: 2px;
	}

	@media (max-width: 640px) {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.875rem;
	}
`;

export const GuestContent = css`
	display: flex;
	align-items: center;
	gap: 1rem;
	min-width: 0;
`;

export const GuestTitle = css`
	font-size: 1rem;
	font-weight: 700;
	margin: 0;
	color: var(--color-text-1, #0f172a);
`;

export const GuestDescription = css`
	font-size: 0.8125rem;
	margin: 0.125rem 0 0;
	color: var(--color-text-2, #475569);
	line-height: 1.4;
`;

export const GuestCtaBadge = css`
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

	${GuestTileLink}:hover & {
		background: var(--color-accent, #3b82f6);
		color: #ffffff;
	}
`;
