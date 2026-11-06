import { css } from '@linaria/core';

export const tubeContainer = css`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	width: clamp(2.2rem, 7.5vw, 4.25rem);
	height: clamp(8.8rem, 30vw, 17rem);
	aspect-ratio: 1 / 4;
	padding: 0;
	margin: 0;
	background: transparent;
	border: none;
	cursor: pointer;
	outline: none;
	user-select: none;
	-webkit-tap-highlight-color: transparent;
	transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);

	&:focus-visible {
		outline: 0.1875rem solid var(--color-focus-ring, #4dabf7);
		outline-offset: 0.25rem;
		border-radius: 0.5rem;
	}

	&[data-selected="true"] {
		transform: translateY(-1.25rem);

		.lip {
			border-color: var(--color-primary-base, #228be6);
			box-shadow: 0 0 0.75rem var(--color-primary-glow, rgba(34, 139, 230, 0.45));
		}

		.tubeBody {
			border-color: var(--color-primary-base, #228be6);
			box-shadow: 0 0 1rem var(--color-primary-glow, rgba(34, 139, 230, 0.45)),
				inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.2);
		}
	}

	&:hover:not([disabled]) {
		.lip,
		.tubeBody {
			border-color: var(--color-primary-base, #228be6);
		}
	}

	&[data-complete="true"] {
		.lip,
		.tubeBody {
			border-color: var(--color-success-base, #40c057);
			box-shadow: 0 0 0.75rem rgba(64, 192, 87, 0.3);
		}
	}
`;

export const lip = css`
	position: absolute;
	top: 0;
	left: -0.25rem;
	right: -0.25rem;
	height: 0.375rem;
	border: 0.1875rem solid var(--color-border-strong, light-dark(#495057, #ced4da));
	border-radius: 0.25rem;
	background: var(--color-surface, light-dark(#ffffff, #1e1e1e));
	z-index: 3;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	transition: border-color 0.2s ease, box-shadow 0.2s ease;
`;

export const tubeBody = css`
	position: relative;
	width: 100%;
	height: calc(100% - 0.25rem);
	margin-top: 0.25rem;
	display: flex;
	flex-direction: column-reverse;
	align-items: stretch;
	justify-content: flex-start;
	background: var(--color-surface-subtle, light-dark(rgba(248, 249, 250, 0.8), rgba(26, 29, 32, 0.8)));
	border: 0.1875rem solid var(--color-border-strong, light-dark(#495057, #ced4da));
	border-top: none;
	border-radius: 0 0 9999px 9999px;
	overflow: hidden;
	box-shadow: inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.15), 0 0.25rem 0.5rem rgba(0, 0, 0, 0.08);
	transition: border-color 0.2s ease, box-shadow 0.2s ease;

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0.25rem;
		bottom: 1.5rem;
		width: 0.25rem;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.05));
		border-radius: 9999px;
		pointer-events: none;
		z-index: 2;
	}
`;

export const segment = css`
	position: relative;
	width: 100%;
	height: 25%;
	flex-shrink: 0;
	margin: 0;
	padding: 0;
	border: none;
	border-radius: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.2);

	&[data-fluid="true"] {
		transition: height 0.25s ease-out;
	}

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: rgba(255, 255, 255, 0.25);
		pointer-events: none;
		z-index: 1;
	}

	svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.45;
		pointer-events: none;
		z-index: 1;
	}
`;
