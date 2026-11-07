import { styled } from '@linaria/react';
import { type KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import type { Board, GridCoord } from '../../engine/types.ts';

export interface DiceBingoBoardProps {
	readonly board: Board;
	readonly focusedCoord: GridCoord;
	readonly hoveredCoord: GridCoord | null;
	readonly highlightedCoords: ReadonlySet<string>;
	readonly pendingRollSum: number | null;
	readonly isPlacing: boolean;
	readonly autoFocusOnPlacing?: boolean;
	readonly onCellClick: (coord: GridCoord) => void;
	readonly onCellFocus: (coord: GridCoord) => void;
	readonly onCellHover: (coord: GridCoord | null) => void;
	readonly boardLabel?: string;
}

const GridContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.375rem;
	width: 100%;
	max-width: 26rem;
	margin: 0 auto;
	padding: 0.5rem;
	background-color: light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.04));
	border-radius: 0.75rem;
	box-sizing: border-box;
	user-select: none;
`;

const GridRow = styled.div`
	display: flex;
	gap: 0.375rem;
	width: 100%;
`;

const CellButton = styled.button`
	position: relative;
	flex: 1 1 0;
	aspect-ratio: 1 / 1;
	min-width: 2.5rem;
	min-height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	font-weight: 700;
	color: light-dark(#1e293b, #f8fafc);
	background-color: light-dark(#ffffff, #1e293b);
	border: 2px solid light-dark(#cbd5e1, #334155);
	border-radius: 0.5rem;
	padding: 0;
	cursor: pointer;
	transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
	outline: none;

	&:focus-visible {
		outline: 3px solid light-dark(#2563eb, #60a5fa);
		outline-offset: 2px;
		z-index: 2;
	}

	&[data-placing='true']:hover:not([data-obstacle='true']):not([data-filled='true']) {
		background-color: light-dark(#dbeafe, #1e3a8a);
		border-color: light-dark(#3b82f6, #60a5fa);
		transform: scale(1.04);
	}

	&[data-highlighted='true'] {
		border-color: light-dark(#60a5fa, #3b82f6);
		background-color: light-dark(#eff6ff, rgba(59, 130, 246, 0.15));
	}

	&[data-obstacle='true'] {
		background-color: light-dark(#94a3b8, #475569);
		border-color: light-dark(#64748b, #334155);
		color: light-dark(#475569, #94a3b8);
		cursor: not-allowed;
		opacity: 0.7;
	}

	&[data-filled='true'] {
		background-color: light-dark(#f1f5f9, #0f172a);
		border-color: light-dark(#94a3b8, #475569);
		font-size: 1.35rem;
	}
`;

const ObstacleIcon = styled.span`
	font-size: 1.1rem;
	line-height: 1;
`;

const GhostPreview = styled.span`
	opacity: 0.45;
	font-weight: 600;
	color: light-dark(#2563eb, #93c5fd);
`;

export function DiceBingoBoard({
	board,
	focusedCoord,
	hoveredCoord,
	highlightedCoords,
	pendingRollSum,
	isPlacing,
	autoFocusOnPlacing = false,
	onCellClick,
	onCellFocus,
	onCellHover,
	boardLabel = 'Dice Bingo grid board',
}: DiceBingoBoardProps) {
	const size = board.length;
	const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>, r: number, c: number) => {
			let nextR = r;
			let nextC = c;

			switch (event.key) {
				case 'ArrowUp':
					nextR = (r - 1 + size) % size;
					break;
				case 'ArrowDown':
					nextR = (r + 1) % size;
					break;
				case 'ArrowLeft':
					nextC = (c - 1 + size) % size;
					break;
				case 'ArrowRight':
					nextC = (c + 1) % size;
					break;
				case ' ':
				case 'Enter': {
					event.preventDefault();
					const cell = board[r][c];
					if (isPlacing && !cell.isObstacle && cell.value === null) {
						onCellClick({ row: r, col: c });
					}
					return;
				}
				default:
					return;
			}

			event.preventDefault();
			onCellFocus({ row: nextR, col: nextC });
			const key = `${nextR},${nextC}`;
			buttonRefs.current.get(key)?.focus();
		},
		[size, board, isPlacing, onCellClick, onCellFocus],
	);

	// Sync DOM focus whenever focusedCoord changes
	useEffect(() => {
		const key = `${focusedCoord.row},${focusedCoord.col}`;
		const btn = buttonRefs.current.get(key);
		if (btn && document.activeElement !== btn) {
			// Don't steal focus if focus is outside the grid
			if (document.activeElement?.getAttribute('role') === 'gridcell') {
				btn.focus();
			}
		}
	}, [focusedCoord]);

	// Automatically focus the focused grid cell when placing phase begins
	const prevIsPlacingRef = useRef(false);
	useEffect(() => {
		if (isPlacing && (!prevIsPlacingRef.current || autoFocusOnPlacing)) {
			const key = `${focusedCoord.row},${focusedCoord.col}`;
			buttonRefs.current.get(key)?.focus();
		}
		prevIsPlacingRef.current = isPlacing;
	}, [isPlacing, autoFocusOnPlacing, focusedCoord]);

	return (
		// biome-ignore lint/a11y/useSemanticElements: Dice Bingo is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern
		<GridContainer role="grid" aria-label={boardLabel}>
			{board.map((row, r) => (
				// biome-ignore lint/suspicious/noArrayIndexKey lint/a11y/useSemanticElements: Row role and stable matrix coordinate required for WAI-ARIA grid pattern
				<GridRow key={`dice-bingo-row-${r}`} role="row">
					{row.map((cell, c) => {
						const isFocused = focusedCoord.row === r && focusedCoord.col === c;
						const isHovered = hoveredCoord?.row === r && hoveredCoord?.col === c;
						const isHighlighted = highlightedCoords.has(`${r},${c}`);
						const isObstacle = cell.isObstacle;
						const isFilled = cell.value !== null;
						const canPlace = isPlacing && !isObstacle && !isFilled;

						let cellAriaLabel = `Row ${r + 1}, Column ${c + 1}`;
						if (isObstacle) {
							cellAriaLabel += ': Blocked Obstacle';
						} else if (isFilled) {
							cellAriaLabel += `: Value ${cell.value}`;
						} else {
							cellAriaLabel += ': Empty';
						}

						return (
							<CellButton
								key={`dice-bingo-cell-${cell.row}-${cell.col}`}
								ref={(el) => {
									if (el) buttonRefs.current.set(`${r},${c}`, el);
									else buttonRefs.current.delete(`${r},${c}`);
								}}
								type="button"
								// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
								role="gridcell"
								tabIndex={isFocused ? 0 : -1}
								aria-label={cellAriaLabel}
								aria-disabled={isObstacle || isFilled}
								data-obstacle={isObstacle ? 'true' : 'false'}
								data-filled={isFilled ? 'true' : 'false'}
								data-highlighted={isHighlighted ? 'true' : 'false'}
								data-placing={isPlacing ? 'true' : 'false'}
								onClick={() => {
									if (canPlace) {
										onCellClick({ row: r, col: c });
									}
								}}
								onFocus={() => onCellFocus({ row: r, col: c })}
								onMouseEnter={() => onCellHover({ row: r, col: c })}
								onMouseLeave={() => onCellHover(null)}
								onKeyDown={(e) => handleKeyDown(e, r, c)}
							>
								{isObstacle ? (
									<ObstacleIcon aria-hidden="true">⛔</ObstacleIcon>
								) : isFilled ? (
									cell.value
								) : canPlace && (isFocused || isHovered) && pendingRollSum !== null ? (
									<GhostPreview aria-hidden="true">{pendingRollSum}</GhostPreview>
								) : null}
							</CellButton>
						);
					})}
				</GridRow>
			))}
		</GridContainer>
	);
}
