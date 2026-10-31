import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Container = styled.div`
	display: flex;
	align-items: stretch;
	gap: 0.25rem;
	padding: 0.25rem;
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radiusScale.lg};
	max-width: 100%;
	overflow-x: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;
	-webkit-overflow-scrolling: touch;
	box-sizing: border-box;

	&::-webkit-scrollbar {
		display: none;
	}

	&[data-size='sm'] {
		border-radius: ${radiusScale.md};
		padding: 0.1875rem;
		gap: 0.1875rem;
	}
`;

export const SegmentButton = styled.button`
	flex: 1 1 0%;
	min-width: max-content;
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.125rem;
	padding: 0.5rem 0.875rem;
	border: none;
	border-radius: ${radiusScale.md};
	background-color: transparent;
	color: ${themeColor('text-2')};
	font-family: inherit;
	font-size: 0.875rem;
	font-weight: 500;
	line-height: 1.25;
	text-align: center;
	cursor: pointer;
	user-select: none;
	outline: none;
	transition: background-color 140ms ease, color 140ms ease, box-shadow 140ms ease;

	/* Enforce WCAG 2.2 AA minimum touch target (44px) */
	min-height: 2.75rem;

	&[data-size='sm'] {
		min-height: 1.5rem;
	}

	&:hover:not(:disabled):not([data-checked='true']) {
		background-color: ${themeColor('container-2')};
		color: ${themeColor('text-1')};
	}

	&[data-checked='true'] {
		background-color: ${themeColor('surface')};
		color: ${themeColor('accent')};
		font-weight: 600;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08);
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
		z-index: 1;
	}

	&[data-disabled='true'],
	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		pointer-events: none;
	}

	&[data-size='sm'] {
		flex-direction: row;
		padding: 0.25rem 0.625rem;
		border-radius: ${radiusScale.sm};
		font-size: 0.8125rem;
		gap: 0.375rem;
	}

	&[data-has-icon='true'] {
		flex-direction: row;
		gap: 0.375rem;
	}

	> [data-slot='icon'] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 1rem;
		height: 1rem;
		font-size: 1rem;

		svg {
			width: 100%;
			height: 100%;
		}
	}

	> [data-slot='label'] {
		display: inline-block;
	}

	> [data-slot='sublabel'] {
		font-size: 0.75rem;
		opacity: 0.75;
		font-weight: 400;
	}
`;
