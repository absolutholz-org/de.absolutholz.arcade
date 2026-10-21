import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const BoardWrapper = styled.div`
	position: relative;
	width: 100%;
	max-width: min(calc(100vw - 1.5rem), calc(100vh - 18rem), 36rem);
	aspect-ratio: 1 / 1;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	touch-action: manipulation;
`;

export const BoardSurface = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	display: grid;
	gap: clamp(0.125rem, 1vw, 0.375rem);
	padding: clamp(0.75rem, 2.5vw, 1.25rem);
	background: ${themeColor('container-1')};
	border: 2px solid ${themeColor('container-2')};
	border-radius: 1.25rem;
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.12);
`;

export const CellButton = styled.button`
	position: relative;
	appearance: none;
	background: transparent;
	border: none;
	padding: 0;
	margin: 0;
	cursor: default;
	outline: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-width: 0;
	min-height: 0;
	border-radius: 50%;
	transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.15s ease;

	/* Sunken hole socket */
	&::before {
		content: '';
		position: absolute;
		width: 48%;
		height: 48%;
		border-radius: 50%;
		background: ${themeColor('surface')};
		border: 1px solid ${themeColor('container-2')};
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.35);
		transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
	}

	/* Tactile 3D marble peg */
	&[data-has-peg='true']::after {
		content: '';
		position: absolute;
		width: 82%;
		height: 82%;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 35%, #f87171, #dc2626 65%, #991b1b 100%);
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5);
		transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.15s ease;
	}

	&[data-has-peg='true'] {
		cursor: pointer;
	}

	&[data-has-peg='true']:hover::after {
		transform: scale(1.06);
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.6);
	}

	&[data-selected='true']::after {
		background: radial-gradient(circle at 35% 35%, #fca5a5, #ef4444 65%, #b91c1c 100%);
		box-shadow: 0 0 0 3px var(--color-focus-ring, #3b82f6), 0 6px 14px rgba(0, 0, 0, 0.45);
		transform: scale(1.14);
	}

	&[data-valid-target='true'] {
		cursor: pointer;
	}

	&[data-valid-target='true']::before {
		background: rgba(16, 185, 129, 0.25);
		border-color: #10b981;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 0 2px #10b981, 0 0 8px rgba(16, 185, 129, 0.4);
		transform: scale(1.15);
	}

	&:disabled {
		cursor: default;
		pointer-events: none;
	}

	&:focus-visible {
		box-shadow: 0 0 0 2px var(--color-focus-ring, #3b82f6);
	}
`;
