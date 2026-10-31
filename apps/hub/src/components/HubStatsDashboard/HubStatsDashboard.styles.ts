import { css } from '@linaria/core';

export const Container = css`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
`;

export const TabPanel = css`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	width: 100%;
	outline: none;
`;

export const KpiGrid = css`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	width: 100%;

	@media (min-width: 640px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;

export const KpiCard = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	border-radius: var(--radius-md, 0.75rem);
	border: 1px solid var(--color-container-2);
	background: var(--color-surface);
	text-align: center;
	gap: 0.25rem;
	min-height: 5.5rem;
	box-sizing: border-box;
	transition: border-color 150ms ease, box-shadow 150ms ease;

	&:hover {
		border-color: var(--color-accent);
	}
`;

export const KpiValue = css`
	font-size: 1.5rem;
	font-weight: 700;
	line-height: 1.2;
	color: var(--color-text-1);
	font-variant-numeric: tabular-nums;

	@media (min-width: 640px) {
		font-size: 1.75rem;
	}
`;

export const KpiLabel = css`
	font-size: 0.8125rem;
	font-weight: 500;
	color: var(--color-text-2);
	text-transform: uppercase;
	letter-spacing: 0.03em;
`;

export const KpiSubline = css`
	font-size: 0.8125rem;
	font-weight: 600;
	color: var(--color-accent);
	margin-top: 0.125rem;
`;

export const Section = css`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
`;

export const SectionHeader = css`
	display: flex;
	align-items: center;
	justify-content: space-between;

	h2 {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text-1);
		margin: 0;
	}
`;

export const CompactGrid = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: 0.75rem;
	width: 100%;

	@media (min-width: 540px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 900px) {
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
`;

export const CompactCard = css`
	display: flex;
	flex-direction: column;
	gap: 0.875rem;
	padding: 1rem;
	text-align: left;
	width: 100%;
	box-sizing: border-box;
	cursor: pointer;
	border-radius: var(--radius-md, 0.75rem);
`;

export const CompactCardHeader = css`
	display: flex;
	align-items: center;
	gap: 0.625rem;
`;

export const CompactGameIcon = css`
	font-size: 1.5rem;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
`;

export const CompactGameTitle = css`
	font-size: 1.0625rem;
	font-weight: 600;
	color: var(--color-text-1);
	line-height: 1.2;
`;

export const CompactMetricsGrid = css`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 0.375rem;
	width: 100%;
	padding-top: 0.5rem;
	border-top: 1px solid var(--color-container-2);
`;

export const MetricItem = css`
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
`;

export const MetricLabel = css`
	font-size: 0.6875rem;
	font-weight: 500;
	color: var(--color-text-2);
	text-transform: uppercase;
	letter-spacing: 0.02em;
`;

export const MetricValue = css`
	font-size: 0.9375rem;
	font-weight: 600;
	color: var(--color-text-1);
	font-variant-numeric: tabular-nums;
`;

export const GameHeaderBanner = css`
	display: flex;
	align-items: center;
	gap: 0.875rem;
	padding: 1rem 1.25rem;
	border-radius: var(--radius-md, 0.75rem);
	background: var(--color-container-1);
	border: 1px solid var(--color-container-2);
`;

export const GameHeaderIcon = css`
	font-size: 2rem;
	line-height: 1;
	display: inline-flex;
	align-items: center;
	justify-content: center;
`;

export const GameHeaderContent = css`
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
`;

export const GameHeaderTitle = css`
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--color-text-1);
	margin: 0;
	line-height: 1.2;
`;

export const GameHeaderSubtitle = css`
	font-size: 0.8125rem;
	font-weight: 500;
	color: var(--color-text-2);
	text-transform: uppercase;
	letter-spacing: 0.03em;
`;
