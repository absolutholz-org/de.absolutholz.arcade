import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import { normalizeWord } from '../../engine/validator.js';
import * as S from './AnagramSlots.styles.js';
import type { AnagramSlotsProps } from './AnagramSlots.types.js';

export function AnagramSlots({ words, foundWords, isRevealed }: AnagramSlotsProps): JSX.Element {
	const { t } = useI18n('anagram');

	const wordsByLength = new Map<number, string[]>();
	for (const word of words) {
		const length = Array.from(word).length;
		wordsByLength.set(length, [...(wordsByLength.get(length) ?? []), word]);
	}
	const lengths = [...wordsByLength.keys()].sort((a, b) => a - b);

	return (
		<S.SlotsCard aria-label={t('board.slotsLabel')}>
			{lengths.map((length) => (
				<S.LengthGroup key={length}>
					<h3>{t('board.wordLength', { length })}</h3>
					<ul>
						{(wordsByLength.get(length) ?? []).map((word) => {
							const normalizedTarget = normalizeWord(word);
							const isFound =
								foundWords.includes(word) ||
								foundWords.some((found) => normalizeWord(found) === normalizedTarget);
							const state = isFound ? 'found' : isRevealed ? 'revealed' : 'hidden';
							return (
								<S.Slot
									key={word}
									data-state={state}
									aria-label={
										state === 'hidden'
											? t('aria.slotHidden', { length })
											: t('aria.slotRevealed', { word })
									}
								>
									{state === 'hidden' ? Array.from(word, () => '_').join(' ') : word}
								</S.Slot>
							);
						})}
					</ul>
				</S.LengthGroup>
			))}
		</S.SlotsCard>
	);
}
