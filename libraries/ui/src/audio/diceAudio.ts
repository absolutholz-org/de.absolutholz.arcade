let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
	if (typeof window === 'undefined') {
		return null;
	}

	const AudioContextConstructor =
		window.AudioContext ||
		// @ts-expect-error webkit prefix fallback
		window.webkitAudioContext;

	if (!AudioContextConstructor) {
		return null;
	}

	if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
		try {
			sharedAudioContext = new AudioContextConstructor();
		} catch {
			return null;
		}
	}

	return sharedAudioContext;
}

/**
 * Synthesizes realistic tabletop wooden dice clicks and tumbling friction
 * using the native Web Audio API (zero external sound asset dependencies).
 * Scales click density based on the number of unheld dice being rolled.
 */
export function playDiceRollSound(activeDiceCount: number): void {
	if (activeDiceCount <= 0) {
		return;
	}

	const ctx = getAudioContext();
	if (!ctx) {
		return;
	}

	try {
		if (ctx.state === 'suspended') {
			ctx.resume().catch(() => {});
		}

		// 2 to 6 micro-taps staggered across ~250ms to 400ms
		const tapCount = Math.max(2, Math.min(6, Math.floor(activeDiceCount * 1.2)));
		const baseTime = ctx.currentTime;
		const totalDuration = 0.35;

		for (let i = 0; i < tapCount; i += 1) {
			const jitter = (Math.random() - 0.5) * 0.04;
			const tapTime = baseTime + (i / tapCount) * totalDuration + 0.02 + jitter;

			// 1. Decayed triangle/sine wave pop (wooden impulse impact)
			const osc = ctx.createOscillator();
			const oscGain = ctx.createGain();

			osc.type = i % 2 === 0 ? 'triangle' : 'sine';
			const startFreq = 280 + Math.random() * 120;
			osc.frequency.setValueAtTime(startFreq, tapTime);
			osc.frequency.exponentialRampToValueAtTime(80 + Math.random() * 40, tapTime + 0.035);

			oscGain.gain.setValueAtTime(0.0001, tapTime);
			oscGain.gain.exponentialRampToValueAtTime(0.18, tapTime + 0.002);
			oscGain.gain.exponentialRampToValueAtTime(0.0001, tapTime + 0.035);

			osc.connect(oscGain);
			oscGain.connect(ctx.destination);

			osc.start(tapTime);
			osc.stop(tapTime + 0.04);

			// 2. Bandpass-filtered white noise burst (tumbling / rolling friction)
			const bufferSize = Math.floor(ctx.sampleRate * 0.025);
			const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
			const channelData = noiseBuffer.getChannelData(0);
			for (let sampleIdx = 0; sampleIdx < bufferSize; sampleIdx += 1) {
				channelData[sampleIdx] = Math.random() * 2 - 1;
			}

			const noiseSource = ctx.createBufferSource();
			noiseSource.buffer = noiseBuffer;

			const filter = ctx.createBiquadFilter();
			filter.type = 'bandpass';
			filter.frequency.setValueAtTime(900 + Math.random() * 600, tapTime);
			filter.Q.setValueAtTime(3.5, tapTime);

			const noiseGain = ctx.createGain();
			noiseGain.gain.setValueAtTime(0.0001, tapTime);
			noiseGain.gain.exponentialRampToValueAtTime(0.09, tapTime + 0.003);
			noiseGain.gain.exponentialRampToValueAtTime(0.0001, tapTime + 0.025);

			noiseSource.connect(filter);
			filter.connect(noiseGain);
			noiseGain.connect(ctx.destination);

			noiseSource.start(tapTime);
			noiseSource.stop(tapTime + 0.03);
		}
	} catch {
		// Gracefully handle blocked autoplay or environments without full audio support
	}
}
