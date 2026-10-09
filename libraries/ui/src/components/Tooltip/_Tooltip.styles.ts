import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Tooltip = styled.div`
	/* Popover baseline reset */
	display: none;
	position: fixed;
	inset: auto;
	padding: 0.375rem 0.625rem;
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.sm};
	box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.16);
	font-size: 0.8125rem;
	line-height: 1.4;
	max-width: 20rem;
	width: max-content;
	z-index: 1100;
	pointer-events: auto;
	outline: none;

	/* Native popover-open state and fallback class */
	&:is(:popover-open, .\:popover-open),
	&.fallback-open {
		display: block;
		animation: tooltipFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes tooltipFadeIn {
		from {
			opacity: 0;
			transform: translateY(0.25rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		&:is(:popover-open, .\:popover-open),
		&.fallback-open {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
`;
