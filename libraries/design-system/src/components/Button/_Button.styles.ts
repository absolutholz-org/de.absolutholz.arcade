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

export const IconWrapper = styled.span`
	align-items: center;
	display: inline-flex;
	font-size: 1.15em;
	justify-content: center;
`;

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

	/* Disabled State */
	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	/* Focus Outline */
	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	/* Variant and Accent Combinations */
	${({ $variant, $accent }) => {
		const isPrimary = $accent === 'primary';
		const startKey = isPrimary ? 'accent' : 'accent-secondary';
		const endKey = isPrimary ? 'accent-secondary' : 'accent';
		const contrastKey = isPrimary
			? 'accent-contrast'
			: 'accent-secondary-contrast';

		const startColor = themeColor(startKey);
		const endColor = themeColor(endKey);
		const contrastColor = themeColor(contrastKey);

		// Blend the end color with 60% of the start color to soften the gradient
		const blendedEndColor = `color-mix(in oklab, ${endColor}, ${startColor} 60%)`;
		const gradId = isPrimary ? 'btn-grad-primary' : 'btn-grad-secondary';

		switch ($variant) {
			case 'solid':
				return `
					background-image: linear-gradient(135deg, ${startColor}, ${blendedEndColor});
					border: none;
					color: ${contrastColor};
					&:hover:not(:disabled) {
						filter: brightness(0.9);
					}
					&:active:not(:disabled) {
						filter: brightness(0.85);
					}
				`;
			case 'outlined':
				return `
					color: ${startColor};
					position: relative;
					&::before {
						background: linear-gradient(135deg, ${startColor}, ${blendedEndColor});
						border-radius: inherit;
						content: '';
						inset: -2px;
						mask-composite: exclude;
						padding: 2px;
						pointer-events: none;
						position: absolute;
						transition: opacity 0.2s ease-in-out;
						-webkit-mask:
							linear-gradient(#fff 0 0) content-box,
							linear-gradient(#fff 0 0);
						-webkit-mask-composite: xor;
					}
					span {
						background-clip: text;
						background-image: linear-gradient(135deg, ${startColor}, ${blendedEndColor});
						color: transparent;
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
					svg[stroke="currentColor"] * {
						stroke: url(#${gradId});
					}
					svg[fill="currentColor"] * {
						fill: url(#${gradId});
					}
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
					color: ${startColor};
					span {
						background-clip: text;
						background-image: linear-gradient(135deg, ${startColor}, ${blendedEndColor});
						color: transparent;
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
					}
					svg[stroke="currentColor"] * {
						stroke: url(#${gradId});
					}
					svg[fill="currentColor"] * {
						fill: url(#${gradId});
					}
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
