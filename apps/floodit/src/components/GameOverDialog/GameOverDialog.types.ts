export interface GameOverDialogProps {
	readonly isOpen: boolean;
	readonly isWon: boolean;
	readonly moves: number;
	readonly maxMoves: number;
	readonly floodPercentage: number;
	readonly onPlayAgain: () => void;
	readonly onNewGame: () => void;
	readonly onClose: () => void;
	readonly difficulty: string;
}
