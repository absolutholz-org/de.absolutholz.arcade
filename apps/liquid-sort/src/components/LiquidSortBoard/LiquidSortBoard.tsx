import type { JSX } from 'react';
import { LiquidSortTube } from '../LiquidSortTube/index.js';
import * as S from './LiquidSortBoard.styles.js';
import type { LiquidSortBoardProps } from './LiquidSortBoard.types.js';

export function LiquidSortBoard({
	board,
	selectedIndex,
	showPatterns,
	fluidAnimations,
	onSelectTube,
}: LiquidSortBoardProps): JSX.Element {
	return (
		<div className={S.boardWrapper}>
			<section className={S.rackContainer} data-tubes={board.length} aria-label="Tubes Rack">
				{board.map((tube, index) => (
					<LiquidSortTube
						// biome-ignore lint/suspicious/noArrayIndexKey: Fixed rack tube slot positions
						key={index}
						index={index}
						tube={tube}
						isSelected={selectedIndex === index}
						isSourceCandidate={false}
						showPatterns={showPatterns}
						fluidAnimations={fluidAnimations}
						onSelect={onSelectTube}
					/>
				))}
			</section>
		</div>
	);
}
