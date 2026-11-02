export interface ConfettiProps {
	/** Total number of confetti particles to burst (defaults to 140). */
	particleCount?: number;
	/** Optional callback triggered when all confetti particles have finished animating. */
	onComplete?: () => void;
}
