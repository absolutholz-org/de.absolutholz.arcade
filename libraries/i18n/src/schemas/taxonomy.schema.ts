import type { SchemaToTranslationContract } from './common.schema.js';

export const taxonomySchema = {
	aria: {
		gameAttributes: 'aria.gameAttributes',
	},
	categories: {
		'logic-deduction': 'categories.logic-deduction',
		'spatial-puzzle': 'categories.spatial-puzzle',
		'word-trivia': 'categories.word-trivia',
		'casual-sorting': 'categories.casual-sorting',
		'card-board': 'categories.card-board',
		'party-duel': 'categories.party-duel',
	},
	categoryDescriptions: {
		'logic-deduction': 'categoryDescriptions.logic-deduction',
		'spatial-puzzle': 'categoryDescriptions.spatial-puzzle',
		'word-trivia': 'categoryDescriptions.word-trivia',
		'casual-sorting': 'categoryDescriptions.casual-sorting',
		'card-board': 'categoryDescriptions.card-board',
		'party-duel': 'categoryDescriptions.party-duel',
	},
	playModes: {
		singleplayer: 'playModes.singleplayer',
		multiplayer: 'playModes.multiplayer',
		both: 'playModes.both',
		twoPlayers: 'playModes.twoPlayers',
	},
	tags: {
		mechanics: {
			'grid-based': 'tags.mechanics.grid-based',
			pathfinding: 'tags.mechanics.pathfinding',
			deduction: 'tags.mechanics.deduction',
			sorting: 'tags.mechanics.sorting',
			'pattern-recognition': 'tags.mechanics.pattern-recognition',
			'color-matching': 'tags.mechanics.color-matching',
			'number-logic': 'tags.mechanics.number-logic',
			'word-forming': 'tags.mechanics.word-forming',
			'graph-topology': 'tags.mechanics.graph-topology',
			'tile-rotation': 'tags.mechanics.tile-rotation',
			'hazard-avoidance': 'tags.mechanics.hazard-avoidance',
			'memory-recall': 'tags.mechanics.memory-recall',
			'hand-management': 'tags.mechanics.hand-management',
			'alignment-capture': 'tags.mechanics.alignment-capture',
		},
		inputs: {
			'touch-optimized': 'tags.inputs.touch-optimized',
			'keyboard-controls': 'tags.inputs.keyboard-controls',
			'drag-and-drop': 'tags.inputs.drag-and-drop',
			'tap-only': 'tags.inputs.tap-only',
			'dual-mode-toggle': 'tags.inputs.dual-mode-toggle',
			'direct-typing': 'tags.inputs.direct-typing',
		},
		pacing: {
			'zen-untimed': 'tags.pacing.zen-untimed',
			'speedrun-timer': 'tags.pacing.speedrun-timer',
			'mistake-penalty': 'tags.pacing.mistake-penalty',
			'undo-friendly': 'tags.pacing.undo-friendly',
			'countdown-arcade': 'tags.pacing.countdown-arcade',
			'move-efficiency': 'tags.pacing.move-efficiency',
			'turn-paced': 'tags.pacing.turn-paced',
		},
		modes: {
			'single-player': 'tags.modes.single-player',
			'pass-and-play': 'tags.modes.pass-and-play',
			'multiplayer-turn-based': 'tags.modes.multiplayer-turn-based',
			'daily-challenge': 'tags.modes.daily-challenge',
			'procedural-endless': 'tags.modes.procedural-endless',
			'curated-levels': 'tags.modes.curated-levels',
			'vs-ai': 'tags.modes.vs-ai',
		},
		sessionLength: {
			'snack-under-3m': 'tags.sessionLength.snack-under-3m',
			'standard-5-10m': 'tags.sessionLength.standard-5-10m',
			'deep-15m-plus': 'tags.sessionLength.deep-15m-plus',
		},
	},
} as const;

export type TaxonomySchema = typeof taxonomySchema;
export type TaxonomyTranslationContract = SchemaToTranslationContract<TaxonomySchema>;
