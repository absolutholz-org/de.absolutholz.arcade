import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const Switch = styled.label`
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	gap: ${space('md')};
	cursor: pointer;
	user-select: none;
	width: auto;
	min-height: 24px;

	&[data-full-width='true'] {
		width: 100%;
	}

	&[data-disabled='true'] {
		cursor: not-allowed;
		opacity: 0.5;
	}

	/* Visually hidden native checkbox */
	> input[type='checkbox'] {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
		appearance: none;
	}

	/* Label text slot */
	> [data-slot='label'] {
		font-size: 0.9375rem;
		line-height: 1.4;
		color: ${themeColor('text-1')};
		font-weight: 600;
	}

	/* High-contrast focus outline on the track element */
	&:has(input:focus-visible) > [data-slot='track'] {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	/* Switch track element */
	> [data-slot='track'] {
		position: relative;
		border-radius: ${radiusScale.pill};
		background-color: ${themeColor('container-2')};
		transition: background-color 200ms ease-in-out;
		flex-shrink: 0;

		/* Preserve visual boundary in Windows High Contrast / Forced Colors Mode */
		border: 1px solid transparent;
		@media (forced-colors: active) {
			border-color: CanvasText;
		}
	}

	/* Size md (Default): 3rem x 1.75rem track */
	&[data-size='md'] > [data-slot='track'] {
		width: 3rem;
		height: 1.75rem;
	}

	&[data-size='md'] > [data-slot='track'] > [data-slot='thumb'] {
		top: 0.1875rem;
		left: 0.1875rem;
		width: 1.375rem;
		height: 1.375rem;
	}

	/* Size sm: 2.25rem x 1.25rem track */
	&[data-size='sm'] > [data-slot='track'] {
		width: 2.25rem;
		height: 1.25rem;
	}

	&[data-size='sm'] > [data-slot='track'] > [data-slot='thumb'] {
		top: 0.125rem;
		left: 0.125rem;
		width: 1rem;
		height: 1rem;
	}

	/* Switch sliding thumb element */
	> [data-slot='track'] > [data-slot='thumb'] {
		position: absolute;
		background-color: ${themeColor('surface')};
		border-radius: ${radiusScale.pill};
		transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
		transform: translateX(0);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

		@media (forced-colors: active) {
			background-color: ButtonText;
		}
	}

	/* Active / Checked track and thumb translation */
	&:has(input:checked) > [data-slot='track'],
	> [data-slot='track'][data-checked='true'] {
		background-color: ${themeColor('accent')};
	}

	&[data-size='md']:has(input:checked) > [data-slot='track'] > [data-slot='thumb'],
	&[data-size='md'] > [data-slot='track'][data-checked='true'] > [data-slot='thumb'] {
		transform: translateX(1.25rem);
	}

	&[data-size='sm']:has(input:checked) > [data-slot='track'] > [data-slot='thumb'],
	&[data-size='sm'] > [data-slot='track'][data-checked='true'] > [data-slot='thumb'] {
		transform: translateX(1rem);
	}

	@media (prefers-reduced-motion: reduce) {
		> [data-slot='track'],
		> [data-slot='track'] > [data-slot='thumb'] {
			transition: none;
		}
	}
`;
