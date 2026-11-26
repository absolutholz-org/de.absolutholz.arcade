import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import { isTubeComplete } from '../../engine/validator.js';
import * as S from './LiquidSortTube.styles.js';
import type { LiquidSortTubeProps } from './LiquidSortTube.types.js';

function renderSvgPattern(colorId: number): JSX.Element {
	const patternType = colorId % 10;
	switch (patternType) {
		case 0:
			// Diagonal stripes (\)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<line x1="0" y1="0" x2="40" y2="40" stroke="currentColor" strokeWidth="3" />
					<line x1="20" y1="0" x2="40" y2="20" stroke="currentColor" strokeWidth="3" />
					<line x1="0" y1="20" x2="20" y2="40" stroke="currentColor" strokeWidth="3" />
				</svg>
			);
		case 1:
			// Three solid dots
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<circle cx="10" cy="12" r="3.5" fill="currentColor" />
					<circle cx="30" cy="12" r="3.5" fill="currentColor" />
					<circle cx="20" cy="28" r="3.5" fill="currentColor" />
				</svg>
			);
		case 2:
			// Horizontal stripes (=)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<line x1="0" y1="13" x2="40" y2="13" stroke="currentColor" strokeWidth="3" />
					<line x1="0" y1="27" x2="40" y2="27" stroke="currentColor" strokeWidth="3" />
				</svg>
			);
		case 3:
			// Two diagonal solid squares
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<rect x="8" y="8" width="9" height="9" fill="currentColor" />
					<rect x="23" y="23" width="9" height="9" fill="currentColor" />
				</svg>
			);
		case 4:
			// Wavy line (~)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<path d="M0 20 Q 10 8, 20 20 T 40 20" fill="none" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
		case 5:
			// Bold X cross
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<line x1="9" y1="9" x2="31" y2="31" stroke="currentColor" strokeWidth="3.5" />
					<line x1="31" y1="9" x2="9" y2="31" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
		case 6:
			// Hollow ring
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
		case 7:
			// Vertical stripes (|||)
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<line x1="10" y1="0" x2="10" y2="40" stroke="currentColor" strokeWidth="3" />
					<line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="3" />
					<line x1="30" y1="0" x2="30" y2="40" stroke="currentColor" strokeWidth="3" />
				</svg>
			);
		case 8:
			// Hollow triangle
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<polygon points="20,7 33,31 7,31" fill="none" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
		default:
			// Hollow diamond
			return (
				<svg viewBox="0 0 40 40" aria-hidden="true">
					<polygon points="20,6 34,20 20,34 6,20" fill="none" stroke="currentColor" strokeWidth="3.5" />
				</svg>
			);
	}
}

export function LiquidSortTube({
	index,
	tube,
	isSelected,
	showPatterns,
	fluidAnimations,
	onSelect,
}: LiquidSortTubeProps): JSX.Element {
	const { t } = useI18n('liquid-sort');

	let contentsText = '';
	if (tube.length === 0) {
		contentsText = t('aria.tubeEmpty');
	} else if (isTubeComplete(tube)) {
		contentsText = t('aria.tubeComplete');
	} else {
		contentsText = tube.map((c) => t(`colors.color${c}` as Parameters<typeof t>[0])).join(', ');
	}

	const ariaLabel = t('aria.tube', { index: String(index + 1), contents: contentsText });

	return (
		<button
			type="button"
			className={S.tubeContainer}
			data-selected={isSelected ? 'true' : 'false'}
			data-complete={isTubeComplete(tube) ? 'true' : 'false'}
			onClick={() => onSelect(index)}
			aria-label={ariaLabel}
			aria-pressed={isSelected}
		>
			<div className={S.lip} aria-hidden="true" />
			<div className={S.tubeBody}>
				{tube.map((colorId, segIdx) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: Fixed physical stack order
						key={segIdx}
						className={S.segment}
						data-color={colorId}
						data-fluid={fluidAnimations ? 'true' : 'false'}
					>
						{showPatterns && renderSvgPattern(colorId)}
					</div>
				))}
			</div>
		</button>
	);
}
