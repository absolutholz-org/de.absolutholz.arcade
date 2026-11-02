let audioCtx: AudioContext | null = null;
let unlockListenersAttached = false;

function resumeAudioContext(): void {
	if (audioCtx && audioCtx.state === 'suspended') {
		audioCtx.resume().catch(() => {
			// Ignore unhandled rejection from browser policy restrictions
		});
	}
	removeUnlockListeners();
}

function removeUnlockListeners(): void {
	if (typeof window === 'undefined' || !unlockListenersAttached) {
		return;
	}
	window.removeEventListener('pointerdown', resumeAudioContext);
	window.removeEventListener('keydown', resumeAudioContext);
	unlockListenersAttached = false;
}

function attachUnlockListeners(): void {
	if (typeof window === 'undefined' || unlockListenersAttached) {
		return;
	}
	window.addEventListener('pointerdown', resumeAudioContext, { passive: true });
	window.addEventListener('keydown', resumeAudioContext, { passive: true });
	unlockListenersAttached = true;
}

/**
 * Returns the lazily-initialized singleton AudioContext, or null if running in SSR / unsupported browser.
 */
export function getAudioContext(): AudioContext | null {
	if (typeof window === 'undefined') {
		return null;
	}

	if (!audioCtx) {
		const AudioCtxClass =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

		if (!AudioCtxClass) {
			return null;
		}

		audioCtx = new AudioCtxClass();
	}

	if (audioCtx.state === 'suspended') {
		attachUnlockListeners();
	}

	return audioCtx;
}

/**
 * Reset function intended for test isolation.
 */
export function _resetAudioContextForTesting(): void {
	removeUnlockListeners();
	audioCtx = null;
}
