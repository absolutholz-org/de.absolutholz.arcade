import { styled } from '@linaria/react';
import { focusVisibleRing } from '../../styles/focus.css';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const TriggerButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.25rem;
	border-radius: ${radiusScale.pill};
	background: transparent;
	border: 1px solid transparent;
	cursor: pointer;
	line-height: 1;
	transition: transform 120ms ease, border-color 150ms ease;

	&:hover:not(:disabled) {
		transform: scale(1.05);
	}

	${focusVisibleRing}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

export const PickerContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.875rem;
	width: 17.5rem;
	max-width: 100%;
`;

export const RadioGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	> [data-slot='header'] {
		font-size: 0.8125rem;
		font-weight: 600;
		color: ${themeColor('text-2')};
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
`;

export const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 0.375rem;
`;

export const OptionButton = styled.button`
	aspect-ratio: 1;
	border-radius: ${radiusScale.md};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.375rem;
	line-height: 1;
	background: transparent;
	border: 1px solid transparent;
	cursor: pointer;
	transition: background-color 120ms ease, transform 120ms ease;
	user-select: none;

	&:hover:not(:disabled) {
		background-color: ${themeColor('container-2')};
		transform: scale(1.1);
	}

	&[data-selected='true'] {
		background-color: light-dark(oklch(0.92 0.05 250), oklch(0.28 0.06 250));
		border-color: ${themeColor('accent')};
	}

	${focusVisibleRing}
`;

export const CustomSection = styled.div`
	border-top: 1px solid ${themeColor('container-2')};
	padding-top: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	> [data-slot='custom-label'] {
		font-size: 0.8125rem;
		font-weight: 500;
		color: ${themeColor('text-2')};
	}

	> [data-slot='custom-row'] {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	> [data-slot='custom-error'] {
		font-size: 0.75rem;
		color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
	}
`;

export const CustomInput = styled.input`
	flex: 1;
	padding: 0.375rem 0.625rem;
	border-radius: ${radiusScale.md};
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	border: 1px solid ${themeColor('container-2')};
	font-size: 0.9375rem;
	min-height: 2rem;

	${focusVisibleRing}

	&[data-invalid='true'] {
		border-color: light-dark(oklch(0.55 0.22 25), oklch(0.72 0.2 25));
	}
`;
