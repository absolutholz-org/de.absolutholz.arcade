export function useSoundEffects() {
	const playTone = (frequency: number, type: OscillatorType, duration: number, gainValue = 0.1) => {
		if (typeof window === 'undefined') return;
		try {
			const AudioContextClass =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			if (!AudioContextClass) return;
			const ctx = new AudioContextClass();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = type;
			osc.frequency.setValueAtTime(frequency, ctx.currentTime);
			gain.gain.setValueAtTime(gainValue, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start();
			osc.stop(ctx.currentTime + duration);
		} catch {
			// Web Audio autoplay protection
		}
	};

	return {
		playSelect: () => playTone(520, 'sine', 0.08, 0.05),
		playJump: () => playTone(680, 'triangle', 0.12, 0.08),
		playInvalid: () => playTone(220, 'sawtooth', 0.1, 0.04),
		playUndo: () => playTone(440, 'sine', 0.09, 0.05),
		playVictory: () => {
			playTone(523.25, 'triangle', 0.2, 0.1);
			setTimeout(() => playTone(659.25, 'triangle', 0.2, 0.1), 150);
			setTimeout(() => playTone(783.99, 'triangle', 0.35, 0.12), 300);
		},
		playStuck: () => {
			playTone(330, 'sine', 0.18, 0.07);
			setTimeout(() => playTone(280, 'sine', 0.25, 0.07), 160);
		},
	};
}
