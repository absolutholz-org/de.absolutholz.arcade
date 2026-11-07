import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';

export const HeaderGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
	text-align: left;
`;

export const PrimaryTitle = styled.span`
	font-size: 1.25rem;
	font-weight: 700;
	line-height: 1.25;
	color: ${themeColor('text-1')};
`;

export const Subtitle = styled.span`
	font-size: 0.8125rem;
	font-weight: 500;
	line-height: 1.2;
	color: ${themeColor('text-2')};
`;

export const DialogBody = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	color: ${themeColor('text-1')};

	/* Suppress redundant markdown H1 inside the modal dialog since the dialog header displays the canonical title and game subtitle */
	& h1 {
		display: none;
	}

	/* Reset top margin on the first visible markdown element following the hidden H1 */
	& article > h1 + *,
	& article > :first-child {
		margin-top: 0;
	}
`;
