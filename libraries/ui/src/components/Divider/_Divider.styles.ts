import { styled } from '@linaria/react';
import { themeColor } from '../../styles/theme/theme.utils';

const BaseDivider = styled.div`
	width: 100%;

	&[data-hide-on-desktop='true'] {
		@media (min-width: 1024px) {
			display: none;
		}
	}
`;

export const Divider = styled(BaseDivider)`
	border: 0;
	border-top: 1px solid ${themeColor('container-2')};
	height: 0;
`;

export const Labeled = styled(BaseDivider)`
	align-items: center;
	border: 0;
	display: flex;

	&::before,
	&::after {
		border-top: 1px solid ${themeColor('container-2')};
		content: '';
		flex: 1;
	}

	> span {
		color: ${themeColor('text-2')};
		display: inline-flex;
		font-size: var(--font-size-small);
		line-height: var(--line-height-small);
		padding-inline: var(--space-md);
		white-space: nowrap;
	}
`;
