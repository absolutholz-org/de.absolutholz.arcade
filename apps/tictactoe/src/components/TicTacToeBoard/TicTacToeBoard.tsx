import { styled } from '@linaria/react';
import { type KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import type { CellValue, WinningLine } from '../../engine/types.ts';

export interface TicTacToeBoardProps {
	readonly board: readonly CellValue[];
	readonly winningLine: WinningLine | null;
	readonly focusedIndex: number;
	readonly onCellClick: (index: number) => void;
	readonly onFocusChange: (index: number) => void;
	readonly disabled?: boolean;
	readonly highlightWinningLine?: boolean;
	readonly showCoordinates?: boolean;
	readonly boardLabel?: string;
}

const BoardWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 24rem;
	margin: 0 auto;
	padding: 0.75rem;
	user-select: none;
`;

const GridContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	width: 100%;
	aspect-ratio: 1 / 1;
	padding: 0.75rem;
	background-color: light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.05));
	border-radius: 1rem;
	border: 1px solid light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.1));
`;

const GridRow = styled.div`
	display: flex;
	gap: 0.5rem;
	flex: 1 1 0;
	width: 100%;
`;

const GridCellWrapper = styled.div`
	flex: 1 1 0;
	height: 100%;
	display: flex;
`;

const CellButton = styled.button`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: inherit;
	background-color: light-dark(#ffffff, #1e293b);
	border: 2px solid light-dark(#cbd5e1, #334155);
	border-radius: 0.75rem;
	padding: 0;
	cursor: pointer;
	transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
	outline: none;

	&:hover:not(:disabled) {
		background-color: light-dark(#f8fafc, #334155);
		border-color: light-dark(#94a3b8, #64748b);
		transform: scale(1.02);
	}

	&:focus-visible {
		outline: 3px solid light-dark(#2563eb, #60a5fa);
		outline-offset: 3px;
		z-index: 2;
	}

	&:disabled {
		cursor: default;
	}

	&[data-winning="true"] {
		background-color: light-dark(#fef3c7, #78350f);
		border-color: light-dark(#d97706, #f59e0b);
		box-shadow: 0 0 12px light-dark(rgba(217, 119, 6, 0.35), rgba(245, 158, 11, 0.45));
		animation: pulse-winning 1.2s infinite alternate ease-in-out;
	}

	@keyframes pulse-winning {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.03);
		}
	}
`;

const MarkText = styled.span`
	font-size: 2.75rem;
	font-weight: 800;
	line-height: 1;

	&[data-mark="X"] {
		color: light-dark(#2563eb, #60a5fa);
	}

	&[data-mark="O"] {
		color: light-dark(#ea580c, #fb923c);
	}
`;

const CoordinateHint = styled.span`
	position: absolute;
	top: 0.25rem;
	left: 0.35rem;
	font-size: 0.65rem;
	font-weight: 600;
	color: light-dark(#94a3b8, #64748b);
	pointer-events: none;
`;

export function TicTacToeBoard({
	board,
	winningLine,
	focusedIndex,
	onCellClick,
	onFocusChange,
	disabled = false,
	highlightWinningLine = true,
	showCoordinates = false,
	boardLabel = 'Tic-Tac-Toe 3x3 game board',
}: TicTacToeBoardProps) {
	const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

	// Ensure button refs array has 9 elements
	useEffect(() => {
		cellRefs.current = cellRefs.current.slice(0, 9);
	}, []);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>, index: number) => {
			const row = Math.floor(index / 3);
			const col = index % 3;
			let targetIndex: number | null = null;

			switch (event.key) {
				case 'ArrowUp':
					targetIndex = ((row + 2) % 3) * 3 + col;
					break;
				case 'ArrowDown':
					targetIndex = ((row + 1) % 3) * 3 + col;
					break;
				case 'ArrowLeft':
					targetIndex = row * 3 + ((col + 2) % 3);
					break;
				case 'ArrowRight':
					targetIndex = row * 3 + ((col + 1) % 3);
					break;
				case 'Home':
					targetIndex = row * 3;
					break;
				case 'End':
					targetIndex = row * 3 + 2;
					break;
				default:
					return;
			}

			if (targetIndex !== null) {
				event.preventDefault();
				onFocusChange(targetIndex);
				cellRefs.current[targetIndex]?.focus();
			}
		},
		[onFocusChange],
	);

	const isWinningIndex = useCallback(
		(index: number): boolean => {
			if (!highlightWinningLine || !winningLine) {
				return false;
			}
			return winningLine.includes(index as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8);
		},
		[highlightWinningLine, winningLine],
	);

	return (
		<BoardWrapper>
			{/* biome-ignore lint/a11y/useSemanticElements: Tic-Tac-Toe is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern */}
			<GridContainer role="grid" aria-label={boardLabel}>
				{[0, 1, 2].map((row) => (
					// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
					<GridRow key={`tictactoe-row-${row}`} role="row">
						{[0, 1, 2].map((col) => {
							const index = row * 3 + col;
							const cellValue = board[index];
							const isFocused = focusedIndex === index;
							const winning = isWinningIndex(index);
							const cellCoord = `${row + 1},${col + 1}`;
							const accessibleLabel = cellValue
								? `Row ${row + 1}, Column ${col + 1}: ${cellValue}`
								: `Row ${row + 1}, Column ${col + 1}: Empty`;

							return (
								// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
								<GridCellWrapper key={`tictactoe-cell-${index}`} role="gridcell">
									<CellButton
										ref={(el) => {
											cellRefs.current[index] = el;
										}}
										type="button"
										tabIndex={isFocused ? 0 : -1}
										disabled={disabled || cellValue !== null}
										data-winning={winning}
										aria-label={accessibleLabel}
										aria-selected={isFocused}
										onClick={() => onCellClick(index)}
										onFocus={() => onFocusChange(index)}
										onKeyDown={(e) => handleKeyDown(e, index)}
									>
										{showCoordinates && <CoordinateHint>{cellCoord}</CoordinateHint>}
										{cellValue && <MarkText data-mark={cellValue}>{cellValue}</MarkText>}
									</CellButton>
								</GridCellWrapper>
							);
						})}
					</GridRow>
				))}
			</GridContainer>
		</BoardWrapper>
	);
}
