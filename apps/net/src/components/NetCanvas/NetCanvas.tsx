import { type JSX, type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { countPorts, getTileShape, hasDirection } from '../../engine/rotator.ts';
import { type Board, type Cell, DIR_EAST, DIR_NORTH, DIR_SOUTH, DIR_WEST } from '../../engine/types.ts';
import * as S from './NetCanvas.styles.ts';

export interface NetCanvasProps {
	board: Board;
	disabled?: boolean;
	highlightPowered?: boolean;
	ariaLabel: string;
	getCellAriaLabel: (cell: Cell) => string;
	onRotateCW: (row: number, col: number) => void;
	onRotateCCW: (row: number, col: number) => void;
	onToggleLock: (row: number, col: number) => void;
}

export function NetCanvas({
	board,
	disabled = false,
	highlightPowered = true,
	ariaLabel,
	getCellAriaLabel,
	onRotateCW,
	onRotateCCW,
	onToggleLock,
}: NetCanvasProps): JSX.Element {
	const { rows, cols, grid } = board;
	const [focusedRow, setFocusedRow] = useState(board.rootRow);
	const [focusedCol, setFocusedCol] = useState(board.rootCol);
	const gridRef = useRef<HTMLDivElement>(null);

	// Ensure focus is kept within bounds
	useEffect(() => {
		if (focusedRow >= rows) setFocusedRow(rows - 1);
		if (focusedCol >= cols) setFocusedCol(cols - 1);
	}, [rows, cols, focusedRow, focusedCol]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>, r: number, c: number) => {
			if (disabled) return;

			let nextR = r;
			let nextC = c;
			let handled = false;

			switch (e.key) {
				case 'ArrowUp':
					nextR = Math.max(0, r - 1);
					handled = true;
					break;
				case 'ArrowDown':
					nextR = Math.min(rows - 1, r + 1);
					handled = true;
					break;
				case 'ArrowLeft':
					nextC = Math.max(0, c - 1);
					handled = true;
					break;
				case 'ArrowRight':
					nextC = Math.min(cols - 1, c + 1);
					handled = true;
					break;
				case 'Enter':
				case ' ':
					e.preventDefault();
					if (grid[r][c].isLocked) return;
					if (e.shiftKey) {
						onRotateCCW(r, c);
					} else {
						onRotateCW(r, c);
					}
					return;
				case 'l':
				case 'L':
					e.preventDefault();
					onToggleLock(r, c);
					return;
				default:
					break;
			}

			if (handled) {
				e.preventDefault();
				setFocusedRow(nextR);
				setFocusedCol(nextC);

				// Focus target element
				const button = gridRef.current?.querySelector<HTMLButtonElement>(
					`[data-row="${nextR}"][data-col="${nextC}"]`,
				);
				button?.focus();
			}
		},
		[cols, disabled, grid, onRotateCCW, onRotateCW, onToggleLock, rows],
	);

	const renderTileGraphic = (cell: Cell) => {
		const { solutionMask, isPowered, isRoot } = cell;
		const isEnergized = highlightPowered && isPowered;
		const shape = getTileShape(solutionMask);
		const ports = countPorts(solutionMask);

		const cableCoreColor = isEnergized ? '#00e5ff' : 'var(--color-border-strong)';
		const cableBgColor = isEnergized ? '#005b66' : 'var(--color-surface-sunken)';
		const centerAccentColor = isEnergized ? '#00f0ff' : 'var(--color-text-muted)';

		return (
			<svg
				viewBox="0 0 100 100"
				className={S.tileGraphic}
				style={{ '--tile-angle': `${cell.rotation}deg` } as Record<string, string>}
				aria-hidden="true"
			>
				<title>Net Tile</title>
				{/* Background Cable Tracks */}
				{hasDirection(solutionMask, DIR_NORTH) && (
					<line x1="50" y1="50" x2="50" y2="0" stroke={cableBgColor} strokeWidth="18" strokeLinecap="round" />
				)}
				{hasDirection(solutionMask, DIR_EAST) && (
					<line
						x1="50"
						y1="50"
						x2="100"
						y2="50"
						stroke={cableBgColor}
						strokeWidth="18"
						strokeLinecap="round"
					/>
				)}
				{hasDirection(solutionMask, DIR_SOUTH) && (
					<line
						x1="50"
						y1="50"
						x2="50"
						y2="100"
						stroke={cableBgColor}
						strokeWidth="18"
						strokeLinecap="round"
					/>
				)}
				{hasDirection(solutionMask, DIR_WEST) && (
					<line x1="50" y1="50" x2="0" y2="50" stroke={cableBgColor} strokeWidth="18" strokeLinecap="round" />
				)}

				{/* Foreground Energized Cable Cores */}
				{hasDirection(solutionMask, DIR_NORTH) && (
					<line
						x1="50"
						y1="50"
						x2="50"
						y2="0"
						stroke={cableCoreColor}
						strokeWidth="10"
						strokeLinecap="round"
					/>
				)}
				{hasDirection(solutionMask, DIR_EAST) && (
					<line
						x1="50"
						y1="50"
						x2="100"
						y2="50"
						stroke={cableCoreColor}
						strokeWidth="10"
						strokeLinecap="round"
					/>
				)}
				{hasDirection(solutionMask, DIR_SOUTH) && (
					<line
						x1="50"
						y1="50"
						x2="50"
						y2="100"
						stroke={cableCoreColor}
						strokeWidth="10"
						strokeLinecap="round"
					/>
				)}
				{hasDirection(solutionMask, DIR_WEST) && (
					<line
						x1="50"
						y1="50"
						x2="0"
						y2="50"
						stroke={cableCoreColor}
						strokeWidth="10"
						strokeLinecap="round"
					/>
				)}

				{/* Center Icons & Terminals */}
				{isRoot ? (
					// Central Server Node (keeps upright via counter-rotation)
					<g className={S.counterRotate}>
						<rect
							x="28"
							y="28"
							width="44"
							height="44"
							rx="8"
							fill="var(--color-surface-sunken)"
							stroke={isEnergized ? '#00e5ff' : 'var(--color-border-strong)'}
							strokeWidth="4"
						/>
						{/* Server Drive Bays / LEDs */}
						<line
							x1="36"
							y1="38"
							x2="64"
							y2="38"
							stroke={centerAccentColor}
							strokeWidth="3"
							strokeLinecap="round"
						/>
						<line
							x1="36"
							y1="46"
							x2="64"
							y2="46"
							stroke={centerAccentColor}
							strokeWidth="3"
							strokeLinecap="round"
						/>
						<circle cx="37" cy="56" r="3" fill={isEnergized ? '#10b981' : '#64748b'} />
						<circle cx="47" cy="56" r="3" fill={isEnergized ? '#00e5ff' : '#64748b'} />
						<circle cx="57" cy="56" r="3" fill={isEnergized ? '#f59e0b' : '#64748b'} />
					</g>
				) : ports === 1 ? (
					// Computer Terminal / Workstation
					<g className={S.counterRotate}>
						<rect
							x="33"
							y="30"
							width="34"
							height="26"
							rx="4"
							fill="var(--color-surface-sunken)"
							stroke={isEnergized ? '#00e5ff' : 'var(--color-border-strong)'}
							strokeWidth="3"
						/>
						<rect
							x="38"
							y="35"
							width="24"
							height="16"
							rx="2"
							fill={isEnergized ? 'rgba(0, 229, 255, 0.25)' : 'rgba(100, 116, 139, 0.15)'}
						/>
						<line x1="50" y1="56" x2="50" y2="65" stroke={cableCoreColor} strokeWidth="4" />
						<line
							x1="40"
							y1="65"
							x2="60"
							y2="65"
							stroke={cableCoreColor}
							strokeWidth="4"
							strokeLinecap="round"
						/>
					</g>
				) : (
					// Junction node
					<circle cx="50" cy="50" r="8" fill={cableCoreColor} stroke={cableBgColor} strokeWidth="3" />
				)}
			</svg>
		);
	};

	return (
		<div className={S.gridWrapper}>
			<div
				ref={gridRef}
				// biome-ignore lint/a11y/useSemanticElements: Net is an interactive 2D grid widget adhering to WAI-ARIA Grid pattern
				role="grid"
				aria-label={ariaLabel}
				aria-rowcount={rows}
				aria-colcount={cols}
				className={S.grid}
				style={{ '--grid-cols': cols, '--grid-rows': rows } as Record<string, number>}
			>
				{grid.map((rowCells, r) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Fixed 2D grid coordinates serve as stable keys
					// biome-ignore lint/a11y/useSemanticElements: Row role required for WAI-ARIA grid pattern
					// biome-ignore lint/a11y/useFocusableInteractive: Row element in ARIA grid delegates focus to cell children via roving tabIndex
					<div key={`net-row-${r}`} role="row" aria-rowindex={r + 1} className={S.row}>
						{rowCells.map((cell, c) => {
							const isFocused = focusedRow === r && focusedCol === c;
							return (
								<button
									key={cell.id}
									type="button"
									// biome-ignore lint/a11y/useSemanticElements: Gridcell role required for WAI-ARIA grid pattern
									role="gridcell"
									data-row={r}
									data-col={c}
									data-powered={cell.isPowered ? 'true' : 'false'}
									data-locked={cell.isLocked ? 'true' : 'false'}
									data-root={cell.isRoot ? 'true' : 'false'}
									aria-colindex={c + 1}
									aria-label={getCellAriaLabel(cell)}
									tabIndex={isFocused ? 0 : -1}
									disabled={disabled}
									className={S.tileButton}
									onClick={() => {
										if (cell.isLocked || disabled) return;
										setFocusedRow(r);
										setFocusedCol(c);
										onRotateCW(r, c);
									}}
									onContextMenu={(e) => {
										e.preventDefault();
										if (disabled) return;
										setFocusedRow(r);
										setFocusedCol(c);
										onToggleLock(r, c);
									}}
									onKeyDown={(e) => handleKeyDown(e, r, c)}
								>
									{renderTileGraphic(cell)}

									{cell.isLocked && (
										<span className={S.lockBadge} aria-hidden="true">
											<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
												<title>Locked</title>
												<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
											</svg>
										</span>
									)}
								</button>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
