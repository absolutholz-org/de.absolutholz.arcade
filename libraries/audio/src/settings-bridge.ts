let soundEnabled = true;
let hapticsEnabled = true;

export interface AudioSyncOptions {
	soundEnabled?: boolean;
	hapticsEnabled?: boolean;
}

/**
 * Initializes the reactive audio and haptics state.
 */
export function initAudioSync(options?: AudioSyncOptions): void {
	if (options?.soundEnabled !== undefined) {
		soundEnabled = Boolean(options.soundEnabled);
	}
	if (options?.hapticsEnabled !== undefined) {
		hapticsEnabled = Boolean(options.hapticsEnabled);
	}
}

export function setSoundEnabled(enabled: boolean): void {
	soundEnabled = Boolean(enabled);
}

export function isSoundEnabled(): boolean {
	return soundEnabled;
}

export function setHapticsEnabled(enabled: boolean): void {
	hapticsEnabled = Boolean(enabled);
}

export function isHapticsEnabled(): boolean {
	return hapticsEnabled;
}
