import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import { isTubeComplete } from '../../engine/validator.js';
import * as S from './LiquidSortTube.styles.js';
import type { LiquidSortTubeProps } from './LiquidSortTube.types.js';

function renderSvgPattern(colorId: number): JSX.Element {
	const patternType = colorId % 5;
	if (patternType === 0) {
		return (
			<svg viewBox="0 0 40 40" aria-hidden="true">
				<line x1="0" y1="0" x2="40" y2="40" stroke="currentColor" strokeWidth="3" />
				<line x1="20" y1="0" x2="40" y2="20" stroke="currentColor" strokeWidth="3" />
				<line x1="0" y1="20" x2="20" y2="40" stroke="currentColor" strokeWidth="3" />
			</svg>
		);
	}
	if (patternType === 1) {
		return (
			<svg viewBox="0 0 40 40" aria-hidden="true">
				<circle cx="10" cy="10" r="3" fill="currentColor" />
				<circle cx="30" cy="10" r="3" fill="currentColor" />
				<circle cx="20" cy="25" r="3" fill="currentColor" />
			</svg>
		);
	}
	if (patternType === 2) {
		return (
			<svg viewBox="0 0 40 40" aria-hidden="true">
				<line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="3" />
				<line x1="0" y1="35" x2="40" y2="35" stroke="currentColor" strokeWidth="3" />
			</svg>
		);
	}
	if (patternType === 3) {
		return (
			<svg viewBox="0 0 40 40" aria-hidden="true">
				<rect x="8" y="8" width="8" height="8" fill="currentColor" />
				<rect x="24" y="24" width="8" height="8" fill="currentColor" />
			</svg>
		);
	}
	return (
		<svg viewBox="0 0 40 40" aria-hidden="true">
			<path d="M0 20 Q 10 10, 20 20 T 40 20" fill="none" stroke="currentColor" strokeWidth="3" />
		</svg>
	);
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
