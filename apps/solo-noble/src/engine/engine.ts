import { getCompiledLayout, toCoordinateKey } from './layouts.js';
import type {
	BoardLayoutId,
	CompiledBoardLayout,
	CoordinateKey,
	GameStatus,
	GameVariant,
	Jump,
	SoloNobleState,
} from './types.ts';

export class SoloNobleEngine {
	private compiledLayout: CompiledBoardLayout;
	private variant: GameVariant;
	private status: GameStatus = 'ready';
	private board: Record<CoordinateKey, boolean> = {};
	private initialEmptyKey: CoordinateKey | null = null;
	private history: Jump[] = [];
	private redoStack: Jump[] = [];

	constructor(layoutId: BoardLayoutId = 'english', variant: GameVariant = 'classic-central') {
		this.compiledLayout = getCompiledLayout(layoutId);
		this.variant = variant;
		this.reset(layoutId, variant);
	}

	public reset(
		layoutId: BoardLayoutId = this.compiledLayout.definition.id,
		variant: GameVariant = this.variant,
	): void {
		this.compiledLayout = getCompiledLayout(layoutId);
		this.variant = variant;
		this.history = [];
		this.redoStack = [];
		this.board = {};

		if (variant === 'custom-start') {
			for (const holeKey of this.compiledLayout.holeKeys) {
				this.board[holeKey] = true;
			}
			this.initialEmptyKey = null;
			this.status = 'ready';
		} else {
			for (const holeKey of this.compiledLayout.holeKeys) {
				this.board[holeKey] = holeKey !== this.compiledLayout.centerKey;
			}
			this.initialEmptyKey = this.compiledLayout.centerKey;
			this.status = 'playing';
			this.updateGameStatus();
		}
	}

	public selectInitialEmptyHole(holeKey: CoordinateKey): boolean {
		if (this.variant !== 'custom-start' || this.status !== 'ready') {
			return false;
		}

		if (!this.compiledLayout.holeKeys.has(holeKey)) {
			return false;
		}

		this.board[holeKey] = false;
		this.initialEmptyKey = holeKey;
		this.status = 'playing';
		this.updateGameStatus();
		return true;
	}

	public getLegalMoves(): Jump[] {
		if (this.status !== 'playing') {
			return [];
		}

		const legalMoves: Jump[] = [];
		for (const jump of this.compiledLayout.allJumps) {
			if (this.board[jump.from] === true && this.board[jump.jumped] === true && this.board[jump.to] === false) {
				legalMoves.push(jump);
			}
		}
		return legalMoves;
	}

	public getLegalMovesFrom(from: CoordinateKey): Jump[] {
		if (this.status !== 'playing' || !this.board[from]) {
			return [];
		}

		const possibleJumps = this.compiledLayout.jumpsFrom.get(from);
		if (!possibleJumps) {
			return [];
		}

		return possibleJumps.filter((jump) => this.board[jump.jumped] === true && this.board[jump.to] === false);
	}

	public isValidMove(from: CoordinateKey, to: CoordinateKey): boolean {
		if (this.status !== 'playing') {
			return false;
		}

		const jump = this.compiledLayout.jumpsBetween.get(`${from}->${to}`);
		if (!jump) {
			return false;
		}

		return this.board[jump.from] === true && this.board[jump.jumped] === true && this.board[jump.to] === false;
	}

	public executeMove(from: CoordinateKey, to: CoordinateKey): boolean {
		if (!this.isValidMove(from, to)) {
			return false;
		}

		const jump = this.compiledLayout.jumpsBetween.get(`${from}->${to}`);
		if (!jump) {
			return false;
		}

		this.board[jump.from] = false;
		this.board[jump.jumped] = false;
		this.board[jump.to] = true;

		this.history.push(jump);
		this.redoStack = [];

		this.updateGameStatus();
		return true;
	}

	public undo(): boolean {
		if (this.history.length === 0) {
			return false;
		}

		const jump = this.history.pop();
		if (!jump) {
			return false;
		}

		this.board[jump.from] = true;
		this.board[jump.jumped] = true;
		this.board[jump.to] = false;

		this.redoStack.push(jump);
		this.updateGameStatus();
		return true;
	}

	public redo(): boolean {
		if (this.redoStack.length === 0) {
			return false;
		}

		const jump = this.redoStack.pop();
		if (!jump) {
			return false;
		}

		this.board[jump.from] = false;
		this.board[jump.jumped] = false;
		this.board[jump.to] = true;

		this.history.push(jump);
		this.updateGameStatus();
		return true;
	}

	public canUndo(): boolean {
		return this.history.length > 0;
	}

	public canRedo(): boolean {
		return this.redoStack.length > 0;
	}

	public getPegCount(): number {
		let count = 0;
		for (const key of this.compiledLayout.holeKeys) {
			if (this.board[key]) {
				count++;
			}
		}
		return count;
	}

	public getMoveCount(): number {
		return this.history.length;
	}

	public getStatus(): GameStatus {
		return this.status;
	}

	public getLayout(): CompiledBoardLayout {
		return this.compiledLayout;
	}

	public getVariant(): GameVariant {
		return this.variant;
	}

	public getBoard(): Readonly<Record<CoordinateKey, boolean>> {
		return this.board;
	}

	public getInitialEmptyKey(): CoordinateKey | null {
		return this.initialEmptyKey;
	}

	public getHistory(): ReadonlyArray<Jump> {
		return this.history;
	}

	public getState(): SoloNobleState {
		return {
			layoutId: this.compiledLayout.definition.id,
			variant: this.variant,
			status: this.status,
			board: { ...this.board },
			pegCount: this.getPegCount(),
			moveCount: this.history.length,
			initialEmptyKey: this.initialEmptyKey,
		};
	}

	public loadState(state: SoloNobleState, history: Jump[] = [], redoStack: Jump[] = []): void {
		this.compiledLayout = getCompiledLayout(state.layoutId);
		this.variant = state.variant;
		this.board = { ...state.board };
		this.initialEmptyKey = state.initialEmptyKey;
		this.history = [...history];
		this.redoStack = [...redoStack];
		this.status = state.status;
		this.updateGameStatus();
	}

	private updateGameStatus(): void {
		if (this.status === 'ready') {
			return;
		}

		const pegCount = this.getPegCount();
		const legalMoves = this.getLegalMoves();

		if (pegCount === 1) {
			if (this.variant === 'classic-central') {
				const isCenterPeg = Boolean(this.board[this.compiledLayout.centerKey]);
				this.status = isCenterPeg ? 'won' : 'stuck';
			} else {
				this.status = 'won';
			}
			return;
		}

		if (legalMoves.length === 0) {
			this.status = 'stuck';
			return;
		}

		this.status = 'playing';
	}
}
