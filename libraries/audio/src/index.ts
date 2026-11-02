export {
	playTap,
	playPickup,
	playDrop,
	playProgress,
	playRegression,
	playVictoryFanfare,
	playMedalChime,
} from './sfx';

export { triggerHaptic, type HapticType } from './haptics';

export {
	initAudioSync,
	setSoundEnabled,
	setHapticsEnabled,
	isSoundEnabled,
	isHapticsEnabled,
	type AudioSyncOptions,
} from './settings-bridge';

export { getAudioContext } from './context';
