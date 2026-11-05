import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeVars } from '../../styles/theme/theme.css';

export const ContentRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.25rem;
	width: 100%;
	box-sizing: border-box;

	@media (min-width: 34rem) {
		flex-direction: row;
		align-items: stretch;
		min-width: 30rem;
		max-width: 32rem;
		gap: 1.5rem;
	}
`;

export const QrCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1.25rem;
	background-color: ${themeVars['container-1']};
	border: 1px solid ${themeVars['container-2']};
	border-radius: ${radiusScale.lg};
	color: ${themeVars['text-1']};
	width: 100%;
	box-sizing: border-box;

	@media (min-width: 34rem) {
		width: 13rem;
		flex-shrink: 0;
	}

	> svg {
		display: block;
		margin: 0 auto;
		width: 100%;
		max-width: 150px;
		height: auto;
	}

	> p {
		margin: 0.75rem 0 0 0;
		font-size: 0.8125rem;
		color: ${themeVars['text-2']};
		text-align: center;
		line-height: 1.35;
	}
`;

export const ActionsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.75rem;
	width: 100%;
	flex: 1 1 auto;
`;

export const StatusBanner = styled.div`
	width: 100%;
	padding: 0.5rem 0.75rem;
	border-radius: ${radiusScale.md};
	background-color: ${themeVars['container-2']};
	color: ${themeVars['text-1']};
	font-size: 0.875rem;
	text-align: center;
	box-sizing: border-box;
`;
