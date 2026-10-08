import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardContainer = styled.div`
	position: relative;
	width: 100%;
	max-width: min(calc(100vw - 1rem), calc(100vh - 16rem), 34rem);
	aspect-ratio: 1 / 1;
	margin: 0 auto;

	@media (min-width: 640px) {
		max-width: min(calc(100vw - 2rem), calc(100vh - 14rem), 34rem);
	}
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 1fr);
	gap: 2px;
	border: 2px solid ${themeColor('text-2')};
	border-radius: var(--radius-sm);
	background-color: ${themeColor('text-2')};
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	touch-action: manipulation;
`;

export const BlockContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(3, 1fr);
	gap: 1px;
	background-color: ${themeColor('container-2')};

	&[data-active-block='true'] {
		position: relative;
		z-index: 2;
	}

	&:nth-child(1) {
		border-top-left-radius: calc(var(--radius-sm) - 2px);
	}

	&:nth-child(3) {
		border-top-right-radius: calc(var(--radius-sm) - 2px);
	}

	&:nth-child(7) {
		border-bottom-left-radius: calc(var(--radius-sm) - 2px);
	}

	&:nth-child(9) {
		border-bottom-right-radius: calc(var(--radius-sm) - 2px);
	}

	&:nth-child(1) > :first-child {
		border-top-left-radius: calc(var(--radius-sm) - 2px);
	}

	&:nth-child(3) > :nth-child(3) {
		border-top-right-radius: calc(var(--radius-sm) - 2px);
	}

	&:nth-child(7) > :nth-child(7) {
		border-bottom-left-radius: calc(var(--radius-sm) - 2px);
	}

	&:nth-child(9) > :last-child {
		border-bottom-right-radius: calc(var(--radius-sm) - 2px);
	}
`;
