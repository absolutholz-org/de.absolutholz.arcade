import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';
import { DIALOG_MAX_WIDTH } from './_Dialog.constants';

export const DialogBase = styled.dialog`
	border: none;
	background: transparent;
	margin: auto;
	max-width: calc(100vw - 2rem);
	max-height: calc(100vh - 2rem);
	color: inherit;
	overflow: visible;

	&::backdrop {
		background-color: oklch(0 0 0 / 0.5);
		backdrop-filter: blur(4px);
		opacity: 0;
		transition-property: opacity, display, overlay;
		transition-duration: 150ms;
		transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
		transition-behavior: allow-discrete;
	}

	&[open]::backdrop {
		opacity: 1;

		@starting-style {
			opacity: 0;
		}
	}

	opacity: 0;
	transform: scale(0.96);
	transition-property: opacity, transform, display, overlay;
	transition-duration: 150ms;
	transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
	transition-behavior: allow-discrete;

	&[open] {
		opacity: 1;
		transform: scale(1);

		@starting-style {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		transform: none;
		transition-duration: 50ms;

		&::backdrop {
			transition-duration: 50ms;
		}

		@starting-style {
			&[open] {
				transform: none;
			}
		}
	}
`;

export const DialogContainer = styled.div`
	width: 100%;
	max-width: ${DIALOG_MAX_WIDTH};
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.xl};
	box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.2), 0 0.125rem 0.5rem rgba(0, 0, 0, 0.12);
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

export const DialogHeader = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.25rem 1.5rem;
	border-bottom: 1px solid ${themeColor('container-2')};
	gap: 1rem;
`;

export const DialogTitle = styled.h2`
	font-size: 1.25rem;
	font-weight: 700;
	line-height: 1.25;
	color: ${themeColor('text-1')};
`;

export const DialogContent = styled.div`
	padding: 1.5rem;
	font-size: 0.9375rem;
	color: ${themeColor('text-2')};

	> p + * {
		margin-top: 0.75rem;
	}
`;

export const DialogFooter = styled.footer`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 0.75rem;
	padding: 1rem 1.5rem;
	border-top: 1px solid ${themeColor('container-2')};
	background-color: ${themeColor('surface')};
`;
