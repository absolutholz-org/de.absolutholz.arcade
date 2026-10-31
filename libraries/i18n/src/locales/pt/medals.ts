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
			watersort: 'Water Sort',
			bridges: 'Pontes',
			anagram: 'Anagram Scramble',
			tents: 'Tendas',
			untangle: 'Desembaraçar',
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
		royal_placement: {
			title: 'Colocação Real',
			desc: 'Coroe o seu primeiro reino.',
		},
		reign_supreme: {
			title: 'Reinado Supremo',
			desc: 'Construa uma dinastia ao longo da sua carreira de desafios.',
		},
		coronation_tour: {
			title: 'Tour de Coroação',
			desc: 'Resolva campanhas selecionadas em todos os tamanhos de reino.',
		},
		succession_streak: {
			title: 'Sucessão Real',
			desc: 'Mantenha sequências invictas de vitórias em reinos desafiadores.',
		},
		speed_easy: {
			title: 'Coroação Relâmpago',
			desc: 'Resolva um reino 6x6 em menos de 20 segundos.',
		},
		speed_expert: {
			title: 'Grande Soberano',
			desc: 'Resolva um reino Especialista 12x12 em menos de 2 minutos.',
		},
		blind_faith: {
			title: 'Fé Cega',
			desc: 'Conclua um tabuleiro 8x8 ou maior sem posicionar uma única marcação X.',
		},
		coup_detat: {
			title: 'Golpe de Estado',
			desc: 'Posicione todas as coroas com precisão absoluta, sem nenhum conflito ou remoção.',
		},
		college_try: {
			title: 'Valeu a Tentativa',
			desc: 'Sofra a sua primeira derrota na corte real.',
		},
		civil_war: {
			title: 'Guerra Civil',
			desc: 'Posicione duas rainhas que se ameaçam mutuamente.',
		},
		abdication: {
			title: 'Abdicação',
			desc: 'Renda-se em um reino após posicionar mais da metade das coroas reais.',
		},
		paranoid_monarch: {
			title: 'Monarca Paranoico',
			desc: 'Preencha mais de 80% do reino com marcas X antes de posicionar sua primeira coroa.',
		},
		royal_indecision: {
			title: 'Indecisão Real',
			desc: 'Posicione e remova uma coroa do mesmo quadrado quatro vezes.',
		},
		first_win: {
			title: 'Posição Real',
			desc: 'Resolva seu primeiro tabuleiro de Queens.',
		},
		reign: {
			title: 'Reinado Supremo',
			desc: 'Resolva 15 tabuleiros de Queens.',
		},
	},
	watersort: {
		chemist_ladder: {
			title: 'Técnico de Laboratório',
			desc: 'Resolva suportes de tubos ao longo da sua carreira (5 / 25 / 100).',
		},
		perfect_ladder: {
			title: 'Químico de Precisão',
			desc: 'Vença quebra-cabeças sem usar desfazer (3 / 10 / 25).',
		},
		first_sort: {
			title: 'Primeira Reação',
			desc: 'Resolva o seu primeiro quebra-cabeça.',
		},
		medium_clear: {
			title: 'Química Intermediária',
			desc: 'Complete 5 quebra-cabeças no nível Médio.',
		},
		hard_clear: {
			title: 'Cromatografia',
			desc: 'Complete 5 quebra-cabeças no nível Difícil.',
		},
		expert_clear: {
			title: 'Grande Alquimista',
			desc: 'Complete o seu primeiro quebra-cabeça no nível Especialista.',
		},
		master_suite: {
			title: 'Mestre dos Elementos',
			desc: 'Conclua pelo menos um quebra-cabeça em todos os 4 níveis de dificuldade.',
		},
		speed_pourer: {
			title: 'Despejo Relâmpago',
			desc: 'Resolva qualquer quebra-cabeça em menos de 45 segundos.',
		},
		blitz_chemist: {
			title: 'Titulação Rápida',
			desc: 'Resolva um quebra-cabeça Médio em menos de 30 segundos.',
		},
		expert_speed: {
			title: 'Velocidade Calculada',
			desc: 'Resolva um quebra-cabeça Difícil em menos de 60 segundos.',
		},
		par_perfection: {
			title: 'Zero Desperdício',
			desc: 'Complete um quebra-cabeça Médio ou Difícil no Par ou abaixo dele.',
		},
		theoretical_limit: {
			title: 'Limite Teórico',
			desc: 'Complete um quebra-cabeça Especialista em 34 jogadas ou menos.',
		},
		flawless: {
			title: 'Mãos Limpas',
			desc: 'Resolva qualquer quebra-cabeça sem usar Desfazer ou Dicas.',
		},
		comeback_kid: {
			title: 'Recuperação Química',
			desc: 'Vença um quebra-cabeça após usar 6+ ações de desfazer sem reiniciar.',
		},
		color_cascade: {
			title: 'Síntese Arco-Íris',
			desc: 'Complete 4 tubos de cor única em jogadas consecutivas.',
		},
		single_buffer: {
			title: 'Margens Estreitas',
			desc: 'Vença um quebra-cabeça utilizando apenas 1 tubo vazio como reserva.',
		},
	},
	tracks: {
		first_departure: {
			title: 'Primeira Partida',
			desc: 'Construa sua primeira ferrovia funcional.',
		},
		transcontinental: {
			title: 'Transcontinental',
			desc: 'Construa linhas ferroviárias ao longo da sua carreira.',
		},
		grand_line: {
			title: 'Grand Line',
			desc: 'Conclua redes ferroviárias selecionadas em todas as dificuldades.',
		},
		express_service: {
			title: 'Serviço Expresso',
			desc: 'Mantenha séries ininterruptas de entregas pontuais.',
		},
		bullet_train: {
			title: 'Trem-Bala',
			desc: 'Construa uma ferrovia 6x6 em menos de 30 segundos.',
		},
		trans_siberian: {
			title: 'Expresso Transiberiano',
			desc: 'Conecte uma rota de Especialista 10x10 em menos de 3 minutos.',
		},
		direct_line: {
			title: 'Linha Direta',
			desc: 'Complete um tabuleiro 8x8 ou maior sem posicionar nenhum marcador.',
		},
		smooth_rail: {
			title: 'Trilho Suave',
			desc: 'Complete um tabuleiro Difícil ou Especialista sem apagar uma única peça de trilho.',
		},
		college_try: {
			title: 'Valeu a Tentativa',
			desc: 'Sofra sua primeira desistência ferroviária.',
		},
		derailment: {
			title: 'Descarrilamento',
			desc: 'Leve um trilho diretamente contra uma parede de pedra.',
		},
		infinite_loop: {
			title: 'Loop Infinito',
			desc: 'Construa um trilho que apenas anda em círculos.',
		},
		wrong_way: {
			title: 'Sentido Contrário',
			desc: 'Construa sua rota começando de trás para frente a partir do portão de saída.',
		},
		signal_failure: {
			title: 'Falha de Sinal',
			desc: 'Ultrapasse a quantidade permitida de trilhos em três linhas ou colunas simultaneamente.',
		},
		indecisive_conductor: {
			title: 'Maquinista Indeciso',
			desc: 'Reoriente o trilho no mesmo quadrado cinco vezes.',
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
	anagram: {
		first_word: {
			title: 'First Word',
			desc: 'Find your very first word.',
		},
		full_rack: {
			title: 'Full Rack',
			desc: 'Use every tile in the rack to form a single word.',
		},
		speed_demon: {
			title: 'Speed Demon',
			desc: 'Win a timed round with at least 60 seconds left on the clock.',
		},
		perfectionist: {
			title: 'Perfectionist',
			desc: 'Find every single word in a round.',
		},
		round_champion: {
			title: 'Round Champion',
			desc: 'Win rounds across your anagram career.',
		},
		wordsmith: {
			title: 'Wordsmith',
			desc: 'Find words across all of your rounds.',
		},
		expert_scholar: {
			title: 'Expert Scholar',
			desc: 'Win rounds on Expert difficulty.',
		},
		hold_my_tiles: {
			title: 'Hold My Tiles',
			desc: 'Shuffle the rack 20 times in a single round.',
		},
		scrambled_egg: {
			title: 'Scrambled Egg',
			desc: 'Shuffle the rack three times within two seconds.',
		},
		cat_person: {
			title: 'Cat Person',
			desc: 'Find a word and its anagram partner in the same round, like "act" and "cat".',
		},
		silent_treatment: {
			title: 'Silent Treatment',
			desc: 'Win a Zen round without using Backspace or Escape.',
		},
		surrender_monkey: {
			title: 'Surrender Monkey',
			desc: 'Reveal the answers within 5 seconds of starting a round.',
		},
		last_second_hero: {
			title: 'Last-Second Hero',
			desc: 'Find the full-length word with one second or less on the clock.',
		},
		typo_tornado: {
			title: 'Typo Tornado',
			desc: 'Submit 10 invalid guesses in a single round.',
		},
		deja_vu: {
			title: 'Déjà Vu',
			desc: 'Submit an already-found word three times in one round.',
		},
		tiny_dictionary: {
			title: 'Tiny Dictionary',
			desc: 'Win an Easy round using only three-letter words plus the full-length word.',
		},
		sleeping_beauty: {
			title: 'Sleeping Beauty',
			desc: 'Pause a round for over 10 minutes, then still win it.',
		},
		polyglot_apprentice: {
			title: 'Aprendiz Poliglota',
			desc: 'Resolva pelo menos um desafio em dois idiomas diferentes.',
		},
		polyglot_trio: {
			title: 'Trio Linguístico',
			desc: 'Resolva pelo menos um desafio em inglês, alemão e português.',
		},
		tower_of_babel: {
			title: 'Torre de Babel',
			desc: 'Resolva desafios em vocabulários secundários.',
		},
		polyglot_expert: {
			title: 'Mestre Interlinguístico',
			desc: 'Conclua um desafio Especialista em dois idiomas diferentes.',
		},
	},
	tents: {
		first_pitch: {
			title: 'Primeiro Acampamento',
			desc: 'Arme sua primeira barraca na floresta.',
		},
		pristine_pitch: {
			title: 'Acampamento Impecável',
			desc: 'Complete um quebra-cabeça Médio, Difícil ou Especialista sem nenhum erro.',
		},
		speed_camper: {
			title: 'Campista Veloz',
			desc: 'Complete um acampamento Difícil ou Especialista em 2 minutos ou menos.',
		},
		minimalist: {
			title: 'Minimalista da Natureza',
			desc: 'Complete um quebra-cabeça sem colocar nenhuma peça de grama.',
		},
		master_camper: {
			title: 'Mestre Campista',
			desc: 'Acumule vitórias de acampamento ao longo da sua carreira.',
		},
		expedition_tour: {
			title: 'Turnê de Expedição',
			desc: 'Domine acampamentos selecionados em todas as dificuldades da trilha.',
		},
		survivalist_streak: {
			title: 'Sequência de Sobrevivência',
			desc: 'Mantenha uma sequência ininterrupta de vitórias na selva.',
		},
		grand_outfitter: {
			title: 'Grande Fornecedor',
			desc: 'Arme barracas ao lado de árvores ao longo de sua jornada de acampamento.',
		},
		glamping: {
			title: 'Glamping',
			desc: 'Preencha todas as linhas e colunas satisfeitas com grama usando a grama automática.',
		},
		bear_encounter: {
			title: 'Encontro com o Urso',
			desc: 'Sobreviva e vença após cometer três ou mais erros de barracas adjacentes simultaneamente.',
		},
		iron_will: {
			title: 'Vontade de Ferro',
			desc: 'Conquiste um acampamento Especialista com todas as dicas e destaques de erros desativados.',
		},
		quick_pitch: {
			title: 'Montagem Rápida',
			desc: 'Arme três barracas nos primeiros seis segundos após chegar ao acampamento.',
		},
	},
	untangle: {
		first_win: {
			title: 'Primeiro Nó Desfeito',
			desc: 'Desembarace seu primeiro grafo em qualquer dificuldade.',
		},
		wins: {
			title: 'Mestre do Desembaraço',
			desc: 'Resolva grafos emaranhados ao longo de sua carreira (5 / 25 / 100).',
		},
		hard_wins: {
			title: 'Solucionador Górdio',
			desc: 'Desembarace redes complexas na dificuldade Difícil (3 / 15 / 50).',
		},
		streak: {
			title: 'Sequência Sem Nós',
			desc: 'Mantenha vitórias consecutivas sem interrupção (3 / 7 / 15).',
		},
		speed_demon: {
			title: 'Demônio da Velocidade',
			desc: 'Desembarace um quebra-cabeça Médio ou Difícil em 45 segundos ou menos.',
		},
		no_undo: {
			title: 'Sem Hesitação',
			desc: 'Complete um quebra-cabeça Difícil sem usar Desfazer.',
		},
	},
} as const satisfies MedalsTranslationContract;
