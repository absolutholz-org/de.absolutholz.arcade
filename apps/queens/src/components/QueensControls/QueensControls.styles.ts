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
	gap: 0.5rem;
`;

export const ModeToggleGroup = styled.div`
	display: flex;
	align-items: center;
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-md);
	padding: 0.25rem;
	gap: 0.25rem;
`;

export const ModeButton = styled.button`
	display: flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.4rem 0.75rem;
	border: none;
	border-radius: var(--radius-sm);
	font-size: 0.875rem;
	font-weight: 500;
	background: transparent;
	color: ${themeColor('text-2')};
	cursor: pointer;
	transition: background-color 150ms ease, color 150ms ease, box-shadow 150ms ease;

	&[data-active='true'] {
		background-color: ${themeColor('surface')};
		color: ${themeColor('accent')};
		font-weight: 600;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
	}

	&:focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 1px;
	}
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
	width: 2.375rem;
	height: 2.375rem;
	padding: 0;
	border: 1px solid ${themeColor('container-2')};
	border-radius: var(--radius-md);
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	cursor: pointer;
	transition: background-color 150ms ease, opacity 150ms ease, color 150ms ease;

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

export const HelperRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.25rem 0.5rem;
	font-size: 0.8125rem;
	color: ${themeColor('text-2')};
`;
