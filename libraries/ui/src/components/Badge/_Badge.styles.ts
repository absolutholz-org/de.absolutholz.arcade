import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Badge = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	line-height: 1.2;
	border-radius: ${radiusScale.pill};
	border: 1px solid transparent;
	white-space: nowrap;
	user-select: none;
	vertical-align: middle;

	/* Sizing presets */
	&[data-size='sm'] {
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		gap: 0.25rem;
	}

	&[data-size='md'] {
		padding: 0.25rem 0.75rem;
		font-size: 0.8125rem;
		gap: 0.375rem;
	}

	/* Neutral variant */
	&[data-variant='neutral'] {
		background-color: ${themeColor('container-2')};
		color: ${themeColor('text-2')};
		border-color: ${themeColor('container-2')};
	}

	/* Success variant */
	&[data-variant='success'] {
		background-color: oklch(0.7 0.16 145 / 0.15);
		color: oklch(0.65 0.18 145);
		border-color: oklch(0.7 0.16 145 / 0.3);
	}

	/* Accent variant */
	&[data-variant='accent'] {
		background-color: oklch(from ${themeColor('accent')} l c h / 0.15);
		color: ${themeColor('accent')};
		border-color: oklch(from ${themeColor('accent')} l c h / 0.3);
	}

	/* Outline variant */
	&[data-variant='outline'] {
		background-color: transparent;
		color: ${themeColor('text-1')};
		border-color: ${themeColor('container-2')};
	}

	> span[data-slot='icon'] {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		line-height: 1;

		> svg {
			width: 0.875em;
			height: 0.875em;
		}
	}

	> span[data-slot='label'] {
		display: inline-flex;
		align-items: center;
		line-height: inherit;
	}
`;
