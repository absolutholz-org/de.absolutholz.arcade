import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { recordGameResult } from '@arcade/lib-medals';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { styled } from '@linaria/react';
import { type JSX, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { FLOODIT_MEDAL_DEFINITIONS } from '../../config/medals.ts';
import { DEFAULT_FLOODIT_SETTINGS, FLOODIT_SETTINGS_CONFIG, type FloodItSettings } from '../../config/settings.ts';
import { createNewGame } from '../../engine/generator.ts';
import { createHistory, pushState, undo } from '../../engine/history.ts';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordRoundCompletion,
	saveActiveGame,
	saveSettings,
} from '../../engine/storage.ts';
import type { BoardState, ColorIndex, Difficulty } from '../../engine/types.ts';
import { applyMove, calculateBoardState } from '../../engine/validator.ts';
import { ColorDock } from '../ColorDock/ColorDock.tsx';
import { GameOverDialog } from '../GameOverDialog/GameOverDialog.tsx';
import { GameStatusBar } from '../GameStatusBar/GameStatusBar.tsx';
import { GridBoard } from '../GridBoard/GridBoard.tsx';

export interface FloodItGameProps {
	initialDifficulty?: Difficulty;
	lang?: SupportedLanguageCode;
	rulesContent?: ReactNode;
}

const PlayfieldArea = styled.main`
	display: block;
	width: 100%;
	max-width: 36rem;
	margin: 0 auto;
	padding: 1rem;
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

function FloodItGameInner({
	initialDifficulty = 'easy',
	activeLang,
	rulesContent,
}: {
	initialDifficulty: Difficulty;
	activeLang: SupportedLanguageCode;
	rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('floodit');
	const { t: tCommon } = useI18n('common');

	const [difficulty, setDifficulty] = useState<Difficulty>(() => resolveInitialDifficulty(initialDifficulty));
	const [boardState, setBoardState] = useState<BoardState>(() => {
		const diff = resolveInitialDifficulty(initialDifficulty);
		const newGame = createNewGame(diff);
		return calculateBoardState(newGame.grid, 0, newGame.maxMoves, newGame.seed);
	});
	const [history, setHistory] = useState(() => createHistory(boardState));
	const [settings, setSettings] = useState<FloodItSettings>(DEFAULT_FLOODIT_SETTINGS);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
				// Restore if saved for matching difficulty
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
			} else if (isExplicitNew || (targetDiff && targetDiff !== initialDifficulty)) {
				const newGame = createNewGame(targetDiff);
				const state = calculateBoardState(newGame.grid, 0, newGame.maxMoves, newGame.seed, newGame.colorCount);
				setBoardState(state);
				setHistory(createHistory(state));
			}
		});
	}, [initialDifficulty]);

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
				0,
				boardState.isWon,
				cellsFlooded,
				maxSingleMoveDelta,
			).then(({ lifetimeStats }) => {
				void recordGameResult(
					{
						gameId: 'floodit',
						won: boardState.isWon,
						playTimeSeconds: 0,
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
					{ definitions: FLOODIT_MEDAL_DEFINITIONS },
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
		setHasRecordedResult(false);
		undoUsedRef.current = false;
		absorbedBottomRightAtMoveRef.current = null;
		maxSingleAbsorptionPercentRef.current = 0;
		void clearActiveGame();
	}, [boardState.seed, difficulty]);

	const handleSelectColor = useCallback(
		(newColor: ColorIndex) => {
			if (boardState.isWon || boardState.isLost || newColor === boardState.currentColor) {
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
		[boardState, difficulty],
	);

	const handleUndo = useCallback(() => {
		if (history.past.length === 0) return;
		undoUsedRef.current = true;
		const undone = undo(history);
		setHistory(undone);
		setBoardState(undone.present);
	}, [history]);

	const handleSettingChange = useCallback((newSettings: FloodItSettings) => {
		setSettings(newSettings);
		void saveSettings(newSettings);
	}, []);

	const difficultyLabel = t(`difficulty.${difficulty}` as 'difficulty.easy');

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/floodit/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={difficultyLabel}
					onOpenRules={() => setIsRulesOpen(true)}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={() => setIsSettingsOpen(true)}
					settingsLabel={t('settings.title')}
				/>
			}
		>
			<PlayfieldArea id="main-content">
				<GameStatusBar
					moves={boardState.moves}
					maxMoves={boardState.maxMoves}
					floodPercentage={boardState.floodPercentage}
					onRestart={handleRestart}
					onUndo={handleUndo}
					canUndo={history.past.length > 0 && !boardState.isWon && !boardState.isLost}
				/>

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
					disabled={boardState.isWon || boardState.isLost}
					showColorblindShapes={settings.showColorblindShapes}
				/>
			</PlayfieldArea>

			<GameOverDialog
				isOpen={boardState.isWon || boardState.isLost}
				isWon={boardState.isWon}
				moves={boardState.moves}
				maxMoves={boardState.maxMoves}
				floodPercentage={boardState.floodPercentage}
				onPlayAgain={handleRestart}
				onNewGame={() => startNewGame()}
				onClose={() => {}}
				difficulty={difficulty}
			/>

			<Dialog isOpen={isRulesOpen} onCancel={() => setIsRulesOpen(false)} title={tCommon('navigation.rules')}>
				<div>{rulesContent}</div>
			</Dialog>

			<Dialog isOpen={isSettingsOpen} onCancel={() => setIsSettingsOpen(false)} title={t('settings.title')}>
				<GameSettingsPanel
					config={FLOODIT_SETTINGS_CONFIG}
					lang={activeLang}
					onSettingsChange={handleSettingChange}
					mode="compact"
				/>
			</Dialog>
		</GameLayout>
	);
}

export function FloodItGame({ initialDifficulty, lang, rulesContent }: FloodItGameProps): JSX.Element {
	const activeLang: SupportedLanguageCode = lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

	return (
		<I18nProvider language={activeLang}>
			<FloodItGameInner
				initialDifficulty={resolveInitialDifficulty(initialDifficulty)}
				activeLang={activeLang}
				rulesContent={rulesContent}
			/>
		</I18nProvider>
	);
}
