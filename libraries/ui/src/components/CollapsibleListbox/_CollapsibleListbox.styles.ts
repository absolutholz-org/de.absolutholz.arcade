import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const ListboxContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 10rem;
	gap: ${space('3xs')};
`;

export const OptionItem = styled.button`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${space('sm')};
	padding: ${space('xs')} ${space('sm')};
	background-color: transparent;
	border: 1px solid transparent;
	width: 100%;
	text-align: left;
	font-size: 0.875rem;
	line-height: 1.25;
	color: ${themeColor('text-1')};
	border-radius: ${radiusScale.sm};
	user-select: none;
	min-height: 2rem;
	transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
	outline: none;

	&:hover {
		background-color: ${themeColor('container-2')};
	}

	&[data-active='true'] {
		background-color: ${themeColor('container-1')};
		font-weight: 600;
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: -2px;
	}

	> [data-slot='content'] {
		display: flex;
		align-items: center;
		gap: ${space('sm')};
		flex: 1;
		min-width: 0;
	}

	> [data-slot='content'] > [data-slot='icon'] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
	}

	> [data-slot='check'] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: ${themeColor('accent')};
		width: 1rem;
		height: 1rem;
	}
`;
