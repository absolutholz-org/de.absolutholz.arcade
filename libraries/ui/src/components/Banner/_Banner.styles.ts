import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

export const Banner_Root = styled.div`
	container-type: inline-size;
	width: 100%;
`;

export const Banner_Container = styled.div`
	background-color: ${themeColor('surface')};
	border: 1px solid ${themeColor('container-2')};
	border-left: 4px solid var(--banner-accent-color);
	border-radius: ${radiusScale.lg};
	box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.12);
	color: ${themeColor('text-1')};
	display: flex;
	flex-direction: column;
	font-size: 1rem;
	gap: ${space('md')};
	padding: ${space('sm')} ${space('md')};

	&[data-variant='success'] {
		--banner-accent-color: light-dark(oklch(0.55 0.18 145), oklch(0.7 0.18 145));
	}

	&[data-variant='info'] {
		--banner-accent-color: light-dark(oklch(0.55 0.18 245), oklch(0.7 0.18 245));
	}

	&[data-variant='warning'] {
		--banner-accent-color: light-dark(oklch(0.65 0.18 75), oklch(0.78 0.18 75));
	}

	&[data-variant='danger'] {
		--banner-accent-color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
	}

	@container (min-width: 40em) {
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const Banner_Content = styled.div``;

export const Banner_Status = styled.div`
	align-items: center;
	color: var(--banner-accent-color);
	display: flex;
	gap: ${space('xs')};
	margin-bottom: ${space('sm')};
`;

export const Banner_StatusLabel = styled.span`
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.05em;
	text-transform: uppercase;
`;

export const Banner_Message = styled.div`
	max-width: 70ch;
	line-height: 1.5;
`;

export const Banner_Actions = styled.div`
	align-self: flex-end;
	flex-shrink: 0;

	@container (min-width: 40em) {
		align-self: center;
	}
`;
