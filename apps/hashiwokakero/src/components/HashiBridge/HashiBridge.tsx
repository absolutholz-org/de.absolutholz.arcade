import type { JSX } from 'react';
import * as S from './HashiBridge.styles.js';
import type { HashiBridgeProps } from './HashiBridge.types.js';

export function HashiBridge({
	bridge,
	fromIsland,
	toIsland,
	cellSpacing,
	padding,
	onClick,
}: HashiBridgeProps): JSX.Element {
	const x1 = padding + fromIsland.x * cellSpacing;
	const y1 = padding + fromIsland.y * cellSpacing;
	const x2 = padding + toIsland.x * cellSpacing;
	const y2 = padding + toIsland.y * cellSpacing;

	const handleClick = () => {
		onClick?.(bridge.fromId, bridge.toId);
	};

	const isHorizontal = bridge.orientation === 'horizontal';
	const offset = 4;

	return (
		<S.BridgeGroup
			onClick={handleClick}
			// biome-ignore lint/a11y/useSemanticElements: SVG group element cannot be replaced by HTML button
			role="button"
			aria-label={`Bridge between ${bridge.fromId} and ${bridge.toId}`}
		>
			{/* Invisible wider hit area for touch/mouse */}
			<S.HitArea x1={x1} y1={y1} x2={x2} y2={y2} />

			{bridge.count === 1 ? (
				<S.BridgeLine className="bridge-line" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={4} />
			) : (
				<>
					{isHorizontal ? (
						<>
							<S.BridgeLine
								className="bridge-line"
								x1={x1}
								y1={y1 - offset}
								x2={x2}
								y2={y2 - offset}
								strokeWidth={3}
							/>
							<S.BridgeLine
								className="bridge-line"
								x1={x1}
								y1={y1 + offset}
								x2={x2}
								y2={y2 + offset}
								strokeWidth={3}
							/>
						</>
					) : (
						<>
							<S.BridgeLine
								className="bridge-line"
								x1={x1 - offset}
								y1={y1}
								x2={x2 - offset}
								y2={y2}
								strokeWidth={3}
							/>
							<S.BridgeLine
								className="bridge-line"
								x1={x1 + offset}
								y1={y1}
								x2={x2 + offset}
								y2={y2}
								strokeWidth={3}
							/>
						</>
					)}
				</>
			)}
		</S.BridgeGroup>
	);
}
