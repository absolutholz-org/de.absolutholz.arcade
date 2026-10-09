import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const Breadcrumb = styled.nav`
	align-items: center;
	display: flex;
	font-size: 0.9375rem;
	line-height: 1.5;

	> ol {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		margin: 0;
		padding: 0;
		row-gap: 0.25rem;
	}

	li {
		align-items: center;
		display: inline-flex;
	}

	a,
	span[data-current='true'] {
		align-items: center;
		border-radius: ${radiusScale.sm};
		display: inline-flex;
		min-height: 24px;
		text-decoration: none;
		transition: color 120ms ease, opacity 120ms ease;
	}

	a {
		color: ${themeColor('text-2')};

		&:hover {
			color: ${themeColor('accent')};
		}

		&:focus-visible {
			outline: 2px solid ${themeColor('accent')};
			outline-offset: 2px;
		}
	}

	span[data-current='true'] {
		color: ${themeColor('text-1')};
		cursor: default;
		font-weight: 600;
	}

	a[data-home='true'] {
		align-items: center;
		display: inline-flex;
		line-height: 1;

		&:hover {
			opacity: 0.85;
		}
	}

	[data-separator='true'] {
		align-items: center;
		color: ${themeColor('text-3')};
		display: inline-flex;
		flex-shrink: 0;
		justify-content: center;
		margin-inline: 0.5rem;
		user-select: none;
	}
`;
