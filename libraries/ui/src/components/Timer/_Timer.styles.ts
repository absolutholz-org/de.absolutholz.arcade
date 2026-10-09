import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';

export const Timer = styled.time`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-variant-numeric: tabular-nums;
	font-feature-settings: 'tnum';
	line-height: 1;
	color: ${themeColor('text-1')};
	letter-spacing: 0.04ch;
	font-weight: 500;
	user-select: none;

	/* Sizing presets */
	&[data-size='sm'] {
		font-size: 0.875rem;
		gap: 0.25rem;
	}

	&[data-size='md'] {
		font-size: 1rem;
		gap: 0.375rem;
	}

	&[data-size='lg'] {
		font-size: 1.25rem;
		gap: 0.5rem;
		font-weight: 600;
	}

	/* Paused visual state */
	&[data-paused='true'] {
		opacity: 0.65;
	}

	/* Child slot nesting per Minimal Exports Principle */
	> [data-slot='icon'] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: ${themeColor('text-2')};
	}

	> [data-slot='digits'] {
		display: inline-block;
	}
`;
