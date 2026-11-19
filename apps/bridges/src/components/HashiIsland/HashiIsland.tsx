import { type JSX, type KeyboardEvent, useEffect, useRef } from 'react';
import * as S from './HashiIsland.styles.js';
import type { HashiIslandProps } from './HashiIsland.types.js';

export function HashiIsland({
	island,
	evaluation,
	isSelected,
	isFocused,
	isTabbable,
	highlightSatisfied,
	highlightOverflow,
	cellSpacing,
	padding,
	onClick,
	onFocus,
	onKeyDown,
}: HashiIslandProps): JSX.Element {
	const groupRef = useRef<SVGGElement | null>(null);
	const cx = padding + island.x * cellSpacing;
	const cy = padding + island.y * cellSpacing;
	const radius = 18;

	// Move DOM focus when keyboard navigation changes focusedIslandId while focus is inside the board
	useEffect(() => {
		const el = groupRef.current;
		if (!isFocused || !el) return;
		const grid = el.closest('[role="grid"]');
		if (grid && document.activeElement !== el && grid.contains(document.activeElement)) {
			el.focus();
		}
	}, [isFocused]);

	let stateAttr = 'neutral';
	if (highlightSatisfied && evaluation.status === 'satisfied') {
		stateAttr = 'satisfied';
	} else if (highlightOverflow && evaluation.status === 'overflow') {
		stateAttr = 'overflow';
	}

	const ariaLabel = `Island at (${island.x + 1}, ${island.y + 1}). Target: ${island.target}, Current: ${evaluation.current}. Status: ${evaluation.status}${isSelected ? ', selected' : ''}`;

	const handleKeyDown = (e: KeyboardEvent) => {
		onKeyDown(e, island);
	};

	return (
		<S.IslandGroup
			ref={groupRef}
			data-selected={isSelected ? 'true' : 'false'}
			data-state={stateAttr}
			tabIndex={isTabbable ? 0 : -1}
			// biome-ignore lint/a11y/useSemanticElements: SVG group element cannot be replaced by HTML button
			role="button"
			aria-label={ariaLabel}
			onClick={() => onClick(island)}
			onFocus={() => onFocus(island)}
			onKeyDown={handleKeyDown}
		>
			{/* Touch friendly hit area */}
			<S.HitArea cx={cx} cy={cy} r={Math.max(radius + 6, 22)} />

			{/* Distinct keyboard focus ring (separate from active/selected island styling) */}
			<S.FocusRing className="focus-ring" cx={cx} cy={cy} r={radius + 5} />

			{/* Rendered Island Circle */}
			<S.IslandCircle className="island-circle" cx={cx} cy={cy} r={radius} />

			{/* Target number */}
			<S.IslandText x={cx} y={cy}>
				{island.target}
			</S.IslandText>
		</S.IslandGroup>
	);
}
