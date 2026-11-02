import { css } from '@linaria/core';

export const confettiCanvas = css`
	position: fixed;
	inset: 0;
	width: 100vw;
	height: 100vh;
	margin: 0;
	padding: 0;
	border: none;
	background: transparent;
	pointer-events: none;
	z-index: 1000;

	&:popover-open {
		display: block;
	}
`;
