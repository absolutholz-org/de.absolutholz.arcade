import type { PentominoesTranslationContract } from '../../schemas/pentominoes.schema.js';

export const ptPentominoes: PentominoesTranslationContract = {
	title: 'Pentaminós',
	subtitle: 'Quebra-cabeça de empacotamento espacial de poliominós',
	description:
		'Encaixe peças poliominós com perfeição em molduras geométricas definidas sem sobreposições nem espaços vazios.',
	difficulty: {
		label: 'Dificuldade',
		easy: 'Fácil',
		easyDesc: 'Quebra-cabeças introdutórios de 3 a 5 peças para raciocínio espacial ágil',
		medium: 'Médio',
		mediumDesc: 'Desafios equilibrados de 5 a 8 peças com silhuetas geométricas',
		hard: 'Difícil',
		hardDesc: 'Molduras densas de 8 a 10 peças exigindo planejamento e rotações',
		expert: 'Especialista',
		expertDesc: 'Grandes desafios canônicos de 12 peças (60 células no total)',
	},
	lobby: {
		title: 'Desafios de Pentaminós',
		subtitle: 'Selecione um pacote de desafios para começar a empacotar',
		selectDifficulty: 'Escolha o Nível de Dificuldade',
		completed: 'Concluído',
		quickPlay: 'Partida Rápida',
		quickPlayDesc: 'Ir diretamente para o próximo desafio não concluído',
		selectLevel: 'Escolher Tabuleiro',
	},
	status: {
		placed: 'Peças posicionadas',
		moves: 'Movimentos',
		noneSelected: 'Nenhuma selecionada',
		timer: 'Tempo Decorrido',
		time: 'Tempo',
		newBestTime: 'Novo Recorde!',
	},
	controls: {
		rotateCw: 'Girar horário (90°)',
		rotateCcw: 'Girar anti-horário (90°)',
		flipH: 'Inverter Horizontalmente',
		returnToTray: 'Devolver à Bandeja',
		clearBoard: 'Limpar Tabuleiro',
		hint: 'Dica',
		undo: 'Desfazer',
		redo: 'Refazer',
		backToLobby: 'Lobby',
		newGame: 'Novo Jogo',
		resume: 'Continuar',
	},
	tray: {
		activePieceTitle: 'Peça Ativa',
		keyboardHint:
			'Setas: mover cursor • Enter/Espaço: posicionar peça • R: girar • F: inverter • Esc: desselecionar',
		pieceStatusAvailable: 'Disponível na bandeja',
		pieceStatusPlaced: 'Posicionada no tabuleiro',
		pieceStatusSelected: 'Atualmente selecionada',
	},
	a11y: {
		boardLabel: 'Tabuleiro de Pentaminós',
		trayLabel: 'Bandeja de Poliominós',
		cellEmpty: 'Linha {{row}}, Coluna {{col}}, Vazia',
		cellOccupied: 'Linha {{row}}, Coluna {{col}}, Ocupada pela peça {{pieceId}}',
		cellVoid: 'Linha {{row}}, Coluna {{col}}, Célula fora da grade',
		puzzleSolved: 'Parabéns! Todas as peças foram posicionadas e o desafio está resolvido!',
		pickedUpFromTray: 'Peça {{pieceId}} retirada da bandeja',
		returnedToTray: 'Peça {{pieceId}} devolvida à bandeja',
		rotatedPiece: 'Peça {{pieceId}} girada para {{rotation}} graus',
		flippedPiece: 'Peça {{pieceId}} invertida',
		placedPiece: 'Peça {{pieceId}} posicionada na linha {{row}}, coluna {{col}}',
		invalidOutOfBounds: 'Não é possível posicionar a peça {{pieceId}}: ultrapassa o tabuleiro',
		invalidVoidCell: 'Não é possível posicionar a peça {{pieceId}}: sobrepõe uma célula vazada',
		invalidOverlap: 'Não é possível posicionar a peça {{pieceId}}: sobrepõe outra peça',
		pickedUpFromBoard: 'Peça {{pieceId}} retirada da linha {{row}}, coluna {{col}}',
		hintPlaced: 'Dica posicionou a peça {{pieceId}} na linha {{row}}, coluna {{col}}',
	},
	victory: {
		title: 'Quebra-cabeça Resolvido!',
		congratulations: 'Excelente dedução espacial! A moldura foi preenchida com perfeição.',
		playAgain: 'Jogar Novamente',
		nextPuzzle: 'Próximo Tabuleiro',
		viewLobby: 'Lobby',
	},
	settings: {
		title: 'Configurações de Pentaminós',
		showPieceLabels: 'Exibir letras das peças',
		showPieceLabelsDescription: 'Mostra as letras de identificação no centro dos blocos posicionados.',
		showSurfacePatterns: 'Padrões táteis',
		showSurfacePatternsDescription: 'Desenha texturas pontilhadas e hachuras para maior acessibilidade.',
		highlightGhostValidity: 'Prévia de encaixe',
		highlightGhostValidityDescription:
			'Destaca em verde ou vermelho as posições válidas ou inválidas ao passar o mouse.',
		showGridCoordinates: 'Coordenadas da grade',
		showGridCoordinatesDescription: 'Exibe marcadores de coordenadas ao longo das bordas do tabuleiro.',
	},
	levels: {
		procedural: {
			title: 'Desafio Procedural',
			description: 'Configuração de empacotamento espacial gerada por algoritmo',
		},
		'rect-3x5': {
			title: 'Retângulo 3×5',
			description: 'Quebra-cabeça introdutório com 3 pentaminós',
		},
		'rect-4x5': {
			title: 'Retângulo 4×5',
			description: 'Retângulo compacto com 4 pentaminós',
		},
		'rect-5x5': {
			title: 'Quadrado 5×5',
			description: 'Moldura quadrada clássica com 5 pentaminós',
		},
		'rect-5x6': {
			title: 'Retângulo 5×6',
			description: 'Tabuleiro retangular equilibrado com 6 pentaminós',
		},
		'rect-5x7': {
			title: 'Retângulo 5×7',
			description: 'Tabuleiro retangular desafiador com 7 pentaminós',
		},
		'rect-5x8': {
			title: 'Retângulo 5×8',
			description: 'Grade ampla com 8 pentaminós',
		},
		'rect-5x9': {
			title: 'Retângulo 5×9',
			description: 'Disposição retangular intrincada com 9 pentaminós',
		},
		'rect-5x10': {
			title: 'Retângulo 5×10',
			description: 'Teste espacial denso com 10 pentaminós',
		},
		'rect-5x11': {
			title: 'Retângulo 5×11',
			description: 'Configuração complexa com 11 pentaminós',
		},
		'rect-5x12': {
			title: 'Grande Retângulo 5×12',
			description: 'O monumento canônico dos 12 pentaminós com 60 células',
		},
		'rect-6x10': {
			title: 'Grande Retângulo 6×10',
			description: 'Tabuleiro canônico 6×10 com 12 pentaminós',
		},
		'rect-8x8-ring': {
			title: '8×8 Vazio Central',
			description: 'Todos os 12 pentaminós contornando um vazio quadrado central 2×2',
		},
		'rect-8x8-notched': {
			title: '8×8 Cruz com Entalhes',
			description: 'Todos os 12 pentaminós com entalhes nas laterais',
		},
		'silhouette-cross': {
			title: 'Silhueta em Cruz',
			description: 'Contorno em cruz simétrica preenchido com 5 pentaminós',
		},
		'silhouette-staircase': {
			title: 'Silhueta em Degraus',
			description: 'Pirâmide escalonada exigindo 6 poliominós',
		},
		'silhouette-archway': {
			title: 'Portal em Arco',
			description: 'Grande arco arquitetônico preenchido com 7 poliominós',
		},
	},
};
