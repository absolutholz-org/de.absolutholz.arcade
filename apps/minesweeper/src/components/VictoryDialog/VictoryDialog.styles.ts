import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const VictoryContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
	padding-top: 0.5rem;
	width: 100%;
`;

export const TimeCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 1.25rem 2rem;
	border-radius: var(--radius-lg);
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	width: 100%;

	[data-slot='label'] {
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: ${themeColor('text-2')};
	}
`;

export const RankMessage = styled.p`
	font-size: 1rem;
	font-weight: 500;
	color: ${themeColor('text-1')};
	text-align: center;
`;

export const Actions = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	width: 100%;

	a {
		font-size: 0.875rem;
		text-decoration: underline;

		&:hover {
			opacity: 0.8;
		}
	}
`;
