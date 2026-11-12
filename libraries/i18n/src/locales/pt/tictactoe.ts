import type { TicTacToeTranslationContract } from '../../schemas/tictactoe.schema.js';

export const ptTicTacToe: TicTacToeTranslationContract = {
	title: 'Jogo da Velha',
	subtitle: 'Clássico duelo 3x3 de estratégia, marcas e alinhamento.',
	description:
		'Desafie um amigo no modo local passa-e-joga. Alinhe três símbolos X ou O em linha, coluna ou diagonal para vencer.',
	playButton: 'Jogar Jogo da Velha',
	difficulty: {
		standard: 'Clássico 3×3',
		standardDesc: 'Regras da grelha padrão 3×3 com rotação de jogada inicial',
	},
	lobby: {
		title: 'Jogo da Velha',
		subtitle: 'Selecione o modo de jogo e personalize os nomes dos jogadores.',
		modeSelect: 'Selecionar Modo de Jogo',
		passAndPlay: 'Passa & Joga (Local)',
		passAndPlayDesc: 'Jogue lado a lado no mesmo ecrã de forma instantânea e offline.',
		playOnline: 'Jogar Online',
		playOnlineDesc: 'Convide um adversário através de ligação de partilha ou código.',
		comingSoon: 'Brevemente',
		player1Label: 'Jogador 1 (X)',
		player2Label: 'Jogador 2 (O)',
		player1Default: 'Jogador 1',
		player2Default: 'Jogador 2',
		startGame: 'Iniciar Jogo',
	},
	game: {
		turn: 'Vez de {{name}} ({{mark}})',
		winner: '{{name}} Venceu!',
		draw: 'Empate!',
		boardLabel: 'Tabuleiro de jogo da velha 3x3',
		cellLabel: 'Linha {{row}}, Coluna {{col}}: {{mark}}',
		emptyCell: 'Vazio',
		playAgain: 'Jogar Novamente',
		backToMenu: 'Voltar ao Menu',
		startingTurnInfo: 'A marca inicial alterna a cada partida.',
		turnDialog: {
			title: 'Vez de {{name}} ({{mark}})',
			passDevice: 'Passe o dispositivo para {{name}}.',
			waiting: 'A aguardar a jogada do adversário...',
			ok: 'Pronto',
		},
	},
	victory: {
		title: 'Fim de Jogo',
		winnerWins: 'Parabéns {{name}}, venceu a partida!',
		drawTitle: 'Partida Empatada',
		drawDescription: 'Ambos os jogadores jogaram com perícia até ao empate.',
		playAgain: 'Jogar Novamente',
		backToMenu: 'Voltar ao Menu',
	},
	controls: {
		undo: 'Desfazer',
		restart: 'Reiniciar',
		rules: 'Regras',
		settings: 'Definições',
		backToLobby: 'Voltar ao Menu',
		keyboardHint: 'Use as teclas de seta para mover e Espaço ou Enter para marcar.',
	},
	settings: {
		title: 'Definições do Jogo da Velha',
		highlightWinningLine: {
			label: 'Destacar Linha Vencedora',
			description: 'Destaca visualmente a linha de três marcas vencedora.',
		},
		showCellCoordinates: {
			label: 'Mostrar Coordenadas',
			description: 'Exibe dicas de linha e coluna nas células da grelha.',
		},
		confirmTurnPass: {
			label: 'Confirmar passagem de vez',
			description: 'Exibe um diálogo para passar o dispositivo após cada jogada.',
		},
	},
};
