import { styled } from '@linaria/react';

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
	color: var(--color-text-1);
`;

export const PrivacySettingDescription = styled.p`
	color: var(--color-text-2, var(--color-text-muted, #4b5563));
	font-size: 0.95rem;
	margin: 0;
`;
