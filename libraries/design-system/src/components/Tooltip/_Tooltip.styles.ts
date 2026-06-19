import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { space } from '../../styles/spacing/spacing.utils';

const popoverFadeIn = keyframes`
	from {
		opacity: 0;
		transform: translateY(4px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

export const Tooltip = styled.div`
	background-color: var(--color-text-1);
	border: none;
	border-radius: 6px;
	box-shadow:
		0 4px 12px -2px rgba(0, 0, 0, 0.12),
		0 2px 6px -1px rgba(0, 0, 0, 0.08);
	color: var(--color-surface);
	display: none;
	font-family: inherit;
	font-size: var(--font-size-small);
	font-weight: 500;
	line-height: var(--line-height-small);
	margin: 0;
	max-width: 240px;
	width: fit-content;
	padding: ${space('2xs')} ${space('sm')};
	z-index: 50;

	/* Reset positioning to be controlled by JS hook */
	inset: auto;
	position: fixed;

	/* Native API state and fallback state */
	&:popover-open,
	&.fallback-open {
		animation: ${popoverFadeIn} 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		display: block;
	}
`;
