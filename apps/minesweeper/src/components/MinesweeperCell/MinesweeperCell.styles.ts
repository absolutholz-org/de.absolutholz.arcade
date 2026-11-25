import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { styled } from '@linaria/react';

export const CellButton = styled.button`
	position: relative;
	width: 100%;
	height: 100%;
	min-width: 0;
	min-height: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: clamp(2px, 0.5vmin, 4px);
	font-size: clamp(0.75rem, min(3.5vw, 3.5vh), 1.25rem);
	font-weight: 700;
	line-height: 1;
	user-select: none;
	touch-action: manipulation;
	transition: background-color 150ms ease, box-shadow 150ms ease, transform 100ms ease;

	&:focus-visible {
		outline: 3px solid ${themeColor('accent')};
		outline-offset: 2px;
		z-index: 2;
	}

	&[disabled] {
		cursor: default;
	}

	/* Unexplored state - tactile 3D button */
	&.unexplored {
		background: ${themeColor('container-2')};
		color: ${themeColor('text-1')};
		box-shadow:
			inset 1px 1px 0 oklch(1 0 0 / 0.35),
			inset -1px -1px 0 oklch(0 0 0 / 0.2),
			0 2px 4px oklch(0 0 0 / 0.1);

		&:hover:not([disabled]) {
			background: color-mix(in oklch, ${themeColor('container-2')} 88%, ${themeColor('text-1')});
		}

		&:active:not([disabled]) {
			transform: scale(0.96);
			box-shadow: inset 1px 1px 2px oklch(0 0 0 / 0.25);
		}
	}

	/* Revealed state - flat inset */
	&.revealed {
		background: ${themeColor('surface')};
		border: 1px solid ${themeColor('container-2')};
		box-shadow: inset 0 1px 2px oklch(0 0 0 / 0.06);
		cursor: default;

		&.number-1 { color: ${themeColor('rainbow-2')}; }
		&.number-2 { color: ${themeColor('rainbow-3')}; }
		&.number-3 { color: ${themeColor('rainbow-1')}; }
		&.number-4 { color: ${themeColor('rainbow-10')}; }
		&.number-5 { color: ${themeColor('rainbow-5')}; }
		&.number-6 { color: ${themeColor('rainbow-6')}; }
		&.number-7 { color: ${themeColor('rainbow-8')}; }
		&.number-8 { color: ${themeColor('rainbow-7')}; }
	}

	/* Flagged state */
	&.flagged {
		background: ${themeColor('container-2')};
		color: ${themeColor('accent')};
		box-shadow:
			inset 1px 1px 0 oklch(1 0 0 / 0.35),
			inset -1px -1px 0 oklch(0 0 0 / 0.2);
	}

	/* Questioned state */
	&.questioned {
		background: ${themeColor('container-2')};
		color: ${themeColor('text-2')};
		box-shadow:
			inset 1px 1px 0 oklch(1 0 0 / 0.35),
			inset -1px -1px 0 oklch(0 0 0 / 0.2);
	}

	/* Detonated state - explosive red/orange gradient */
	&.detonated {
		background: radial-gradient(circle, ${themeColor('rainbow-4')} 20%, ${themeColor('rainbow-7')} 60%, ${themeColor('status-danger')} 100%);
		color: oklch(from ${themeColor('status-danger')} clamp(0.12, (0.62 - l) * 100, 0.98) 0.02 h);
		box-shadow: inset 0 2px 4px oklch(0 0 0 / 0.4);
		animation: detonate-pulse 300ms ease-out;
	}

	/* Revealed mine on game over */
	&.revealed-mine {
		background: color-mix(in oklch, ${themeColor('status-danger')} 16%, ${themeColor('surface')});
		color: ${themeColor('status-danger')};
		border: 1px solid color-mix(in oklch, ${themeColor('status-danger')} 55%, ${themeColor('surface')});
	}

	@keyframes detonate-pulse {
		0% { transform: scale(0.85); }
		50% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}
`;

export const IconWrapper = styled.span`
	width: 65%;
	height: 65%;
	max-width: 1.5rem;
	max-height: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		width: 100%;
		height: 100%;
	}
`;
