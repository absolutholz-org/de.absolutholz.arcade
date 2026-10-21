import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSoundEffects } from '../../audio/useSoundEffects.js';
import { SoloNobleEngine } from '../../engine/engine.js';
import type { BoardLayoutId, CoordinateKey, GameStatus, GameVariant } from '../../engine/types.js';
import {
	clearActiveGame,
	loadActiveGame,
	loadPreferences,
	saveActiveGame,
	updateRecord,
} from '../../storage/storage.js';
import { SoloNobleBoard } from '../SoloNobleBoard/SoloNobleBoard.js';
import { SoloNobleControls } from '../SoloNobleControls/SoloNobleControls.js';
import { SoloNobleGameHeader } from '../SoloNobleGameHeader/SoloNobleGameHeader.js';
import * as S from './SoloNobleGame.styles.js';

function GameContent() {
	const { t } = useI18n('solo-noble');
	const sfx = useSoundEffects();

	const [layoutId, setLayoutId] = useState<BoardLayoutId>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const paramLayout = params.get('layout') as BoardLayoutId | null;
			if (paramLayout && ['english', 'european', 'triangular', 'diamond', 'wiegleb'].includes(paramLayout)) {
				return paramLayout;
			}
		}
		return 'english';
	});

	const [variant, setVariant] = useState<GameVariant>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const paramVariant = params.get('variant') as GameVariant | null;
			if (paramVariant && ['classic-central', 'clear-out', 'custom-start'].includes(paramVariant)) {
				return paramVariant;
			}
		}
		return 'classic-central';
	});

	const [selectedHole, setSelectedHole] = useState<CoordinateKey | null>(null);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const engine = useMemo(() => new SoloNobleEngine(layoutId, variant), [layoutId, variant]);

	const [board, setBoard] = useState(engine.getBoard());
	const [status, setStatus] = useState<GameStatus>(engine.getStatus());
	const [pegsRemaining, setPegsRemaining] = useState(engine.getPegCount());
	const [movesCount, setMovesCount] = useState(engine.getMoveCount());

	// Timer interval
	useEffect(() => {
		if (status !== 'playing' || isPaused) return;
		const timer = setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [status, isPaused]);

	// Initialize preferences / query params on mount
	useEffect(() => {
		async function init() {
			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const isResume = params.get('resume') === 'true';
				if (isResume) {
					const active = await loadActiveGame();
					if (active && active.status === 'playing') {
						setLayoutId(active.layoutId);
						setVariant(active.variant);
						setElapsedSeconds(active.elapsedSeconds);
						engine.loadState({
							layoutId: active.layoutId,
							variant: active.variant,
							status: active.status,
							board: active.board,
							pegCount: active.pegsRemaining,
							moveCount: active.movesCount,
							initialEmptyKey: null,
						});
						setBoard({ ...engine.getBoard() });
						setStatus(engine.getStatus());
						setPegsRemaining(engine.getPegCount());
						setMovesCount(engine.getMoveCount());
						return;
					}
				}
			}

			const prefs = await loadPreferences();
			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				if (!params.has('layout') && !params.has('variant')) {
					setLayoutId(prefs.layoutId);
					setVariant(prefs.variant);
				}
			}
		}
		init();
	}, [engine]);

	const syncEngineState = useCallback(() => {
		const newBoard = { ...engine.getBoard() };
		const newStatus = engine.getStatus();
		const newPegs = engine.getPegCount();
		const newMoves = engine.getMoveCount();

		setBoard(newBoard);
		setStatus(newStatus);
		setPegsRemaining(newPegs);
		setMovesCount(newMoves);

		if (newStatus === 'playing') {
			saveActiveGame({
				layoutId,
				variant,
				board: newBoard,
				elapsedSeconds,
				pegsRemaining: newPegs,
				movesCount: newMoves,
				status: newStatus,
				timestamp: Date.now(),
			});
		} else if (newStatus === 'won' || newStatus === 'stuck') {
			clearActiveGame();
		}
	}, [elapsedSeconds, engine, layoutId, variant]);

	const validTargets = useMemo(() => {
		if (!selectedHole || status !== 'playing' || isPaused) {
			return new Set<CoordinateKey>();
		}
		const legalJumps = engine.getLegalMovesFrom(selectedHole);
		return new Set(legalJumps.map((jump) => jump.to));
	}, [engine, selectedHole, status, isPaused]);

	const handleCellClick = useCallback(
		(holeKey: CoordinateKey) => {
			if (isPaused) return;

			if (status === 'ready') {
				const started = engine.selectInitialEmptyHole(holeKey);
				if (started) {
					sfx.playJump();
					syncEngineState();
				}
				return;
			}

			if (status !== 'playing') return;

			if (board[holeKey]) {
				setSelectedHole((prev) => (prev === holeKey ? null : holeKey));
				sfx.playSelect();
				return;
			}

			if (selectedHole && validTargets.has(holeKey)) {
				const moved = engine.executeMove(selectedHole, holeKey);
				if (moved) {
					setSelectedHole(null);
					sfx.playJump();
					syncEngineState();

					const currentStatus = engine.getStatus();
					if (currentStatus === 'won') {
						sfx.playVictory();
						updateRecord(layoutId, variant, engine.getPegCount(), engine.getMoveCount(), true);
					} else if (currentStatus === 'stuck') {
						sfx.playStuck();
						updateRecord(layoutId, variant, engine.getPegCount(), engine.getMoveCount(), false);
					}
				}
			} else {
				sfx.playInvalid();
			}
		},
		[board, engine, isPaused, layoutId, selectedHole, sfx, status, syncEngineState, validTargets, variant],
	);

	const handleUndo = useCallback(() => {
		if (engine.undo()) {
			setSelectedHole(null);
			sfx.playUndo();
			syncEngineState();
		}
	}, [engine, sfx, syncEngineState]);

	const handleRedo = useCallback(() => {
		if (engine.redo()) {
			setSelectedHole(null);
			sfx.playJump();
			syncEngineState();
		}
	}, [engine, sfx, syncEngineState]);

	const handleReset = useCallback(() => {
		engine.reset();
		setSelectedHole(null);
		setElapsedSeconds(0);
		sfx.playSelect();
		syncEngineState();
		clearActiveGame();
	}, [engine, sfx, syncEngineState]);

	return (
		<S.GameContainer>
			<SoloNobleGameHeader
				layoutId={layoutId}
				variant={variant}
				elapsedSeconds={elapsedSeconds}
				isPaused={isPaused}
				onTogglePause={() => setIsPaused((prev) => !prev)}
				onReset={handleReset}
			/>
			<SoloNobleBoard
				layout={engine.getLayout()}
				board={board}
				status={status}
				selectedHole={selectedHole}
				validTargets={validTargets}
				onCellClick={handleCellClick}
			/>
			<SoloNobleControls
				pegsRemaining={pegsRemaining}
				movesCount={movesCount}
				status={status}
				canUndo={engine.canUndo()}
				canRedo={engine.canRedo()}
				onUndo={handleUndo}
				onRedo={handleRedo}
				onReset={handleReset}
				labels={{
					pegsRemaining: t('stats.pegsRemaining'),
					movesCount: t('stats.movesCount'),
					undo: t('controls.undo'),
					redo: t('controls.redo'),
					reset: t('controls.reset'),
					statusReady: t('status.readyInstruction'),
					statusWon: t('status.wonDesc'),
					statusStuck: t('status.stuckDesc'),
				}}
			/>
		</S.GameContainer>
	);
}

export function SoloNobleGame({ lang }: { lang: SupportedLanguageCode }) {
	return (
		<I18nProvider language={lang}>
			<GameContent />
		</I18nProvider>
	);
}
