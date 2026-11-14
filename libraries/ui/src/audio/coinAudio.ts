import { getAudioContext, isHapticsEnabled, isSoundEnabled } from '@arcade/lib-audio';

/**
 * Synthesizes a crisp metallic ping on coin toss using Web Audio API.
 */
export function playCoinTossPing(): void {
	if (!isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	try {
		const now = ctx.currentTime;
		const primaryOsc = ctx.createOscillator();
		const overtoneOsc = ctx.createOscillator();
		const gain = ctx.createGain();

		primaryOsc.type = 'sine';
		primaryOsc.frequency.setValueAtTime(1680, now);
		primaryOsc.frequency.exponentialRampToValueAtTime(2120, now + 0.09);

		overtoneOsc.type = 'triangle';
		overtoneOsc.frequency.setValueAtTime(3360, now);
		overtoneOsc.frequency.exponentialRampToValueAtTime(3980, now + 0.08);

		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.linearRampToValueAtTime(0.09, now + 0.006);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

		primaryOsc.connect(gain);
		overtoneOsc.connect(gain);
		gain.connect(ctx.destination);

		primaryOsc.start(now);
		overtoneOsc.start(now);
		primaryOsc.stop(now + 0.2);
		overtoneOsc.stop(now + 0.2);
	} catch {
		// Ignore audio synthesis failures on restricted contexts
	}
}

/**
 * Synthesizes a soft wooden/metallic clack when the coin lands.
 */
export function playCoinLandClack(): void {
	if (!isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	try {
		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'triangle';
		osc.frequency.setValueAtTime(310, now);
		osc.frequency.exponentialRampToValueAtTime(115, now + 0.055);

		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.linearRampToValueAtTime(0.11, now + 0.004);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.08);
	} catch {
		// Ignore audio synthesis failures on restricted contexts
	}
}

/**
 * Triggers a subtle 15ms haptic pulse when haptics are enabled and supported.
 */
export function triggerCoinHaptic(): void {
	if (!isHapticsEnabled()) return;
	if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;

	try {
		navigator.vibrate(15);
	} catch {
		// Ignore unsupported vibrate errors
	}
}
