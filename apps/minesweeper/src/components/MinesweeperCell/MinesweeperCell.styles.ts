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
	padding: 0;
	margin: 0;
	border: none;
	border-radius: clamp(2px, 0.5vmin, 4px);
	font-family: inherit;
	font-size: clamp(0.75rem, min(3.5vw, 3.5vh), 1.25rem);
	font-weight: 700;
	line-height: 1;
	user-select: none;
	touch-action: manipulation;
	cursor: pointer;
	transition: background-color 150ms ease, box-shadow 150ms ease, transform 100ms ease;

	&:focus-visible {
		outline: 3px solid var(--color-interactive-primary, #6366f1);
		outline-offset: 2px;
		z-index: 2;
	}

	&[disabled] {
		cursor: default;
	}

	/* Unexplored state - tactile 3D button */
	&.unexplored {
		background: var(--color-container-2, #e5e7eb);
		color: var(--color-text-1, #111827);
		box-shadow:
			inset 1px 1px 0 rgba(255, 255, 255, 0.6),
			inset -1px -1px 0 rgba(0, 0, 0, 0.2),
			0 2px 4px rgba(0, 0, 0, 0.1);

		&:hover:not([disabled]) {
			background: var(--color-container-3, #d1d5db);
		}

		&:active:not([disabled]) {
			transform: scale(0.96);
			box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.25);
		}
	}

	/* Revealed state - flat inset */
	&.revealed {
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-container-2, #e5e7eb);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
		cursor: default;

		&.number-1 { color: #1976d2; }
		&.number-2 { color: #388e3c; }
		&.number-3 { color: #d32f2f; }
		&.number-4 { color: #303f9f; }
		&.number-5 { color: #7b1fa2; }
		&.number-6 { color: #00796b; }
		&.number-7 { color: #512da8; }
		&.number-8 { color: #e65100; }
	}

	/* Flagged state */
	&.flagged {
		background: var(--color-container-2, #e5e7eb);
		color: var(--color-accent, #ef4444);
		box-shadow:
			inset 1px 1px 0 rgba(255, 255, 255, 0.6),
			inset -1px -1px 0 rgba(0, 0, 0, 0.2);
	}

	/* Questioned state */
	&.questioned {
		background: var(--color-container-2, #e5e7eb);
		color: var(--color-text-2, #4b5563);
		box-shadow:
			inset 1px 1px 0 rgba(255, 255, 255, 0.6),
			inset -1px -1px 0 rgba(0, 0, 0, 0.2);
	}

	/* Detonated state - explosive red/orange gradient */
	&.detonated {
		background: radial-gradient(circle, #fde047 20%, #f97316 60%, #dc2626 100%);
		color: #ffffff;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
		animation: detonate-pulse 300ms ease-out;
	}

	/* Revealed mine on game over */
	&.revealed-mine {
		background: var(--color-container-3, #fecaca);
		color: #991b1b;
		border: 1px solid #f87171;
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
