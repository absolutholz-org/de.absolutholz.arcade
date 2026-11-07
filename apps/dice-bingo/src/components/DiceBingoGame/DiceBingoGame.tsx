import { type DieState, createDice, rollDice } from '@arcade/lib-dice';
import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { recordGameResult } from '@arcade/lib-medals';
import { playDiceRollSound } from '@arcade/lib-ui/audio/diceAudio';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { Die } from '@arcade/lib-ui/components/Die';
import { GameControlStrip } from '@arcade/lib-ui/components/GameControlStrip';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameRulesDialog } from '@arcade/lib-ui/components/GameRulesDialog';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { GameStatusStrip } from '@arcade/lib-ui/components/GameStatusStrip';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { styled } from '@linaria/react';
import { type JSX, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DICE_BINGO_SETTINGS_CONFIG, type DiceBingoSettings } from '../../config/settings.ts';
import { evaluateBoard } from '../../engine/evaluator.ts';
import { createInitialSnapshot } from '../../engine/generator.ts';
import { evaluateRoundFeats } from '../../engine/medals.ts';
import {
	clearActiveGame,
	loadActiveGame,
	loadLastDifficulty,
	loadSettings,
	recordDiceBingoRoundResult,
	saveActiveGame,
	saveLastDifficulty,
	saveSettings,
} from '../../engine/storage.ts';
import type { Board, DiceBingoSnapshot, DifficultyLevel, GamePhase, GridCoord } from '../../engine/types.ts';
import { DiceBingoBoard } from '../DiceBingoBoard/DiceBingoBoard.tsx';

export interface DiceBingoGameProps {
	initialDifficulty?: DifficultyLevel;
	lang?: SupportedLanguageCode;
	rulesContent?: ReactNode;
}

const PlayfieldWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	width: 100%;
	max-width: 28rem;
	margin: 0 auto;
	padding: 0.25rem 0.5rem;
	box-sizing: border-box;
`;

const RollControlRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1.25rem;
	width: 100%;
	padding: 0.5rem 0;
`;

const DicePairContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
`;

const GameOverSummary = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1rem 0;
	text-align: center;
`;

const ScoreHighlight = styled.div`
	font-size: 2.5rem;
	font-weight: 800;
	color: light-dark(#2563eb, #60a5fa);
`;

const FeatsList = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: center;
`;

const FeatBadge = styled.span`
	padding: 0.25rem 0.75rem;
	font-size: 0.875rem;
	font-weight: 600;
	border-radius: 9999px;
	background-color: light-dark(#dbeafe, #1e3a8a);
	color: light-dark(#1e40af, #93c5fd);
`;

function resolveInitialDifficulty(initial?: DifficultyLevel): DifficultyLevel {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const paramDiff = params.get('difficulty');
		if (paramDiff === 'easy' || paramDiff === 'medium' || paramDiff === 'hard') {
			return paramDiff;
		}
	}
	return initial ?? 'medium';
}

function GameContent({
	initialDifficulty = 'medium',
	activeLang,
	rulesContent,
}: {
	initialDifficulty?: DifficultyLevel;
	activeLang: SupportedLanguageCode;
	rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('dice-bingo');
	const { t: tCommon } = useI18n('common');

	const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => resolveInitialDifficulty(initialDifficulty));
	const [snapshot, setSnapshot] = useState<DiceBingoSnapshot>(() => createInitialSnapshot(difficulty));

	const [dice, setDice] = useState<DieState[]>(() => createDice(2, 6));
	const [isRolling, setIsRolling] = useState<boolean>(false);
	const [spinCount, setSpinCount] = useState<number>(0);

	const rollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const [focusedCoord, setFocusedCoord] = useState<GridCoord>({ row: 0, col: 0 });
	const [hoveredCoord, setHoveredCoord] = useState<GridCoord | null>(null);
	const [settings, setSettings] = useState<DiceBingoSettings>({
		confirmRestart: true,
		highlightPotentialLines: true,
		showPointPreview: true,
	});

	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isGameOverOpen, setIsGameOverOpen] = useState(false);

	// Load settings and resume active game if requested
	useEffect(() => {
		async function init() {
			const savedSettings = await loadSettings();
			setSettings(savedSettings);

			const params = new URLSearchParams(window.location.search);
			const isResume = params.get('resume') === 'true';
			const isNew = params.get('new') === 'true';

			if (isResume && !isNew) {
				const active = await loadActiveGame();
				if (active && !active.isComplete) {
					setSnapshot(active);
					setDifficulty(active.difficulty);
					if (active.currentRoll) {
						setDice([
							{
								id: 'die-1',
								value: active.currentRoll.dice[0],
								sides: 6,
								isHeld: false,
								isRolling: false,
							},
							{
								id: 'die-2',
								value: active.currentRoll.dice[1],
								sides: 6,
								isHeld: false,
								isRolling: false,
							},
						]);
					}
					return;
				}
			}

			const targetDiff = resolveInitialDifficulty(initialDifficulty);
			setDifficulty(targetDiff);
			const fresh = createInitialSnapshot(targetDiff);
			setSnapshot(fresh);
			void saveLastDifficulty(targetDiff);
		}
		void init();
	}, [initialDifficulty]);

	// Auto-save active snapshot
	useEffect(() => {
		if (snapshot.isComplete) {
			void clearActiveGame();
		} else if (snapshot.currentTurn > 0) {
			void saveActiveGame(snapshot);
		}
	}, [snapshot]);

	// Clean up roll timers
	useEffect(() => {
		return () => {
			if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
			if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
		};
	}, []);

	// Board evaluation
	const boardScore = useMemo(() => evaluateBoard(snapshot.board), [snapshot.board]);

	// Calculate highlighted coordinates intersecting focused/hovered cell
	const highlightedCoords = useMemo(() => {
		if (!settings.highlightPotentialLines) return new Set<string>();
		const target = hoveredCoord ?? (snapshot.phase === 'placing' ? focusedCoord : null);
		if (!target) return new Set<string>();

		const coords = new Set<string>();
		const size = snapshot.board.length;

		// Row and Column
		for (let i = 0; i < size; i++) {
			coords.add(`${target.row},${i}`);
			coords.add(`${i},${target.col}`);
		}

		// Main diagonal
		if (target.row === target.col) {
			for (let i = 0; i < size; i++) {
				coords.add(`${i},${i}`);
			}
		}

		// Anti diagonal
		if (target.row + target.col === size - 1) {
			for (let i = 0; i < size; i++) {
				coords.add(`${i},${size - 1 - i}`);
			}
		}

		return coords;
	}, [settings.highlightPotentialLines, hoveredCoord, focusedCoord, snapshot.phase, snapshot.board.length]);

	// Handle dice rolling with animated tumble physics
	const handleRollTrigger = useCallback(() => {
		if (snapshot.phase !== 'ready_to_roll' || isRolling) return;

		playDiceRollSound(2);
		setIsRolling(true);
		setSpinCount((prev) => prev + 1);
		setSnapshot((prev) => ({ ...prev, phase: 'rolling' }));

		const finalResult = rollDice(dice);

		if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
		if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);

		// Rapidly cycle intermediate tumbling faces
		rollIntervalRef.current = setInterval(() => {
			setDice((prev) =>
				prev.map((die) => ({
					...die,
					value: Math.floor(Math.random() * 6) + 1,
					isRolling: true,
				})),
			);
		}, 70);

		// Settle dice after 520ms
		rollTimeoutRef.current = setTimeout(() => {
			if (rollIntervalRef.current) {
				clearInterval(rollIntervalRef.current);
				rollIntervalRef.current = null;
			}

			setDice(finalResult.dice);
			setIsRolling(false);

			const d1 = finalResult.dice[0]?.value ?? 1;
			const d2 = finalResult.dice[1]?.value ?? 1;

			setSnapshot((prev) => ({
				...prev,
				currentRoll: {
					dice: [d1, d2],
					sum: d1 + d2,
				},
				phase: 'placing',
			}));
		}, 520);
	}, [snapshot.phase, isRolling, dice]);

	// Space key trigger for rolling when ready
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === ' ' || e.key === 'Enter') {
				if (
					snapshot.phase === 'ready_to_roll' &&
					!isRulesOpen &&
					!isSettingsOpen &&
					!isPaused &&
					!isGameOverOpen
				) {
					const targetTag = (e.target as HTMLElement | null)?.tagName;
					if (targetTag !== 'BUTTON' && targetTag !== 'INPUT' && targetTag !== 'A') {
						e.preventDefault();
						handleRollTrigger();
					}
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [snapshot.phase, isRulesOpen, isSettingsOpen, isPaused, isGameOverOpen, handleRollTrigger]);

	// Cell placement
	const handleCellClick = useCallback(
		(coord: GridCoord) => {
			if (snapshot.phase !== 'placing' || snapshot.currentRoll === null) return;
			const cell = snapshot.board[coord.row][coord.col];
			if (cell.isObstacle || cell.value !== null) return;

			const rolledSum = snapshot.currentRoll.sum;
			const newBoard: Board = snapshot.board.map((row, r) =>
				row.map((c, col) => {
					if (r === coord.row && col === coord.col) {
						return { ...c, value: rolledSum };
					}
					return c;
				}),
			);

			const nextTurn = snapshot.currentTurn + 1;
			const isComplete = nextTurn >= snapshot.maxTurns;

			const newScore = evaluateBoard(newBoard);
			const nextPhase: GamePhase = isComplete ? 'game_over' : 'ready_to_roll';

			const updatedSnapshot: DiceBingoSnapshot = {
				...snapshot,
				board: newBoard,
				currentTurn: nextTurn,
				currentRoll: null,
				phase: nextPhase,
				moveHistory: [
					...snapshot.moveHistory,
					{
						turn: nextTurn,
						coord,
						roll: snapshot.currentRoll,
					},
				],
				isComplete,
				finalScore: isComplete ? newScore.totalScore : undefined,
				completedAt: isComplete ? Date.now() : undefined,
			};

			setSnapshot(updatedSnapshot);

			if (isComplete) {
				const playTimeSeconds = Math.max(1, Math.round((Date.now() - updatedSnapshot.startedAt) / 1000));
				const feats = evaluateRoundFeats({
					snapshot: updatedSnapshot,
					boardScore: newScore,
				});

				void recordDiceBingoRoundResult(updatedSnapshot.difficulty, newScore.totalScore, playTimeSeconds);

				void recordGameResult({
					gameId: 'dice-bingo',
					won: true,
					playTimeSeconds,
					levelKey: updatedSnapshot.difficulty,
					roundContext: {
						roundMetadata: {
							score: newScore.totalScore,
							difficulty: updatedSnapshot.difficulty,
							feats,
							turns: updatedSnapshot.currentTurn,
							maxTurns: updatedSnapshot.maxTurns,
							cleanSweep: newScore.cleanSweep,
						},
					},
				});

				setIsGameOverOpen(true);
			}
		},
		[snapshot],
	);

	const handleRestart = useCallback(() => {
		const fresh = createInitialSnapshot(difficulty);
		setSnapshot(fresh);
		setIsGameOverOpen(false);
		void clearActiveGame();
	}, [difficulty]);

	const difficultyLabel = t(`difficulty.${difficulty}` as 'difficulty.easy');
	const turnsLeft = snapshot.maxTurns - snapshot.currentTurn;
	const statusText = snapshot.isComplete
		? `${t('game.winTitle')} • ${t('game.totalScore')}: ${boardScore.totalScore}`
		: `${t('game.turnsRemaining')}: ${turnsLeft} / ${snapshot.maxTurns} • ${t('game.currentScore')}: ${boardScore.totalScore}${
				snapshot.phase === 'placing' && snapshot.currentRoll
					? ` • ${t('game.currentRoll')}: ${snapshot.currentRoll.sum}`
					: ''
			}`;
	const statusState = snapshot.isComplete ? 'solved' : 'default';

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/dice-bingo/${activeLang}/`}
					backLabel={t('controls.backToLobby')}
					difficulty={difficultyLabel}
					onOpenRules={() => setIsRulesOpen(true)}
					rulesLabel={tCommon('navigation.rules')}
					onOpenSettings={() => setIsSettingsOpen(true)}
					settingsLabel={t('settings.title')}
				/>
			}
			status={<GameStatusStrip statusText={statusText} statusState={statusState} />}
			toolbar={
				<GameControlStrip
					onReset={handleRestart}
					canReset={snapshot.currentTurn > 0 && !isPaused}
					resetLabel={t('controls.restart')}
					onNewPuzzle={() => {
						window.location.href = `/dice-bingo/${activeLang}/`;
					}}
					canNewPuzzle={!isPaused}
					newPuzzleLabel={t('controls.newGame')}
					aria-label={t('title')}
				/>
			}
		>
			<PlayfieldWrapper>
				<DiceBingoBoard
					board={snapshot.board}
					focusedCoord={focusedCoord}
					hoveredCoord={hoveredCoord}
					highlightedCoords={highlightedCoords}
					pendingRollSum={snapshot.currentRoll?.sum ?? null}
					isPlacing={snapshot.phase === 'placing'}
					onCellClick={handleCellClick}
					onCellFocus={setFocusedCoord}
					onCellHover={setHoveredCoord}
					boardLabel={t('game.boardLabel')}
				/>

				<RollControlRow>
					{/* biome-ignore lint/a11y/useSemanticElements: W3C APG pattern groups interactive dice controls using role="group" */}
					<DicePairContainer role="group" aria-label="Dice">
						{dice.map((die, idx) => (
							<Die
								key={die.id}
								state={die}
								index={idx}
								tumbleIndex={idx}
								isRolling={isRolling}
								spinCount={spinCount}
							/>
						))}
					</DicePairContainer>

					<Button
						variant="primary"
						size="lg"
						disabled={snapshot.phase !== 'ready_to_roll'}
						onClick={handleRollTrigger}
					>
						🎲 {t('game.rollDice')}
					</Button>
				</RollControlRow>
			</PlayfieldWrapper>

			{/* In-game Rules Dialog */}
			<GameRulesDialog isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} gameTitle={t('title')}>
				{rulesContent}
			</GameRulesDialog>

			{/* In-game Settings Dialog */}
			<GameSettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} gameTitle={t('title')}>
				<GameSettingsPanel
					config={DICE_BINGO_SETTINGS_CONFIG}
					lang={activeLang}
					onSettingsChange={(newSettings) => {
						setSettings(newSettings as DiceBingoSettings);
						void saveSettings(newSettings as DiceBingoSettings);
					}}
					mode="compact"
				/>
			</GameSettingsDialog>

			{/* Pause Overlay */}
			<PauseDialog
				isOpen={isPaused && !snapshot.isComplete && !isSettingsOpen && !isRulesOpen}
				onResume={() => setIsPaused(false)}
				onRestart={handleRestart}
			/>

			{/* Game Over / Victory Dialog */}
			<Dialog isOpen={isGameOverOpen} onCancel={() => setIsGameOverOpen(false)} title={t('game.winTitle')}>
				<GameOverSummary>
					<p>{t('game.winDescription', { score: boardScore.totalScore })}</p>
					<ScoreHighlight>{boardScore.totalScore}</ScoreHighlight>
					<p>
						{t('game.linesScored')}: {boardScore.lines.filter((l) => l.score > 0).length} /{' '}
						{boardScore.lines.length}
					</p>

					<FeatsList>
						{evaluateRoundFeats({ snapshot, boardScore }).map((feat) => (
							<FeatBadge key={feat}>⭐ {feat.replace(/_/g, ' ')}</FeatBadge>
						))}
					</FeatsList>

					<Button variant="primary" size="lg" onClick={handleRestart}>
						{t('controls.newGame')}
					</Button>
				</GameOverSummary>
			</Dialog>
		</GameLayout>
	);
}

export function DiceBingoGame(props: DiceBingoGameProps): JSX.Element {
	const activeLang: SupportedLanguageCode =
		props.lang && isSupportedLanguage(props.lang) ? props.lang : DEFAULT_LANGUAGE;

	return (
		<I18nProvider language={activeLang}>
			<GameContent
				initialDifficulty={props.initialDifficulty}
				activeLang={activeLang}
				rulesContent={props.rulesContent}
			/>
		</I18nProvider>
	);
}
