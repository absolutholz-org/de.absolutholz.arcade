import styled from '@emotion/styled';

import { radius } from '../../styles/radius/radius.utils';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';
import type { ToolbarItemVariant } from './_Toolbar.types';

export const ToolbarRoot = styled.div`
	align-items: center;
	display: flex;
	gap: ${space('md')};
	justify-content: space-between;
	width: fit-content;
`;

export const Group = styled.div`
	align-items: center;
	display: flex;
	gap: ${space('md')};
`;

interface ItemButtonProps {
	$variant: ToolbarItemVariant;
}

export const ItemButton = styled.button<ItemButtonProps>`
	align-items: center;
	background-color: transparent;
	border: 1px solid transparent;
	border-radius: ${radius('sm')};
	cursor: pointer;
	display: flex;
	font-size: var(--font-size-small);
	font-weight: 500;
	gap: ${space('sm')};
	padding: ${space('sm')} ${space('md')};
	transition:
		background-color 0.2s ease-in-out,
		color 0.2s ease-in-out,
		border-color 0.2s ease-in-out,
		outline 0.2s ease-in-out;

	${({ $variant }) => {
		switch ($variant) {
			case 'primary':
				return `
					background-color: ${themeColor('accent')};
					color: ${themeColor('accent-contrast')};
					&:hover:not(:disabled) {
						filter: brightness(0.9);
					}
				`;
			case 'danger':
				return `
					border-color: #d32f2f;
					color: #d32f2f;
					&:hover:not(:disabled) {
						background-color: #d32f2f;
						color: #ffffff;
					}
				`;
			case 'secondary':
				return `
					background-color: ${themeColor('surface')};
					border-color: ${themeColor('container-2')};
					color: ${themeColor('text-1')};
					&:hover:not(:disabled) {
						background-color: ${themeColor('container-1')};
					}
				`;
			case 'ghost':
			default:
				return `
					background-color: transparent;
					color: ${themeColor('text-1')};
					&:hover:not(:disabled) {
						background-color: ${themeColor('container-1')};
					}
				`;
		}
	}}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}
`;

export const ItemLabel = styled.span`
	@media (max-width: 768px) {
		display: none;
	}
`;
