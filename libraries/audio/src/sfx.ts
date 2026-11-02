import { getAudioContext } from './context';
import { isSoundEnabled } from './settings-bridge';

// C Major Pentatonic base scale frequencies in Hz: C4, D4, E4, G4, A4
const PENTATONIC_BASE = [261.63, 293.66, 329.63, 392.0, 440.0];

/**
 * Helper to play a single tone with frequency and gain envelopes.
 */
function playTone({
	type = 'sine',
	startFreq,
	endFreq,
	startTime,
	duration,
	peakGain = 0.15,
}: {
	type?: OscillatorType;
	startFreq: number;
	endFreq?: number;
	startTime: number;
	duration: number;
	peakGain?: number;
}): void {
	const ctx = getAudioContext();
	if (!ctx) return;

	try {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = type;
		osc.frequency.setValueAtTime(startFreq, startTime);

		if (endFreq !== undefined && endFreq !== startFreq) {
			osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), startTime + duration);
		}

		gain.gain.setValueAtTime(0.0001, startTime);
		const attackTime = Math.min(0.01, duration * 0.2);
		gain.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(startTime);
		osc.stop(startTime + duration + 0.05);
	} catch {
		// Ignore any audio synthesis errors
	}
}

/**
 * Crisp, subtle chirp (40ms, sine).
 */
export function playTap(): void {
	if (!isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	playTone({
		type: 'sine',
		startFreq: 800,
		endFreq: 600,
		startTime: now,
		duration: 0.04,
		peakGain: 0.08,
	});
}

/**
 * Pitch upward glide (30ms).
 */
export function playPickup(): void {
	if (!isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	playTone({
		type: 'sine',
		startFreq: 320,
		endFreq: 640,
		startTime: now,
		duration: 0.03,
		peakGain: 0.1,
	});
}

/**
 * Percussive downward snap (50ms).
 */
export function playDrop(): void {
	if (!isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	playTone({
		type: 'triangle',
		startFreq: 480,
		endFreq: 120,
		startTime: now,
		duration: 0.05,
		peakGain: 0.15,
	});
}

/**
 * Ascending notes along a major pentatonic scale based on step index.
 */
export function playProgress(step: number): void {
	if (!isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const safeStep = Math.max(0, Math.floor(step));
	const octave = Math.floor(safeStep / PENTATONIC_BASE.length);
	const noteIndex = safeStep % PENTATONIC_BASE.length;
	const freq = PENTATONIC_BASE[noteIndex] * 2 ** octave;

	const now = ctx.currentTime;
	playTone({
		type: 'sine',
		startFreq: freq,
		startTime: now,
		duration: 0.12,
		peakGain: 0.12,
	});
}

/**
 * Muted low thud for invalid moves or backward progress.
 */
export function playRegression(): void {
	if (!isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	playTone({
		type: 'triangle',
		startFreq: 150,
		endFreq: 60,
		startTime: now,
		duration: 0.08,
		peakGain: 0.18,
	});
}

/**
 * Arpeggiated ascending 4-note chord.
 */
export function playVictoryFanfare(): void {
	if (!isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	// C5, E5, G5, C6
	const notes = [523.25, 659.25, 783.99, 1046.5];
	const interval = 0.08;

	notes.forEach((freq, idx) => {
		playTone({
			type: 'triangle',
			startFreq: freq,
			startTime: now + idx * interval,
			duration: 0.25,
			peakGain: 0.12,
		});
	});
}

/**
 * Bright two-tone resonant chime.
 */
export function playMedalChime(): void {
	if (!isSoundEnabled()) return;
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	// First bell tone (A5) then harmonic shimmer (E6)
	playTone({
		type: 'sine',
		startFreq: 880.0,
		startTime: now,
		duration: 0.35,
		peakGain: 0.14,
	});
	playTone({
		type: 'sine',
		startFreq: 1318.51,
		startTime: now + 0.09,
		duration: 0.45,
		peakGain: 0.16,
	});
}
