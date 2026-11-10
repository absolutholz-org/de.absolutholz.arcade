import type { TicTacToeTranslationContract } from '../../schemas/tictactoe.schema.js';

export const enTicTacToe: TicTacToeTranslationContract = {
	title: 'Tic-Tac-Toe',
	subtitle: 'Classic 3x3 duel of strategy, marks, and alignment.',
	description:
		'Challenge a friend in local pass-and-play Tic-Tac-Toe. Align three X or O marks in a row, column, or diagonal to claim victory.',
	playButton: 'Play Tic-Tac-Toe',
	difficulty: {
		standard: 'Classic 3×3',
		standardDesc: 'Standard 3×3 grid rules with alternating starting turns',
	},
	lobby: {
		title: 'Tic-Tac-Toe',
		subtitle: 'Select your preferred game mode and customize player names.',
		modeSelect: 'Select Game Mode',
		passAndPlay: 'Pass & Play (Local)',
		passAndPlayDesc: 'Play face-to-face on the same screen or device with zero latency.',
		playOnline: 'Play Online',
		playOnlineDesc: 'Invite a remote opponent via share link or room code.',
		comingSoon: 'Coming Soon',
		player1Label: 'Player 1 (X)',
		player2Label: 'Player 2 (O)',
		player1Default: 'Player 1',
		player2Default: 'Player 2',
		startGame: 'Start Game',
	},
	game: {
		turn: "{{name}}'s Turn ({{mark}})",
		winner: '{{name}} Wins!',
		draw: "It's a Draw!",
		boardLabel: 'Tic-Tac-Toe 3x3 game board',
		cellLabel: 'Row {{row}}, Column {{col}}: {{mark}}',
		emptyCell: 'Empty',
		playAgain: 'Play Again',
		backToMenu: 'Back to Menu',
		startingTurnInfo: 'Starting mark rotates each round.',
	},
	victory: {
		title: 'Game Over',
		winnerWins: 'Congratulations {{name}}, you won the match!',
		drawTitle: 'Match Drawn',
		drawDescription: 'Both players played skillfully to a standstill.',
		playAgain: 'Play Again',
		backToMenu: 'Back to Menu',
	},
	controls: {
		undo: 'Undo',
		restart: 'Restart Game',
		rules: 'Rules',
		settings: 'Settings',
		backToLobby: 'Back to Menu',
		keyboardHint: 'Use Arrow keys to move between cells, Space or Enter to place your mark.',
	},
	settings: {
		title: 'Tic-Tac-Toe Settings',
		highlightWinningLine: {
			label: 'Highlight Winning Line',
			description: 'Visually highlight the three connecting marks that achieved victory.',
		},
		showCellCoordinates: {
			label: 'Show Coordinate Labels',
			description: 'Display accessible row and column indicator hints on grid cells.',
		},
	},
};
