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

export const EmptyState = css`
	padding: 3rem 1rem;
	text-align: center;
	color: var(--color-text-muted, #64748b);
	font-size: 1rem;
	grid-column: 1 / -1;
`;
