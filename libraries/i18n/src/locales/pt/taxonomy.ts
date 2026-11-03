import type { TaxonomyTranslationContract } from '../../schemas/taxonomy.schema.js';

export const ptTaxonomy = {
	aria: {
		gameAttributes: 'Atributos do jogo',
	},
	categories: {
		'logic-deduction': 'Lógica e Dedução',
		'spatial-puzzle': 'Quebra-cabeça Espacial',
		'word-trivia': 'Palavras e Curiosidades',
		'casual-sorting': 'Organização Casual',
		'card-board': 'Cartas e Tabuleiro',
		'party-duel': 'Festa e Duelo',
	},
	tags: {
		mechanics: {
			'grid-based': 'Em grade',
			pathfinding: 'Criação de caminhos',
			deduction: 'Dedução',
			sorting: 'Organização',
			'pattern-recognition': 'Reconhecimento de padrões',
			'color-matching': 'Combinação de cores',
			'number-logic': 'Lógica numérica',
			'word-forming': 'Formação de palavras',
			'graph-topology': 'Topologia de grafos',
			'tile-rotation': 'Rotação de peças',
			'hazard-avoidance': 'Desvio de perigos',
			'memory-recall': 'Memória',
			'hand-management': 'Gestão de mão',
			'alignment-capture': 'Alinhamento e captura',
		},
		inputs: {
			'touch-optimized': 'Otimizado para toque',
			'keyboard-controls': 'Controles por teclado',
			'drag-and-drop': 'Arrastar e soltar',
			'tap-only': 'Apenas toque',
			'dual-mode-toggle': 'Alternador de modo',
			'direct-typing': 'Digitação direta',
		},
		pacing: {
			'zen-untimed': 'Zen (sem tempo)',
			'speedrun-timer': 'Cronômetro',
			'mistake-penalty': 'Penalidade por erro',
			'undo-friendly': 'Desfazer amigável',
			'countdown-arcade': 'Contagem regressiva',
			'move-efficiency': 'Eficiência de movimentos',
			'turn-paced': 'Por turnos',
		},
		modes: {
			'single-player': 'Um jogador',
			'pass-and-play': 'Passar e jogar',
			'multiplayer-turn-based': 'Multijogador por turnos',
			'daily-challenge': 'Desafio diário',
			'procedural-endless': 'Infinito / Procedural',
			'curated-levels': 'Níveis selecionados',
			'vs-ai': 'Contra IA',
		},
		sessionLength: {
			'snack-under-3m': '< 3 min',
			'standard-5-10m': '5–10 min',
			'deep-15m-plus': '15+ min',
		},
	},
} as const satisfies TaxonomyTranslationContract;
