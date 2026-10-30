import { recordGameResult } from '@arcade/lib-medals';
import { recordGameStats } from '@arcade/lib-storage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { TRACKS_MEDAL_DEFINITIONS } from '../../config/medals.js';
import { generateTracksPuzzle } from '../../engine/generator.js';
import {
	canRedo as checkCanRedo,
	canUndo as checkCanUndo,
	cloneBoardState,
	createHistory,
	pushState,
	redo,
	reset,
	undo,
} from '../../engine/history.js';
import { createBoardFromPuzzle, getNextPuzzle, getPuzzleById, getPuzzlesByDifficulty } from '../../engine/puzzles.js';
import {
	clearActiveGame,
	loadActiveGame,
	loadProgress,
	loadSettings,
	recordPuzzleCompletion,
	saveActiveGame,
	saveSettings,
} from '../../engine/storage.js';
import {
	type BoardState,
	DEFAULT_SETTINGS,
	DIFFICULTY_GRID_SIZES,
	DIFFICULTY_LEVELS,
	type DifficultyLevel,
	type Direction,
	type HistoryState,
	type InputMode,
	MAX_MISTAKES,
	type ProgressMap,
	type StaticPuzzleDefinition,
	type TracksSettings,
} from '../../engine/types.js';
import {
	ALL_TRACK_TYPES,
	DIRECTION_DELTA,
	OPPOSITE_DIRECTION,
	TRACK_DIRECTIONS,
	applyDragStep,
	autoOrientBoardTracks,
	evaluateBoard,
	evaluateLines,
	getFixedCell,
	inferCellTrackType,
	isTrackType,
} from '../../engine/validator.js';

function getWallCollisionsCount(board: BoardState): number {
	let collisions = 0;
	for (let r = 0; r < board.size; r++) {
		for (let c = 0; c < board.size; c++) {
			const state = board.grid[r][c];
			if (!isTrackType(state)) continue;
			const dirs = TRACK_DIRECTIONS[state];
			for (const dir of dirs) {
				const isStartGate = r === board.start.row && c === board.start.col && dir === board.start.side;
				const isEndGate = r === board.end.row && c === board.end.col && dir === board.end.side;
				if (isStartGate || isEndGate) continue;
				const nRow = r + DIRECTION_DELTA[dir].dRow;
				const nCol = c + DIRECTION_DELTA[dir].dCol;
				if (nRow < 0 || nRow >= board.size || nCol < 0 || nCol >= board.size) {
					collisions++;
				}
			}
		}
	}
	return collisions;
}

function detectClosedLoop(board: BoardState): boolean {
	const visited = new Set<string>();
	const adj = new Map<string, string[]>();

	for (let r = 0; r < board.size; r++) {
		for (let c = 0; c < board.size; c++) {
			const state = board.grid[r][c];
			if (!isTrackType(state)) continue;
			const key = `${r},${c}`;
			const neighbors: string[] = [];
			for (const dir of TRACK_DIRECTIONS[state]) {
				const nRow = r + DIRECTION_DELTA[dir].dRow;
				const nCol = c + DIRECTION_DELTA[dir].dCol;
				if (nRow < 0 || nRow >= board.size || nCol < 0 || nCol >= board.size) continue;
				const nState = board.grid[nRow][nCol];
				if (isTrackType(nState) && TRACK_DIRECTIONS[nState].includes(OPPOSITE_DIRECTION[dir])) {
					neighbors.push(`${nRow},${nCol}`);
				}
			}
			adj.set(key, neighbors);
		}
	}

	for (const startNode of adj.keys()) {
		if (visited.has(startNode)) continue;
		const stack: Array<{ node: string; parent: string | null }> = [{ node: startNode, parent: null }];
		visited.add(startNode);

		while (stack.length > 0) {
			const top = stack.pop();
			if (!top) break;
			const neighbors = adj.get(top.node) ?? [];
			for (const neighbor of neighbors) {
				if (neighbor === top.parent) continue;
				if (visited.has(neighbor)) {
					return true;
				}
				visited.add(neighbor);
				stack.push({ node: neighbor, parent: top.node });
			}
		}
	}
	return false;
}

function isGateConnected(board: BoardState, gate: { row: number; col: number; side: Direction }): boolean {
	const state = board.grid[gate.row]?.[gate.col];
	return isTrackType(state) && TRACK_DIRECTIONS[state].includes(gate.side);
}

function unwrapPuzzle(
	found: StaticPuzzleDefinition | { puzzle: StaticPuzzleDefinition; difficulty?: DifficultyLevel } | undefined,
): StaticPuzzleDefinition | undefined {
	if (!found) return undefined;
	return 'puzzle' in found ? found.puzzle : found;
}

function buildBoard(puzzle: StaticPuzzleDefinition): BoardState {
	return createBoardFromPuzzle(puzzle, puzzle.difficulty);
}

function resolveInitialPuzzle(initialDifficulty: DifficultyLevel, initialPuzzleId?: string): StaticPuzzleDefinition {
	let diff: DifficultyLevel = initialDifficulty;

	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const queryDiff = params.get('difficulty') as DifficultyLevel | null;
		const queryPuzzle = params.get('puzzle');
		const isRandom = params.get('random') === 'true' || params.get('procedural') === 'true';

		if (queryDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(queryDiff)) {
			diff = queryDiff;
		}

		if (queryPuzzle) {
			const found = unwrapPuzzle(getPuzzleById(queryPuzzle));
			if (found) return found;
		} else if (isRandom || params.get('new') === 'true') {
			try {
				const size = DIFFICULTY_GRID_SIZES[diff].width;
				return generateTracksPuzzle(size, diff);
			} catch {
				// Fallback to static if generation fails
			}
		}
	}

	if (initialPuzzleId) {
		const found = unwrapPuzzle(getPuzzleById(initialPuzzleId));
		if (found) return found;
	}

	const list = getPuzzlesByDifficulty(diff);
	return list[0] ?? getPuzzlesByDifficulty('easy')[0];
}

function fillSatisfiedLinesWithCross(
	state: BoardState,
	targetLine?: { axis: 'row' | 'col'; index: number },
): BoardState {
	const lineEvals = evaluateLines(state);
	const next = cloneBoardState(state);
	let changed = false;

	if (targetLine) {
		if (targetLine.axis === 'row') {
			const r = targetLine.index;
			if (lineEvals.rows[r]?.status === 'satisfied') {
				for (let c = 0; c < next.size; c++) {
					if (next.grid[r]?.[c] === 'empty' && !getFixedCell(next, r, c)) {
						next.grid[r][c] = 'cross';
						changed = true;
					}
				}
			}
		} else {
			const c = targetLine.index;
			if (lineEvals.cols[c]?.status === 'satisfied') {
				for (let r = 0; r < next.size; r++) {
					if (next.grid[r]?.[c] === 'empty' && !getFixedCell(next, r, c)) {
						next.grid[r][c] = 'cross';
						changed = true;
					}
				}
			}
		}
		return changed ? next : state;
	}

	for (let r = 0; r < next.size; r++) {
		if (lineEvals.rows[r]?.status === 'satisfied') {
			for (let c = 0; c < next.size; c++) {
				if (next.grid[r]?.[c] === 'empty' && !getFixedCell(next, r, c)) {
					next.grid[r][c] = 'cross';
					changed = true;
				}
			}
		}
	}

	for (let c = 0; c < next.size; c++) {
		if (lineEvals.cols[c]?.status === 'satisfied') {
			for (let r = 0; r < next.size; r++) {
				if (next.grid[r]?.[c] === 'empty' && !getFixedCell(next, r, c)) {
					next.grid[r][c] = 'cross';
					changed = true;
				}
			}
		}
	}

	return changed ? next : state;
}

function didCauseNewOverflow(prevBoard: BoardState, nextBoard: BoardState): boolean {
	const prevLines = evaluateLines(prevBoard);
	const nextLines = evaluateLines(nextBoard);

	for (let r = 0; r < nextBoard.size; r++) {
		if (nextLines.rows[r]?.status === 'overflow' && prevLines.rows[r]?.status !== 'overflow') {
			return true;
		}
	}

	for (let c = 0; c < nextBoard.size; c++) {
		if (nextLines.cols[c]?.status === 'overflow' && prevLines.cols[c]?.status !== 'overflow') {
			return true;
		}
	}

	return false;
}

export function useTracksGame(initialDifficulty: DifficultyLevel = 'easy', initialPuzzleId?: string) {
	const initialPuzzle = useMemo(
		() => resolveInitialPuzzle(initialDifficulty, initialPuzzleId),
		[initialDifficulty, initialPuzzleId],
	);

	const [puzzle, setPuzzle] = useState<StaticPuzzleDefinition>(initialPuzzle);
	const [board, setBoard] = useState<BoardState>(() => buildBoard(initialPuzzle));
	const [history, setHistory] = useState<HistoryState>(() => createHistory(buildBoard(initialPuzzle)));
	const [inputMode, setInputMode] = useState<InputMode>('track');
	const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>({
		row: 0,
		col: 0,
	});
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [movesCount, setMovesCount] = useState(0);
	const [mistakes, setMistakes] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isNewBestTime, setIsNewBestTime] = useState(false);
	const [settings, setSettings] = useState<TracksSettings>(DEFAULT_SETTINGS);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [isLoaded, setIsLoaded] = useState(false);

	// Refs for latest state in event callbacks
	const boardRef = useRef(board);
	boardRef.current = board;

	const puzzleRef = useRef(puzzle);
	puzzleRef.current = puzzle;

	const settingsRef = useRef(settings);
	settingsRef.current = settings;

	const elapsedRef = useRef(elapsedSeconds);
	elapsedRef.current = elapsedSeconds;

	const movesRef = useRef(movesCount);
	movesRef.current = movesCount;

	// Round context tracking for @arcade/lib-medals
	const hasRecordedResultRef = useRef(false);
	const isCompleteRef = useRef(false);
	isCompleteRef.current = isComplete;
	const mistakesRef = useRef(mistakes);
	mistakesRef.current = mistakes;
	const crossMarkersPlacedRef = useRef(0);
	const tracksErasedCountRef = useRef(0);
	const wallCollisionsCountRef = useRef(0);
	const closedLoopCreatedRef = useRef(false);
	const startedFromExitRef = useRef(false);
	const startConnectedBeforeRef = useRef(false);
	const firstMoveCellRef = useRef<{ row: number; col: number } | null>(null);
	const maxSimultaneousRowColumnViolationsRef = useRef(0);
	const cellTrackChangeCountsRef = useRef<Record<string, number>>({});
	const maxSameCellTrackChangesRef = useRef(0);

	const resetTrackingRefs = useCallback(() => {
		hasRecordedResultRef.current = false;
		crossMarkersPlacedRef.current = 0;
		tracksErasedCountRef.current = 0;
		wallCollisionsCountRef.current = 0;
		closedLoopCreatedRef.current = false;
		startedFromExitRef.current = false;
		startConnectedBeforeRef.current = false;
		firstMoveCellRef.current = null;
		maxSimultaneousRowColumnViolationsRef.current = 0;
		cellTrackChangeCountsRef.current = {};
		maxSameCellTrackChangesRef.current = 0;
	}, []);

	const recordVictory = useCallback((playTimeSeconds: number) => {
		if (hasRecordedResultRef.current) return;
		hasRecordedResultRef.current = true;
		const curPuzzle = puzzleRef.current;
		const levelKey = curPuzzle.difficulty;
		const sizeKey = `${curPuzzle.size}x${curPuzzle.size}`;
		const isProcedural = curPuzzle.id.startsWith('procedural-') || curPuzzle.id.startsWith('generated-');
		const completedPresetId = isProcedural ? undefined : curPuzzle.id;

		void recordGameStats({
			gameId: 'tracks',
			won: true,
			bucketKey: levelKey,
			playTimeSeconds: Math.max(1, playTimeSeconds),
			moves: movesRef.current,
			isFlawless: mistakesRef.current === 0,
		});

		void recordGameResult(
			{
				gameId: 'tracks',
				won: true,
				playTimeSeconds: Math.max(1, playTimeSeconds),
				levelKey,
				sizeKey,
				roundContext: {
					crossMarkersPlaced: crossMarkersPlacedRef.current,
					tracksErasedCount: tracksErasedCountRef.current,
					wallCollisionsCount: wallCollisionsCountRef.current,
					closedLoopCreated: closedLoopCreatedRef.current,
					startedFromExit: startedFromExitRef.current,
					maxSimultaneousRowColumnViolations: maxSimultaneousRowColumnViolationsRef.current,
					maxSameCellTrackChanges: maxSameCellTrackChangesRef.current,
					completedPresetId,
					size: sizeKey,
					difficulty: levelKey,
				},
			},
			{ definitions: TRACKS_MEDAL_DEFINITIONS },
		).catch((error) => {
			console.warn('[@arcade/tracks] Failed to record victory medals result:', error);
		});
	}, []);

	const recordSurrender = useCallback((playTimeSeconds: number) => {
		if (hasRecordedResultRef.current) return;
		hasRecordedResultRef.current = true;
		const curPuzzle = puzzleRef.current;
		const levelKey = curPuzzle.difficulty;
		const sizeKey = `${curPuzzle.size}x${curPuzzle.size}`;

		void recordGameStats({
			gameId: 'tracks',
			won: false,
			bucketKey: levelKey,
			playTimeSeconds: Math.max(1, playTimeSeconds),
			moves: movesRef.current,
			isFlawless: false,
		});

		void recordGameResult(
			{
				gameId: 'tracks',
				won: false,
				playTimeSeconds: Math.max(1, playTimeSeconds),
				levelKey,
				sizeKey,
				roundContext: {
					crossMarkersPlaced: crossMarkersPlacedRef.current,
					tracksErasedCount: tracksErasedCountRef.current,
					wallCollisionsCount: wallCollisionsCountRef.current,
					closedLoopCreated: closedLoopCreatedRef.current,
					startedFromExit: startedFromExitRef.current,
					maxSimultaneousRowColumnViolations: maxSimultaneousRowColumnViolationsRef.current,
					maxSameCellTrackChanges: maxSameCellTrackChangesRef.current,
					completedPresetId: undefined,
					size: sizeKey,
					difficulty: levelKey,
				},
			},
			{ definitions: TRACKS_MEDAL_DEFINITIONS },
		).catch((error) => {
			console.warn('[@arcade/tracks] Failed to record surrender medals result:', error);
		});
	}, []);

	useEffect(() => {
		return () => {
			if (
				!isCompleteRef.current &&
				!hasRecordedResultRef.current &&
				(elapsedRef.current > 0 || movesRef.current > 0)
			) {
				recordSurrender(elapsedRef.current);
			}
		};
	}, [recordSurrender]);

	// Drag tracking refs
	const isDraggingRef = useRef(false);
	const lastDragCellRef = useRef<{ row: number; col: number } | null>(null);
	const dragMovedRef = useRef(false);
	const dragStartBoardRef = useRef<BoardState>(board);
	const victoryTimerRef = useRef<number | null>(null);

	// Load saved settings, progress, and active game on mount
	useEffect(() => {
		async function init() {
			try {
				const [loadedSettings, loadedProgress, savedGame] = await Promise.all([
					loadSettings(),
					loadProgress(),
					loadActiveGame(),
				]);

				setSettings(loadedSettings);
				setProgress(loadedProgress);

				const requestedPuzzle = resolveInitialPuzzle(initialDifficulty, initialPuzzleId);
				let forceNew = false;
				let forceResume = false;

				if (typeof window !== 'undefined') {
					const params = new URLSearchParams(window.location.search);
					if (params.get('new') === 'true') forceNew = true;
					if (params.get('resume') === 'true') forceResume = true;
				}

				if (
					!forceNew &&
					savedGame &&
					!savedGame.isComplete &&
					(forceResume || savedGame.puzzleId === requestedPuzzle.id)
				) {
					const restoredPuzzle =
						savedGame.puzzleDefinition ??
						unwrapPuzzle(getPuzzleById(savedGame.puzzleId)) ??
						requestedPuzzle;
					const baseBoard = buildBoard(restoredPuzzle);
					const restoredBoard: BoardState = {
						...baseBoard,
						grid: savedGame.grid,
					};
					setPuzzle(restoredPuzzle);
					setBoard(restoredBoard);
					setHistory(createHistory(restoredBoard));
					setElapsedSeconds(savedGame.elapsedSeconds ?? 0);
					setMovesCount(savedGame.movesCount ?? 0);
					setMistakes(savedGame.mistakes ?? 0);
					setIsPaused(true);
				} else {
					const freshBoard = buildBoard(requestedPuzzle);
					setPuzzle(requestedPuzzle);
					setBoard(freshBoard);
					setHistory(createHistory(freshBoard));
					setElapsedSeconds(0);
					setMovesCount(0);
					setMistakes(0);
					setIsPaused(false);
				}
			} catch {
				const fallbackBoard = buildBoard(initialPuzzle);
				setPuzzle(initialPuzzle);
				setBoard(fallbackBoard);
				setHistory(createHistory(fallbackBoard));
			} finally {
				setIsLoaded(true);
			}
		}

		init();

		return () => {
			if (victoryTimerRef.current !== null) {
				window.clearTimeout(victoryTimerRef.current);
			}
		};
	}, [initialDifficulty, initialPuzzle, initialPuzzleId]);

	// Timer ticker
	useEffect(() => {
		if (!isLoaded || isPaused || isComplete || settings.gameMode === 'casual') {
			return;
		}

		const timer = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);

		return () => window.clearInterval(timer);
	}, [isLoaded, isPaused, isComplete, settings.gameMode]);

	// Auto-save active game state
	useEffect(() => {
		if (!isLoaded || isComplete) return;

		saveActiveGame({
			puzzleId: puzzle.id,
			difficulty: puzzle.difficulty,
			grid: board.grid,
			elapsedSeconds,
			movesCount,
			mistakes,
			isComplete: false,
			lastPlayed: Date.now(),
			puzzleDefinition: puzzle,
		});
	}, [isLoaded, isComplete, puzzle, board.grid, elapsedSeconds, movesCount, mistakes]);

	// Evaluate current board
	const evaluation = useMemo(() => evaluateBoard(board), [board]);

	// Commit a board state transition (updates history, moves, mistakes, and checks victory)
	const commitBoardMove = useCallback(
		(prevBoard: BoardState, candidateBoard: BoardState) => {
			const finalBoard = settingsRef.current.autoCross
				? fillSatisfiedLinesWithCross(candidateBoard)
				: candidateBoard;

			const nextMoves = movesRef.current + 1;
			movesRef.current = nextMoves;
			setMovesCount(nextMoves);

			// Track crossMarkersPlaced
			for (let r = 0; r < finalBoard.size; r++) {
				for (let c = 0; c < finalBoard.size; c++) {
					if (finalBoard.grid[r][c] === 'cross' && prevBoard.grid[r][c] !== 'cross') {
						crossMarkersPlacedRef.current++;
					}
				}
			}

			// Track tracksErasedCount
			for (let r = 0; r < finalBoard.size; r++) {
				for (let c = 0; c < finalBoard.size; c++) {
					if (isTrackType(prevBoard.grid[r][c]) && !isTrackType(finalBoard.grid[r][c])) {
						tracksErasedCountRef.current++;
					}
				}
			}

			// Track same cell track changes
			for (let r = 0; r < finalBoard.size; r++) {
				for (let c = 0; c < finalBoard.size; c++) {
					const p = prevBoard.grid[r][c];
					const n = finalBoard.grid[r][c];
					if (p !== n && (isTrackType(p) || isTrackType(n))) {
						const key = `${r},${c}`;
						const count = (cellTrackChangeCountsRef.current[key] ?? 0) + 1;
						cellTrackChangeCountsRef.current[key] = count;
						if (count > maxSameCellTrackChangesRef.current) {
							maxSameCellTrackChangesRef.current = count;
						}
					}
				}
			}

			// Track wall collisions
			const wallCount = getWallCollisionsCount(finalBoard);
			wallCollisionsCountRef.current = Math.max(wallCollisionsCountRef.current, wallCount);

			// Track closed loop
			if (detectClosedLoop(finalBoard)) {
				closedLoopCreatedRef.current = true;
			}

			// Track gates & started from exit
			const startConnected = isGateConnected(finalBoard, finalBoard.start);
			const endConnected = isGateConnected(finalBoard, finalBoard.end);
			if (!startConnectedBeforeRef.current && endConnected && !startConnected) {
				startedFromExitRef.current = true;
			}
			if (startConnected) {
				startConnectedBeforeRef.current = true;
			}

			// Track max simultaneous row/col violations
			const lineEvals = evaluateLines(finalBoard);
			const overflows =
				lineEvals.rows.filter((r) => r.status === 'overflow').length +
				lineEvals.cols.filter((c) => c.status === 'overflow').length;
			maxSimultaneousRowColumnViolationsRef.current = Math.max(
				maxSimultaneousRowColumnViolationsRef.current,
				overflows,
			);

			if (settingsRef.current.gameMode === 'standard' && didCauseNewOverflow(prevBoard, finalBoard)) {
				const nextMistakes = Math.min(MAX_MISTAKES, mistakesRef.current + 1);
				mistakesRef.current = nextMistakes;
				setMistakes(nextMistakes);
				if (nextMistakes >= MAX_MISTAKES) {
					recordSurrender(elapsedRef.current);
				}
			}

			boardRef.current = finalBoard;
			setBoard(finalBoard);
			setHistory((h) => pushState(h, finalBoard));

			const nextEval = evaluateBoard(finalBoard);
			if (nextEval.isComplete) {
				setIsComplete(true);
				isCompleteRef.current = true;
				clearActiveGame();
				recordVictory(elapsedRef.current);

				const isProcedural =
					puzzleRef.current.id.startsWith('procedural-') || puzzleRef.current.id.startsWith('generated-');
				if (!isProcedural) {
					const recordFn = recordPuzzleCompletion as (
						id: string,
						sec: number,
						moves?: number,
					) => Promise<{ isNewBestTime: boolean }>;

					recordFn(puzzleRef.current.id, elapsedRef.current, nextMoves).then((res) => {
						setIsNewBestTime(res.isNewBestTime);
						loadProgress().then(setProgress);
					});
				}

				if (victoryTimerRef.current !== null) {
					window.clearTimeout(victoryTimerRef.current);
				}
				victoryTimerRef.current = window.setTimeout(() => {
					setIsVictoryOpen(true);
				}, 1200);
			}
		},
		[recordSurrender, recordVictory],
	);

	// Primary cell click/tap
	const handleCellClick = useCallback(
		(row: number, col: number) => {
			if (isComplete || isPaused) return;
			if (dragMovedRef.current) {
				dragMovedRef.current = false;
				return;
			}

			setFocusedCell({ row, col });
			const curBoard = boardRef.current;
			if (getFixedCell(curBoard, row, col)) return;

			if (firstMoveCellRef.current === null) {
				firstMoveCellRef.current = { row, col };
				if (row === curBoard.end.row && col === curBoard.end.col) {
					startedFromExitRef.current = true;
				}
			}

			const current = curBoard.grid[row]?.[col] ?? 'empty';
			const nextBoard = cloneBoardState(curBoard);

			if (inputMode === 'track') {
				if (current === 'empty' || current === 'candidate') {
					const inferred = inferCellTrackType(curBoard, row, col) ?? 'straight-h';
					nextBoard.grid[row][col] = inferred;
					const oriented = autoOrientBoardTracks(nextBoard);
					commitBoardMove(curBoard, oriented);
				} else if (isTrackType(current)) {
					nextBoard.grid[row][col] = 'cross';
					const oriented = autoOrientBoardTracks(nextBoard);
					commitBoardMove(curBoard, oriented);
				} else {
					nextBoard.grid[row][col] = 'empty';
					const oriented = autoOrientBoardTracks(nextBoard);
					commitBoardMove(curBoard, oriented);
				}
			} else {
				const nextState = current === 'cross' ? 'empty' : 'cross';
				if (current === nextState) return;
				nextBoard.grid[row][col] = nextState;
				const oriented = autoOrientBoardTracks(nextBoard);
				commitBoardMove(curBoard, oriented);
			}
		},
		[inputMode, isComplete, isPaused, commitBoardMove],
	);

	// Right-click / context menu: quickly toggle 'cross' (X)
	const handleCellContextMenu = useCallback(
		(row: number, col: number, e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			if (isComplete || isPaused) return;

			setFocusedCell({ row, col });
			const curBoard = boardRef.current;
			if (getFixedCell(curBoard, row, col)) return;

			const current = curBoard.grid[row]?.[col] ?? 'empty';
			const nextState = current === 'cross' ? 'empty' : 'cross';
			const nextBoard = cloneBoardState(curBoard);
			nextBoard.grid[row][col] = nextState;
			const oriented = autoOrientBoardTracks(nextBoard);
			commitBoardMove(curBoard, oriented);
		},
		[isComplete, isPaused, commitBoardMove],
	);

	// Pointer drag handlers
	const handleDragStart = useCallback(
		(row: number, col: number, e: PointerEvent<HTMLButtonElement>) => {
			if (isComplete || isPaused || e.button !== 0) return;

			isDraggingRef.current = true;
			lastDragCellRef.current = { row, col };
			dragMovedRef.current = false;
			dragStartBoardRef.current = boardRef.current;

			if (firstMoveCellRef.current === null) {
				firstMoveCellRef.current = { row, col };
				if (row === boardRef.current.end.row && col === boardRef.current.end.col) {
					startedFromExitRef.current = true;
				}
			}
		},
		[isComplete, isPaused],
	);

	const handleDragEnter = useCallback(
		(row: number, col: number, _e: PointerEvent<HTMLButtonElement>) => {
			if (!isDraggingRef.current || isComplete || isPaused) return;

			const last = lastDragCellRef.current;
			if (!last || (last.row === row && last.col === col)) return;

			const curBoard = boardRef.current;

			if (inputMode === 'track') {
				const dist = Math.abs(row - last.row) + Math.abs(col - last.col);
				if (dist === 1) {
					const stepped = applyDragStep(curBoard, last.row, last.col, row, col);
					boardRef.current = stepped;
					setBoard(stepped);
					lastDragCellRef.current = { row, col };
					dragMovedRef.current = true;
				}
			} else {
				if (!getFixedCell(curBoard, row, col) && curBoard.grid[row]?.[col] === 'empty') {
					const nextBoard = cloneBoardState(curBoard);
					nextBoard.grid[row][col] = 'cross';
					boardRef.current = nextBoard;
					setBoard(nextBoard);
					lastDragCellRef.current = { row, col };
					dragMovedRef.current = true;
				}
			}
		},
		[inputMode, isComplete, isPaused],
	);

	const handleDragEnd = useCallback(
		(_e: PointerEvent<HTMLElement>) => {
			if (!isDraggingRef.current) return;
			isDraggingRef.current = false;
			lastDragCellRef.current = null;

			if (dragMovedRef.current) {
				commitBoardMove(dragStartBoardRef.current, boardRef.current);
			}
		},
		[commitBoardMove],
	);

	// Clicking a row or column clue fills remaining empty cells in a satisfied line with 'cross'
	const handleClueClick = useCallback(
		(axis: 'row' | 'col', index: number) => {
			if (isComplete || isPaused) return;
			const curBoard = boardRef.current;
			const crossed = fillSatisfiedLinesWithCross(curBoard, { axis, index });
			if (crossed !== curBoard) {
				commitBoardMove(curBoard, crossed);
			}
		},
		[isComplete, isPaused, commitBoardMove],
	);

	// Hint: place the first missing or incorrect solution step
	const handleHint = useCallback(() => {
		if (isComplete || isPaused) return;

		const curBoard = boardRef.current;
		const solution = puzzleRef.current.solution;
		const targetStep = solution.find((step) => curBoard.grid[step.row]?.[step.col] !== step.track);

		if (!targetStep) return;

		const nextBoard = cloneBoardState(curBoard);
		nextBoard.grid[targetStep.row][targetStep.col] = targetStep.track;
		setFocusedCell({ row: targetStep.row, col: targetStep.col });
		commitBoardMove(curBoard, nextBoard);
	}, [isComplete, isPaused, commitBoardMove]);

	// Cell focus
	const handleCellFocus = useCallback((row: number, col: number) => {
		setFocusedCell({ row, col });
	}, []);

	// Undo / Redo / Reset
	const canUndo = checkCanUndo(history);
	const canRedo = checkCanRedo(history);

	const handleUndo = useCallback(() => {
		if (isComplete || isPaused || !checkCanUndo(history)) return;
		const prevGrid = history.present.grid;
		const nextHistory = undo(history);
		const nextGrid = nextHistory.present.grid;
		for (let r = 0; r < nextHistory.present.size; r++) {
			for (let c = 0; c < nextHistory.present.size; c++) {
				if (isTrackType(prevGrid[r]?.[c]) && !isTrackType(nextGrid[r]?.[c])) {
					tracksErasedCountRef.current++;
				}
			}
		}
		setHistory(nextHistory);
		boardRef.current = nextHistory.present;
		setBoard(nextHistory.present);
	}, [isComplete, isPaused, history]);

	const handleRedo = useCallback(() => {
		if (isComplete || isPaused || !checkCanRedo(history)) return;
		const nextHistory = redo(history);
		setHistory(nextHistory);
		boardRef.current = nextHistory.present;
		setBoard(nextHistory.present);
	}, [isComplete, isPaused, history]);

	const handleReset = useCallback(() => {
		if (isComplete || isPaused) return;
		const prevGrid = history.present.grid;
		const nextHistory = reset(history);
		const nextGrid = nextHistory.present.grid;
		for (let r = 0; r < nextHistory.present.size; r++) {
			for (let c = 0; c < nextHistory.present.size; c++) {
				if (isTrackType(prevGrid[r]?.[c]) && !isTrackType(nextGrid[r]?.[c])) {
					tracksErasedCountRef.current++;
				}
			}
		}
		setHistory(nextHistory);
		boardRef.current = nextHistory.present;
		setBoard(nextHistory.present);
	}, [isComplete, isPaused, history]);

	const handleTogglePause = useCallback(() => {
		if (isComplete) return;
		setIsPaused((prev) => !prev);
	}, [isComplete]);

	// Keyboard navigation & shortcuts
	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLDivElement>) => {
			if (isComplete || isPaused) return;

			const currentFocus = focusedCell ?? { row: 0, col: 0 };
			const size = boardRef.current.size;

			switch (e.key) {
				case 'ArrowUp': {
					e.preventDefault();
					setFocusedCell({
						row: Math.max(0, currentFocus.row - 1),
						col: currentFocus.col,
					});
					break;
				}
				case 'ArrowDown': {
					e.preventDefault();
					setFocusedCell({
						row: Math.min(size - 1, currentFocus.row + 1),
						col: currentFocus.col,
					});
					break;
				}
				case 'ArrowLeft': {
					e.preventDefault();
					setFocusedCell({
						row: currentFocus.row,
						col: Math.max(0, currentFocus.col - 1),
					});
					break;
				}
				case 'ArrowRight': {
					e.preventDefault();
					setFocusedCell({
						row: currentFocus.row,
						col: Math.min(size - 1, currentFocus.col + 1),
					});
					break;
				}
				case 'Home': {
					e.preventDefault();
					setFocusedCell({ row: currentFocus.row, col: 0 });
					break;
				}
				case 'End': {
					e.preventDefault();
					setFocusedCell({ row: currentFocus.row, col: size - 1 });
					break;
				}
				case ' ':
				case 'Enter': {
					e.preventDefault();
					handleCellClick(currentFocus.row, currentFocus.col);
					break;
				}
				case 't':
				case 'T': {
					e.preventDefault();
					const curBoard = boardRef.current;
					if (getFixedCell(curBoard, currentFocus.row, currentFocus.col)) break;
					const current = curBoard.grid[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					const nextBoard = cloneBoardState(curBoard);
					if (isTrackType(current)) {
						nextBoard.grid[currentFocus.row][currentFocus.col] = 'empty';
					} else {
						nextBoard.grid[currentFocus.row][currentFocus.col] =
							inferCellTrackType(curBoard, currentFocus.row, currentFocus.col) ?? 'straight-h';
					}
					commitBoardMove(curBoard, autoOrientBoardTracks(nextBoard));
					break;
				}
				case 'x':
				case 'X':
				case 'm':
				case 'M': {
					e.preventDefault();
					const curBoard = boardRef.current;
					if (getFixedCell(curBoard, currentFocus.row, currentFocus.col)) break;
					const current = curBoard.grid[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					const nextBoard = cloneBoardState(curBoard);
					nextBoard.grid[currentFocus.row][currentFocus.col] = current === 'cross' ? 'empty' : 'cross';
					commitBoardMove(curBoard, autoOrientBoardTracks(nextBoard));
					break;
				}
				case 'c':
				case 'C': {
					e.preventDefault();
					const curBoard = boardRef.current;
					if (getFixedCell(curBoard, currentFocus.row, currentFocus.col)) break;
					const current = curBoard.grid[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					const idx = isTrackType(current) ? ALL_TRACK_TYPES.indexOf(current) : -1;
					const nextTrack = ALL_TRACK_TYPES[(idx + 1) % ALL_TRACK_TYPES.length];
					const nextBoard = cloneBoardState(curBoard);
					nextBoard.grid[currentFocus.row][currentFocus.col] = nextTrack;
					commitBoardMove(curBoard, nextBoard);
					break;
				}
				case 'Backspace':
				case 'Delete': {
					e.preventDefault();
					const curBoard = boardRef.current;
					if (getFixedCell(curBoard, currentFocus.row, currentFocus.col)) break;
					const current = curBoard.grid[currentFocus.row]?.[currentFocus.col] ?? 'empty';
					if (current === 'empty') break;
					const nextBoard = cloneBoardState(curBoard);
					nextBoard.grid[currentFocus.row][currentFocus.col] = 'empty';
					commitBoardMove(curBoard, autoOrientBoardTracks(nextBoard));
					break;
				}
				case 'h':
				case 'H': {
					e.preventDefault();
					handleHint();
					break;
				}
				case 'u':
				case 'U': {
					e.preventDefault();
					handleUndo();
					break;
				}
				case 'z':
				case 'Z': {
					e.preventDefault();
					if (e.shiftKey) {
						handleRedo();
					} else {
						handleUndo();
					}
					break;
				}
				case 'y':
				case 'Y': {
					if (e.ctrlKey || e.metaKey) {
						e.preventDefault();
						handleRedo();
					}
					break;
				}
				case 'Escape':
				case 'p':
				case 'P': {
					e.preventDefault();
					handleTogglePause();
					break;
				}
			}
		},
		[
			isComplete,
			isPaused,
			focusedCell,
			handleCellClick,
			commitBoardMove,
			handleHint,
			handleUndo,
			handleRedo,
			handleTogglePause,
		],
	);

	// Select / start a specific puzzle
	const handleSelectPuzzle = useCallback(
		(newPuzzle: StaticPuzzleDefinition) => {
			if (
				!isCompleteRef.current &&
				!hasRecordedResultRef.current &&
				(elapsedRef.current > 0 || movesRef.current > 0)
			) {
				recordSurrender(elapsedRef.current);
			}
			resetTrackingRefs();

			if (victoryTimerRef.current !== null) {
				window.clearTimeout(victoryTimerRef.current);
				victoryTimerRef.current = null;
			}
			const freshBoard = buildBoard(newPuzzle);
			setPuzzle(newPuzzle);
			boardRef.current = freshBoard;
			setBoard(freshBoard);
			setHistory(createHistory(freshBoard));
			setFocusedCell({ row: 0, col: 0 });
			setElapsedSeconds(0);
			setMovesCount(0);
			setMistakes(0);
			setIsComplete(false);
			isCompleteRef.current = false;
			setIsPaused(false);
			setIsVictoryOpen(false);
		},
		[recordSurrender, resetTrackingRefs],
	);

	const hasNextPuzzle = useMemo(() => !!getNextPuzzle(puzzle.id), [puzzle.id]);

	const handleNextPuzzle = useCallback(() => {
		const next = unwrapPuzzle(getNextPuzzle(puzzle.id));
		if (next) {
			handleSelectPuzzle(next);
			if (typeof window !== 'undefined') {
				const url = new URL(window.location.href);
				url.searchParams.set('difficulty', next.difficulty);
				url.searchParams.set('puzzle', next.id);
				window.history.replaceState(null, '', url.toString());
			}
		}
	}, [puzzle.id, handleSelectPuzzle]);

	const handlePlayAgain = useCallback(() => {
		handleSelectPuzzle(puzzle);
	}, [puzzle, handleSelectPuzzle]);

	const handleUpdateSettings = useCallback(async (newSettings: TracksSettings) => {
		const gameMode = newSettings.casualMode ? 'casual' : (newSettings.gameMode ?? 'standard');
		const resolved: TracksSettings = {
			...newSettings,
			casualMode: gameMode === 'casual',
			gameMode,
		};
		setSettings(resolved);
		settingsRef.current = resolved;
		await saveSettings(resolved);
	}, []);

	const openSettings = useCallback(() => {
		setIsPaused(true);
		setIsSettingsOpen(true);
	}, []);

	const closeSettings = useCallback(() => {
		setIsSettingsOpen(false);
		setIsPaused(false);
	}, []);

	const openRules = useCallback(() => {
		setIsPaused(true);
		setIsRulesOpen(true);
	}, []);

	const closeRules = useCallback(() => {
		setIsRulesOpen(false);
		setIsPaused(false);
	}, []);

	return {
		puzzle,
		board,
		evaluation,
		inputMode,
		focusedCell,
		elapsedSeconds,
		movesCount,
		mistakes,
		maxMistakes: MAX_MISTAKES,
		isPaused,
		isComplete,
		isVictoryOpen,
		isRulesOpen,
		isSettingsOpen,
		isNewBestTime,
		settings,
		progress,
		canUndo,
		canRedo,
		hasNextPuzzle,
		setInputMode,
		openSettings,
		closeSettings,
		openRules,
		closeRules,
		closeVictory: () => setIsVictoryOpen(false),
		handleCellClick,
		handleCellContextMenu,
		handleCellFocus,
		handleDragStart,
		handleDragEnter,
		handleDragEnd,
		handleClueClick,
		handleHint,
		handleUndo,
		handleRedo,
		handleReset,
		handleTogglePause,
		handleKeyDown,
		handleUpdateSettings,
		handleNextPuzzle,
		handlePlayAgain,
	};
}
