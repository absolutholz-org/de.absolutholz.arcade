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
	border: 1px solid var(--color-border, #e2e8f0);
	background: var(--color-surface, #ffffff);
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
`;

export const TrophyLabel = css`
	font-size: 0.8125rem;
	font-weight: 500;
	color: var(--color-text-muted, #64748b);
	text-transform: capitalize;
`;

export const FilterBar = css`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	padding: 0.5rem;
	border-radius: 0.5rem;
	background: var(--color-surface-subtle, #f1f5f9);
`;

export const FilterTab = css`
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	border: none;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	background: transparent;
	color: var(--color-text-muted, #64748b);
	transition: background-color 0.15s ease, color 0.15s ease;

	&:hover {
		color: var(--color-text, #0f172a);
		background: color-mix(in srgb, var(--color-primary, #3b82f6) 10%, transparent);
	}

	&[data-active='true'] {
		background: var(--color-surface, #ffffff);
		color: var(--color-text, #0f172a);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
`;

export const MedalsGrid = css`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
	gap: 1.25rem;
	width: 100%;
`;

export const MedalCard = css`
	display: flex;
	flex-direction: column;
	padding: 1.25rem;
	border-radius: 0.75rem;
	border: 1px solid var(--color-border, #e2e8f0);
	background: var(--color-surface, #ffffff);
	gap: 0.75rem;
	transition: transform 0.15s ease, box-shadow 0.15s ease;

	&[data-status='locked'] {
		filter: grayscale(1);
		opacity: 0.7;
	}

	&[data-status='unlocked'] {
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

		&[data-tier='gold'] {
			border-color: #eab308;
		}

		&[data-tier='silver'] {
			border-color: #94a3b8;
		}

		&[data-tier='bronze'] {
			border-color: #b45309;
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
`;

export const MedalTitle = css`
	font-size: 1rem;
	font-weight: 600;
	line-height: 1.3;
	margin: 0;
	color: var(--color-text, #0f172a);
`;

export const MedalGameBadge = css`
	font-size: 0.75rem;
	font-weight: 500;
	color: var(--color-text-muted, #64748b);
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

export const MedalDescription = css`
	font-size: 0.875rem;
	line-height: 1.4;
	color: var(--color-text-muted, #64748b);
	margin: 0;
`;

export const MedalFooter = css`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	margin-top: auto;
	padding-top: 0.5rem;
	border-top: 1px solid var(--color-border-subtle, #f1f5f9);
`;

export const UnlockedDate = css`
	font-size: 0.75rem;
	font-weight: 500;
	color: var(--color-primary, #3b82f6);
`;

export const ProgressContainer = css`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	width: 100%;
`;

export const ProgressBarTrack = css`
	width: 100%;
	height: 0.375rem;
	border-radius: 9999px;
	background: var(--color-surface-subtle, #e2e8f0);
	overflow: hidden;
`;

export const ProgressBarFill = css`
	height: 100%;
	border-radius: 9999px;
	background: var(--color-primary, #3b82f6);
	transition: width 0.3s ease;
`;

export const ProgressLabel = css`
	font-size: 0.75rem;
	font-weight: 500;
	color: var(--color-text-muted, #64748b);
`;

export const EmptyState = css`
	padding: 3rem 1rem;
	text-align: center;
	color: var(--color-text-muted, #64748b);
	font-size: 1rem;
	grid-column: 1 / -1;
`;
