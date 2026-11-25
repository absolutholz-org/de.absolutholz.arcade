import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';

export const PrivacySettingRowContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	flex-wrap: wrap;
`;

export const PrivacySettingInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
`;

export const PrivacySettingTitle = styled.h2`
	font-size: 1.25rem;
	font-weight: 700;
	margin: 0;
	color: ${themeColor('text-1')};
`;

export const PrivacySettingDescription = styled.p`
	color: ${themeColor('text-2')};
	font-size: 0.95rem;
	margin: 0;
`;
