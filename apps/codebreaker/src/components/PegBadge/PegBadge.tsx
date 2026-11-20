import type { JSX } from 'react';
import { PEG_COLORS, type PegColorId, type PegSymbol } from '../../engine/types';
import * as S from './PegBadge.styles';

export interface PegBadgeProps {
	readonly colorId: PegColorId;
	readonly size?: 'sm' | 'md' | 'lg';
	readonly showShape?: boolean;
	readonly showNumber?: boolean;
}

function renderSymbolPath(symbol: PegSymbol): JSX.Element {
	switch (symbol) {
		case 'circle':
			return <circle cx="12" cy="12" r="5.5" fill="currentColor" />;
		case 'triangle':
			return <polygon points="12,5 19,18 5,18" fill="currentColor" />;
		case 'square':
			return <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />;
		case 'diamond':
			return <polygon points="12,4.5 19.5,12 12,19.5 4.5,12" fill="currentColor" />;
		case 'star':
			return (
				<polygon
					points="12,4 14.4,9.1 20,9.8 15.9,13.7 16.9,19.3 12,16.5 7.1,19.3 8.1,13.7 4,9.8 9.6,9.1"
					fill="currentColor"
				/>
			);
		case 'cross':
			return <path d="M9.5 4.5h5v5h5v5h-5v5h-5v-5h-5v-5h5z" fill="currentColor" />;
		case 'ring':
			return <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="3.2" />;
		case 'hexagon':
			return <polygon points="12,4.5 18.5,8.25 18.5,15.75 12,19.5 5.5,15.75 5.5,8.25" fill="currentColor" />;
	}
}

export function PegBadge({ colorId, size = 'md', showShape = false, showNumber = false }: PegBadgeProps): JSX.Element {
	const spec = PEG_COLORS[colorId];

	return (
		<S.PegCircle className={S.pegTokensScope} data-color={spec.key} data-size={size} aria-hidden="true">
			<S.PegGlyph
				viewBox="0 0 24 24"
				focusable="false"
				aria-hidden="true"
				data-visible={showShape ? 'true' : 'false'}
			>
				{renderSymbolPath(spec.symbol)}
			</S.PegGlyph>
			{showNumber && <S.NumberTag>{spec.numberLabel}</S.NumberTag>}
		</S.PegCircle>
	);
}
