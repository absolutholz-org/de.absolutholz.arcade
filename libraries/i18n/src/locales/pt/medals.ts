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
			bridges: 'Pontes',
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
		first_brushstroke: {
			title: 'Primeira Pincelada',
			desc: 'Resolva seu primeiro quebra-cabeça de imagem.',
		},
		gallery: {
			title: 'A Galeria',
			desc: 'Complete quebra-cabeças selecionados nas coleções Fácil, Médio e Difícil.',
		},
		artist: {
			title: 'Artista dos Pixels',
			desc: 'Resolva quebra-cabeças e preencha sua galeria para sempre.',
		},
		streak: {
			title: 'Linha Contínua',
			desc: 'Construa sequências de vitórias consecutivas sem ser eliminado.',
		},
		speed_easy: {
			title: 'Desenhista Veloz',
			desc: 'Resolva um tabuleiro 5x5 em menos de 20 segundos.',
		},
		speed_hard: {
			title: 'Grande Muralista',
			desc: 'Resolva um tabuleiro 15x15 em menos de 3 minutos.',
		},
		direct_painter: {
			title: 'Pintor Direto',
			desc: 'Complete uma imagem 10x10 ou 15x15 sem marcar uma única cruz.',
		},
		flawless_canvas: {
			title: 'Tela Impecável',
			desc: 'Complete um tabuleiro 15x15 com zero erros e zero dicas.',
		},
		college_try: {
			title: 'Tentativa Válida',
			desc: 'Sofra sua primeira eliminação. Todo artista faz rascunhos.',
		},
		speedrun_ruin: {
			title: 'Corrida para a Ruína',
			desc: 'Seja eliminado em menos de 15 segundos.',
		},
		abstract: {
			title: 'Expressionismo Abstrato',
			desc: 'Preencha mais de três quartos do tabuleiro antes de perder.',
		},
		playing_safe: {
			title: 'Jogando com Cautela',
			desc: 'Marque 15 cruzes antes de preencher um único pixel.',
		},
		indecisive: {
			title: 'Pintor Indeciso',
			desc: 'Mude de ideia na mesma célula cinco vezes em uma rodada.',
		},
	},
	minesweeper: {
		clearance_initiated: {
			title: 'Desminagem Iniciada',
			desc: 'Vença seu primeiro jogo de Campo Minado.',
		},
		veteran: {
			title: 'Veterano do Campo Minado',
			desc: 'Acumule vitórias no total: Bronze com 5, Prata com 25 e Ouro com 100 jogos.',
		},
		tour: {
			title: 'Turnê do Campo Minado',
			desc: 'Supere campos maiores e mais difíceis: Bronze em Pequeno+, Prata em Grande (Difícil+), Ouro em Extra Grande (Especialista).',
		},
		streak: {
			title: 'Sequência de Desarme',
			desc: 'Alcance vitórias consecutivas: Bronze com 3, Prata com 5 (Médio+) e Ouro com 10 (Médio+).',
		},
		flagless: {
			title: 'Olha mãe, sem bandeiras!',
			desc: 'Vença uma partida no Médio, Grande ou Extra Grande sem posicionar nenhuma bandeira.',
		},
		speed_small: {
			title: 'Varredura Relâmpago',
			desc: 'Limpe um campo Pequeno no Médio em 15 segundos ou menos.',
		},
		expert_gold: {
			title: 'Demolidor Supremo',
			desc: 'Limpe um campo Extra Grande no Especialista em 90 segundos ou menos.',
		},
		college_try: {
			title: 'Valeu a Tentativa',
			desc: 'Pise em uma mina e sofra sua primeira derrota. O que vale é a intenção!',
		},
		speedrun_failure: {
			title: 'Primeiro passo em falso',
			desc: 'Detone uma mina em até 3 segundos de jogo.',
		},
		chord_master: {
			title: 'Mestre dos Acordes',
			desc: 'Vença uma partida usando pelo menos 15 ações de acorde.',
		},
		the_ocho: {
			title: 'O Oito Mítico',
			desc: 'Revele uma casa com o número 8 e conclua a desminagem do tabuleiro.',
		},
		mine_magnet: {
			title: 'Ímã de Minas',
			desc: 'Pise em uma mina em 5 jogos seguidos. Que tal uma pausa de cinco minutos?',
		},
		great_cascade: {
			title: 'A Grande Cascata',
			desc: 'Desencadeie uma reação em cadeia que libere 20 ou mais casas com um único clique.',
		},
		flag_hoarder: {
			title: 'Acumulador de Bandeiras',
			desc: 'Posicione bandeiras em 150% do total real de minas. Pelo seguro morreu o bicho!',
		},
		marathon: {
			title: 'Mãos Firmes',
			desc: 'Total histórico de casas seguras limpas em todos os campos minados.',
		},
		corner_to_corner: {
			title: 'De Canto a Canto',
			desc: 'Abra os quatro cantos em seus primeiros quatro movimentos em um tabuleiro grande e vença.',
		},
		bomb_technician: {
			title: 'Técnico Antibombas',
			desc: 'Limpe um campo minado Extra Grande no nível Especialista sem nenhuma bandeira fora do lugar.',
		},
		first_clear: {
			title: 'Liberação Iniciada',
			desc: 'Vença sua primeira partida de Campo Minado.',
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
	bridges: {
		first_span: {
			title: 'Primeiro Vão',
			desc: 'Conecte sua primeiríssima rede de ilhas.',
		},
		archipelago: {
			title: 'Arquiteto do Arquipélago',
			desc: 'Conclua redes de pontes com curadoria em todos os tamanhos de grade.',
		},
		builder: {
			title: 'Mestre Construtor',
			desc: 'Construa pontes e conecte ilhas ao longo da sua carreira.',
		},
		streak: {
			title: 'Trânsito Ininterrupto',
			desc: 'Resolva tabuleiros consecutivos sem perder uma rota.',
		},
		speed_beginner: {
			title: 'Trânsito Rápido',
			desc: 'Conecte uma grade Iniciante 6x6 em menos de 20 segundos.',
		},
		speed_expert: {
			title: 'Mestre da Engenharia Civil',
			desc: 'Resolva uma grade Especialista 18x18 em menos de 4 minutos.',
		},
		flawless_network: {
			title: 'Rede Impecável',
			desc: 'Conclua um tabuleiro Difícil ou Especialista sem demolir uma única ponte.',
		},
		double_trouble: {
			title: 'Problema em Dobro',
			desc: 'Coloque todas as pontes duplas antes de desenhar qualquer vão simples.',
		},
		college_try: {
			title: 'Valeu a Tentativa',
			desc: 'Sofra sua primeira linha de trânsito fracassada.',
		},
		bridge_to_nowhere: {
			title: 'Ponte para Lugar Nenhum',
			desc: 'Construa um circuito isolado que deixe o continente ilhado.',
		},
		traffic_jam: {
			title: 'Engarrafamento',
			desc: 'Tente desenhar pontes que se cruzam cinco vezes no mesmo jogo.',
		},
		indecisive_engineer: {
			title: 'Engenheiro Indeciso',
			desc: 'Alterne a conexão entre duas ilhas seis vezes seguidas.',
		},
		speedrun_collapse: {
			title: 'Colapso Relâmpago',
			desc: 'Abandone ou colapse um projeto de pontes em menos de 10 segundos.',
		},
	},
} as const satisfies MedalsTranslationContract;
