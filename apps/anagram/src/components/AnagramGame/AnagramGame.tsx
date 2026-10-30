import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { Dialog, GameHeader, GameLayout, GameSettingsPanel, PauseDialog } from '@arcade/lib-ui';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { type JSX, useCallback, useMemo, useState } from 'react';
import { ANAGRAM_SETTINGS_CONFIG } from '../../config/settings.js';
import {
	DIFFICULTY_CONFIGS,
	type DifficultyLevel,
	type GameMode,
	type LanguageCode,
	SUPPORTED_VOCAB_LANGUAGES,
} from '../../engine/types.js';
import { AnagramControls } from '../AnagramControls/index.js';
import { AnagramRack } from '../AnagramRack/index.js';
import { AnagramSlots } from '../AnagramSlots/index.js';
import { DefeatDialog } from '../DefeatDialog/index.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { useAnagramGame } from './AnagramGame.hooks.js';
import * as S from './AnagramGame.styles.js';
import type { AnagramGameProps } from './AnagramGame.types.js';

function resolveSearchParams(
	fallbackDifficulty: DifficultyLevel,
	fallbackMode: GameMode,
	routeLanguage: SupportedLanguageCode,
): { difficulty: DifficultyLevel; mode: GameMode; vocabLanguage: LanguageCode } {
	const defaultVocab: LanguageCode =
		routeLanguage === 'de' ? 'de' : routeLanguage === 'fr' ? 'fr' : routeLanguage === 'pt' ? 'pt' : 'en';
	if (typeof window === 'undefined') {
		return { difficulty: fallbackDifficulty, mode: fallbackMode, vocabLanguage: defaultVocab };
	}
	const params = new URLSearchParams(window.location.search);
	const rawDifficulty = params.get('difficulty');
	const rawMode = params.get('mode');
	const rawVocab = params.get('vocab');
	const difficulty: DifficultyLevel =
		rawDifficulty && rawDifficulty in DIFFICULTY_CONFIGS ? (rawDifficulty as DifficultyLevel) : fallbackDifficulty;
	const mode: GameMode = rawMode === 'timed' || rawMode === 'zen' ? rawMode : fallbackMode;
	const vocabLanguage: LanguageCode =
		rawVocab && (SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(rawVocab)
			? (rawVocab as LanguageCode)
			: defaultVocab;
	return { difficulty, mode, vocabLanguage };
}

function formatClock(totalSeconds: number): string {
	const safe = Math.max(0, Math.floor(totalSeconds));
	const minutes = Math.floor(safe / 60);
	const seconds = safe % 60;
	return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function AnagramGame({
	initialDifficulty = 'easy',
	initialMode = 'zen',
	lang,
	rulesContent,
}: AnagramGameProps): JSX.Element {
	const [activeLang] = useState<SupportedLanguageCode>(() => {
		if (lang && isSupportedLanguage(lang)) return lang;
		if (typeof window !== 'undefined') {
			const match = window.location.pathname.match(/\/anagram\/([a-z]{2})(\/|$)/);
			if (match && isSupportedLanguage(match[1])) {
				return match[1] as SupportedLanguageCode;
			}
		}
		return DEFAULT_LANGUAGE;
	});

	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isRulesOpen, setIsRulesOpen] = useState(false);

	const { difficulty, mode, vocabLanguage } = useMemo(
		() => resolveSearchParams(initialDifficulty, initialMode, activeLang),
		[initialDifficulty, initialMode, activeLang],
	);

	const { t } = useI18n('anagram');
	const { t: tCommon } = useI18n('common');
	const game = useAnagramGame(difficulty, mode, vocabLanguage);

	const openSettings = useCallback(() => {
		if (!game.isPaused && !game.isEnded) {
			game.togglePause();
		}
		setIsSettingsOpen(true);
	}, [game]);

	const closeSettings = useCallback(() => {
		setIsSettingsOpen(false);
		if (game.isPaused && !game.isEnded) {
			game.togglePause();
		}
	}, [game]);

	const openRules = useCallback(() => {
		if (!game.isPaused && !game.isEnded) {
			game.togglePause();
		}
		setIsRulesOpen(true);
	}, [game]);

	const closeRules = useCallback(() => {
		setIsRulesOpen(false);
		if (game.isPaused && !game.isEnded) {
			game.togglePause();
		}
	}, [game]);

	const feedbackMessage = useMemo(() => {
		if (!game.feedback) return '';
		const wordUpper = game.feedback.word.toLocaleUpperCase();
		switch (game.feedback.kind) {
			case 'accepted':
				return game.feedback.clearedBaseline
					? t('feedback.baselineCleared')
					: t('feedback.accepted', { word: wordUpper, points: String(game.feedback.points ?? 0) });
			case 'duplicate':
				return t('feedback.duplicate', { word: wordUpper });
			case 'tooShort':
				return t('feedback.tooShort', { min: String(game.minWordLength) });
			case 'notInRack':
				return t('feedback.notInRack');
			case 'notAWord':
				return t('feedback.notAWord', { word: wordUpper });
		}
	}, [game.feedback, game.minWordLength, t]);

	const displaySeconds = mode === 'timed' ? game.remainingSeconds : game.elapsedSeconds;
	const difficultyLabel = `${t(`vocabulary.${game.vocabLanguage}`)} • ${t(`difficulty.${difficulty}`)} • ${t(`mode.${mode}`)}`;

	return (
		<I18nProvider language={activeLang}>
			<GameLayout
				header={
					<GameHeader
						backHref={`/anagram/${activeLang}/?difficulty=${difficulty}&mode=${mode}&vocab=${vocabLanguage}`}
						backLabel={t('navigation.lobby')}
						difficulty={difficultyLabel}
						onOpenRules={openRules}
						rulesLabel={tCommon('navigation.rules')}
						onOpenSettings={openSettings}
						settingsLabel={tCommon('settings.title')}
					/>
				}
				status={
					<div className={S.statusBar}>
						<span
							className={S.statusMetric}
							aria-label={t('hud.wordsFound', {
								found: String(game.foundWords.length),
								total: String(game.round.words.length),
							})}
						>
							<span>
								{t('hud.wordsFound', {
									found: String(game.foundWords.length),
									total: String(game.round.words.length),
								})}
							</span>
						</span>
						<Timer
							variant="inline"
							seconds={displaySeconds}
							isPaused={game.isPaused}
							onTogglePause={game.togglePause}
							size="sm"
							showIcon={true}
							aria-label={t('hud.timeLeft', { time: formatClock(displaySeconds) })}
						/>
						<span className={S.statusMetric} aria-label={t('hud.score', { score: String(game.score) })}>
							<span>{t('hud.score', { score: String(game.score) })}</span>
						</span>
					</div>
				}
				toolbar={
					<AnagramControls
						canSubmit={game.stagedIds.length > 0}
						isDisabled={!game.isInteractive}
						isEnded={game.isEnded}
						hasClearedBaseline={game.hasClearedBaseline}
						showReveal={mode === 'zen'}
						onShuffle={game.shuffle}
						onClear={game.clearStaged}
						onSubmit={game.submit}
						onReveal={game.reveal}
						onNewRound={game.newRound}
					/>
				}
			>
				<div className={S.boardArea}>
					<AnagramSlots
						words={game.round.words}
						foundWords={game.foundWords}
						isRevealed={game.isRevealed || game.outcome === 'timeUp'}
						onSelectWord={game.selectWord}
						isDisabled={!game.isInteractive}
					/>

					<AnagramRack
						tiles={game.tiles}
						stagedIds={game.stagedIds}
						isDisabled={!game.isInteractive}
						feedbackMessage={feedbackMessage}
						feedbackKind={game.feedback?.kind ?? 'idle'}
						onStageTile={game.stageTile}
						onRecallTile={game.recallTile}
					/>
				</div>

				<PauseDialog
					isOpen={game.isPaused && !game.isEnded && !isSettingsOpen && !isRulesOpen}
					onResume={game.togglePause}
					onRestart={game.newRound}
				/>

				{/* In-game Rules Modal */}
				<Dialog
					isOpen={isRulesOpen}
					onCancel={closeRules}
					title={tCommon('navigation.rules')}
					showCloseButton={true}
				>
					{rulesContent}
				</Dialog>

				{/* In-game Settings Modal (compact mode) */}
				<Dialog
					isOpen={isSettingsOpen}
					onCancel={closeSettings}
					title={tCommon('settings.title')}
					showCloseButton={true}
				>
					<GameSettingsPanel config={ANAGRAM_SETTINGS_CONFIG} lang={activeLang} mode="compact" />
				</Dialog>

				<VictoryDialog
					isOpen={game.dialog === 'victory'}
					isMastered={game.isMastered}
					foundCount={game.foundWords.length}
					totalCount={game.round.words.length}
					score={game.score}
					elapsedSeconds={game.elapsedSeconds}
					difficulty={difficulty}
					mode={mode}
					onPlayAgain={game.newRound}
					onClose={game.closeDialog}
				/>

				<DefeatDialog
					isOpen={game.dialog === 'defeat'}
					foundCount={game.foundWords.length}
					totalCount={game.round.words.length}
					onPlayAgain={game.newRound}
					onClose={game.closeDialog}
				/>
			</GameLayout>
		</I18nProvider>
	);
}
