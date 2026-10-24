import type { AnagramTranslationContract } from '../../schemas/anagram.schema.js';

export const enAnagram = {
	title: 'Anagram Scramble',
	subtitle: 'Unscramble the rack and find every hidden word.',
	description:
		'Build words from the letter tiles in your rack. Each tile can be used once per word. Find a word that uses every tile, or at least half of all words, to clear the round.',
	difficulty: {
		label: 'Difficulty',
		easy: 'Easy',
		easyDimensions: '5 Letters',
		easyDesc: 'Accessible racks with high vowel counts (~6–12 words).',
		medium: 'Medium',
		mediumDimensions: '6 Letters',
		mediumDesc: 'Standard classic anagram balance (~15–25 words).',
		hard: 'Hard',
		hardDimensions: '7 Letters',
		hardDesc: 'Deep vocabulary search (~30–50 words).',
		expert: 'Expert',
		expertDimensions: '8 Letters (Min 4)',
		expertDesc: 'No 3-letter fillers; focus on complex stems.',
	},
	mode: {
		label: 'Mode',
		zen: 'Zen',
		zenDesc: 'Relaxed • Untimed play',
		timed: 'Timed Arcade',
		timedDesc: '2:30 Timer • Bonus time per word',
	},
	vocabulary: {
		label: 'Word Language',
		en: 'English',
		de: 'Deutsch',
	},
	controls: {
		shuffle: 'Shuffle',
		play: 'Play',
		clear: 'Clear',
		submit: 'Submit',
		reveal: 'Reveal Answers',
		newRound: 'New Round',
		pause: 'Pause',
		resume: 'Resume',
	},
	hud: {
		score: 'Score: {{score}}',
		timeLeft: 'Time left: {{time}}',
		wordsFound: '{{found}} / {{total}} words',
		rackLabel: 'Letter rack',
		stagedLabel: 'Current word',
	},
	board: {
		slotsLabel: 'Words to find',
		wordLength: '{{length}} letters',
	},
	feedback: {
		accepted: '{{word}} found! +{{points}}',
		baselineCleared: 'Root word found! Round qualified to advance.',
		duplicate: 'You already found {{word}}.',
		tooShort: 'Words need at least {{min}} letters.',
		notInRack: 'That word needs letters you do not have.',
		notAWord: '{{word}} is not in the word list.',
	},
	aria: {
		rackTile: 'Letter {{letter}}',
		stagedTile: 'Staged letter {{letter}}. Press to return it to the rack.',
		slotHidden: 'Hidden word with {{length}} letters',
		slotRevealed: 'Found word: {{word}}',
	},
	pause: {
		title: 'Game Paused',
		description: 'The rack and board are hidden while paused.',
	},
	victory: {
		title: 'Round Cleared!',
		masteredTitle: 'Perfect Sweep!',
		summary: 'You found {{found}} of {{total}} words.',
	},
	defeat: {
		title: "Time's Up!",
		summary: 'You found {{found}} of {{total}} words, but no full-length word.',
	},
	navigation: {
		rules: 'Rules',
		lobby: 'Lobby',
	},
} as const satisfies AnagramTranslationContract;
