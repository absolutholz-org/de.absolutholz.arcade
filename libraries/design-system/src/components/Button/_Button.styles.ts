import styled from '@emotion/styled';
import { radius } from '../../styles/radius/radius.utils';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';
// eslint-disable-next-line no-restricted-imports
import { fontSize } from '../Text/_Text.functions';
import type {
	ButtonAccent,
	ButtonDisplay,
	ButtonVariant,
} from './_Button.types';

interface StyledButtonProps {
	$variant: ButtonVariant;
	$accent: ButtonAccent;
	$display: ButtonDisplay;
}

export const StyledButton = styled.button<StyledButtonProps>`
	align-items: center;
	border: 2px solid transparent;
	border-radius: ${radius('md')};
	display: ${({ $display }) => ($display === 'block' ? 'flex' : 'inline-flex')};
	font-size: ${fontSize('base')};
	font-weight: 600;
	gap: ${space('xs')};
	height: 2.5rem;
	justify-content: center;
	line-height: var(--line-height-base);
	padding: 0 ${space('md')};
	text-decoration: none;
	transition:
		background-color 0.2s ease-in-out,
		color 0.2s ease-in-out,
		border-color 0.2s ease-in-out,
		filter 0.2s ease-in-out,
		outline 0.2s ease-in-out;
	white-space: nowrap;
	width: ${({ $display }) => ($display === 'block' ? '100%' : 'auto')};

	/* Focus Outline */
	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	/* Disabled State */
	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	/* Variant and Accent Combinations */
	${({ $variant, $accent }) => {
		const bgKey = $accent === 'primary' ? 'accent' : 'accent-secondary';
		const textKey =
			$accent === 'primary' ? 'accent-contrast' : 'accent-secondary-contrast';
		const accentColor = themeColor(bgKey);
		const contrastColor = themeColor(textKey);

		switch ($variant) {
			case 'solid':
				return `
					background-color: ${accentColor};
					color: ${contrastColor};
					&:hover:not(:disabled) {
						filter: brightness(0.9);
					}
					&:active:not(:disabled) {
						filter: brightness(0.8);
					}
				`;
			case 'outlined':
				return `
					border-color: ${accentColor};
					color: ${accentColor};
					&:hover:not(:disabled) {
						background-color: ${themeColor('container-1')};
					}
					&:active:not(:disabled) {
						background-color: ${themeColor('container-2')};
					}
				`;
			case 'ghost':
			default:
				return `
					color: ${accentColor};
					&:hover:not(:disabled) {
						background-color: ${themeColor('container-1')};
					}
					&:active:not(:disabled) {
						background-color: ${themeColor('container-2')};
					}
				`;
		}
	}}
`;
