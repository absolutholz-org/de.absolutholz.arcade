import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui/components/SegmentedControl';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate';
import { type JSX, useEffect, useState } from 'react';
import { loadActiveGame, loadLastConfig, loadProgress, saveLastConfig } from '../../engine/storage.js';
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

function parseUrlParams(routeLanguage: string): { mode: GameMode; vocab: LanguageCode } {
	let mode: GameMode = 'zen';
	let vocab: LanguageCode =
		routeLanguage === 'de' ? 'de' : routeLanguage === 'fr' ? 'fr' : routeLanguage === 'pt' ? 'pt' : 'en';

	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		const rawMode = params.get('mode');
		if (rawMode && (GAME_MODES as readonly string[]).includes(rawMode)) {
			mode = rawMode as GameMode;
		}
		const rawVocab = params.get('vocab');
		if (rawVocab && (SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(rawVocab)) {
			vocab = rawVocab as LanguageCode;
		}
	}
	return { mode, vocab };
}

function LobbyContent(): JSX.Element {
	const { t, language } = useI18n('anagram');
	const { t: tCommon } = useI18n('common');
	const [activeGame, setActiveGame] = useState<GameSnapshot | null>(null);
	const [progress, setProgress] = useState<ProgressMap>({});
	const [selectedMode, setSelectedMode] = useState<GameMode>(() => parseUrlParams(language).mode);
	const [vocabLanguage, setVocabLanguage] = useState<LanguageCode>(() => parseUrlParams(language).vocab);
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');

	useEffect(() => {
		async function init() {
			const [savedGame, savedProgress, lastConfig] = await Promise.all([
				loadActiveGame(),
				loadProgress(),
				loadLastConfig(),
			]);

			if (savedGame && !savedGame.isComplete) {
				setActiveGame(savedGame);
			}
			setProgress(savedProgress);

			const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
			const rawMode = urlParams?.get('mode');
			const rawVocab = urlParams?.get('vocab');
			const rawDiff = urlParams?.get('difficulty');

			const hasExplicitMode = rawMode && (GAME_MODES as readonly string[]).includes(rawMode);
			const hasExplicitVocab = rawVocab && (SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(rawVocab);
			const hasExplicitDiff = rawDiff && (DIFFICULTY_LEVELS as readonly string[]).includes(rawDiff);

			const resolvedMode: GameMode = hasExplicitMode
				? (rawMode as GameMode)
				: savedGame && !savedGame.isComplete
					? savedGame.mode
					: lastConfig?.mode && (GAME_MODES as readonly string[]).includes(lastConfig.mode)
						? lastConfig.mode
						: 'zen';

			const fallbackVocab: LanguageCode =
				language === 'de' ? 'de' : language === 'fr' ? 'fr' : language === 'pt' ? 'pt' : 'en';

			const resolvedVocab: LanguageCode = hasExplicitVocab
				? (rawVocab as LanguageCode)
				: savedGame && !savedGame.isComplete
					? savedGame.language
					: lastConfig?.vocab && (SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(lastConfig.vocab)
						? lastConfig.vocab
						: fallbackVocab;

			const resolvedDiff: DifficultyLevel = hasExplicitDiff
				? (rawDiff as DifficultyLevel)
				: savedGame && !savedGame.isComplete
					? savedGame.difficulty
					: lastConfig?.difficulty && (DIFFICULTY_LEVELS as readonly string[]).includes(lastConfig.difficulty)
						? lastConfig.difficulty
						: 'easy';

			setSelectedMode(resolvedMode);
			setVocabLanguage(resolvedVocab);
			setSelectedDifficulty(resolvedDiff);
		}
		init();
	}, [language]);

	const handleSelectMode = (mode: GameMode) => {
		setSelectedMode(mode);
		void saveLastConfig({ vocab: vocabLanguage, mode, difficulty: selectedDifficulty });
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('mode', mode);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const handleSelectVocabLanguage = (nextLang: LanguageCode) => {
		setVocabLanguage(nextLang);
		void saveLastConfig({ vocab: nextLang, mode: selectedMode, difficulty: selectedDifficulty });
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.delete('lang');
			url.searchParams.set('vocab', nextLang);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const pageFooterLinks = [
		{ label: `📖 ${tCommon('navigation.rules')}`, href: `/anagram/${language}/rules` },
		{ label: `⚙️ ${tCommon('settings.title')}`, href: `/anagram/${language}/settings` },
		{ label: `📊 ${tCommon('stats.title')}`, href: `/anagram/${language}/stats` },
		{ label: `🏅 ${tCommon('navigation.medals')}`, href: `/anagram/${language}/medals` },
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
								href={`/anagram/${language}/game?difficulty=${diff}&mode=${selectedMode}&vocab=${vocabLanguage}&new=true`}
								onClick={() => {
									setSelectedDifficulty(diff);
									void saveLastConfig({ vocab: vocabLanguage, mode: selectedMode, difficulty: diff });
								}}
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
