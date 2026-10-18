import { getBoardDefinition, posKey } from './layouts.ts';
import type {
	BoardDefinition,
	BoardLayoutId,
	EngineOptions,
	GameStatus,
	GameVariantId,
	JumpMove,
	Position,
	SoloNobleSnapshot,
} from './types.ts';

/**
 * Headless Solo Noble (Peg Solitaire) engine.
 * Pure TypeScript implementation with zero external or UI dependencies.
 */
export class SoloNobleEngine {
	private readonly definition: BoardDefinition;
	private readonly variantId: GameVariantId;
	private readonly configuredEmpty: Position | null;

	private initialEmpty: Position | null = null;
	private status: GameStatus = 'ready';
	private readonly pegs: Set<string> = new Set<string>();

	private readonly undoStack: JumpMove[] = [];
	private readonly redoStack: JumpMove[] = [];

	public constructor(options?: EngineOptions) {
		const layoutId: BoardLayoutId = options?.layoutId ?? 'english';
		this.definition = getBoardDefinition(layoutId);
		this.variantId = options?.variantId ?? 'classic-central';
		this.configuredEmpty = options?.initialEmpty ?? null;

		this.initializeBoard();
	}

	/**
	 * Sets up the initial board configuration.
	 */
	private initializeBoard(): void {
		this.pegs.clear();
		this.undoStack.length = 0;
		this.redoStack.length = 0;

		// Populate all holes with pegs initially
		for (const hole of this.definition.holes) {
			this.pegs.add(posKey(hole.r, hole.c));
		}

		if (this.variantId === 'custom-start') {
			if (
				this.configuredEmpty &&
				this.definition.holeSet.has(posKey(this.configuredEmpty.r, this.configuredEmpty.c))
			) {
				this.initialEmpty = this.configuredEmpty;
				this.pegs.delete(posKey(this.configuredEmpty.r, this.configuredEmpty.c));
				this.status = 'ready';
			} else {
				this.initialEmpty = null;
				this.status = 'ready';
			}
		} else {
			const emptyHole = this.configuredEmpty ?? this.definition.center;
			this.initialEmpty = emptyHole;
			this.pegs.delete(posKey(emptyHole.r, emptyHole.c));
			this.status = 'ready';
		}
	}

	/**
	 * For custom-start variant, selects the initial hole to leave empty.
	 */
	public selectInitialEmpty(pos: Position): boolean {
		if (this.variantId !== 'custom-start' || this.initialEmpty !== null) {
			return false;
		}

		const key = posKey(pos.r, pos.c);
		if (!this.definition.holeSet.has(key)) {
			return false;
		}

		this.initialEmpty = { r: pos.r, c: pos.c };
		this.pegs.delete(key);
		this.status = 'ready';
		return true;
	}

	/**
	 * Checks if a specific coordinate is a valid board hole.
	 */
	public isHole(pos: Position): boolean {
		return this.definition.holeSet.has(posKey(pos.r, pos.c));
	}

	/**
	 * Checks if a specific hole contains a peg.
	 */
	public hasPeg(pos: Position): boolean {
		return this.pegs.has(posKey(pos.r, pos.c));
	}

	/**
	 * Retrieves the JumpMove definition if a jump between from and to is valid.
	 */
	public getJumpMove(from: Position, to: Position): JumpMove | null {
		const fromK = posKey(from.r, from.c);
		const toK = posKey(to.r, to.c);

		if (!this.pegs.has(fromK)) {
			return null;
		}

		if (!this.definition.holeSet.has(toK) || this.pegs.has(toK)) {
			return null;
		}

		const targetMap = this.definition.jumpLookup.get(fromK);
		if (!targetMap) {
			return null;
		}

		const jump = targetMap.get(toK);
		if (!jump) {
			return null;
		}

		const jumpedK = posKey(jump.jumped.r, jump.jumped.c);
		if (!this.pegs.has(jumpedK)) {
			return null;
		}

		return jump;
	}

	/**
	 * Validates whether moving from `from` to `to` is currently legal.
	 */
	public isValidMove(from: Position, to: Position): boolean {
		return this.getJumpMove(from, to) !== null;
	}

	/**
	 * Returns all currently legal jumps on the board.
	 */
	public getLegalMoves(): JumpMove[] {
		if (this.status === 'stuck' || this.status === 'won') {
			return [];
		}

		const legalMoves: JumpMove[] = [];
		for (const jump of this.definition.validJumps) {
			const fromK = posKey(jump.from.r, jump.from.c);
			const jumpedK = posKey(jump.jumped.r, jump.jumped.c);
			const toK = posKey(jump.to.r, jump.to.c);

			if (this.pegs.has(fromK) && this.pegs.has(jumpedK) && !this.pegs.has(toK)) {
				legalMoves.push(jump);
			}
		}

		return legalMoves;
	}

	/**
	 * Fast check whether at least one legal move exists without allocating an array.
	 */
	public hasLegalMoves(): boolean {
		for (const jump of this.definition.validJumps) {
			const fromK = posKey(jump.from.r, jump.from.c);
			const jumpedK = posKey(jump.jumped.r, jump.jumped.c);
			const toK = posKey(jump.to.r, jump.to.c);

			if (this.pegs.has(fromK) && this.pegs.has(jumpedK) && !this.pegs.has(toK)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Executes a jump move from `from` to `to`.
	 */
	public makeMove(from: Position, to: Position): boolean {
		if (this.status === 'stuck' || this.status === 'won') {
			return false;
		}

		if (this.variantId === 'custom-start' && this.initialEmpty === null) {
			return false;
		}

		const jump = this.getJumpMove(from, to);
		if (!jump) {
			return false;
		}

		const fromK = posKey(jump.from.r, jump.from.c);
		const jumpedK = posKey(jump.jumped.r, jump.jumped.c);
		const toK = posKey(jump.to.r, jump.to.c);

		this.pegs.delete(fromK);
		this.pegs.delete(jumpedK);
		this.pegs.add(toK);

		this.undoStack.push(jump);
		this.redoStack.length = 0;

		this.updateStatus();
		return true;
	}

	/**
	 * Reverts the most recent move.
	 */
	public undo(): boolean {
		const jump = this.undoStack.pop();
		if (!jump) {
			return false;
		}

		this.redoStack.push(jump);

		const fromK = posKey(jump.from.r, jump.from.c);
		const jumpedK = posKey(jump.jumped.r, jump.jumped.c);
		const toK = posKey(jump.to.r, jump.to.c);

		this.pegs.add(fromK);
		this.pegs.add(jumpedK);
		this.pegs.delete(toK);

		if (this.undoStack.length === 0) {
			this.status = 'ready';
		} else {
			this.status = 'playing';
		}

		return true;
	}

	/**
	 * Re-applies the most recently undone move.
	 */
	public redo(): boolean {
		const jump = this.redoStack.pop();
		if (!jump) {
			return false;
		}

		const fromK = posKey(jump.from.r, jump.from.c);
		const jumpedK = posKey(jump.jumped.r, jump.jumped.c);
		const toK = posKey(jump.to.r, jump.to.c);

		this.pegs.delete(fromK);
		this.pegs.delete(jumpedK);
		this.pegs.add(toK);

		this.undoStack.push(jump);
		this.updateStatus();

		return true;
	}

	/**
	 * Resets the game to its initial state.
	 */
	public reset(): void {
		this.initializeBoard();
	}

	/**
	 * Updates the game status after a move or redo.
	 */
	private updateStatus(): void {
		const remaining = this.pegs.size;

		if (remaining === 1) {
			if (this.variantId === 'classic-central') {
				const centerK = posKey(this.definition.center.r, this.definition.center.c);
				if (this.pegs.has(centerK)) {
					this.status = 'won';
				} else {
					this.status = 'stuck';
				}
			} else {
				// Clear Out and Custom Start win when 1 peg remains anywhere
				this.status = 'won';
			}
			return;
		}

		if (this.hasLegalMoves()) {
			this.status = 'playing';
		} else {
			this.status = 'stuck';
		}
	}

	public get canUndo(): boolean {
		return this.undoStack.length > 0;
	}

	public get canRedo(): boolean {
		return this.redoStack.length > 0;
	}

	public get pegCount(): number {
		return this.pegs.size;
	}

	public get moveCount(): number {
		return this.undoStack.length;
	}

	public get gameStatus(): GameStatus {
		return this.status;
	}

	public get boardDefinition(): BoardDefinition {
		return this.definition;
	}

	public get initialEmptyPosition(): Position | null {
		return this.initialEmpty;
	}

	public getSnapshot(): SoloNobleSnapshot {
		return {
			layoutId: this.definition.id,
			variantId: this.variantId,
			status: this.status,
			pegCount: this.pegs.size,
			moveCount: this.undoStack.length,
			initialEmpty: this.initialEmpty,
			pegs: new Set(this.pegs),
		};
	}
}
