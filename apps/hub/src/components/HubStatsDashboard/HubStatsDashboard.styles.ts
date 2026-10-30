import { css } from '@linaria/core';

export const Container = css`
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	width: 100%;
`;

export const KpiGrid = css`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	width: 100%;

	@media (min-width: 768px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;

export const KpiCard = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1.25rem 1rem;
	border-radius: 0.75rem;
	border: 1px solid var(--color-container-2);
	background: var(--color-surface);
	text-align: center;
	gap: 0.375rem;
	transition: border-color 150ms ease;

	&:hover {
		border-color: var(--color-accent);
	}
`;

export const KpiValue = css`
	font-size: 1.75rem;
	font-weight: 700;
	line-height: 1.2;
	color: var(--color-text-1);
	font-variant-numeric: tabular-nums;
`;

export const KpiLabel = css`
	font-size: 0.8125rem;
	font-weight: 500;
	color: var(--color-text-2);
	text-transform: uppercase;
	letter-spacing: 0.03em;
`;

export const Section = css`
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	width: 100%;
`;

export const SectionHeader = css`
	display: flex;
	align-items: center;
	justify-content: space-between;

	h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-1);
		margin: 0;
	}
`;

export const TableWrapper = css`
	width: 100%;
	overflow-x: auto;
	border: 1px solid var(--color-container-2);
	border-radius: 0.75rem;
	background: var(--color-surface);
	-webkit-overflow-scrolling: touch;
`;

export const Table = css`
	width: 100%;
	border-collapse: collapse;
	text-align: left;
	font-variant-numeric: tabular-nums;
`;

export const Th = css`
	background: var(--color-container-1);
	color: var(--color-text-2);
	font-size: 0.8125rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	padding: 0.875rem 1rem;
	border-bottom: 1px solid var(--color-container-2);
	white-space: nowrap;

	&[data-align='right'] {
		text-align: right;
	}

	&[data-align='center'] {
		text-align: center;
	}
`;

export const Tr = css`
	border-bottom: 1px solid var(--color-container-1);
	transition: background-color 120ms ease;

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background: var(--color-container-1);
	}
`;

export const Td = css`
	padding: 1rem;
	color: var(--color-text-1);
	font-size: 0.9375rem;
	vertical-align: middle;
	white-space: nowrap;

	&[data-align='right'] {
		text-align: right;
	}

	&[data-align='center'] {
		text-align: center;
	}
`;

export const GameCell = css`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-weight: 600;
	color: var(--color-text-1);
`;

export const GameIcon = css`
	font-size: 1.5rem;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
`;

export const ActionsCell = css`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

export const ActionLink = css`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	font-size: 0.8125rem;
	font-weight: 500;
	color: var(--color-text-2);
	border: 1px solid var(--color-container-2);
	background: var(--color-surface);
	border-radius: 0.375rem;
	padding: 0.375rem 0.625rem;
	text-decoration: none;
	transition:
		color 120ms ease,
		border-color 120ms ease,
		background-color 120ms ease;

	&:hover {
		color: var(--color-accent);
		border-color: var(--color-accent);
		text-decoration: none;
	}

	&[data-primary='true'] {
		color: var(--color-accent);
		border-color: var(--color-accent);
		background: color-mix(in srgb, var(--color-accent) 8%, var(--color-surface));

		&:hover {
			background: color-mix(in srgb, var(--color-accent) 16%, var(--color-surface));
		}
	}
`;
