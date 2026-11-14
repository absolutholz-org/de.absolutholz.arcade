import { styled } from '@linaria/react';
import { radiusScale } from '../../styles/radius/radius.constants';
import { themeColor } from '../../styles/theme/theme.utils';

export const CoinButton = styled.button`
	padding: 0.25rem;
	border-radius: ${radiusScale.pill};
	perspective: 50rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: transform 120ms ease;

	&:hover:not(:disabled) {
		transform: translateY(-0.125rem);
	}

	&:active:not(:disabled) {
		transform: scale(0.97);
	}

	&:focus-visible {
		outline: 3px solid ${themeColor('accent')};
		outline-offset: 0.25rem;
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

export const CoinRotor = styled.div`
	position: relative;
	width: var(--coin-size, 8.5rem);
	height: var(--coin-size, 8.5rem);
	transform-style: preserve-3d;
	will-change: transform;

	&[data-size='sm'] {
		--coin-size: 4.75rem;
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

export const CoinFaceLayer = styled.div`
	position: absolute;
	inset: 0;
	backface-visibility: hidden;
	display: flex;
	align-items: center;
	justify-content: center;

	&[data-side='tails'] {
		transform: rotateY(180deg);
	}

	> svg {
		width: 100%;
		height: 100%;
		display: block;
	}
`;
