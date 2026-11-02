import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { _resetAudioContextForTesting, getAudioContext } from '../context';
import { triggerHaptic } from '../haptics';
import {
	initAudioSync,
	isHapticsEnabled,
	isSoundEnabled,
	setHapticsEnabled,
	setSoundEnabled,
} from '../settings-bridge';
import {
	playDrop,
	playMedalChime,
	playPickup,
	playProgress,
	playRegression,
	playTap,
	playVictoryFanfare,
} from '../sfx';

describe('@arcade/lib-audio', () => {
	let mockOscillator: {
		type: string;
		frequency: {
			setValueAtTime: ReturnType<typeof vi.fn>;
			exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
		};
		connect: ReturnType<typeof vi.fn>;
		start: ReturnType<typeof vi.fn>;
		stop: ReturnType<typeof vi.fn>;
	};

	let mockGain: {
		gain: {
			setValueAtTime: ReturnType<typeof vi.fn>;
			linearRampToValueAtTime: ReturnType<typeof vi.fn>;
			exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
		};
		connect: ReturnType<typeof vi.fn>;
	};

	let mockAudioContext: {
		state: AudioContextState;
		currentTime: number;
		destination: Record<string, unknown>;
		createOscillator: ReturnType<typeof vi.fn>;
		createGain: ReturnType<typeof vi.fn>;
		resume: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		setSoundEnabled(true);
		setHapticsEnabled(true);
		_resetAudioContextForTesting();

		mockOscillator = {
			type: 'sine',
			frequency: {
				setValueAtTime: vi.fn(),
				exponentialRampToValueAtTime: vi.fn(),
			},
			connect: vi.fn(),
			start: vi.fn(),
			stop: vi.fn(),
		};

		mockGain = {
			gain: {
				setValueAtTime: vi.fn(),
				linearRampToValueAtTime: vi.fn(),
				exponentialRampToValueAtTime: vi.fn(),
			},
			connect: vi.fn(),
		};

		mockAudioContext = {
			state: 'running',
			currentTime: 10,
			destination: {},
			createOscillator: vi.fn(() => mockOscillator),
			createGain: vi.fn(() => mockGain),
			resume: vi.fn().mockResolvedValue(undefined),
		};

		const MockAudioContext = vi.fn(function (this: unknown) {
			return mockAudioContext;
		});
		vi.stubGlobal('AudioContext', MockAudioContext);
		vi.stubGlobal('navigator', {
			vibrate: vi.fn().mockReturnValue(true),
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	describe('Settings Bridge', () => {
		it('toggles sound and haptic settings and supports batch init', () => {
			setSoundEnabled(false);
			expect(isSoundEnabled()).toBe(false);
			setSoundEnabled(true);
			expect(isSoundEnabled()).toBe(true);

			setHapticsEnabled(false);
			expect(isHapticsEnabled()).toBe(false);
			setHapticsEnabled(true);
			expect(isHapticsEnabled()).toBe(true);

			initAudioSync({ soundEnabled: false, hapticsEnabled: false });
			expect(isSoundEnabled()).toBe(false);
			expect(isHapticsEnabled()).toBe(false);
		});
	});

	describe('Haptics', () => {
		it('triggers expected vibration patterns for different intensities', () => {
			expect(triggerHaptic('light')).toBe(true);
			expect(navigator.vibrate).toHaveBeenCalledWith(12);

			expect(triggerHaptic('medium')).toBe(true);
			expect(navigator.vibrate).toHaveBeenCalledWith(22);

			expect(triggerHaptic('success')).toBe(true);
			expect(navigator.vibrate).toHaveBeenCalledWith([30, 40, 50, 40, 80]);

			expect(triggerHaptic('warning')).toBe(true);
			expect(navigator.vibrate).toHaveBeenCalledWith([40, 60, 40]);
		});

		it('bypasses vibration when haptics are disabled', () => {
			setHapticsEnabled(false);
			expect(triggerHaptic('light')).toBe(false);
			expect(navigator.vibrate).not.toHaveBeenCalled();
		});

		it('handles missing navigator.vibrate gracefully', () => {
			vi.stubGlobal('navigator', {});
			expect(triggerHaptic('light')).toBe(false);
		});
	});

	describe('Audio Context & Autoplay Resume', () => {
		it('lazily instantiates AudioContext and registers unlock listeners on suspended state', () => {
			mockAudioContext.state = 'suspended';
			const addEventSpy = vi.spyOn(window, 'addEventListener');

			const ctx = getAudioContext();
			expect(ctx).toBe(mockAudioContext);
			expect(addEventSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function), { passive: true });
			expect(addEventSpy).toHaveBeenCalledWith('keydown', expect.any(Function), { passive: true });
		});
	});

	describe('Synthesized Sound Primitives', () => {
		it('exits early and creates no audio nodes when sound is disabled', () => {
			setSoundEnabled(false);

			playTap();
			playPickup();
			playDrop();
			playProgress(1);
			playRegression();
			playVictoryFanfare();
			playMedalChime();

			expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
			expect(mockAudioContext.createGain).not.toHaveBeenCalled();
		});

		it('plays tap chirp with sine wave and connects nodes', () => {
			playTap();

			expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(1);
			expect(mockAudioContext.createGain).toHaveBeenCalledTimes(1);
			expect(mockOscillator.type).toBe('sine');
			expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(800, 10);
			expect(mockOscillator.start).toHaveBeenCalledWith(10);
		});

		it('plays pickup and drop sounds', () => {
			playPickup();
			expect(mockOscillator.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();

			mockAudioContext.createOscillator.mockClear();
			playDrop();
			expect(mockOscillator.type).toBe('triangle');
		});

		it('plays progress tone ascending along pentatonic scale', () => {
			playProgress(0);
			expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(261.63, 10);

			mockAudioContext.createOscillator.mockClear();
			playProgress(5); // Octave 1, note 0: 261.63 * 2 = 523.26
			expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(523.26, 10);
		});

		it('plays regression thud', () => {
			playRegression();
			expect(mockOscillator.type).toBe('triangle');
			expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(150, 10);
		});

		it('plays victory fanfare and medal chime', () => {
			playVictoryFanfare();
			expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(4);

			mockAudioContext.createOscillator.mockClear();
			playMedalChime();
			expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(2);
		});
	});
});
