import { css } from '@linaria/core';

export const ToolHeader = css`
	width: min(100%, 34rem);
	margin-inline: auto;
`;

export const Arena = css`
	position: relative;
	width: min(100%, 34rem);
	margin-inline: auto;
	height: clamp(18rem, 50svh, 28rem);
	background: var(--color-container-1);
	border: 0.125rem dashed var(--color-container-2);
	border-radius: 1.5rem;
	overflow: hidden;
	touch-action: none;
	user-select: none;
	-webkit-touch-callout: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: inset 0 0.125rem 0.5rem oklch(0 0 0 / 0.05);

	&:focus-visible {
		outline: 0.1875rem solid var(--color-accent);
		outline-offset: 0.25rem;
	}
`;

export const ArenaHint = css`
	text-align: center;
	padding: 1.25rem;
	pointer-events: none;
	color: var(--color-text-2);

	h3 {
		margin: 0 0 0.5rem;
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--color-text-1);
	}

	p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.4;
	}
`;

export const TouchRing = css`
	position: absolute;
	width: 5.75rem;
	height: 5.75rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	transform: translate(-50%, -50%) scale(1);
	transition: transform 0.15s ease-out;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const TouchBadge = css`
	position: absolute;
	top: -0.75rem;
	right: -0.75rem;
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	background: var(--color-surface);
	color: var(--color-text-1);
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 800;
	font-size: 0.95rem;
	border: 0.125rem solid var(--color-text-1);
	box-shadow: 0 0.125rem 0.375rem oklch(0 0 0 / 0.15);
`;

export const CountdownSvg = css`
	position: absolute;
	inset: 0;
	transform: rotate(-90deg);
`;

export const CountdownCircle = css`
	fill: none;
	stroke-linecap: round;
	transition: stroke-dashoffset 0.05s linear;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const FallbackSection = css`
	width: min(100%, 34rem);
	margin-inline: auto;
	background: var(--color-surface);
	border: 0.0625rem solid var(--color-container-2);
	border-radius: 1rem;
	padding: 1rem;
`;

export const DividerWrap = css`
	width: min(100%, 34rem);
	margin-inline: auto;
`;

export const FallbackLabel = css`
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--color-text-2);
`;

export const CompassBoard = css`
	position: relative;
	width: min(100%, 21rem);
	margin-inline: auto;
	aspect-ratio: 1 / 1;
	border-radius: 50%;
	background: var(--color-container-1);
	border: 0.125rem solid var(--color-container-2);
	box-shadow: inset 0 0.125rem 0.75rem oklch(0 0 0 / 0.05), 0 0.5rem 1.5rem oklch(0 0 0 / 0.06);
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const DialRingSvg = css`
	position: absolute;
	inset: 0;
	pointer-events: none;
`;

export const CompassNeedle = css`
	position: absolute;
	inset: 0;
	pointer-events: none;
	transform-origin: 50% 50%;
	transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	z-index: 5;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const CompassDial = css`
	position: relative;
	width: 36%;
	height: 36%;
	border-radius: 50%;
	background: var(--color-surface);
	border: 0.15rem solid var(--color-container-2);
	box-shadow: 0 0.25rem 1rem oklch(0 0 0 / 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	touch-action: manipulation;
	transition: transform 0.15s ease, box-shadow 0.15s ease;
	z-index: 3;
	padding: 0.25rem;

	&:hover {
		transform: scale(1.04);
		box-shadow: 0 0.375rem 1.25rem oklch(0 0 0 / 0.18);
	}

	&:active {
		transform: scale(0.96);
	}

	&:focus-visible {
		outline: 0.1875rem solid var(--color-accent);
		outline-offset: 0.25rem;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
		&:hover,
		&:active {
			transform: none;
		}
	}
`;

export const DialContent = css`
	text-align: center;
	pointer-events: none;
`;

export const DialTurnNumber = css`
	display: block;
	font-size: clamp(0.85rem, 3vw, 1.1rem);
	font-weight: 800;
	color: var(--color-text-1);
	line-height: 1.15;
`;

export const DialActiveIcon = css`
	display: block;
	font-size: clamp(0.9rem, 3vw, 1.15rem);
	line-height: 1;
	margin-top: 0.15rem;
`;

export const SeatNode = css`
	position: absolute;
	width: clamp(2.5rem, 15%, 3.1rem);
	height: clamp(2.5rem, 15%, 3.1rem);
	transform: translate(-50%, -50%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--color-surface);
	border: 0.15rem solid var(--color-container-2);
	box-shadow: 0 0.1875rem 0.5rem oklch(0 0 0 / 0.12);
	transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
	z-index: 2;

	&[data-active='true'] {
		transform: translate(-50%, -50%) scale(1.2);
		border-width: 0.22rem;
		box-shadow: 0 0 0 0.3rem color-mix(in oklch, var(--color-accent) 22%, transparent),
			0 0.375rem 1rem oklch(0 0 0 / 0.22);
		z-index: 4;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
		&[data-active='true'] {
			transform: translate(-50%, -50%) scale(1.1);
		}
	}
`;

export const SeatShapeIcon = css`
	font-size: clamp(1rem, 3.5vw, 1.3rem);
	line-height: 1;
`;

export const SeatRankBadge = css`
	position: absolute;
	bottom: -0.35rem;
	right: -0.35rem;
	min-width: 1.15rem;
	height: 1.15rem;
	border-radius: 9999px;
	background: var(--color-accent);
	color: var(--color-accent-contrast);
	font-size: 0.625rem;
	font-weight: 800;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 0.2rem;
	border: 0.1rem solid var(--color-surface);
`;

export const CompassToolbar = css`
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5rem;

	@media (max-width: 36rem) {
		button {
			flex-direction: column;
			gap: 0.25rem;
			height: auto;
			min-height: 3rem;
			padding: 0.45rem 0.75rem;
			line-height: 1.15;
		}
	}
`;

export const TurnQueueSection = css`
	width: min(100%, 34rem);
	margin-inline: auto;
`;

export const SectionHeading = css`
	margin: 0 0 0.5rem;
	font-size: 0.95rem;
	font-weight: 700;
	color: var(--color-text-2);
`;

export const TurnQueueGrid = css`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
	gap: 0.5rem;
	list-style: none;
	padding: 0;
	margin: 0;
`;

export const TurnQueueItem = css`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	border-radius: 0.75rem;
	background: var(--color-surface);
	border: 0.125rem solid var(--color-container-2);
	transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
	min-width: 0;

	&[data-active='true'] {
		box-shadow: 0 0.1875rem 0.625rem oklch(0 0 0 / 0.1);
	}
`;

export const TurnQueueBadge = css`
	width: 1.75rem;
	height: 1.75rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.95rem;
	flex-shrink: 0;
	background: var(--color-container-1);
`;

export const TurnQueueName = css`
	font-size: 0.875rem;
	font-weight: 700;
	color: var(--color-text-1);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	min-width: 0;
`;

export const TurnQueueRank = css`
	font-size: 0.75rem;
	font-weight: 800;
	padding: 0.125rem 0.4rem;
	border-radius: 9999px;
	color: var(--color-surface);
	flex-shrink: 0;
`;

export const NamingShapeBadge = css`
	width: 2.75rem;
	height: 2.75rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	flex-shrink: 0;
	border: 0.125rem solid;
`;

export const NamingFieldWrap = css`
	flex: 1;
	min-width: 0;
`;
