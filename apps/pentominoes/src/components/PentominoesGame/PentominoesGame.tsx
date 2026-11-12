import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { recordGameResult } from '@arcade/lib-medals';
import { Button } from '@arcade/lib-ui/components/Button';
import { Confetti } from '@arcade/lib-ui/components/Confetti';
import { GameControlButton, GameControlStrip } from '@arcade/lib-ui/components/GameControlStrip';
import { GameHeader } from '@arcade/lib-ui/components/GameHeader';
import { GameRulesDialog } from '@arcade/lib-ui/components/GameRulesDialog';
import { GameSettingsDialog } from '@arcade/lib-ui/components/GameSettingsDialog';
import { GameSettingsPanel } from '@arcade/lib-ui/components/GameSettingsPanel';
import { GameStatusStrip } from '@arcade/lib-ui/components/GameStatusStrip';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { PauseDialog } from '@arcade/lib-ui/components/PauseDialog';
import { GameLayout } from '@arcade/lib-ui/layouts/GameLayout';
import { type JSX, type KeyboardEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PENTOMINOES_MEDAL_DEFINITIONS } from '../../config/medals.ts';
import {
	DEFAULT_PENTOMINOES_SETTINGS,
	PENTOMINOES_SETTINGS_CONFIG,
	type PentominoesSettings,
} from '../../config/settings.ts';
import {
	CURATED_LEVELS,
	generateProceduralPuzzle,
	getCuratedLevel,
	getLevelsByDifficulty,
} from '../../engine/generator.ts';
import { canRedo, canUndo, createHistory, pushHistory, redoHistory, undoHistory } from '../../engine/history.ts';
import {
	getPieceDefinition,
	getPlacementCells,
	getPlacementLabelCell,
	rotateClockwise,
	rotateCounterClockwise,
} from '../../engine/pieces.ts';
import { findHintPlacement } from '../../engine/solver.ts';
import {
	clearActiveGame,
	loadActiveGame,
	loadSettings,
	recordCompletedLevel,
	saveActiveGame,
	saveLastConfig,
	saveSettings,
} from '../../engine/storage.ts';
import type {
	ActivePieceSelection,
	Coordinate,
	Difficulty,
	LevelDefinition,
	PieceId,
	Placement,
} from '../../engine/types.ts';
import {
	buildOccupancyGrid,
	findPlacementAtCell,
	isPuzzleComplete,
	placePiece,
	removePiece,
	validatePlacement,
} from '../../engine/validator.ts';
import { VictoryDialog } from '../VictoryDialog/index.ts';
import {
	ActiveTransformBar,
	BoardGridContainer,
	BoardRow,
	BoardSection,
	CellLabelBadge,
	ColCoordBadge,
	CoordCornerCell,
	CoordinateHeaderRow,
	KeyboardHelpText,
	RowCoordBadge,
	SrOnlyLiveRegion,
	TransformButtonsGroup,
	TrayGrid,
	TrayPieceLabel,
	TraySection,
	WorkspaceWrapper,
	cellButtonClass,
	trayItemButtonClass,
} from './PentominoesGame.styles.ts';
import { PieceGlyph } from './PieceGlyph.tsx';

export interface PentominoesGameProps {
	readonly lang?: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}

function resolveInitialLevel(): {
	readonly level: LevelDefinition;
	readonly mode: 'curated' | 'procedural';
	readonly seed: number;
} {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const modeParam = params.get('mode');
		const diffParam = params.get('difficulty') as Difficulty | null;
		const levelParam = params.get('level');

		const validDiff: Difficulty =
			diffParam === 'easy' || diffParam === 'medium' || diffParam === 'hard' || diffParam === 'expert'
				? diffParam
				: 'easy';

		if (modeParam === 'procedural') {
			const seed = Date.now() % 1_000_000;
			const generated = generateProceduralPuzzle(validDiff, seed);
			return { level: generated.level, mode: 'procedural', seed };
		}

		if (levelParam) {
			const found = getCuratedLevel(levelParam);
			if (found) {
				return { level: found, mode: 'curated', seed: 1 };
			}
		}

		const byDiff = getLevelsByDifficulty(validDiff)[0];
		if (byDiff) {
			return { level: byDiff, mode: 'curated', seed: 1 };
		}
	}

	return { level: CURATED_LEVELS[0], mode: 'curated', seed: 1 };
}

function formatTimer(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function PentominoesGameInner({
	activeLang,
	rulesContent,
}: {
	readonly activeLang: SupportedLanguageCode;
	readonly rulesContent?: ReactNode;
}): JSX.Element {
	const { t } = useI18n('pentominoes');
	const { t: tCommon } = useI18n('common');

	const initialSetup = useMemo(() => resolveInitialLevel(), []);
	const [level, setLevel] = useState<LevelDefinition>(initialSetup.level);
	const [mode, setMode] = useState<'curated' | 'procedural'>(initialSetup.mode);
	const [seed, setSeed] = useState<number>(initialSetup.seed);
	const [history, setHistory] = useState(() => createHistory([]));
	const [activePiece, setActivePiece] = useState<ActivePieceSelection | null>(null);
	const [cursor, setCursor] = useState<Coordinate>({ row: 0, col: 0 });
	const [moveCount, setMoveCount] = useState(0);
	const [hintsUsed, setHintsUsed] = useState(0);
	const [undoCount, setUndoCount] = useState(0);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [settings, setSettings] = useState<PentominoesSettings>(DEFAULT_PENTOMINOES_SETTINGS);
	const [isPaused, setIsPaused] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isVictoryOpen, setIsVictoryOpen] = useState(false);
	const [hasRecordedVictory, setHasRecordedVictory] = useState(false);
	const [announcement, setAnnouncement] = useState('');

	const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
	const placements = history.present;
	const isSolved = useMemo(
		() => isPuzzleComplete(level.mask, level.pieceIds, placements),
		[level.mask, level.pieceIds, placements],
	);

	// Hydrate settings & saved game if resuming
	useEffect(() => {
		void loadSettings().then(setSettings);

		if (typeof window === 'undefined') {
			return;
		}
		const params = new URLSearchParams(window.location.search);
		const isResume = params.get('resume') === 'true';
		const isExplicitNew = params.get('new') === 'true';

		if (isResume || !isExplicitNew) {
			void loadActiveGame().then((saved) => {
				if (!saved) {
					return;
				}
				if (isResume || saved.levelId === level.id) {
					const curated = getCuratedLevel(saved.levelId);
					const restoredLevel: LevelDefinition = curated ?? {
						id: saved.levelId,
						difficulty: saved.difficulty,
						category: 'custom-silhouette',
						rows: saved.mask.length,
						cols: saved.mask[0]?.length ?? 0,
						mask: saved.mask,
						pieceIds: saved.pieceIds,
					};
					setLevel(restoredLevel);
					setMode(saved.mode);
					setSeed(saved.seed);
					setHistory(createHistory(saved.placements));
					setMoveCount(saved.moveCount);
					setHintsUsed(saved.hintsUsed);
					setUndoCount(saved.undoCount);
					setElapsedSeconds(saved.elapsedSeconds);
				}
			});
		}
	}, [level.id]);

	// Active timer
	useEffect(() => {
		if (isPaused || isSolved || isRulesOpen || isSettingsOpen) {
			return;
		}
		const timerId = window.setInterval(() => {
			setElapsedSeconds((prev) => prev + 1);
		}, 1000);
		return () => window.clearInterval(timerId);
	}, [isPaused, isSolved, isRulesOpen, isSettingsOpen]);

	// Persist active session on placement changes
	useEffect(() => {
		if (isSolved) {
			return;
		}
		if (placements.length === 0 && moveCount === 0) {
			return;
		}
		void saveActiveGame({
			levelId: level.id,
			mode,
			difficulty: level.difficulty,
			seed,
			mask: level.mask,
			pieceIds: level.pieceIds,
			placements,
			moveCount,
			hintsUsed,
			undoCount,
			elapsedSeconds,
			updatedAt: new Date().toISOString(),
		});
	}, [isSolved, level, mode, seed, placements, moveCount, hintsUsed, undoCount, elapsedSeconds]);

	// Handle victory
	useEffect(() => {
		if (!isSolved || hasRecordedVictory) {
			return;
		}
		setHasRecordedVictory(true);
		setIsVictoryOpen(true);
		setActivePiece(null);
		setAnnouncement(t('a11y.puzzleSolved'));
		void clearActiveGame();

		void recordCompletedLevel(level.id, level.difficulty, elapsedSeconds, moveCount).then((progress) => {
			const completedSet = new Set(progress.completedLevelIds);
			const pentaLadderCount = CURATED_LEVELS.filter(
				(lvl) => lvl.category === 'penta-ladder' && completedSet.has(lvl.id),
			).length;
			const silhouetteCount = CURATED_LEVELS.filter(
				(lvl) => lvl.category === 'custom-silhouette' && completedSet.has(lvl.id),
			).length;
			const fullSetCount = CURATED_LEVELS.filter(
				(lvl) => lvl.category === 'full-set-60' && completedSet.has(lvl.id),
			).length;

			const isSpeedPacker =
				(level.difficulty === 'hard' || level.difficulty === 'expert') && elapsedSeconds <= 180;

			void recordGameResult(
				{
					gameId: 'pentominoes',
					won: true,
					playTimeSeconds: elapsedSeconds,
					levelKey: level.difficulty,
					roundContext: {
						won: true,
						levelKey: level.difficulty,
						roundMetadata: {
							pentaLadderSolved: pentaLadderCount,
							silhouettesSolved: silhouetteCount,
							fullSet60Solved: fullSetCount,
							isFlawless: hintsUsed === 0 && undoCount === 0,
							isSpeedPacker,
						},
					},
				},
				{ definitions: PENTOMINOES_MEDAL_DEFINITIONS },
			);
		});
	}, [isSolved, hasRecordedVictory, level.id, level.difficulty, elapsedSeconds, moveCount, hintsUsed, undoCount, t]);

	const occupancyGrid = useMemo(() => buildOccupancyGrid(level.mask, placements), [level.mask, placements]);

	const placedPieceIds = useMemo(() => new Set(placements.map((p) => p.pieceId)), [placements]);

	// Compute ghost preview cells for activePiece at cursor
	const ghostPreview = useMemo(() => {
		if (!activePiece || !settings.highlightGhostValidity) {
			return { cells: new Set<string>(), valid: false };
		}
		const candidate: Placement = {
			pieceId: activePiece.pieceId,
			anchor: cursor,
			rotation: activePiece.rotation,
			flipped: activePiece.flipped,
		};
		const validation = validatePlacement(level.mask, placements, candidate);
		const coordKeys = new Set(getPlacementCells(candidate).map((c) => `${c.row},${c.col}`));
		return { cells: coordKeys, valid: validation.valid };
	}, [activePiece, cursor, level.mask, placements, settings.highlightGhostValidity]);

	// Map each placed piece's label cell for rendering its canonical letter
	const labelCellByCoord = useMemo(() => {
		const map = new Map<string, string>();
		for (const p of placements) {
			const labelCoord = getPlacementLabelCell(p);
			const def = getPieceDefinition(p.pieceId);
			map.set(`${labelCoord.row},${labelCoord.col}`, def.label);
		}
		return map;
	}, [placements]);

	const findFirstPlayableCell = useCallback((): Coordinate => {
		for (let r = 0; r < level.rows; r++) {
			for (let c = 0; c < level.cols; c++) {
				if (level.mask[r]?.[c] === 1) {
					return { row: r, col: c };
				}
			}
		}
		return { row: 0, col: 0 };
	}, [level.cols, level.mask, level.rows]);

	const focusBoardCursor = useCallback(
		(preferred?: Coordinate) => {
			const candidate = preferred ?? cursor;
			const isPlayable = level.mask[candidate.row]?.[candidate.col] === 1;
			const target = isPlayable ? candidate : findFirstPlayableCell();
			setCursor(target);
			const key = `${target.row},${target.col}`;
			const btn = cellRefs.current.get(key);
			if (btn) {
				btn.focus();
			} else if (typeof window !== 'undefined') {
				window.requestAnimationFrame(() => {
					cellRefs.current.get(key)?.focus();
				});
			}
		},
		[cursor, findFirstPlayableCell, level.mask],
	);

	// Ensure initial cursor starts on a playable cell when level changes
	useEffect(() => {
		setCursor((prev) => {
			if (level.mask[prev.row]?.[prev.col] === 1) {
				return prev;
			}
			return findFirstPlayableCell();
		});
	}, [findFirstPlayableCell, level.mask]);

	const handleSelectTrayPiece = useCallback(
		(pieceId: PieceId) => {
			if (placedPieceIds.has(pieceId)) {
				const existing = placements.find((p) => p.pieceId === pieceId);
				const nextPlacements = removePiece(placements, pieceId);
				setHistory((prev) => pushHistory(prev, nextPlacements));
				setActivePiece({ pieceId, rotation: 0, flipped: false });
				setAnnouncement(t('a11y.pickedUpFromTray', { pieceId }));
				focusBoardCursor(existing?.anchor);
				return;
			}
			if (activePiece?.pieceId === pieceId) {
				setActivePiece(null);
				setAnnouncement(t('a11y.returnedToTray', { pieceId }));
				return;
			}
			setActivePiece({ pieceId, rotation: 0, flipped: false });
			setAnnouncement(t('a11y.pickedUpFromTray', { pieceId }));
			focusBoardCursor();
		},
		[activePiece, focusBoardCursor, placedPieceIds, placements, t],
	);

	const handleRotateCw = useCallback(() => {
		if (!activePiece) {
			return;
		}
		const nextRotation = rotateClockwise(activePiece.rotation);
		setActivePiece({ ...activePiece, rotation: nextRotation });
		setAnnouncement(
			t('a11y.rotatedPiece', {
				pieceId: activePiece.pieceId,
				rotation: nextRotation,
			}),
		);
	}, [activePiece, t]);

	const handleRotateCcw = useCallback(() => {
		if (!activePiece) {
			return;
		}
		const nextRotation = rotateCounterClockwise(activePiece.rotation);
		setActivePiece({ ...activePiece, rotation: nextRotation });
		setAnnouncement(
			t('a11y.rotatedPiece', {
				pieceId: activePiece.pieceId,
				rotation: nextRotation,
			}),
		);
	}, [activePiece, t]);

	const handleFlip = useCallback(() => {
		if (!activePiece) {
			return;
		}
		const nextFlipped = !activePiece.flipped;
		setActivePiece({ ...activePiece, flipped: nextFlipped });
		setAnnouncement(
			t('a11y.flippedPiece', {
				pieceId: activePiece.pieceId,
				flipped: nextFlipped ? '1' : '0',
			}),
		);
	}, [activePiece, t]);

	const handleCellAction = useCallback(
		(targetCoord: Coordinate) => {
			setCursor(targetCoord);

			if (activePiece) {
				const candidate: Placement = {
					pieceId: activePiece.pieceId,
					anchor: targetCoord,
					rotation: activePiece.rotation,
					flipped: activePiece.flipped,
				};
				const result = placePiece(level.mask, placements, candidate);
				if (result.validation.valid) {
					setHistory((prev) => pushHistory(prev, result.placements));
					setMoveCount((prev) => prev + 1);
					const nextPlacedIds = new Set(result.placements.map((p) => p.pieceId));
					const nextAvailable = level.pieceIds.find((id) => !nextPlacedIds.has(id));
					setActivePiece(nextAvailable ? { pieceId: nextAvailable, rotation: 0, flipped: false } : null);
					setAnnouncement(
						t('a11y.placedPiece', {
							pieceId: activePiece.pieceId,
							row: targetCoord.row + 1,
							col: targetCoord.col + 1,
							placed: result.placements.length,
							total: level.pieceIds.length,
						}),
					);
				} else {
					const reason = result.validation.reason;
					if (reason === 'out-of-bounds') {
						setAnnouncement(t('a11y.invalidOutOfBounds', { pieceId: activePiece.pieceId }));
					} else if (reason === 'void-cell') {
						setAnnouncement(t('a11y.invalidVoidCell', { pieceId: activePiece.pieceId }));
					} else {
						setAnnouncement(t('a11y.invalidOverlap', { pieceId: activePiece.pieceId }));
					}
				}
				return;
			}

			const existing = findPlacementAtCell(placements, targetCoord);
			if (existing) {
				const remaining = removePiece(placements, existing.pieceId);
				setHistory((prev) => pushHistory(prev, remaining));
				setMoveCount((prev) => prev + 1);
				setActivePiece({
					pieceId: existing.pieceId,
					rotation: existing.rotation,
					flipped: existing.flipped,
				});
				setAnnouncement(
					t('a11y.pickedUpFromBoard', {
						pieceId: existing.pieceId,
						row: targetCoord.row + 1,
						col: targetCoord.col + 1,
					}),
				);
			}
		},
		[activePiece, level.mask, level.pieceIds, placements, t],
	);

	const handleBoardKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const { key } = event;
			if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
				event.preventDefault();
				const dRow = key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? 1 : 0;
				const dCol = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : 0;
				const nextRow = Math.max(0, Math.min(level.rows - 1, cursor.row + dRow));
				const nextCol = Math.max(0, Math.min(level.cols - 1, cursor.col + dCol));
				setCursor({ row: nextRow, col: nextCol });
				const btn = cellRefs.current.get(`${nextRow},${nextCol}`);
				btn?.focus();
				return;
			}

			if (key === 'r' || key === 'R') {
				event.preventDefault();
				handleRotateCw();
				return;
			}

			if (key === 'f' || key === 'F') {
				event.preventDefault();
				handleFlip();
				return;
			}

			if (key === 'Escape') {
				if (activePiece) {
					event.preventDefault();
					const id = activePiece.pieceId;
					setActivePiece(null);
					setAnnouncement(t('a11y.returnedToTray', { pieceId: id }));
				}
				return;
			}

			if (key === ' ' || key === 'Enter') {
				event.preventDefault();
				handleCellAction(cursor);
			}
		},
		[activePiece, cursor, handleCellAction, handleFlip, handleRotateCw, level.cols, level.rows, t],
	);

	const handleUndo = useCallback(() => {
		if (!canUndo(history) || isPaused) {
			return;
		}
		setHistory((prev) => undoHistory(prev));
		setUndoCount((prev) => prev + 1);
	}, [history, isPaused]);

	const handleRedo = useCallback(() => {
		if (!canRedo(history) || isPaused) {
			return;
		}
		setHistory((prev) => redoHistory(prev));
	}, [history, isPaused]);

	const handleHint = useCallback(() => {
		if (isPaused || isSolved) {
			return;
		}
		const hint = findHintPlacement(level.mask, level.pieceIds, placements);
		if (!hint) {
			return;
		}
		const result = placePiece(level.mask, placements, hint);
		if (result.validation.valid) {
			setHistory((prev) => pushHistory(prev, result.placements));
			setHintsUsed((prev) => prev + 1);
			setMoveCount((prev) => prev + 1);
			if (activePiece?.pieceId === hint.pieceId) {
				setActivePiece(null);
			}
			setAnnouncement(
				t('a11y.hintPlaced', {
					pieceId: hint.pieceId,
					row: hint.anchor.row + 1,
					col: hint.anchor.col + 1,
				}),
			);
		}
	}, [activePiece, isPaused, isSolved, level.mask, level.pieceIds, placements, t]);

	const handleRestartBoard = useCallback(() => {
		setHistory(createHistory([]));
		setActivePiece(null);
		setMoveCount(0);
		setHintsUsed(0);
		setUndoCount(0);
		setElapsedSeconds(0);
		setHasRecordedVictory(false);
		setIsVictoryOpen(false);
		setIsPaused(false);
		void clearActiveGame();
	}, []);

	const handleNextLevel = useCallback(() => {
		if (mode === 'procedural') {
			const nextSeed = (seed + 1) % 1_000_000;
			const generated = generateProceduralPuzzle(level.difficulty, nextSeed);
			setLevel(generated.level);
			setSeed(nextSeed);
			handleRestartBoard();
			return;
		}
		const currentIndex = CURATED_LEVELS.findIndex((lvl) => lvl.id === level.id);
		const nextLvl = CURATED_LEVELS[(currentIndex + 1) % CURATED_LEVELS.length] ?? CURATED_LEVELS[0];
		setLevel(nextLvl);
		void saveLastConfig({
			difficulty: nextLvl.difficulty,
			levelId: nextLvl.id,
			mode: 'curated',
		});
		handleRestartBoard();
	}, [handleRestartBoard, level.difficulty, level.id, mode, seed]);

	const difficultyLabel = t(`difficulty.${level.difficulty}`);
	const statusText = isSolved
		? t('victory.title')
		: `${t('status.placed')}: ${placements.length} / ${level.pieceIds.length} • ${t('status.moves')}: ${moveCount}`;
	const statusState = isSolved ? 'solved' : 'default';

	return (
		<GameLayout
			header={
				<GameHeader
					backHref={`/pentominoes/${activeLang}/`}
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
					onTogglePause={() => {
						if (!isSolved) {
							setIsPaused((prev) => !prev);
						}
					}}
				/>
			}
			toolbar={
				<GameControlStrip
					onUndo={handleUndo}
					canUndo={canUndo(history) && !isPaused}
					onRedo={handleRedo}
					canRedo={canRedo(history) && !isPaused}
					onRestart={handleRestartBoard}
					canRestart={placements.length > 0 && !isPaused}
					onNewGame={handleNextLevel}
					canNewGame={!isPaused}
					hasActiveProgress={placements.length > 0}
					isComplete={isSolved}
				>
					<GameControlButton
						type="button"
						disabled={isSolved || isPaused}
						onClick={handleHint}
						aria-label={t('controls.hint')}
						title={t('controls.hint')}
						data-collapse-mobile="true"
					>
						<Icon name="lightbulb" size="sm" />
						<span>{t('controls.hint')}</span>
					</GameControlButton>
				</GameControlStrip>
			}
		>
			<SrOnlyLiveRegion aria-live="polite" aria-atomic="true">
				{announcement}
			</SrOnlyLiveRegion>

			{isSolved && <Confetti />}

			<WorkspaceWrapper>
				<BoardSection aria-label={t('a11y.boardLabel')}>
					{/* biome-ignore lint/a11y/useSemanticElements: Pentominoes is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern */}
					<BoardGridContainer
						role="grid"
						aria-label={t('a11y.boardLabel')}
						aria-rowcount={level.rows}
						aria-colcount={level.cols}
						data-cols={String(level.cols)}
						data-coords={settings.showGridCoordinates ? 'true' : 'false'}
						onKeyDown={handleBoardKeyDown}
					>
						{settings.showGridCoordinates && (
							<CoordinateHeaderRow aria-hidden="true">
								<CoordCornerCell />
								{Array.from({ length: level.cols }, (_, colIdx) => (
									<ColCoordBadge key={`col-coord-${String.fromCharCode(65 + colIdx)}`}>
										{String.fromCharCode(65 + colIdx)}
									</ColCoordBadge>
								))}
							</CoordinateHeaderRow>
						)}

						{level.mask.map((rowMask, rIdx) => {
							const rowNumber = rIdx + 1;
							return (
								// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
								<BoardRow key={`pentominoes-row-${rowNumber}`} role="row" aria-rowindex={rowNumber}>
									{settings.showGridCoordinates && (
										<RowCoordBadge aria-hidden="true">{rowNumber}</RowCoordBadge>
									)}
									{rowMask.map((maskVal, cIdx) => {
										const colNumber = cIdx + 1;
										const coordKey = `${rIdx},${cIdx}`;
										const occupant = occupancyGrid[rIdx]?.[cIdx] ?? null;
										const isVoid = maskVal === 0;
										const isCursor = cursor.row === rIdx && cursor.col === cIdx;
										const isGhost = ghostPreview.cells.has(coordKey);
										const occupantDef = occupant ? getPieceDefinition(occupant) : null;
										const labelBadge = settings.showPieceLabels
											? labelCellByCoord.get(coordKey)
											: undefined;

										const ariaCellLabel = isVoid
											? t('a11y.cellVoid', { row: rowNumber, col: colNumber })
											: occupant
												? t('a11y.cellOccupied', {
														row: rowNumber,
														col: colNumber,
														pieceId: occupant,
													})
												: t('a11y.cellEmpty', { row: rowNumber, col: colNumber });

										return (
											<button
												key={`pentominoes-cell-${rowNumber}-${colNumber}`}
												ref={(el) => {
													if (el) {
														cellRefs.current.set(coordKey, el);
													} else {
														cellRefs.current.delete(coordKey);
													}
												}}
												type="button"
												// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
												role="gridcell"
												aria-colindex={colNumber}
												className={cellButtonClass}
												tabIndex={isCursor ? 0 : -1}
												disabled={isVoid}
												aria-label={ariaCellLabel}
												data-void={isVoid ? 'true' : 'false'}
												data-color={
													occupantDef ? String(occupantDef.colorIndex % 12) : undefined
												}
												data-pattern={
													occupant && settings.showSurfacePatterns ? 'true' : 'false'
												}
												data-ghost={
													isGhost ? (ghostPreview.valid ? 'valid' : 'invalid') : undefined
												}
												onMouseEnter={() => {
													if (activePiece) {
														setCursor({ row: rIdx, col: cIdx });
													}
												}}
												onClick={() => handleCellAction({ row: rIdx, col: cIdx })}
											>
												{labelBadge && <CellLabelBadge>{labelBadge}</CellLabelBadge>}
											</button>
										);
									})}
								</BoardRow>
							);
						})}
					</BoardGridContainer>

					<KeyboardHelpText>{t('tray.keyboardHint')}</KeyboardHelpText>
				</BoardSection>

				<TraySection aria-label={t('a11y.trayLabel')}>
					<ActiveTransformBar>
						<strong>
							{t('tray.activePieceTitle')}:{' '}
							{activePiece
								? `${activePiece.pieceId} (${activePiece.rotation}°${activePiece.flipped ? ' ↔' : ''})`
								: t('status.noneSelected')}
						</strong>

						<TransformButtonsGroup>
							<Button variant="secondary" size="sm" disabled={!activePiece} onClick={handleRotateCw}>
								{t('controls.rotateCw')}
							</Button>
							<Button variant="secondary" size="sm" disabled={!activePiece} onClick={handleRotateCcw}>
								{t('controls.rotateCcw')}
							</Button>
							<Button variant="secondary" size="sm" disabled={!activePiece} onClick={handleFlip}>
								{t('controls.flipH')}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								disabled={!activePiece}
								onClick={() => setActivePiece(null)}
							>
								{t('controls.returnToTray')}
							</Button>
						</TransformButtonsGroup>
					</ActiveTransformBar>

					<TrayGrid>
						{level.pieceIds.map((pieceId) => {
							const isPlaced = placedPieceIds.has(pieceId);
							const isSelected = activePiece?.pieceId === pieceId;
							const statusLabel = isSelected
								? t('tray.pieceStatusSelected')
								: isPlaced
									? t('tray.pieceStatusPlaced')
									: t('tray.pieceStatusAvailable');

							return (
								<button
									key={pieceId}
									type="button"
									className={trayItemButtonClass}
									data-selected={isSelected ? 'true' : 'false'}
									data-placed={isPlaced ? 'true' : 'false'}
									aria-pressed={isSelected}
									aria-label={`${pieceId} — ${statusLabel}`}
									onClick={() => handleSelectTrayPiece(pieceId)}
								>
									<PieceGlyph
										pieceId={pieceId}
										rotation={isSelected ? activePiece.rotation : 0}
										flipped={isSelected ? activePiece.flipped : false}
										showLabel={settings.showPieceLabels}
										title={`${pieceId} (${statusLabel})`}
									/>
									<TrayPieceLabel>{pieceId}</TrayPieceLabel>
								</button>
							);
						})}
					</TrayGrid>
				</TraySection>
			</WorkspaceWrapper>

			<PauseDialog
				isOpen={isPaused && !isSolved && !isSettingsOpen && !isRulesOpen}
				onResume={() => setIsPaused(false)}
				onRestart={handleRestartBoard}
			/>

			<VictoryDialog
				isOpen={isVictoryOpen}
				elapsedSeconds={elapsedSeconds}
				movesCount={moveCount}
				difficulty={level.difficulty}
				hasNextPuzzle={true}
				onPlayAgain={handleRestartBoard}
				onNextPuzzle={handleNextLevel}
				onClose={() => setIsVictoryOpen(false)}
			/>

			<GameRulesDialog isOpen={isRulesOpen} gameTitle={t('title')} onClose={() => setIsRulesOpen(false)}>
				{rulesContent}
			</GameRulesDialog>

			<GameSettingsDialog
				isOpen={isSettingsOpen}
				gameTitle={t('title')}
				onClose={() => {
					setIsSettingsOpen(false);
					void loadSettings().then(setSettings);
				}}
			>
				<GameSettingsPanel
					config={PENTOMINOES_SETTINGS_CONFIG}
					lang={activeLang}
					mode="compact"
					onSettingsChange={(updated) => {
						setSettings(updated);
						void saveSettings(updated);
					}}
				/>
			</GameSettingsDialog>
		</GameLayout>
	);
}

export function PentominoesGame({ lang, rulesContent }: PentominoesGameProps): JSX.Element {
	const activeLang: SupportedLanguageCode = lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;

	return (
		<I18nProvider language={activeLang}>
			<PentominoesGameInner activeLang={activeLang} rulesContent={rulesContent} />
		</I18nProvider>
	);
}
