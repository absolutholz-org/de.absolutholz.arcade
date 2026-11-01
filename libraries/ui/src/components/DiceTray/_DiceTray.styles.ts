import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const TrayContainer = styled.section`
	position: relative;
	display: inline-flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1.25rem;
	width: auto;
	max-width: 100%;
	margin: 0;
	padding: 1.25rem;
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.xl};
	box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.08);
	box-sizing: border-box;
`;

export const TopBar = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	gap: 0.75rem;
`;

export const TotalBadge = styled.div`
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

export const DiceGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
	min-height: 4.5rem;
	padding: 0.5rem 0;
	box-sizing: border-box;
`;

export const ControlsBar = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: center;
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
