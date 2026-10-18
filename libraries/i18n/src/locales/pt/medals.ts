import type { MedalsTranslationContract } from '../../schemas/medals.schema.js';

export const ptMedals = {
	showcase: {
		title: 'Minhas Medalhas',
		description: 'Acompanhe seus troféus, conquistas pessoais e progresso nos jogos.',
		trophiesSummary: 'Coleção de Troféus',
		allGames: 'Todos os Jogos',
		games: {
			sudoku: 'Sudoku',
			nonogram: 'Nonograma',
			minesweeper: 'Campo Minado',
			queens: 'Queens',
			tracks: 'Tracks',
		},
		status: {
			unlocked: 'Desbloqueado',
			locked: 'Bloqueado',
			unlockedOn: 'Desbloqueado em {{date}}',
			progress: 'Progresso: {{current}} / {{target}} ({{percent}}%)',
		},
		tiers: {
			gold: 'Ouro',
			silver: 'Prata',
			bronze: 'Bronze',
		},
		empty: 'Nenhuma medalha encontrada para este filtro.',
	},
	sudoku: {
		first_win: {
			title: 'Primeira Vitória',
			desc: 'Vença sua primeira partida de Sudoku.',
		},
		win_streak_3: {
			title: 'Sequência Vencedora',
			desc: 'Vença 3 partidas de Sudoku seguidas.',
		},
		expert_master: {
			title: 'Grão-Mestre',
			desc: 'Vença 10 partidas de Sudoku no nível Especialista.',
		},
		speed_demon: {
			title: 'Veloz',
			desc: 'Resolva qualquer Sudoku em menos de 3 minutos.',
		},
		flawless: {
			title: 'Lógica Perfeita',
			desc: 'Complete um Sudoku sem cometer nenhum erro.',
		},
	},
	nonogram: {
		first_solve: {
			title: 'Primeira Revelação',
			desc: 'Resolva seu primeiro enigma de lógica visual.',
		},
		gallery_curator: {
			title: 'Curador da Galeria',
			desc: 'Resolva 5 enigmas distintos de Nonograma.',
		},
		perfectionist: {
			title: 'Perfeccionista',
			desc: 'Resolva 10 enigmas de Nonograma sem erros.',
		},
		swift_mind: {
			title: 'Mente Ágil',
			desc: 'Resolva um Nonograma em menos de 60 segundos.',
		},
	},
	minesweeper: {
		first_clear: {
			title: 'Liberação Iniciada',
			desc: 'Vença sua primeira partida de Campo Minado.',
		},
		veteran: {
			title: 'Veterano do Campo Minado',
			desc: 'Vença 10 partidas de Campo Minado.',
		},
		demolition_expert: {
			title: 'Especialista em Demolição',
			desc: 'Limpe um campo minado no nível Especialista.',
		},
	},
	queens: {
		first_win: {
			title: 'Posição Real',
			desc: 'Resolva seu primeiro tabuleiro de Queens.',
		},
		reign: {
			title: 'Reinado Supremo',
			desc: 'Resolva 15 tabuleiros de Queens.',
		},
	},
	tracks: {
		first_departure: {
			title: 'Primeira Partida',
			desc: 'Complete sua primeira ferrovia.',
		},
		transcontinental: {
			title: 'Transcontinental',
			desc: 'Complete 15 ferrovias.',
		},
	},
} as const satisfies MedalsTranslationContract;
