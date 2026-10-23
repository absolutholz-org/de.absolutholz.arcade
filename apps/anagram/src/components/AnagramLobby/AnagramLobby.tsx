import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { GameLandingTemplate, GameSelectionCard, SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui';
import { type JSX, useEffect, useState } from 'react';
import { loadProgress } from '../../engine/storage.js';
import type { DifficultyLevel, GameMode, ProgressMap } from '../../engine/types.js';
import * as S from './AnagramLobby.styles.js';
import type { AnagramLobbyProps } from './AnagramLobby.types.js';

const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = ['easy', 'medium', 'hard', 'expert'];
const GAME_MODES: readonly GameMode[] = ['zen', 'timed'];

function getInitialMode(): GameMode {
	if (typeof window !== 'undefined') {
		const raw = new URLSearchParams(window.location.search).get('mode');
		if (raw && (GAME_MODES as readonly string[]).includes(raw)) {
			return raw as GameMode;
		}
	}
	return 'zen';
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('anagram');
	const { t: tCommon } = useI18n('common');
	const [progress, setProgress] = useState<ProgressMap>({});
	const [selectedMode, setSelectedMode] = useState<GameMode>(getInitialMode);

	useEffect(() => {
		loadProgress().then(setProgress);
	}, []);

	const handleSelectMode = (mode: GameMode) => {
		setSelectedMode(mode);
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('mode', mode);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const pageFooterLinks = [
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/anagram/${language}/medals` },
		{ label: tCommon('navigation.rules'), href: `/anagram/${language}/rules` },
	];

	const modeItems: SegmentedControlItem[] = GAME_MODES.map((mode) => ({
		id: mode,
		label: t(`mode.${mode}`),
		sublabel: t(`mode.${mode}Desc`),
	}));

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="anagram"
		>
			<S.Section aria-labelledby="anagram-mode-section-title">
				<h2 id="anagram-mode-section-title">{t('mode.label')}</h2>
				<SegmentedControl
					items={modeItems}
					value={selectedMode}
					onChange={(mode) => handleSelectMode(mode as GameMode)}
					ariaLabel={t('mode.label')}
				/>
			</S.Section>

			<S.Section aria-labelledby="anagram-tiers-section-title">
				<h2 id="anagram-tiers-section-title">{t('difficulty.label')}</h2>

				<S.CardsGrid>
					{DIFFICULTY_LEVELS.map((diff) => {
						const record = progress[diff];

						return (
							<GameSelectionCard
								key={diff}
								as="a"
								href={`/anagram/${language}/game?difficulty=${diff}&mode=${selectedMode}`}
								title={t(`difficulty.${diff}`)}
								dimensions={t(`difficulty.${diff}Dimensions`)}
								subtitle={t(`difficulty.${diff}Desc`)}
								badge={
									record?.completed
										? {
												label: record.mastered
													? t('victory.masteredTitle')
													: t('victory.title'),
												variant: 'success',
											}
										: undefined
								}
							/>
						);
					})}
				</S.CardsGrid>
			</S.Section>
		</GameLandingTemplate>
	);
}

export function AnagramLobby({ lang }: AnagramLobbyProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
