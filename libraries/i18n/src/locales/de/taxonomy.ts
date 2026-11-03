import type { TaxonomyTranslationContract } from '../../schemas/taxonomy.schema.js';

export const deTaxonomy = {
	aria: {
		gameAttributes: 'Spieleigenschaften',
	},
	categories: {
		'logic-deduction': 'Logik & Deduktion',
		'spatial-puzzle': 'Räumliches Puzzle',
		'word-trivia': 'Wort & Wissen',
		'casual-sorting': 'Entspanntes Sortieren',
		'card-board': 'Karten- & Brettspiele',
		'party-duel': 'Party & Duell',
	},
	tags: {
		mechanics: {
			'grid-based': 'Gitterbasiert',
			pathfinding: 'Pfadfindung',
			deduction: 'Deduktion',
			sorting: 'Sortieren',
			'pattern-recognition': 'Mustererkennung',
			'color-matching': 'Farbabgleich',
			'number-logic': 'Zahlenlogik',
			'word-forming': 'Wortbildung',
			'graph-topology': 'Graphentopologie',
			'tile-rotation': 'Kachelrotation',
			'hazard-avoidance': 'Gefahrenvermeidung',
			'memory-recall': 'Gedächtnis',
			'hand-management': 'Kartenmanagement',
			'alignment-capture': 'Reihen & Schlagen',
		},
		inputs: {
			'touch-optimized': 'Touch-optimiert',
			'keyboard-controls': 'Tastatursteuerung',
			'drag-and-drop': 'Drag & Drop',
			'tap-only': 'Nur Tippen',
			'dual-mode-toggle': 'Modus-Umschalter',
			'direct-typing': 'Direkte Eingabe',
		},
		pacing: {
			'zen-untimed': 'Zen (Ohne Zeitlimit)',
			'speedrun-timer': 'Timer',
			'mistake-penalty': 'Fehlerstrafen',
			'undo-friendly': 'Schritt zurück',
			'countdown-arcade': 'Countdown',
			'move-efficiency': 'Zugeffizienz',
			'turn-paced': 'Rundenbasiert',
		},
		modes: {
			'single-player': 'Einzelspieler',
			'pass-and-play': 'Pass & Play',
			'multiplayer-turn-based': 'Rundenbasierter Mehrspieler',
			'daily-challenge': 'Tägliche Herausforderung',
			'procedural-endless': 'Endlos / Prozedural',
			'curated-levels': 'Kuratierte Level',
			'vs-ai': 'Gegen KI',
		},
		sessionLength: {
			'snack-under-3m': '< 3 Min.',
			'standard-5-10m': '5–10 Min.',
			'deep-15m-plus': '15+ Min.',
		},
	},
} as const satisfies TaxonomyTranslationContract;
