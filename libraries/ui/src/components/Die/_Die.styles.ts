import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const tumble0 = css`
	@keyframes tumble0 {
		0% {
			transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
		50% {
			transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg);
		}
		100% {
			transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg);
		}
	}
`;

export const tumble1 = css`
	@keyframes tumble1 {
		0% {
			transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
		50% {
			transform: rotateX(-270deg) rotateY(360deg) rotateZ(-90deg);
		}
		100% {
			transform: rotateX(-540deg) rotateY(720deg) rotateZ(-180deg);
		}
	}
`;

export const tumble2 = css`
	@keyframes tumble2 {
		0% {
			transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
		50% {
			transform: rotateX(180deg) rotateY(-360deg) rotateZ(120deg);
		}
		100% {
			transform: rotateX(360deg) rotateY(-720deg) rotateZ(240deg);
		}
	}
`;

export const tumble3 = css`
	@keyframes tumble3 {
		0% {
			transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
		50% {
			transform: rotateX(-360deg) rotateY(270deg) rotateZ(180deg);
		}
		100% {
			transform: rotateX(-720deg) rotateY(540deg) rotateZ(360deg);
		}
	}
`;

export const tumble4 = css`
	@keyframes tumble4 {
		0% {
			transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
		50% {
			transform: rotateX(450deg) rotateY(180deg) rotateZ(-120deg);
		}
		100% {
			transform: rotateX(900deg) rotateY(360deg) rotateZ(-240deg);
		}
	}
`;

export const tumble5 = css`
	@keyframes tumble5 {
		0% {
			transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		}
		50% {
			transform: rotateX(-180deg) rotateY(-270deg) rotateZ(180deg);
		}
		100% {
			transform: rotateX(-360deg) rotateY(-540deg) rotateZ(360deg);
		}
	}
`;

export const hop0 = css`
	@keyframes hop0 {
		0% {
			transform: translateY(0) scale(1);
		}
		30% {
			transform: translateY(-16px) rotate(-3deg) scale(1.08);
		}
		65% {
			transform: translateY(-7px) rotate(2deg) scale(1.03);
		}
		85% {
			transform: translateY(-2px) scale(0.98);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}
`;

export const hop1 = css`
	@keyframes hop1 {
		0% {
			transform: translateY(0) scale(1);
		}
		30% {
			transform: translateY(-18px) rotate(4deg) scale(1.09);
		}
		65% {
			transform: translateY(-8px) rotate(-2deg) scale(1.04);
		}
		85% {
			transform: translateY(-2px) scale(0.98);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}
`;

export const hop2 = css`
	@keyframes hop2 {
		0% {
			transform: translateY(0) scale(1);
		}
		30% {
			transform: translateY(-14px) rotate(-4deg) scale(1.07);
		}
		65% {
			transform: translateY(-6px) rotate(1deg) scale(1.03);
		}
		85% {
			transform: translateY(-1px) scale(0.99);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}
`;

export const hop3 = css`
	@keyframes hop3 {
		0% {
			transform: translateY(0) scale(1);
		}
		30% {
			transform: translateY(-20px) rotate(3deg) scale(1.1);
		}
		65% {
			transform: translateY(-9px) rotate(-3deg) scale(1.04);
		}
		85% {
			transform: translateY(-3px) scale(0.98);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}
`;

export const hop4 = css`
	@keyframes hop4 {
		0% {
			transform: translateY(0) scale(1);
		}
		30% {
			transform: translateY(-15px) rotate(2deg) scale(1.08);
		}
		65% {
			transform: translateY(-6px) rotate(-1deg) scale(1.03);
		}
		85% {
			transform: translateY(-1px) scale(0.99);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}
`;

export const hop5 = css`
	@keyframes hop5 {
		0% {
			transform: translateY(0) scale(1);
		}
		30% {
			transform: translateY(-17px) rotate(-3deg) scale(1.08);
		}
		65% {
			transform: translateY(-8px) rotate(2deg) scale(1.04);
		}
		85% {
			transform: translateY(-2px) scale(0.98);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}
`;

export const DieWrapper = styled.button`
	position: relative;
	width: 3.5rem;
	height: 3.5rem;
	padding: 0;
	margin: 0.375rem;
	background: transparent;
	border: none;
	cursor: pointer;
	perspective: 500px;
	border-radius: ${radiusScale.lg};
	user-select: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	touch-action: manipulation;
	transition: transform 120ms cubic-bezier(0, 0, 0.2, 1);

	&:hover:not(:disabled) {
		transform: translateY(-2px);
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 4px;
	}

	&[data-held='true'] {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 3px;
		border-radius: ${radiusScale.lg};
	}

	&[data-rolling='true'][data-tumble='0'] {
		animation: hop0 0.44s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}
	&[data-rolling='true'][data-tumble='1'] {
		animation: hop1 0.52s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}
	&[data-rolling='true'][data-tumble='2'] {
		animation: hop2 0.47s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}
	&[data-rolling='true'][data-tumble='3'] {
		animation: hop3 0.56s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}
	&[data-rolling='true'][data-tumble='4'] {
		animation: hop4 0.49s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}
	&[data-rolling='true'][data-tumble='5'] {
		animation: hop5 0.51s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none !important;
		animation: none !important;
		&:hover:not(:disabled) {
			transform: none !important;
		}
	}
`;

export const Cube = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	transform-style: preserve-3d;
	transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);

	&[data-face='1'] {
		transform: rotateX(0deg) rotateY(0deg);
	}
	&[data-face='2'] {
		transform: rotateX(0deg) rotateY(-90deg);
	}
	&[data-face='3'] {
		transform: rotateX(-90deg) rotateY(0deg);
	}
	&[data-face='4'] {
		transform: rotateX(90deg) rotateY(0deg);
	}
	&[data-face='5'] {
		transform: rotateX(0deg) rotateY(90deg);
	}
	&[data-face='6'] {
		transform: rotateX(0deg) rotateY(180deg);
	}

	&[data-rolling='true'][data-tumble='0'] {
		animation: tumble0 0.44s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	&[data-rolling='true'][data-tumble='1'] {
		animation: tumble1 0.52s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	&[data-rolling='true'][data-tumble='2'] {
		animation: tumble2 0.47s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	&[data-rolling='true'][data-tumble='3'] {
		animation: tumble3 0.56s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	&[data-rolling='true'][data-tumble='4'] {
		animation: tumble4 0.49s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	&[data-rolling='true'][data-tumble='5'] {
		animation: tumble5 0.51s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none !important;
		animation: none !important;
	}
`;

export const Face = styled.div`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 0.45rem;
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.lg};
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), inset 0 0 0 1px ${themeColor('container-2')};
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 1fr);
	align-items: center;
	justify-items: center;
	backface-visibility: hidden;

	&[data-face-idx='1'] {
		transform: rotateY(0deg) translateZ(1.75rem);
	}
	&[data-face-idx='2'] {
		transform: rotateY(90deg) translateZ(1.75rem);
	}
	&[data-face-idx='3'] {
		transform: rotateX(90deg) translateZ(1.75rem);
	}
	&[data-face-idx='4'] {
		transform: rotateX(-90deg) translateZ(1.75rem);
	}
	&[data-face-idx='5'] {
		transform: rotateY(-90deg) translateZ(1.75rem);
	}
	&[data-face-idx='6'] {
		transform: rotateY(180deg) translateZ(1.75rem);
	}

	> span {
		width: 0.625rem;
		height: 0.625rem;
		border-radius: 50%;
		background-color: ${themeColor('text-1')};

		&[data-pip='false'] {
			visibility: hidden;
		}
	}
`;

export const HeldBadge = styled.span`
	position: absolute;
	top: -0.45rem;
	right: -0.45rem;
	padding: 0.1875rem 0.375rem;
	font-size: 0.625rem;
	font-weight: 700;
	line-height: 1;
	border-radius: ${radiusScale.sm};
	background-color: ${themeColor('accent')};
	color: ${themeColor('accent-contrast')};
	display: inline-flex;
	align-items: center;
	gap: 0.125rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
	z-index: 2;
	pointer-events: none;
`;
