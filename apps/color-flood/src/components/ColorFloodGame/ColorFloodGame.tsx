import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { recordGameResult } from '@arcade/lib-medals';
import { GameControlStrip } from '@arcade/lib-ui/components/GameControlStrip';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameRulesDialog } from '@arcade/lib-ui/components/GameRulesDialog';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { GameStatusStrip } from '@arcade/lib-ui/components/GameStatusStrip';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { styled } from '@linaria/react';
import { type JSX, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { COLOR_FLOOD_MEDAL_DEFINITIONS } from '../../config/medals.ts';
import {
	COLOR_FLOOD_SETTINGS_CONFIG,
	type ColorFloodSettings,
	DEFAULT_COLOR_FLOOD_SETTINGS,
} from '../../config/settings.ts';
import { createNewGame } from '../../engine/generator.ts';
import { createHistory, pushState, redo, undo } from '../../engine/history.ts';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordRoundCompletion,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine/storage.ts';
import { type BoardState, type ColorIndex, DIFFICULTY_CONFIGS, type Difficulty } from '../../engine/types.ts';
import { applyMove, calculateBoardState } from '../../engine/validator.ts';
import { ColorDock } from '../ColorDock/ColorDock.tsx';
import { GameOverDialog } from '../GameOverDialog/GameOverDialog.tsx';
import { GridBoard } from '../GridBoard/GridBoard.tsx';

export interface ColorFloodGameProps {
	initialDifficulty?: Difficulty;
	lang?: SupportedLanguageCode;
	rulesContent?: ReactNode;
}

const PlayfieldArea = styled.div`
	display: block;
	width: 100%;
	max-width: 36rem;
	margin: 0 auto;
	padding: 0.5rem;
`;

function resolveInitialDifficulty(initial?: Difficulty): Difficulty {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const paramDiff = params.get('difficulty');
		if (paramDiff === 'beginner' || paramDiff === 'easy' || paramDiff === 'medium' || paramDiff === 'hard') {
			return paramDiff;
		}
	}
	return initial ?? 'beginner';
}

function ColorFloodGameInner({
	initialDifficulty = 'easy',
	activeLang,
	rulesContent,
}: {
	initialDifficulty: Difficulty;
	activeLang: SupportedLanguageCode;
	rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('color-flood');
	const { t: tCommon } = useI18n('common');

	const [difficulty, setDifficulty] = useState<Difficulty>(() => resolveInitialDifficulty(initialDifficulty));
	const [boardState, setBoardState] = useState<BoardState>(() => {
		const diff = resolveInitialDifficulty(initialDifficulty);
		const newGame = createNewGame(diff);
		return calculateBoardState(newGame.grid, 0, newGame.maxMoves, newGame.seed, newGame.colorCount);
	});
	const [history, setHistory] = useState(() => createHistory(boardState));
	const [settings, setSettings] = useState<ColorFloodSettings>(DEFAULT_COLOR_FLOOD_SETTINGS);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isGameOverOpen, setIsGameOverOpen] = useState(false);
	const [hasRecordedResult, setHasRecordedResult] = useState(false);

	const undoUsedRef = useRef(false);
	const absorbedBottomRightAtMoveRef = useRef<number | null>(null);
	const maxSingleAbsorptionPercentRef = useRef<number>(0);

	// Load settings & active session on mount
	useEffect(() => {
		void loadSettings().then(setSettings);

		const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
		const isExplicitNew = params?.get('new') === 'true';
		const queryDiff = params?.get('difficulty') as Difficulty | null;
		const targetDiff =
			queryDiff === 'beginner' || queryDiff === 'easy' || queryDiff === 'medium' || queryDiff === 'hard'
				? queryDiff
				: initialDifficulty;

		if (targetDiff !== initialDifficulty) {
			setDifficulty(targetDiff);
		}

		void loadActiveGame().then((snapshot) => {
			if (!isExplicitNew && snapshot && snapshot.difficulty === targetDiff) {
				const restored = calculateBoardState(
					snapshot.grid,
					snapshot.moves,
					snapshot.maxMoves,
					snapshot.seed,
					snapshot.colorCount ?? 6,
				);
				setBoardState(restored);
				setHistory(createHistory(restored));
				setDifficulty(snapshot.difficulty);
				undoUsedRef.current = Boolean(snapshot.undoUsed);
				void saveLastConfig({
					difficulty: snapshot.difficulty,
					size: DIFFICULTY_CONFIGS[snapshot.difficulty].size,
					colorCount: DIFFICULTY_CONFIGS[snapshot.difficulty].colorCount,
				});
			} else if (isExplicitNew || (targetDiff && targetDiff !== initialDifficulty)) {
				const newGame = createNewGame(targetDiff);
				const state = calculateBoardState(newGame.grid, 0, newGame.maxMoves, newGame.seed, newGame.colorCount);
				setBoardState(state);
				setHistory(createHistory(state));
				void saveLastConfig({
					difficulty: targetDiff,
					size: DIFFICULTY_CONFIGS[targetDiff].size,
					colorCount: DIFFICULTY_CONFIGS[targetDiff].colorCount,
				});
			} else {
				void saveLastConfig({
					difficulty: targetDiff,
					size: DIFFICULTY_CONFIGS[targetDiff].size,
					colorCount: DIFFICULTY_CONFIGS[targetDiff].colorCount,
				});
			}
		});
	}, [initialDifficulty]);

	// Active gameplay timer
	useEffect(() => {
		if (isPaused || boardState.isWon || boardState.isLost || isRulesOpen || isSettingsOpen) {
			return;
		}
		const intervalId = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);
		return () => window.clearInterval(intervalId);
	}, [isPaused, boardState.isWon, boardState.isLost, isRulesOpen, isSettingsOpen]);

	// Sync game over dialog visibility with board resolution
	useEffect(() => {
		if (boardState.isWon || boardState.isLost) {
			setIsGameOverOpen(true);
		} else {
			setIsGameOverOpen(false);
		}
	}, [boardState.isWon, boardState.isLost]);

	// Handle Victory / Defeat recording
	useEffect(() => {
		if ((boardState.isWon || boardState.isLost) && !hasRecordedResult) {
			setHasRecordedResult(true);
			void clearActiveGame();

			const spareMoves = Math.max(0, boardState.maxMoves - boardState.moves);
			const isWireToWire = boardState.isWon && boardState.moves === boardState.maxMoves;
			const isCleanSweep = boardState.isWon && spareMoves >= 5;
			const isNoRegrets = boardState.isWon && !undoUsedRef.current;
			const isCornerToCorner =
				boardState.isWon &&
				absorbedBottomRightAtMoveRef.current !== null &&
				absorbedBottomRightAtMoveRef.current <= 8;
			const isGiantLeap = maxSingleAbsorptionPercentRef.current >= 25;
			const isTsunami = maxSingleAbsorptionPercentRef.current >= 40;
			const isSymbolSurveyor = boardState.isWon && Boolean(settings.showColorblindShapes);
			const cellsFlooded = boardState.floodedCluster.size;
			const maxSingleMoveDelta = maxSingleAbsorptionPercentRef.current / 100;

			void recordRoundCompletion(
				difficulty,
				boardState.moves,
				elapsedSeconds,
				boardState.isWon,
				cellsFlooded,
				maxSingleMoveDelta,
			).then(({ lifetimeStats }) => {
				void recordGameResult(
					{
						gameId: 'color-flood',
						won: boardState.isWon,
						playTimeSeconds: elapsedSeconds,
						levelKey: difficulty,
						roundContext: {
							won: boardState.isWon,
							levelKey: difficulty,
							roundMetadata: {
								spareMoves,
								moves: boardState.moves,
								maxMoves: boardState.maxMoves,
								isWireToWire,
								isCleanSweep,
								isNoRegrets,
								isCornerToCorner,
								isGiantLeap,
								isTsunami,
								isSymbolSurveyor,
								cellsFlooded,
								maxSingleMoveDelta,
								tierWins: lifetimeStats.tierWins,
								lifetimeCellsFlooded: lifetimeStats.lifetimeCellsFlooded,
								finalColor: boardState.currentColor,
							},
						},
					},
					{ definitions: COLOR_FLOOD_MEDAL_DEFINITIONS },
				);
			});
		}
	}, [
		boardState.isWon,
		boardState.isLost,
		boardState.moves,
		boardState.maxMoves,
		boardState.currentColor,
		boardState.floodedCluster.size,
		difficulty,
		elapsedSeconds,
		hasRecordedResult,
		settings.showColorblindShapes,
	]);

	const startNewGame = useCallback(
		(diff = difficulty) => {
			const game = createNewGame(diff);
			const state = calculateBoardState(game.grid, 0, game.maxMoves, game.seed, game.colorCount);
			setDifficulty(diff);
			setBoardState(state);
			setHistory(createHistory(state));
			setElapsedSeconds(0);
			setIsPaused(false);
			setIsGameOverOpen(false);
			setHasRecordedResult(false);
			undoUsedRef.current = false;
			absorbedBottomRightAtMoveRef.current = null;
			maxSingleAbsorptionPercentRef.current = 0;
			void clearActiveGame();
		},
		[difficulty],
	);

	const handleRestart = useCallback(() => {
		const newGame = createNewGame(difficulty, boardState.seed);
		const restarted = calculateBoardState(newGame.grid, 0, newGame.maxMoves, newGame.seed, newGame.colorCount);
		setBoardState(restarted);
		setHistory(createHistory(restarted));
		setElapsedSeconds(0);
		setIsPaused(false);
		setIsGameOverOpen(false);
		setHasRecordedResult(false);
		undoUsedRef.current = false;
		absorbedBottomRightAtMoveRef.current = null;
		maxSingleAbsorptionPercentRef.current = 0;
		void clearActiveGame();
	}, [boardState.seed, difficulty]);

	const handleSelectColor = useCallback(
		(newColor: ColorIndex) => {
			if (isPaused || boardState.isWon || boardState.isLost || newColor === boardState.currentColor) {
				return;
			}
			const nextState = applyMove(boardState, newColor);
			setBoardState(nextState);
			setHistory((h) => pushState(h, nextState));

			// Track bottom-right cell absorption
			const bottomRightKey = `${nextState.size - 1},${nextState.size - 1}`;
			if (absorbedBottomRightAtMoveRef.current === null && nextState.floodedCluster.has(bottomRightKey)) {
				absorbedBottomRightAtMoveRef.current = nextState.moves;
			}

			// Track max single-move absorption
			const deltaPercent = nextState.floodPercentage - boardState.floodPercentage;
			if (deltaPercent > maxSingleAbsorptionPercentRef.current) {
				maxSingleAbsorptionPercentRef.current = deltaPercent;
			}

			// Persist active snapshot if game is still in progress
			if (!nextState.isWon && !nextState.isLost) {
				void saveActiveGame({
					difficulty,
					size: nextState.size,
					colorCount: nextState.colorCount,
					grid: nextState.grid.map((r) => [...r]),
					moves: nextState.moves,
					maxMoves: nextState.maxMoves,
					seed: nextState.seed,
					history: [],
					timestamp: Date.now(),
					undoUsed: undoUsedRef.current,
				});
			}
		},
		[boardState, difficulty, isPaused],
	);

	const handleUndo = useCallback(() => {
		if (history.past.length === 0 || isPaused) return;
		undoUsedRef.current = true;
		const undone = undo(history);
		setHistory(undone);
		setBoardState(undone.present);
	}, [history, isPaused]);

	const handleRedo = useCallback(() => {
		if (history.future.length === 0 || isPaused) return;
		const redone = redo(history);
		setHistory(redone);
		setBoardState(redone.present);
	}, [history, isPaused]);

	const handleTogglePause = useCallback(() => {
		if (boardState.isWon || boardState.isLost) return;
		setIsPaused((prev) => !prev);
	}, [boardState.isWon, boardState.isLost]);

	const handleSettingChange = useCallback((newSettings: ColorFloodSettings) => {
		setSettings(newSettings);
		void saveSettings(newSettings);
	}, []);

	const difficultyLabel = t(`difficulty.${difficulty}` as 'difficulty.easy');
	const movesLeft = Math.max(0, boardState.maxMoves - boardState.moves);
	const roundedPercentage = Math.round(boardState.floodPercentage);
	const statusText = boardState.isWon
		? t('game.winTitle')
		: boardState.isLost
			? t('game.lossTitle')
			: `${t('game.movesRemaining')}: ${movesLeft} / ${boardState.maxMoves} • ${t('game.percentageFlooded')}: ${roundedPercentage}%`;
	const statusState = boardState.isWon ? 'solved' : boardState.isLost ? 'danger' : 'default';
	const isInteractive = !isPaused && !boardState.isWon && !boardState.isLost;

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/color-flood/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={difficultyLabel}
					onOpenRules={() => setIsRulesOpen(true)}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={() => setIsSettingsOpen(true)}
					settingsLabel={t('settings.title')}
				/>
			}
			status={
				<GameStatusStrip
					statusText={statusText}
					statusState={statusState}
					elapsedSeconds={elapsedSeconds}
					isPaused={isPaused}
					onTogglePause={handleTogglePause}
				/>
			}
			toolbar={
				<GameControlStrip
					onUndo={handleUndo}
					canUndo={history.past.length > 0 && isInteractive}
					undoLabel={t('controls.undo')}
					onRedo={handleRedo}
					canRedo={history.future.length > 0 && isInteractive}
					redoLabel={t('controls.redo')}
					onReset={handleRestart}
					canReset={boardState.moves > 0 && !isPaused}
					resetLabel={t('controls.restart')}
					onNewPuzzle={() => startNewGame()}
					canNewPuzzle={!isPaused}
					newPuzzleLabel={t('controls.newGame')}
					aria-label={t('title')}
				/>
			}
		>
			<PlayfieldArea>
				<GridBoard
					grid={boardState.grid}
					size={boardState.size}
					showColorblindShapes={settings.showColorblindShapes}
					currentColor={boardState.currentColor}
					floodedCluster={boardState.floodedCluster}
				/>

				<ColorDock
					currentColor={boardState.currentColor}
					colors={boardState.activeColors}
					onSelectColor={handleSelectColor}
					disabled={!isInteractive}
					showColorblindShapes={settings.showColorblindShapes}
				/>
			</PlayfieldArea>

			<PauseDialog
				isOpen={isPaused && !boardState.isWon && !boardState.isLost && !isSettingsOpen && !isRulesOpen}
				onResume={handleTogglePause}
				onRestart={handleRestart}
			/>

			<GameOverDialog
				isOpen={isGameOverOpen}
				isWon={boardState.isWon}
				moves={boardState.moves}
				maxMoves={boardState.maxMoves}
				floodPercentage={boardState.floodPercentage}
				onPlayAgain={handleRestart}
				onNewGame={() => startNewGame()}
				onClose={() => setIsGameOverOpen(false)}
				difficulty={difficulty}
			/>

			<GameRulesDialog isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} gameTitle={t('title')}>
				{rulesContent}
			</GameRulesDialog>

			<GameSettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} gameTitle={t('title')}>
				<GameSettingsPanel
					config={COLOR_FLOOD_SETTINGS_CONFIG}
					lang={activeLang}
					onSettingsChange={handleSettingChange}
					mode="compact"
				/>
			</GameSettingsDialog>
		</GameLayout>
	);
}

export function ColorFloodGame({ initialDifficulty, lang, rulesContent }: ColorFloodGameProps): JSX.Element {
	const activeLang: SupportedLanguageCode = lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

	return (
		<I18nProvider language={activeLang}>
			<ColorFloodGameInner
				initialDifficulty={resolveInitialDifficulty(initialDifficulty)}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
