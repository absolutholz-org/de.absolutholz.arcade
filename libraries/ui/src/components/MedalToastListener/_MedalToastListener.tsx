import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode, TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import {
	type MedalUnlockedEventDetail,
	getMedalDefinitionsForGame,
	subscribeToMedalUnlocked,
} from '@arcade/lib-medals';
import { useEffect } from 'react';
import { toast } from '../Toast';

function MedalToastListenerContent() {
	const { t, language } = useI18n('medals');

	useEffect(() => {
		const unsubscribe = subscribeToMedalUnlocked((detail: MedalUnlockedEventDetail) => {
			const definitions = getMedalDefinitionsForGame(detail.gameId);
			const defMap = new Map(definitions.map((d) => [d.id, d]));

			for (const medal of detail.medals) {
				const def = defMap.get(medal.id);
				const strippedId = medal.id.startsWith(`${detail.gameId}_`)
					? medal.id.slice(detail.gameId.length + 1)
					: medal.id;
				const normalizedSlug =
					detail.gameId === 'sudoku' && strippedId === 'first_win' ? 'first_victory' : strippedId;
				const derivedTitleKey = (
					def ? def.titleKey.replace(/^medals\./, '') : `${detail.gameId}.${normalizedSlug}.title`
				) as TranslationKey;
				const derivedDescKey = (
					def ? def.descriptionKey.replace(/^medals\./, '') : `${detail.gameId}.${normalizedSlug}.desc`
				) as TranslationKey;

				const translatedTitle = t(derivedTitleKey);
				const translatedDesc = t(derivedDescKey);
				const title = translatedTitle !== derivedTitleKey ? translatedTitle : 'Medal Unlocked!';
				const message = translatedDesc !== derivedDescKey ? translatedDesc : medal.id;

				const showcaseHref = `/${detail.gameId}/${language}/medals`;

				toast.achievement(message, {
					title,
					action: {
						label: t('showcase.widget.viewShowcase'),
						onClick: () => {
							if (typeof window !== 'undefined') {
								window.location.assign(showcaseHref);
							}
						},
						ariaLabel: `${t('showcase.widget.viewShowcase')} - ${title}`,
					},
				});
			}
		});

		return unsubscribe;
	}, [t, language]);

	return null;
}

export interface MedalToastListenerProps {
	lang?: SupportedLanguageCode;
}

/**
 * Global background listener bridging game medal unlock events to the accessible Toast controller.
 */
export function MedalToastListener({ lang }: MedalToastListenerProps = {}) {
	if (lang) {
		return (
			<I18nProvider language={lang}>
				<MedalToastListenerContent />
			</I18nProvider>
		);
	}
	return <MedalToastListenerContent />;
}
