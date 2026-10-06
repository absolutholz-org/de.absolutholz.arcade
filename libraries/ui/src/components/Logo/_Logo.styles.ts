import { styled } from '@linaria/react';
import { WOOD_GRAIN_BASE64 } from '../../assets/wood-grain';
import { radiusScale } from '../../styles/radius/radius.constants';
import { LOGO_SIZES } from './_Logo.constants';

export const Logo = styled.span`
	align-items: center;
	background-image: url(${WOOD_GRAIN_BASE64});
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	border-radius: ${radiusScale.md};
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	display: inline-flex;
	flex-shrink: 0;
	font-size: ${LOGO_SIZES.md};
	height: 1em;
	justify-content: center;
	overflow: hidden;
	user-select: none;
	vertical-align: middle;
	width: 1em;

	> svg {
		display: block;
		height: 0.9em;
		width: 0.9em;
	}
`;

export const Small = styled(Logo)`
	border-radius: ${radiusScale.sm};
	font-size: ${LOGO_SIZES.sm};
`;

export const Large = styled(Logo)`
	font-size: ${LOGO_SIZES.lg};
`;

export const ExtraLarge = styled(Logo)`
	font-size: ${LOGO_SIZES.xl};
`;
