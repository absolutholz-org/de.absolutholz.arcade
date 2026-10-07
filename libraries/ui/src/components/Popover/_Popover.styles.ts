import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const PopoverContent = styled.div`
	/* Popover user-agent reset */
	border: 1px solid ${themeColor('container-2')};
	margin: 0;
	padding: 1rem;
	inset: auto;
	position: fixed;
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	border-radius: ${radiusScale.lg};
	box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.12),
		0 0.125rem 0.375rem rgba(0, 0, 0, 0.08);
	font-family: inherit;
	font-size: 0.9375rem;
	line-height: 1.5;
	min-width: 12rem;
	max-width: calc(100vw - 2rem);
	z-index: 1000;
	outline: none;

	/* Top-layer entry and exit transitions */
	opacity: 0;
	transform: scale(0.96);
	transition-property: opacity, transform, display, overlay;
	transition-duration: 150ms;
	transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
	transition-behavior: allow-discrete;

	&:is(:popover-open, .\:popover-open),
	&[data-open='true'] {
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

		@starting-style {
			&:is(:popover-open, .\:popover-open),
			&[data-open='true'] {
				transform: none;
			}
		}
	}
`;
