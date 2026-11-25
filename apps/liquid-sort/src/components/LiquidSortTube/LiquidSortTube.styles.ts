import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
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
		outline: 0.1875rem solid ${themeColor('accent')};
		outline-offset: 0.25rem;
		border-radius: 0.5rem;
	}

	&[data-selected="true"] {
		transform: translateY(-1.25rem);

		.lip {
			border-color: ${themeColor('accent')};
			box-shadow: 0 0 0.75rem oklch(from ${themeColor('accent')} l c h / 0.45);
		}

		.tubeBody {
			border-color: ${themeColor('accent')};
			box-shadow: 0 0 1rem oklch(from ${themeColor('accent')} l c h / 0.45),
				inset 0 0.125rem 0.25rem oklch(1 0 0 / 0.2);
		}
	}

	&:hover:not([disabled]) {
		.lip,
		.tubeBody {
			border-color: ${themeColor('accent')};
		}
	}

	&[data-complete="true"] {
		.lip,
		.tubeBody {
			border-color: ${themeColor('status-success')};
			box-shadow: 0 0 0.75rem oklch(from ${themeColor('status-success')} l c h / 0.3);
		}
	}
`;

export const lip = css`
	position: absolute;
	top: 0;
	left: -0.25rem;
	right: -0.25rem;
	height: 0.375rem;
	border: 0.1875rem solid ${themeColor('text-2')};
	border-radius: 0.25rem;
	background: ${themeColor('surface')};
	z-index: 3;
	box-shadow: 0 1px 2px oklch(0 0 0 / 0.1);
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
	background: color-mix(in oklch, ${themeColor('container-1')} 80%, transparent);
	border: 0.1875rem solid ${themeColor('text-2')};
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
	background-color: ${themeColor('text-3')};
	color: oklch(from ${themeColor('text-3')} clamp(0.12, (0.62 - l) * 100, 0.98) 0.02 h);
	box-shadow: inset 0 2px 4px oklch(1 0 0 / 0.35), inset 0 -2px 4px oklch(0 0 0 / 0.2);

	&[data-color='0'] { --seg-color: ${themeColor('rainbow-1')}; }
	&[data-color='1'] { --seg-color: ${themeColor('rainbow-2')}; }
	&[data-color='2'] { --seg-color: ${themeColor('rainbow-3')}; }
	&[data-color='3'] { --seg-color: ${themeColor('rainbow-4')}; }
	&[data-color='4'] { --seg-color: ${themeColor('rainbow-5')}; }
	&[data-color='5'] { --seg-color: ${themeColor('rainbow-6')}; }
	&[data-color='6'] { --seg-color: ${themeColor('rainbow-7')}; }
	&[data-color='7'] { --seg-color: ${themeColor('rainbow-8')}; }
	&[data-color='8'] { --seg-color: ${themeColor('rainbow-9')}; }
	&[data-color='9'] { --seg-color: ${themeColor('rainbow-10')}; }

	&[data-color] {
		background-color: var(--seg-color, ${themeColor('text-3')});
		color: oklch(from var(--seg-color, ${themeColor('text-3')}) clamp(0.12, (0.62 - l) * 100, 0.98) 0.02 h);
	}

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
