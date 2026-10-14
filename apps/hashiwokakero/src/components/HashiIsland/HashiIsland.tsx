import type { JSX, KeyboardEvent } from 'react';
import * as S from './HashiIsland.styles.js';
import type { HashiIslandProps } from './HashiIsland.types.js';

export function HashiIsland({
	island,
	evaluation,
	isSelected,
	isFocused,
	highlightSatisfied,
	highlightOverflow,
	cellSpacing,
	padding,
	onClick,
	onFocus,
	onKeyDown,
}: HashiIslandProps): JSX.Element {
	const cx = padding + island.x * cellSpacing;
	const cy = padding + island.y * cellSpacing;
	const radius = 18;

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
			data-selected={isSelected ? 'true' : 'false'}
			data-state={stateAttr}
			tabIndex={0}
			// biome-ignore lint/a11y/useSemanticElements: SVG group element cannot be replaced by HTML button
			role="button"
			aria-label={ariaLabel}
			onClick={() => onClick(island)}
			onFocus={() => onFocus(island)}
			onKeyDown={handleKeyDown}
		>
			{/* Touch friendly hit area */}
			<S.HitArea cx={cx} cy={cy} r={Math.max(radius + 6, 22)} />

			{/* Rendered Island Circle */}
			<S.IslandCircle className="island-circle" cx={cx} cy={cy} r={radius} />

			{/* Target number */}
			<S.IslandText x={cx} y={cy}>
				{island.target}
			</S.IslandText>
		</S.IslandGroup>
	);
}
