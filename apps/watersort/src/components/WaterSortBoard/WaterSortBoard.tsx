import type { JSX } from 'react';
import { WaterSortTube } from '../WaterSortTube/index.js';
import * as S from './WaterSortBoard.styles.js';
import type { WaterSortBoardProps } from './WaterSortBoard.types.js';

export function WaterSortBoard({
	board,
	selectedIndex,
	showPatterns,
	fluidAnimations,
	onSelectTube,
}: WaterSortBoardProps): JSX.Element {
	return (
		<div className={S.boardWrapper}>
			<section className={S.rackContainer} data-tubes={board.length} aria-label="Tubes Rack">
				{board.map((tube, index) => (
					<WaterSortTube
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
