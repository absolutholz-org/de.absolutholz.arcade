import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX, KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import type { Cell } from '../../engine/types';
import { FlagIcon, MineIcon, QuestionIcon } from '../MinesweeperIcons';
import * as S from './MinesweeperCell.styles';

export interface MinesweeperCellProps {
	cell: Cell;
	isFocused: boolean;
	isGameOver: boolean;
	isWon: boolean;
	onReveal: (col: number, row: number) => void;
	onFlag: (col: number, row: number) => void;
	onChord: (col: number, row: number) => void;
	onFocus: (col: number, row: number) => void;
}

export function MinesweeperCell({
	cell,
	isFocused,
	isGameOver,
	isWon,
	onReveal,
	onFlag,
	onChord,
	onFocus,
}: MinesweeperCellProps): JSX.Element {
	const { t } = useI18n('minesweeper');
	const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isLongPressActiveRef = useRef(false);
	const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

	const clearTimer = useCallback(() => {
		if (longPressTimerRef.current) {
			clearTimeout(longPressTimerRef.current);
			longPressTimerRef.current = null;
		}
	}, []);

	useEffect(() => {
		return () => clearTimer();
	}, [clearTimer]);

	const handlePointerDown = useCallback(
		(e: PointerEvent<HTMLButtonElement>) => {
			if (isGameOver || isWon || cell.state === 'revealed') return;

			// Handle right click immediately on pointerdown
			if (e.button === 2) {
				clearTimer();
				isLongPressActiveRef.current = true;
				e.preventDefault();
				onFlag(cell.col, cell.row);
				return;
			}

			// Only initiate long-press on primary button (left click or touch)
			if (e.button !== 0) return;

			clearTimer();
			isLongPressActiveRef.current = false;
			pointerDownPosRef.current = { x: e.clientX, y: e.clientY };

			longPressTimerRef.current = setTimeout(() => {
				isLongPressActiveRef.current = true;
				longPressTimerRef.current = null;
				onFlag(cell.col, cell.row);
				if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
					try {
						navigator.vibrate(40);
					} catch {
						// vibration not supported
					}
				}
			}, 380);
		},
		[cell.col, cell.row, cell.state, isGameOver, isWon, onFlag, clearTimer],
	);

	const handlePointerMove = useCallback(
		(e: PointerEvent<HTMLButtonElement>) => {
			if (!pointerDownPosRef.current || !longPressTimerRef.current) return;
			const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
			const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);
			if (dx > 8 || dy > 8) {
				clearTimer();
				pointerDownPosRef.current = null;
			}
		},
		[clearTimer],
	);

	const handlePointerUp = useCallback(
		(e: PointerEvent<HTMLButtonElement>) => {
			clearTimer();
			pointerDownPosRef.current = null;
			if (isLongPressActiveRef.current) {
				e.preventDefault();
			}
		},
		[clearTimer],
	);

	const handlePointerCancel = useCallback(() => {
		clearTimer();
		pointerDownPosRef.current = null;
	}, [clearTimer]);

	const handleClick = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			// Suppress click if long-press or right-click just triggered
			if (isLongPressActiveRef.current) {
				isLongPressActiveRef.current = false;
				e.preventDefault();
				return;
			}

			if (cell.state === 'unexplored') {
				onReveal(cell.col, cell.row);
			} else if (cell.state === 'revealed' && cell.nearMineCount > 0) {
				onChord(cell.col, cell.row);
			}
		},
		[cell.col, cell.row, cell.state, cell.nearMineCount, onReveal, onChord],
	);

	const handleContextMenu = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			clearTimer();

			// If already flagged via pointerdown(button=2), don't double-toggle
			if (isLongPressActiveRef.current) {
				isLongPressActiveRef.current = false;
				return;
			}

			if (cell.state !== 'revealed') {
				onFlag(cell.col, cell.row);
			}
		},
		[cell.col, cell.row, cell.state, onFlag, clearTimer],
	);

	const handleDoubleClick = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			if (cell.state === 'revealed' && cell.nearMineCount > 0) {
				onChord(cell.col, cell.row);
			}
		},
		[cell.col, cell.row, cell.state, cell.nearMineCount, onChord],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				if (cell.state === 'unexplored') {
					onReveal(cell.col, cell.row);
				} else if (cell.state === 'revealed' && cell.nearMineCount > 0) {
					onChord(cell.col, cell.row);
				}
			} else if (e.key === 'f' || e.key === 'F' || e.key === 'm' || e.key === 'M') {
				e.preventDefault();
				if (cell.state !== 'revealed') {
					onFlag(cell.col, cell.row);
				}
			} else if (e.key === 'c' || e.key === 'C') {
				e.preventDefault();
				if (cell.state === 'revealed' && cell.nearMineCount > 0) {
					onChord(cell.col, cell.row);
				}
			}
		},
		[cell.col, cell.row, cell.state, cell.nearMineCount, onReveal, onFlag, onChord],
	);

	// Generate localized aria-label
	const rowNum = cell.row + 1;
	const colNum = cell.col + 1;
	let ariaLabel = '';

	if (cell.state === 'detonated') {
		ariaLabel = t('aria.cellDetonated', { row: rowNum, col: colNum });
	} else if (isGameOver && !isWon && cell.mine && cell.state !== 'flagged') {
		ariaLabel = t('aria.cellMine', { row: rowNum, col: colNum });
	} else if (cell.state === 'flagged') {
		ariaLabel = t('aria.cellFlagged', { row: rowNum, col: colNum });
	} else if (cell.state === 'questioned') {
		ariaLabel = t('aria.cellQuestioned', { row: rowNum, col: colNum });
	} else if (cell.state === 'revealed') {
		if (cell.nearMineCount > 0) {
			ariaLabel = t('aria.cellRevealed', {
				row: rowNum,
				col: colNum,
				count: cell.nearMineCount,
			});
		} else {
			ariaLabel = t('aria.cellRevealedEmpty', { row: rowNum, col: colNum });
		}
	} else {
		ariaLabel = t('aria.cellHidden', { row: rowNum, col: colNum });
	}

	const isRevealedMine = isGameOver && !isWon && cell.mine && cell.state !== 'detonated' && cell.state !== 'flagged';
	const classNames = [
		cell.state,
		cell.state === 'revealed' && cell.nearMineCount > 0 ? `number-${cell.nearMineCount}` : '',
		isRevealedMine ? 'revealed-mine' : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<S.CellButton
			type="button"
			tabIndex={isFocused ? 0 : -1}
			aria-label={ariaLabel}
			aria-selected={isFocused}
			data-col={cell.col}
			data-row={cell.row}
			disabled={isGameOver || isWon}
			className={classNames}
			onClick={handleClick}
			onContextMenu={handleContextMenu}
			onDoubleClick={handleDoubleClick}
			onKeyDown={handleKeyDown}
			onFocus={() => onFocus(cell.col, cell.row)}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			onPointerLeave={handlePointerCancel}
		>
			{cell.state === 'detonated' && (
				<S.IconWrapper>
					<MineIcon />
				</S.IconWrapper>
			)}
			{cell.state === 'flagged' && (
				<S.IconWrapper>
					<FlagIcon />
				</S.IconWrapper>
			)}
			{cell.state === 'questioned' && (
				<S.IconWrapper>
					<QuestionIcon />
				</S.IconWrapper>
			)}
			{cell.state === 'revealed' && cell.nearMineCount > 0 && <span>{cell.nearMineCount}</span>}
			{isRevealedMine && (
				<S.IconWrapper>
					<MineIcon />
				</S.IconWrapper>
			)}
		</S.CellButton>
	);
}
