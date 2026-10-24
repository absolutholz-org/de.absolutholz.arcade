import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { GameLandingTemplate, GameSelectionCard, SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { type JSX, useEffect, useState } from 'react';
import { loadActiveGame, loadProgress, loadSettings, saveSettings } from '../../engine/storage.js';
import {
	type DifficultyLevel,
	type GameMode,
	type GameSnapshot,
	type LanguageCode,
	type ProgressMap,
	SUPPORTED_VOCAB_LANGUAGES,
} from '../../engine/types.js';
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

function getInitialVocabLanguage(routeLanguage: string): LanguageCode {
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const raw = params.get('vocab') ?? params.get('lang');
		if (raw && (SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(raw)) {
			return raw as LanguageCode;
		}
	}
	if (routeLanguage === 'de') return 'de';
	if (routeLanguage === 'pt') return 'pt';
	return 'en';
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('anagram');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [selectedMode, setSelectedMode] = useState<GameMode>(getInitialMode);
	const [vocabLanguage, setVocabLanguage] = useState<LanguageCode>(() => getInitialVocabLanguage(language));

	useEffect(() => {
		async function init() {
			const [savedGame, savedProgress, savedSettings] = await Promise.all([
				loadActiveGame(),
				loadProgress(),
				loadSettings(),
			]);
			if (savedGame && !savedGame.isComplete) {
				setActiveGame(savedGame);
			}
			setProgress(savedProgress);

			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const queryVocab = params.get('vocab') ?? params.get('lang');
				if (queryVocab && (SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(queryVocab)) {
					setVocabLanguage(queryVocab as LanguageCode);
					return;
				}
			}
			if (
				savedSettings.vocabLanguage &&
				(SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(savedSettings.vocabLanguage)
			) {
				setVocabLanguage(savedSettings.vocabLanguage);
			}
		}
		init();
	}, []);

	const handleSelectMode = (mode: GameMode) => {
		setSelectedMode(mode);
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('mode', mode);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const handleSelectVocabLanguage = (nextLang: LanguageCode) => {
		setVocabLanguage(nextLang);
		void saveSettings({ vocabLanguage: nextLang });
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('lang', nextLang);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const pageFooterLinks = [
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/anagram/${language}/medals` },
		{ label: tCommon('navigation.rules'), href: `/anagram/${language}/rules` },
	];

	const vocabItems: SegmentedControlItem[] = SUPPORTED_VOCAB_LANGUAGES.map((code) => ({
		id: code,
		label: t(`vocabulary.${code}`),
	}));

	const modeItems: SegmentedControlItem[] = GAME_MODES.map((mode) => ({
		id: mode,
		label: t(`mode.${mode}`),
		sublabel: t(`mode.${mode}Desc`),
	}));

	const resumeState = activeGame
		? {
				message: `${t(`difficulty.${activeGame.difficulty}`)} • ${t(`mode.${activeGame.mode}`)} • ${t(`vocabulary.${activeGame.language}`)} • ${t('hud.wordsFound', { found: String(activeGame.foundWords.length), total: String(activeGame.words.length) })} • ${formatTime(activeGame.mode === 'timed' ? activeGame.remainingSeconds : activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/anagram/${language}/game?resume=true`;
				},
				buttonLabel: t('controls.resume'),
			}
		: undefined;

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			pageFooterLinks={pageFooterLinks}
			offlineGameId="anagram"
		>
			<S.Section aria-labelledby="anagram-vocab-section-title">
				<h2 id="anagram-vocab-section-title">{t('vocabulary.label')}</h2>
				<SegmentedControl
					items={vocabItems}
					value={vocabLanguage}
					onChange={(code) => handleSelectVocabLanguage(code as LanguageCode)}
					ariaLabel={t('vocabulary.label')}
				/>
			</S.Section>

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
								href={`/anagram/${language}/game?difficulty=${diff}&mode=${selectedMode}&vocab=${vocabLanguage}&lang=${vocabLanguage}&new=true`}
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
