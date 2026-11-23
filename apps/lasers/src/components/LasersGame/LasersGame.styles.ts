import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const PlayfieldStack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-height: 0;
	gap: 0.5rem;

	@media (min-width: 640px) {
		gap: 0.75rem;
	}
`;

export const HudMetrics = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.25rem 0.75rem;
	font-variant-numeric: tabular-nums;

	@media (min-width: 640px) {
		gap: 0.5rem 1.25rem;
		justify-content: flex-start;
	}
`;

export const MetricItem = styled.div`
	display: inline-flex;
	align-items: baseline;
	gap: 0.25rem;
	font-size: 0.75rem;
	color: ${themeColor('text-2')};
	white-space: nowrap;

	@media (min-width: 640px) {
		gap: 0.375rem;
		font-size: 0.875rem;
	}
`;

export const MetricValue = styled.strong`
	font-size: 0.875rem;
	font-weight: 800;
	color: ${themeColor('text-1')};

	@media (min-width: 640px) {
		font-size: 1rem;
	}

	&[data-highlight='true'] {
		color: ${themeColor('accent')};
	}
`;

export const LiveRegion = styled.div`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
`;
