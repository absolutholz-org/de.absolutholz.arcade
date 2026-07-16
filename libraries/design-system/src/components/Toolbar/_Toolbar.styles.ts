import styled from '@emotion/styled';

import { radius } from '../../styles/radius/radius.utils';
import { space } from '../../styles/spacing';
import { Button } from '../Button';
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
	$toolbarVariant: ToolbarItemVariant;
}

export const ItemButton = styled(Button)<ItemButtonProps>`
	border-radius: ${radius('sm')};
	font-size: var(--font-size-small);
	font-weight: 500;
	gap: ${space('sm')};
	height: auto;
	padding: ${space('sm')} ${space('md')};

	${({ $toolbarVariant }) => {
		if ($toolbarVariant === 'danger') {
			return `
				border-color: #d32f2f;
				color: #d32f2f;
				&::before {
					display: none;
				}
				span {
					background-clip: unset;
					background-image: none;
					color: #d32f2f;
					-webkit-background-clip: unset;
					-webkit-text-fill-color: initial;
				}
				&:hover:not(:disabled) {
					background-color: #d32f2f;
					color: #ffffff;
					span {
						color: #ffffff;
						-webkit-text-fill-color: #ffffff;
					}
				}
			`;
		}
		return '';
	}}
`;

export const ItemLabel = styled.span`
	@media (max-width: 768px) {
		display: none;
	}
`;
