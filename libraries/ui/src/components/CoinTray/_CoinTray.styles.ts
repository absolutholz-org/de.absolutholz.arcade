import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const TrayContainer = styled.section`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.25rem;
	width: 100%;
	margin: 0;
	padding: 1.5rem;
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.xl};
	box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.08);
`;

export const TopBar = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	gap: 0.75rem;
`;

export const StatusBadge = styled.div`
	display: inline-flex;
	align-items: baseline;
	gap: 0.375rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: ${themeColor('text-2')};

	> strong {
		font-size: 1.375rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
	}
`;

export const SingleStage = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 0.75rem 0;
	--coin-size: 8.5rem;
`;

export const BatchGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 0.875rem;
	width: 100%;
	min-height: 4.5rem;
	padding: 0.75rem 0;
	--coin-size: 3.5rem;

	&[data-count='1'] {
		--coin-size: 8.5rem;
	}

	&[data-count='2'] {
		--coin-size: 6.5rem;
	}

	&[data-count='3'] {
		--coin-size: 5.25rem;
	}

	&[data-count='4'] {
		--coin-size: 4.5rem;
	}

	&[data-count='5'] {
		--coin-size: 4rem;
	}
`;

export const ControlsBar = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	width: 100%;
`;

export const LiveAnnouncer = styled.output`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
`;
