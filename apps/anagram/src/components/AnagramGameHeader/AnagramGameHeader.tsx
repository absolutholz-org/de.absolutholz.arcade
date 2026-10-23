import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import type { JSX } from 'react';
import * as S from './AnagramGameHeader.styles.js';
import type { AnagramGameHeaderProps } from './AnagramGameHeader.types.js';

function formatClock(totalSeconds: number): string {
	const safe = Math.max(0, Math.floor(totalSeconds));
	const minutes = Math.floor(safe / 60);
	const seconds = safe % 60;
	return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function AnagramGameHeader({
	difficulty,
	mode,
	score,
	foundCount,
	totalCount,
	displaySeconds,
	isPaused,
	isEnded,
	onTogglePause,
	onNewRound,
}: AnagramGameHeaderProps): JSX.Element {
	const { t, language } = useI18n('anagram');

	return (
		<S.HeaderContainer>
			<S.LeftSection>
				<a
					href={`/anagram/${language}/?difficulty=${difficulty}&mode=${mode}`}
					aria-label={t('navigation.lobby')}
				>
					<Icon name="chevron-left" size="sm" />
				</a>
			</S.LeftSection>

			<S.CenterSection>
				<S.MetaRow>
					<span>{t(`difficulty.${difficulty}`)}</span>
					<span>•</span>
					<span>{t(`mode.${mode}`)}</span>
				</S.MetaRow>

				<Timer
					seconds={displaySeconds}
					isPaused={isPaused}
					size="sm"
					showIcon={true}
					aria-label={t('hud.timeLeft', { time: formatClock(displaySeconds) })}
				/>

				<S.StatusRow>
					<S.StatusBadge>
						{t('hud.wordsFound', { found: String(foundCount), total: String(totalCount) })}
					</S.StatusBadge>
					<S.StatusBadge data-variant="accent">{t('hud.score', { score: String(score) })}</S.StatusBadge>
				</S.StatusRow>
			</S.CenterSection>

			<Toolbar aria-label={t('controls.pause')}>
				<S.HeaderButton
					type="button"
					disabled={isEnded}
					onClick={onTogglePause}
					aria-label={isPaused ? t('controls.resume') : t('controls.pause')}
					title={isPaused ? t('controls.resume') : t('controls.pause')}
				>
					<Icon name={isPaused ? 'play' : 'pause'} size="sm" />
				</S.HeaderButton>

				<S.HeaderButton
					type="button"
					onClick={onNewRound}
					aria-label={t('controls.newRound')}
					title={t('controls.newRound')}
				>
					<Icon name="rotate-ccw" size="sm" />
				</S.HeaderButton>
			</Toolbar>
		</S.HeaderContainer>
	);
}
