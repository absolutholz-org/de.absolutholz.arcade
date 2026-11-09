export interface EmojiOption {
	readonly value: string;
	readonly label: string;
}

export const GRID_COLUMNS = 6;

/**
 * Curated collection of 30 arcade-themed emojis conforming to WCAG accessible names.
 */
export const ARCADE_AVATAR_EMOJIS: readonly EmojiOption[] = [
	{ value: '👾', label: 'Alien monster' },
	{ value: '🎮', label: 'Video game controller' },
	{ value: '🕹️', label: 'Joystick' },
	{ value: '🎲', label: 'Game die' },
	{ value: '🎯', label: 'Bullseye target' },
	{ value: '🧩', label: 'Puzzle piece' },
	{ value: '🏆', label: 'Trophy' },
	{ value: '🥇', label: '1st place medal' },
	{ value: '🚀', label: 'Rocket' },
	{ value: '⚡', label: 'High voltage lightning' },
	{ value: '💎', label: 'Gem stone' },
	{ value: '🧠', label: 'Brain' },
	{ value: '👑', label: 'Crown' },
	{ value: '🦊', label: 'Fox' },
	{ value: '🦉', label: 'Owl' },
	{ value: '🐱', label: 'Cat face' },
	{ value: '🐻', label: 'Bear face' },
	{ value: '🛸', label: 'Flying saucer' },
	{ value: '🤖', label: 'Robot' },
	{ value: '🎪', label: 'Circus tent' },
	{ value: '🔥', label: 'Fire flame' },
	{ value: '⭐', label: 'Glowing star' },
	{ value: '✨', label: 'Sparkles' },
	{ value: '👻', label: 'Ghost' },
	{ value: '⚔️', label: 'Crossed swords' },
	{ value: '🛡️', label: 'Shield' },
	{ value: '❤️', label: 'Red heart' },
	{ value: '⏳', label: 'Hourglass' },
	{ value: '🔮', label: 'Crystal ball' },
	{ value: '🪄', label: 'Magic wand' },
] as const;
