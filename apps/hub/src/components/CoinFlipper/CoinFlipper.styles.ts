import { css } from '@linaria/core';

export const Container = css`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding-bottom: 2rem;
`;

export const Toolbar = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
`;

export const ToolbarGroup = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
`;

export const StageCard = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.25rem;
	padding: 1.5rem;
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	border-radius: 1rem;
`;

export const BatchControls = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
`;

export const StepperGroup = css`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.25rem;
	background-color: var(--color-container-1);
	border: 1px solid var(--color-container-2);
	border-radius: 0.625rem;
`;

export const StepperValue = css`
	min-width: 2.25rem;
	text-align: center;
	font-weight: 700;
	font-size: 0.9375rem;
	font-variant-numeric: tabular-nums;
	color: var(--color-text-1);
`;

export const SummaryPill = css`
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.375rem 0.875rem;
	border-radius: 9999px;
	background-color: var(--color-container-1);
	border: 1px solid var(--color-container-2);
	color: var(--color-text-1);
	font-size: 0.9375rem;
	font-weight: 600;
`;

export const SingleStage = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem 0;
`;

export const BatchGrid = css`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(5.25rem, 1fr));
	justify-items: center;
	gap: 1rem;
	width: 100%;
	padding: 0.5rem 0;
`;

export const CoinButton = css`
	appearance: none;
	background: transparent;
	border: none;
	padding: 0.25rem;
	margin: 0;
	cursor: pointer;
	border-radius: 9999px;
	min-width: 44px;
	min-height: 44px;
	perspective: 800px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: transform 120ms ease;

	&:hover:not(:disabled) {
		transform: translateY(-2px);
	}

	&:active:not(:disabled) {
		transform: scale(0.97);
	}

	&:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: 4px;
	}

	&:disabled {
		cursor: default;
	}

	@media (prefers-reduced-motion: reduce) {
		&:hover:not(:disabled),
		&:active:not(:disabled) {
			transform: none;
		}
	}
`;

export const CoinRotor = css`
	position: relative;
	width: 8.5rem;
	height: 8.5rem;
	transform-style: preserve-3d;
	will-change: transform;

	&[data-size='sm'] {
		width: 4.75rem;
		height: 4.75rem;
	}

	&[data-face='heads'] {
		transform: rotateY(0deg);
	}

	&[data-face='tails'] {
		transform: rotateY(180deg);
	}

	&[data-flipping='true'][data-face='heads'][data-spin='a'] {
		animation: coinFlipHeadsA 620ms cubic-bezier(0.22, 0.88, 0.32, 1) forwards;
	}

	&[data-flipping='true'][data-face='heads'][data-spin='b'] {
		animation: coinFlipHeadsB 620ms cubic-bezier(0.22, 0.88, 0.32, 1) forwards;
	}

	&[data-flipping='true'][data-face='tails'][data-spin='a'] {
		animation: coinFlipTailsA 620ms cubic-bezier(0.22, 0.88, 0.32, 1) forwards;
	}

	&[data-flipping='true'][data-face='tails'][data-spin='b'] {
		animation: coinFlipTailsB 620ms cubic-bezier(0.22, 0.88, 0.32, 1) forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		&[data-flipping='true'][data-face='heads'][data-spin='a'],
		&[data-flipping='true'][data-face='heads'][data-spin='b'] {
			animation: coinReducedHeads 150ms ease-out forwards;
		}

		&[data-flipping='true'][data-face='tails'][data-spin='a'],
		&[data-flipping='true'][data-face='tails'][data-spin='b'] {
			animation: coinReducedTails 150ms ease-out forwards;
		}
	}

	@keyframes coinFlipHeadsA {
		0% {
			transform: rotateY(0deg) scale(1);
		}
		45% {
			transform: rotateY(540deg) scale(1.08);
		}
		100% {
			transform: rotateY(1080deg) scale(1);
		}
	}

	@keyframes coinFlipHeadsB {
		0% {
			transform: rotateY(0deg) scale(1);
		}
		45% {
			transform: rotateY(540deg) scale(1.08);
		}
		100% {
			transform: rotateY(1080deg) scale(1);
		}
	}

	@keyframes coinFlipTailsA {
		0% {
			transform: rotateY(0deg) scale(1);
		}
		45% {
			transform: rotateY(630deg) scale(1.08);
		}
		100% {
			transform: rotateY(1260deg) scale(1);
		}
	}

	@keyframes coinFlipTailsB {
		0% {
			transform: rotateY(0deg) scale(1);
		}
		45% {
			transform: rotateY(630deg) scale(1.08);
		}
		100% {
			transform: rotateY(1260deg) scale(1);
		}
	}

	@keyframes coinReducedHeads {
		0% {
			opacity: 0.45;
			transform: rotateY(0deg) scale(0.92);
		}
		100% {
			opacity: 1;
			transform: rotateY(0deg) scale(1);
		}
	}

	@keyframes coinReducedTails {
		0% {
			opacity: 0.45;
			transform: rotateY(180deg) scale(0.92);
		}
		100% {
			opacity: 1;
			transform: rotateY(180deg) scale(1);
		}
	}
`;

export const CoinFaceLayer = css`
	position: absolute;
	inset: 0;
	backface-visibility: hidden;
	display: flex;
	align-items: center;
	justify-content: center;

	&[data-side='tails'] {
		transform: rotateY(180deg);
	}

	svg {
		width: 100%;
		height: 100%;
		display: block;
	}
`;

export const ResultLabel = css`
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--color-text-1);
	letter-spacing: 0.01em;
`;

export const HintText = css`
	font-size: 0.875rem;
	color: var(--color-text-2);
	text-align: center;
`;

export const ActionRow = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
`;

export const HistorySection = css`
	display: flex;
	flex-direction: column;
	gap: 0.625rem;
	padding: 1rem 1.25rem;
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	border-radius: 0.875rem;
`;

export const HistoryHeader = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
`;

export const HistoryTitle = css`
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--color-text-2);
	margin: 0;
`;

export const HistoryStrip = css`
	display: flex;
	align-items: center;
	gap: 0.4375rem;
	overflow-x: auto;
	padding: 0.25rem 0;
	scrollbar-width: thin;
`;

export const HistoryPill = css`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	min-width: 2rem;
	height: 2rem;
	padding: 0 0.5rem;
	border-radius: 9999px;
	font-size: 0.8125rem;
	font-weight: 700;
	border: 1px solid var(--color-container-2);

	&[data-face='heads'] {
		background-color: oklch(0.92 0.06 78);
		color: oklch(0.32 0.08 55);
		border-color: oklch(0.76 0.1 72);
	}

	&[data-face='tails'] {
		background-color: oklch(0.91 0.03 240);
		color: oklch(0.3 0.05 245);
		border-color: oklch(0.74 0.05 240);
	}
`;

export const EmptyHistory = css`
	font-size: 0.875rem;
	color: var(--color-text-2);
`;

export const LiveRegion = css`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
`;
