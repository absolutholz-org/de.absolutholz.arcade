import styled from '@emotion/styled';
import type { SpacingKey } from '../../styles/spacing/spacing.utils';
import { space } from '../../styles/spacing/spacing.utils';
import type { AccordionVariant } from './_Accordion.types';

export const AccordionContainer = styled.div<{
	$gap: SpacingKey;
}>`
	display: flex;
	flex-direction: column;
	gap: ${({ $gap }) => space($gap)};
	width: 100%;
`;

export const Details = styled.details<{
	$variant: AccordionVariant;
}>`
	overflow: hidden;
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
	width: 100%;

	/* Strip default browser details marker */
	&::-webkit-details-marker {
		display: none;
	}

	& > summary {
		list-style: none;
	}

	/* Variant styling */
	${({ $variant }) => {
		if ($variant === 'bordered') {
			return `
				border: 1px solid var(--color-container-2);
				border-radius: 8px;
				background-color: var(--color-surface);
				&:hover {
					border-color: var(--color-accent);
					box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.08);
				}
			`;
		}
		if ($variant === 'ghost') {
			return `
				border-bottom: 1px solid var(--color-container-2);
				background-color: transparent;
				border-radius: 0;
			`;
		}
		return '';
	}}
`;

export const Summary = styled.summary`
	align-items: center;
	color: var(--color-text-1);
	cursor: pointer;
	display: flex;
	font-weight: 600;
	justify-content: space-between;
	padding: ${space('md')} ${space('lg')};
	transition: background-color 0.2s ease;
	user-select: none;

	&::-webkit-details-marker {
		display: none;
	}

	&:hover {
		background-color: var(--color-container-1);
	}

	/* Fully visible keyboard focus outline */
	&:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: -3px;
	}
`;

export const SummaryContent = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
	gap: ${space('sm')};
`;

export const ChevronIcon = styled.svg`
	color: var(--color-text-2);
	fill: none;
	flex-shrink: 0;
	height: 1.25rem;
	stroke: currentColor;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-width: 2;
	transition:
		transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
		color 0.2s ease;
	width: 1.25rem;

	summary:hover & {
		color: var(--color-accent);
	}

	/* Rotate chevron when parent details is open */
	details[open] & {
		color: var(--color-accent);
		transform: rotate(180deg);
	}
`;

export const ContentPanel = styled.div`
	background-color: var(--color-container-1);
	border-top: 1px solid var(--color-container-2);
	color: var(--color-text-2);
	line-height: 1.6;
	padding: ${space('md')} ${space('lg')};
`;
