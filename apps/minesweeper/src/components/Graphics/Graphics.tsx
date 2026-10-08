import type { JSX } from 'react';
import type { BoardSizeId, DifficultyId } from '../../engine/types';
import { MineIcon } from '../MinesweeperIcons';
import * as S from './Graphics.styles';

export function SizeGraphic({ size }: { size: BoardSizeId }): JSX.Element {
	return (
		<figure className={S.graphicContainer} aria-hidden="true">
			<div className={S.sizeGrid}>
				{size === 'xs' && (
					<div className={S.sizeRow}>
						<div className={S.sizeField} />
					</div>
				)}
				{size === 'sm' && (
					<div className={S.sizeRow}>
						<div className={S.sizeField} />
						<div className={S.sizeField} />
					</div>
				)}
				{size === 'md' && (
					<>
						<div className={S.sizeRow}>
							<div className={S.sizeField} />
							<div className={S.sizeField} />
						</div>
						<div className={S.sizeRow}>
							<div className={S.sizeField} />
							<div className={S.sizeField} />
						</div>
					</>
				)}
				{size === 'lg' && (
					<>
						<div className={S.sizeRow}>
							<div className={S.sizeField} />
							<div className={S.sizeField} />
							<div className={S.sizeField} />
						</div>
						<div className={S.sizeRow}>
							<div className={S.sizeField} />
							<div className={S.sizeField} />
							<div className={S.sizeField} />
						</div>
					</>
				)}
				{size === 'xl' && (
					<>
						<div className={S.sizeRow}>
							<div className={S.sizeField} />
							<div className={S.sizeField} />
							<div className={S.sizeField} />
							<div className={S.sizeField} />
						</div>
						<div className={S.sizeRow}>
							<div className={S.sizeField} />
							<div className={S.sizeField} />
							<div className={S.sizeField} />
							<div className={S.sizeField} />
						</div>
					</>
				)}
			</div>
		</figure>
	);
}

export function DifficultyGraphic({ difficulty }: { difficulty: DifficultyId }): JSX.Element {
	return (
		<figure className={S.graphicContainer} aria-hidden="true">
			<div className={S.difficultyGrid}>
				{difficulty === 'simple' && (
					<div className={S.difficultyRow}>
						<div className={S.difficultyMine}>
							<MineIcon />
						</div>
					</div>
				)}
				{difficulty === 'medium' && (
					<div className={S.difficultyRow}>
						<div className={S.difficultyMine}>
							<MineIcon />
						</div>
						<div className={S.difficultyMine}>
							<MineIcon />
						</div>
					</div>
				)}
				{difficulty === 'hard' && (
					<>
						<div className={S.difficultyRow}>
							<div className={S.difficultyMine}>
								<MineIcon />
							</div>
						</div>
						<div className={S.difficultyRow}>
							<div className={S.difficultyMine}>
								<MineIcon />
							</div>
							<div className={S.difficultyMine}>
								<MineIcon />
							</div>
						</div>
					</>
				)}
				{difficulty === 'expert' && (
					<>
						<div className={S.difficultyRow}>
							<div className={S.difficultyMine}>
								<MineIcon />
							</div>
							<div className={S.difficultyMine}>
								<MineIcon />
							</div>
						</div>
						<div className={S.difficultyRow}>
							<div className={S.difficultyMine}>
								<MineIcon />
							</div>
							<div className={S.difficultyMine}>
								<MineIcon />
							</div>
						</div>
					</>
				)}
			</div>
		</figure>
	);
}
