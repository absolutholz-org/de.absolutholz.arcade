import { DEFAULT_LANGUAGE } from '@arcade/lib-i18n/constants/languages';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { isSupportedLanguage } from '@arcade/lib-i18n/utils/detection';
import { GameContainer } from '@arcade/lib-ui/components/GameContainer';
import { type JSX, useMemo, useState } from 'react';
import {
	DIFFICULTY_CONFIGS,
	type DifficultyLevel,
	type GameMode,
	type LanguageCode,
	SUPPORTED_VOCAB_LANGUAGES,
} from '../../engine/types.js';
import { AnagramControls } from '../AnagramControls/index.js';
import { AnagramGameHeader } from '../AnagramGameHeader/index.js';
import { AnagramRack } from '../AnagramRack/index.js';
import { AnagramSlots } from '../AnagramSlots/index.js';
import { DefeatDialog } from '../DefeatDialog/index.js';
import { PauseOverlay } from '../PauseOverlay/index.js';
import { VictoryDialog } from '../VictoryDialog/index.js';
import { useAnagramGame } from './AnagramGame.hooks.js';
import * as S from './AnagramGame.styles.js';
import type { AnagramGameProps } from './AnagramGame.types.js';

function resolveSearchParams(
	fallbackDifficulty: DifficultyLevel,
	fallbackMode: GameMode,
	routeLanguage: SupportedLanguageCode,
): { difficulty: DifficultyLevel; mode: GameMode; vocabLanguage: LanguageCode } {
	const defaultVocab: LanguageCode = routeLanguage === 'de' ? 'de' : 'en';
	if (typeof window === 'undefined') {
		return { difficulty: fallbackDifficulty, mode: fallbackMode, vocabLanguage: defaultVocab };
	}
	const params = new URLSearchParams(window.location.search);
	const rawDifficulty = params.get('difficulty');
	const rawMode = params.get('mode');
	const rawVocab = params.get('vocab') ?? params.get('lang');
	const difficulty: DifficultyLevel =
		rawDifficulty && rawDifficulty in DIFFICULTY_CONFIGS ? (rawDifficulty as DifficultyLevel) : fallbackDifficulty;
	const mode: GameMode = rawMode === 'timed' || rawMode === 'zen' ? rawMode : fallbackMode;
	const vocabLanguage: LanguageCode =
		rawVocab && (SUPPORTED_VOCAB_LANGUAGES as readonly string[]).includes(rawVocab)
			? (rawVocab as LanguageCode)
			: defaultVocab;
	return { difficulty, mode, vocabLanguage };
}

export function AnagramGame({ initialDifficulty = 'easy', initialMode = 'zen', lang }: AnagramGameProps): JSX.Element {
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

	const { difficulty, mode, vocabLanguage } = useMemo(
		() => resolveSearchParams(initialDifficulty, initialMode, activeLang),
		[initialDifficulty, initialMode, activeLang],
	);

	const { t } = useI18n('anagram');
	const { t: tCommon } = useI18n('common');
	const game = useAnagramGame(difficulty, mode, vocabLanguage);

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

	return (
		<I18nProvider language={activeLang}>
			<GameContainer
				id="main-content"
				header={
					<AnagramGameHeader
						difficulty={difficulty}
						mode={mode}
						score={game.score}
						foundCount={game.foundWords.length}
						totalCount={game.round.words.length}
						displaySeconds={displaySeconds}
						isPaused={game.isPaused}
						isEnded={game.isEnded}
						onTogglePause={game.togglePause}
						onNewRound={game.newRound}
					/>
				}
				overlay={
					<PauseOverlay
						isOpen={game.isPaused && !game.isEnded}
						onResume={game.togglePause}
						onRestart={game.newRound}
					/>
				}
				dialogs={
					<>
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
					</>
				}
			>
				<S.PlayColumn>
					<AnagramSlots
						words={game.round.words}
						foundWords={game.foundWords}
						isRevealed={game.isRevealed || game.outcome === 'timeUp'}
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

					<S.GameFooter>
						<S.GameFooterLink href={`/anagram/${activeLang}/rules`}>
							📖 {t('navigation.rules')}
						</S.GameFooterLink>
						<S.GameFooterLink
							href={`/anagram/${activeLang}/medals`}
							aria-label={tCommon('navigation.medals')}
						>
							🏅 {tCommon('navigation.medals')}
						</S.GameFooterLink>
					</S.GameFooter>
				</S.PlayColumn>
			</GameContainer>
		</I18nProvider>
	);
}
