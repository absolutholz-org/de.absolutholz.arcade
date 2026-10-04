import { styled } from '@linaria/react';

export const Divider = styled.div`
	align-items: center;
	border: 0;
	display: flex;
	margin: 0;
	width: 100%;

	&::before,
	&::after {
		border-top: 1px solid var(--color-container-2);
		content: '';
		flex: 1;
	}

	&[data-hide-on-desktop='true'] {
		@media (min-width: 1024px) {
			display: none;
		}
	}
`;

export const Content = styled.span`
	color: var(--color-text-2);
	display: inline-flex;
	font-size: var(--font-size-small);
	line-height: var(--line-height-small);
	padding-inline: var(--space-md);
	white-space: nowrap;
`;
