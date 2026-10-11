import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';
import { PAUSE_OVERLAY_CARD_MAX_WIDTH, PAUSE_OVERLAY_Z_INDEX } from './_PauseOverlay.constants';

export const OverlayBackdrop = styled.div`
	position: absolute;
	inset: 0;
	z-index: ${PAUSE_OVERLAY_Z_INDEX};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: ${space('xl')};
	background-color: oklch(0 0 0 / 0.5);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	text-align: center;
	border-radius: inherit;
`;

export const OverlayCard = styled.div`
	max-width: ${PAUSE_OVERLAY_CARD_MAX_WIDTH};
	width: 100%;
	padding: 2rem 1.75rem;
	border-radius: ${radiusScale.xl};
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	box-shadow: 0 10px 30px oklch(0 0 0 / 0.25);
	text-align: center;

	h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
		margin: 0;
	}

	p {
		font-size: 0.875rem;
		color: ${themeColor('text-2')};
		line-height: 1.45;
		margin: 0;
	}
`;
