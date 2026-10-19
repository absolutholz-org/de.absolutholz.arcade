import type { MedalsTranslationContract } from '../../schemas/medals.schema.js';

export const ptMedals = {
	showcase: {
		title: 'Galeria de Medalhas',
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
		widget: {
			bannerTitle: 'Sua Coleção de Troféus',
			guestTitle: 'Galeria de Medalhas',
			guestDescription:
				'Conquiste marcos nos enigmas, acompanhe seu progresso e ganhe troféus em todos os jogos.',
			viewShowcase: 'Ver Galeria',
		},
	},
	sudoku: {
		first_victory: {
			title: 'Primeira Vitória',
			desc: 'Vença sua primeira partida de Sudoku em qualquer dificuldade.',
		},
		streak: {
			title: 'Sequência Vitoriosa',
			desc: 'Alcance vitórias consecutivas: Bronze com 3, Prata com 5 e Ouro com 10 partidas.',
		},
		campaign_foundations: {
			title: 'Campanha Fundamentos',
			desc: 'Domine quebra-cabeças selecionados: Bronze para todos os 6 Fáceis, Prata para os 6 Médios, Ouro para os 12 sem usar dicas.',
		},
		campaign_gauntlet: {
			title: 'Campanha Desafio Supremo',
			desc: 'Supere quebra-cabeças avançados: Bronze para 3 Difíceis, Prata para todos os 6 Difíceis, Ouro para todos os 6 Muito Difíceis.',
		},
		speed_demon: {
			title: 'Velocista',
			desc: 'Resolva um Sudoku em menos de 3 minutos na dificuldade Média ou superior.',
		},
		flawless_logic: {
			title: 'Lógica Impecável',
			desc: 'Complete um Sudoku na dificuldade Difícil ou superior sem erros e sem dicas.',
		},
		beyond_mortal: {
			title: 'Além dos Mortais',
			desc: 'Resolva um quebra-cabeça na dificuldade Insano ou Desumano.',
		},
		living_on_edge: {
			title: 'No Limite',
			desc: 'Vença uma partida com exatamente 2 erros cometidos, a um passo da derrota.',
		},
		participation: {
			title: 'Medalha de Participação',
			desc: 'Resolva qualquer quebra-cabeça em qualquer dificuldade. Você conseguiu!',
		},
		old_college_try: {
			title: 'Valeu a Tentativa',
			desc: 'Sofra sua primeira derrota. Você tentou, e isso é o que importa.',
		},
		speedrun_failure: {
			title: 'Fracasso Relâmpago',
			desc: 'Cometa 3 erros e perca uma partida em menos de 20 segundos.',
		},
		analysis_paralysis: {
			title: 'Paralisia por Análise',
			desc: 'Passe mais de 20 minutos resolvendo um Fácil. Pensar duas vezes antes de agir.',
		},
		are_you_sure: {
			title: 'Tem Certeza Disso?',
			desc: 'Desfaça jogadas 10 vezes consecutivas na mesma partida.',
		},
		living_on_prayer: {
			title: 'Por um Triz',
			desc: 'Cometa dois erros no primeiro minuto e ainda saia vitorioso.',
		},
		pencil_pusher: {
			title: 'Mestre do Lápis',
			desc: 'Anote 60 notas candidatas antes de colocar o seu primeiro número confirmado.',
		},
		surgical_precision: {
			title: 'Precisão Cirúrgica',
			desc: 'Resolva um tabuleiro Difícil ou superior sem notas, sem dicas e sem erros.',
		},
		insomnia: {
			title: 'Especial da Insônia',
			desc: 'Complete um quebra-cabeça entre as 2h00 e as 4h00 da madrugada.',
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
