import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const PaletteSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	width: 100%;
	max-width: 28rem;
	margin: 0 auto;
`;

export const ColorGrid = styled.fieldset`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5rem;
	border: 0;
	padding: 0;
	margin: 0;
`;

export const ColorButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 3rem;
	min-height: 3rem;
	padding: 0.25rem;
	border-radius: 0.875rem;
	border: 0.125rem solid color-mix(in oklch, ${themeColor('text-1')} 16%, transparent);
	background-color: ${themeColor('container-1')};
	cursor: pointer;
	transition: transform 120ms ease, border-color 120ms ease;

	&:hover:not(:disabled) {
		border-color: ${themeColor('accent')};
		transform: translateY(-0.0625rem);
	}

	&:active:not(:disabled) {
		transform: translateY(0);
	}

	&:focus-visible {
		outline: 0.1875rem solid ${themeColor('accent')};
		outline-offset: 0.125rem;
	}

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	@media (forced-colors: active) {
		border: 0.125rem solid buttonborder;
		background-color: canvas;

		&:focus-visible {
			outline: 0.1875rem solid highlight;
		}
	}
`;

export const ActionRow = styled.fieldset`
	display: grid;
	grid-template-columns: auto auto 1fr;
	gap: 0.5rem;
	align-items: center;
	border: 0;
	padding: 0;
	margin: 0;
`;
