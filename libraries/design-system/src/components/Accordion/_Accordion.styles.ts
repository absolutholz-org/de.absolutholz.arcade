import styled from '@emotion/styled';
import type { SpacingKey } from '../../styles/spacing/spacing.utils';
import { space } from '../../styles/spacing/spacing.utils';
import type { AccordionVariant } from './_Accordion.types';

export const AccordionContainer = styled.div<{
	$gap: SpacingKey;
}>`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: ${({ $gap }) => space($gap)};
`;

export const Details = styled.details<{
	$variant: AccordionVariant;
}>`
	width: 100%;
	overflow: hidden;
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;

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
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: ${space('md')} ${space('lg')};
	font-weight: 600;
	color: var(--color-text-1);
	cursor: pointer;
	user-select: none;
	transition: background-color 0.2s ease;

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
	display: flex;
	align-items: center;
	gap: ${space('sm')};
	flex: 1;
`;

export const ChevronIcon = styled.svg`
	flex-shrink: 0;
	width: 1.25rem;
	height: 1.25rem;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
	color: var(--color-text-2);
	transition:
		transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
		color 0.2s ease;

	summary:hover & {
		color: var(--color-accent);
	}

	/* Rotate chevron when parent details is open */
	details[open] & {
		transform: rotate(180deg);
		color: var(--color-accent);
	}
`;

export const ContentPanel = styled.div`
	padding: ${space('md')} ${space('lg')};
	color: var(--color-text-2);
	line-height: 1.6;
	background-color: var(--color-container-1);
	border-top: 1px solid var(--color-container-2);
`;
