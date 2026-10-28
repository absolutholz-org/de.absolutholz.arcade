import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const ControlsContainer = styled.div`
	width: 100%;
	max-width: min(calc(100vw - 1.5rem), calc(100vh - 16rem), 36rem);
	margin: 0.75rem auto 0;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
`;

export const MainBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 0.5rem;
`;

export const ActionButtonGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 0.375rem;
`;

export const ActionButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.4rem 0.625rem;
	min-width: 2.375rem;
	height: 2.375rem;
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-md);
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	font-size: 0.8125rem;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 150ms ease, opacity 150ms ease, color 150ms ease;

	&[data-icon-only='true'] {
		padding: 0;
		width: 2.375rem;
	}

	&:hover:not(:disabled) {
		background-color: ${themeColor('container-1')};
		color: ${themeColor('accent')};
	}

	&:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}
`;
