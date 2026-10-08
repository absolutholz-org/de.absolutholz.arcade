import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const OverlayBackdrop = styled.div`
	position: absolute;
	inset: 0;
	z-index: 20;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
	background-color: rgba(0, 0, 0, 0.45);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	text-align: center;
	border-radius: inherit;
`;

export const OverlayCard = styled.div`
	max-width: 20rem;
	width: 100%;
	padding: 2rem 1.75rem;
	border-radius: var(--radius-xl);
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
	text-align: center;

	h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
		color: ${themeColor('text-1')};
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		color: ${themeColor('text-2')};
		line-height: 1.45;
	}
`;
