import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const HeaderContainer = styled.header`
	width: 100%;
	max-width: 38rem;
	margin: 0 auto;
	padding: 0.5rem 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
`;

export const LeftSection = styled.div`
	display: flex;
	align-items: center;

	a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.5rem;
		color: ${themeColor('text-1')};
		background: ${themeColor('container-1')};
		border: 1px solid ${themeColor('container-2')};
		transition: background 0.15s ease, transform 0.15s ease;

		&:hover {
			background: ${themeColor('container-2')};
			transform: translateX(-1px);
		}
	}
`;

export const CenterSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.125rem;
`;

export const ModeTitle = styled.span`
	font-size: 0.8125rem;
	font-weight: 600;
	color: ${themeColor('text-2')};
	letter-spacing: 0.02em;
`;

export const HeaderButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.25rem;
	height: 2.25rem;
	border-radius: 0.5rem;
	background: transparent;
	border: none;
	color: ${themeColor('text-1')};
	cursor: pointer;
	transition: background 0.15s ease;

	&:hover {
		background: ${themeColor('container-2')};
	}
`;
