import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const Toast_Host = styled.aside`
	position: fixed;
	z-index: 9999;
	pointer-events: none;
	display: flex;
	flex-direction: column;
	padding: ${space('md')};
	box-sizing: border-box;
	max-width: 100vw;
	border: none;
	background: transparent;
	margin: 0;
	inset: auto;
	overflow: visible;

	&[data-position='top-right'] {
		top: 0;
		right: 0;
		align-items: flex-end;
	}

	&[data-position='top-left'] {
		top: 0;
		left: 0;
		align-items: flex-start;
	}

	&[data-position='bottom-right'] {
		bottom: 0;
		right: 0;
		align-items: flex-end;
	}

	&[data-position='bottom-left'] {
		bottom: 0;
		left: 0;
		align-items: flex-start;
	}

	&[data-position='top-center'] {
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		align-items: center;
	}

	&[data-position='bottom-center'] {
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		align-items: center;
	}
`;

export const Toast_List = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${space('sm')};
	width: 100%;
	max-width: 24rem;
`;

export const Toast_Item = styled.div`
	pointer-events: auto;
	position: relative;
	overflow: hidden;
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	border: 1px solid ${themeColor('container-2')};
	border-left: 4px solid var(--toast-accent-color);
	border-radius: ${radiusScale.lg};
	box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.16);
	display: flex;
	align-items: flex-start;
	gap: ${space('sm')};
	padding: ${space('sm')} ${space('md')};
	width: 100%;
	min-width: 18rem;
	max-width: 24rem;
	box-sizing: border-box;
	transition: opacity 160ms ease, transform 160ms ease;

	&[data-variant='info'] {
		--toast-accent-color: light-dark(oklch(0.55 0.18 245), oklch(0.7 0.18 245));
	}

	&[data-variant='success'] {
		--toast-accent-color: light-dark(oklch(0.55 0.18 145), oklch(0.7 0.18 145));
	}

	&[data-variant='warning'] {
		--toast-accent-color: light-dark(oklch(0.65 0.18 75), oklch(0.78 0.18 75));
	}

	&[data-variant='achievement'] {
		--toast-accent-color: light-dark(oklch(0.68 0.2 80), oklch(0.82 0.2 80));
	}

	&:hover,
	&:focus-within,
	&[data-paused='true'] {
		& [data-toast-progress-bar] {
			animation-play-state: paused;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const Toast_ProgressTrack = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 0.1875rem;
	background-color: ${themeColor('container-2')};
	overflow: hidden;
`;

export const Toast_ProgressBar = styled.div`
	height: 100%;
	width: 100%;
	background-color: var(--toast-accent-color);
	transform-origin: left center;
	animation-name: toastCountdown;
	animation-duration: var(--toast-duration, 7000ms);
	animation-timing-function: linear;
	animation-fill-mode: forwards;

	@keyframes toastCountdown {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		animation: none;
		display: none;
	}
`;

export const Toast_Icon = styled.div`
	color: var(--toast-accent-color);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-top: 0.125rem;
`;

export const Toast_Content = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	min-width: 0;
	gap: 0.25rem;
`;

export const Toast_Title = styled.div`
	font-size: 0.875rem;
	font-weight: 700;
	line-height: 1.25;
	color: ${themeColor('text-1')};
`;

export const Toast_Message = styled.div`
	font-size: 0.875rem;
	line-height: 1.4;
	color: ${themeColor('text-2')};
	word-break: break-word;
`;

export const Toast_Action = styled.div`
	margin-top: ${space('xs')};
`;

export const Toast_DismissButton = styled.button`
	background: transparent;
	border: none;
	cursor: pointer;
	color: ${themeColor('text-2')};
	padding: 0.25rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: ${radiusScale.sm};
	min-width: 24px;
	min-height: 24px;
	flex-shrink: 0;
	margin-left: ${space('xs')};
	outline: none;
	transition: color 120ms ease, background-color 120ms ease;

	&:hover {
		color: ${themeColor('text-1')};
		background-color: ${themeColor('container-1')};
	}

	&:focus-visible {
		outline: 2px solid var(--toast-accent-color);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;
