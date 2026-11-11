import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Collapsible = styled.details`
	display: block;
	width: 100%;
	border-radius: ${radiusScale.lg};
	background-color: ${themeColor('container-1')};
	transition: border-color 0.15s ease-in-out, background-color 0.15s ease-in-out;

	&[data-variant='default'] {
		border: 1px solid ${themeColor('container-2')};
	}

	&[data-variant='bordered'] {
		border: 2px solid ${themeColor('container-2')};
	}

	&[data-variant='card'] {
		border: 1px solid ${themeColor('container-2')};
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
	}

	&[open] > summary {
		border-bottom: 1px solid ${themeColor('container-2')};
	}

	&[open] > summary [data-slot='chevron'] {
		transform: rotate(180deg);
	}
`;

export const Summary = styled.summary`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
	min-height: 2.75rem;
	cursor: pointer;
	user-select: none;
	list-style: none;
	border-radius: inherit;
	color: ${themeColor('text-1')};
	font-weight: 600;
	font-size: 1rem;
	transition: background-color 0.15s ease-in-out;

	&::-webkit-details-marker {
		display: none;
	}

	&:hover {
		background-color: ${themeColor('container-2')};
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: -2px;
	}

	> [data-slot='summary-content'] {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		flex: 1;
		min-width: 0;
	}

	> [data-slot='title'] {
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.4;
	}

	[data-slot='chevron'] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: ${themeColor('text-2')};
		transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		flex-shrink: 0;
	}
`;

export const Content = styled.div`
	padding: 1rem;
	color: ${themeColor('text-1')};
`;
