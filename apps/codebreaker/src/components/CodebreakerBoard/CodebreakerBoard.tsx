import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type JSX, type KeyboardEvent, useEffect, useRef } from 'react';
import {
	type DraftRow,
	type FeedbackResult,
	type GameStatus,
	type GuessRow,
	PEG_COLORS,
	type PegColorId,
} from '../../engine/types';
import { PegBadge } from '../PegBadge/PegBadge';
import * as S from './CodebreakerBoard.styles';

export interface CodebreakerBoardProps {
	readonly codeLength: number;
	readonly colorCount: number;
	readonly maxAttempts: number;
	readonly secret: readonly PegColorId[];
	readonly history: readonly GuessRow[];
	readonly draft: DraftRow;
	readonly selectedSlot: number;
	readonly status: GameStatus;
	readonly isPaused: boolean;
	readonly showColorShapes: boolean;
	readonly showColorNumbers: boolean;
	readonly conflictingRowIndex: number | null;
	readonly hintedSlotIndex: number | null;
	readonly onSelectSlot: (slotIndex: number) => void;
	readonly onPlaceColor: (colorId: PegColorId) => void;
	readonly onClearSlot: () => void;
	readonly onSubmitGuess: () => void;
	readonly onHint: () => void;
	readonly onUndo: () => void;
	readonly onRedo: () => void;
	readonly onTogglePause: () => void;
}

type FeedbackPegKind = 'exact' | 'partial' | 'empty';

function buildGroupedFeedback(feedback: FeedbackResult | null, codeLength: number): FeedbackPegKind[] {
	if (!feedback) {
		return Array.from({ length: codeLength }, () => 'empty');
	}
	const pegs: FeedbackPegKind[] = [];
	for (let i = 0; i < feedback.exact; i += 1) {
		pegs.push('exact');
	}
	for (let i = 0; i < feedback.partial; i += 1) {
		pegs.push('partial');
	}
	while (pegs.length < codeLength) {
		pegs.push('empty');
	}
	return pegs;
}

export function CodebreakerBoard({
	codeLength,
	colorCount,
	maxAttempts,
	secret,
	history,
	draft,
	selectedSlot,
	status,
	isPaused,
	showColorShapes,
	showColorNumbers,
	conflictingRowIndex,
	hintedSlotIndex,
	onSelectSlot,
	onPlaceColor,
	onClearSlot,
	onSubmitGuess,
	onHint,
	onUndo,
	onRedo,
	onTogglePause,
}: CodebreakerBoardProps): JSX.Element {
	const { t } = useI18n('codebreaker');
	const activeRowRef = useRef<HTMLDivElement | null>(null);
	const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const activeRowIndex = history.length;
	const isRevealVisible = status !== 'playing' && !isPaused;

	useEffect(() => {
		if (activeRowIndex >= 0 && activeRowRef.current && typeof activeRowRef.current.scrollIntoView === 'function') {
			activeRowRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		}
	}, [activeRowIndex]);

	const getSlotAriaLabel = (slotIndex: number, peg: PegColorId | null): string => {
		if (peg === null) {
			return t('aria.slotEmpty', { slot: slotIndex + 1 });
		}
		const spec = PEG_COLORS[peg];
		return t('aria.slotFilled', {
			slot: slotIndex + 1,
			color: t(`colors.${spec.key}` as 'colors.red'),
			symbol: t(`symbols.${spec.symbol}` as 'symbols.circle'),
		});
	};

	const handleSlotKeyDown = (event: KeyboardEvent<HTMLButtonElement>, slotIndex: number) => {
		if (isPaused || status !== 'playing') {
			return;
		}

		const key = event.key;
		if (key === 'ArrowLeft') {
			event.preventDefault();
			const prev = (slotIndex - 1 + codeLength) % codeLength;
			onSelectSlot(prev);
			slotRefs.current[prev]?.focus();
			return;
		}
		if (key === 'ArrowRight') {
			event.preventDefault();
			const next = (slotIndex + 1) % codeLength;
			onSelectSlot(next);
			slotRefs.current[next]?.focus();
			return;
		}
		if (key === 'Backspace' || key === 'Delete') {
			event.preventDefault();
			onClearSlot();
			return;
		}
		if (key === 'Enter') {
			event.preventDefault();
			onSubmitGuess();
			return;
		}
		if (/^[1-8]$/.test(key)) {
			const idx = Number(key) - 1;
			if (idx >= 0 && idx < colorCount) {
				event.preventDefault();
				onPlaceColor(idx as PegColorId);
			}
			return;
		}
		const lower = key.toLowerCase();
		if (lower === 'h') {
			event.preventDefault();
			onHint();
		} else if (lower === 'u' || lower === 'z') {
			event.preventDefault();
			onUndo();
		} else if (lower === 'r' || lower === 'y') {
			event.preventDefault();
			onRedo();
		} else if (key === 'Escape' || lower === 'p') {
			event.preventDefault();
			onTogglePause();
		}
	};

	const rows = Array.from({ length: maxAttempts }, (_, index) => index);
	const slots = Array.from({ length: codeLength }, (_, index) => index);
	const feedbackCols = codeLength > 4 ? '3' : '2';

	return (
		<S.BoardFrame data-paused={isPaused ? 'true' : 'false'}>
			<S.SecretBanner aria-label={isRevealVisible ? t('aria.secretCodeReveal') : t('feedback.hiddenCodeLabel')}>
				<S.SecretLabel>
					{isRevealVisible ? t('feedback.secretCodeLabel') : t('feedback.hiddenCodeLabel')}
				</S.SecretLabel>
				<S.SecretSlots>
					{slots.map((slotPos) => {
						const peg = secret[slotPos];
						return isRevealVisible && peg !== undefined ? (
							<span key={`secret-pos-${slotPos}`} aria-label={getSlotAriaLabel(slotPos, peg)}>
								<PegBadge
									colorId={peg}
									size="sm"
									showShape={showColorShapes}
									showNumber={showColorNumbers}
								/>
							</span>
						) : (
							<S.HiddenPeg key={`secret-hidden-pos-${slotPos}`} aria-hidden="true">
								?
							</S.HiddenPeg>
						);
					})}
				</S.SecretSlots>
			</S.SecretBanner>

			{/* biome-ignore lint/a11y/useSemanticElements: Codebreaker board implements the WAI-ARIA Grid pattern */}
			<S.RowsContainer
				role="grid"
				aria-label={t('aria.boardGrid')}
				aria-rowcount={maxAttempts}
				aria-colcount={codeLength}
			>
				{rows.map((rowIdx) => {
					const submitted = history[rowIdx];
					const isActive = status === 'playing' && rowIdx === activeRowIndex;
					const rowState = submitted ? 'submitted' : isActive ? 'active' : 'future';
					const isConflicting = conflictingRowIndex === rowIdx;
					const feedbackPegs = buildGroupedFeedback(submitted ? submitted.feedback : null, codeLength);

					return (
						<S.GuessRowEl
							key={`codebreaker-row-${rowIdx}`}
							ref={isActive ? activeRowRef : undefined}
							// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
							role="row"
							aria-rowindex={rowIdx + 1}
							aria-label={
								isActive
									? t('aria.activeRowLabel', { row: rowIdx + 1 })
									: t('aria.rowLabel', { row: rowIdx + 1 })
							}
							data-state={rowState}
							data-conflict={isConflicting ? 'true' : 'false'}
						>
							<S.RowIndex aria-hidden="true">{rowIdx + 1}</S.RowIndex>

							<S.PegsTrack>
								{slots.map((slotIdx) => {
									if (isActive) {
										const peg = draft[slotIdx] ?? null;
										const isSelected = selectedSlot === slotIdx;
										const isHinted = hintedSlotIndex === slotIdx;

										return (
											<S.SlotButton
												key={`active-slot-${slotIdx}`}
												ref={(el) => {
													slotRefs.current[slotIdx] = el;
												}}
												type="button"
												// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
												role="gridcell"
												aria-colindex={slotIdx + 1}
												aria-selected={isSelected}
												tabIndex={isSelected ? 0 : -1}
												disabled={isPaused}
												data-selected={isSelected ? 'true' : 'false'}
												data-hinted={isHinted ? 'true' : 'false'}
												aria-label={getSlotAriaLabel(slotIdx, peg)}
												onClick={() => onSelectSlot(slotIdx)}
												onKeyDown={(e) => handleSlotKeyDown(e, slotIdx)}
											>
												{peg !== null ? (
													<PegBadge
														colorId={peg}
														size="md"
														showShape={showColorShapes}
														showNumber={showColorNumbers}
													/>
												) : (
													<S.EmptySocket aria-hidden="true" />
												)}
											</S.SlotButton>
										);
									}

									const peg = submitted ? submitted.guess[slotIdx] : null;
									return (
										<S.StaticSlot
											key={`row-${rowIdx}-slot-${slotIdx}`}
											// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
											role="gridcell"
											aria-colindex={slotIdx + 1}
											aria-label={getSlotAriaLabel(slotIdx, peg)}
										>
											{peg !== null ? (
												<PegBadge
													colorId={peg}
													size="sm"
													showShape={showColorShapes}
													showNumber={showColorNumbers}
												/>
											) : (
												<S.EmptySocket aria-hidden="true" />
											)}
										</S.StaticSlot>
									);
								})}
							</S.PegsTrack>

							<S.FeedbackCluster
								data-cols={feedbackCols}
								aria-label={
									submitted
										? t('aria.feedbackSummary', {
												exact: submitted.feedback.exact,
												partial: submitted.feedback.partial,
											})
										: undefined
								}
							>
								{slots.map((fbPos) => (
									<S.FeedbackPeg
										key={`row-${rowIdx}-fb-${fbPos}`}
										data-kind={feedbackPegs[fbPos] ?? 'empty'}
										aria-hidden="true"
									/>
								))}
							</S.FeedbackCluster>
						</S.GuessRowEl>
					);
				})}
			</S.RowsContainer>
		</S.BoardFrame>
	);
}
