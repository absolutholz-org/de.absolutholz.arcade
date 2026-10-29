import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Container = styled.section`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	width: 100%;
`;

export const Header = styled.header`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
		line-height: 1.25;
	}
`;

export const SwitcherContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	overflow-x: auto;
	padding-bottom: 0.25rem;
`;

export const MetricsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	width: 100%;

	@media (min-width: 640px) {
		grid-template-columns: repeat(3, 1fr);
	}

	@media (min-width: 900px) {
		grid-template-columns: repeat(5, 1fr);
	}
`;

export const SecondaryMetricsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rem;
	width: 100%;

	@media (min-width: 640px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;

export const MetricCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1.25rem 1rem;
	border-radius: ${radiusScale.md};
	border: 1px solid ${themeColor('container-2')};
	background: ${themeColor('surface')};
	text-align: center;
	gap: 0.375rem;

	&[data-variant='highlight'] {
		border-color: color-mix(in oklch, ${themeColor('accent')} 35%, transparent);
		background: color-mix(in oklch, ${themeColor('accent')} 6%, ${themeColor('surface')});
	}

	[data-slot='value'] {
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1.2;
		color: ${themeColor('text-1')};
		font-variant-numeric: tabular-nums;
	}

	[data-slot='label'] {
		font-size: 0.8125rem;
		font-weight: 500;
		color: ${themeColor('text-2')};
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}
`;

export const EmptyStateCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 3rem 1.5rem;
	border-radius: ${radiusScale.lg};
	border: 1px dashed ${themeColor('container-2')};
	background: ${themeColor('surface')};
	gap: 1rem;

	[data-slot='icon'] {
		font-size: 2.5rem;
		line-height: 1;
	}

	[data-slot='title'] {
		font-size: 1.25rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
		margin: 0;
	}

	[data-slot='description'] {
		font-size: 0.9375rem;
		color: ${themeColor('text-2')};
		max-width: 28rem;
		margin: 0;
		line-height: 1.5;
	}
`;
