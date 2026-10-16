import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import type { JSX } from 'react';
import * as S from './TracksGameHeader.styles.js';
import type { TracksGameHeaderProps } from './TracksGameHeader.types.js';

export function TracksGameHeader({
	difficulty,
	puzzleId,
	satisfiedLines,
	totalLines,
	elapsedSeconds,
	mistakes,
	maxMistakes,
	isPaused,
	gameMode,
	onTogglePause,
	onOpenSettings,
}: TracksGameHeaderProps): JSX.Element {
	const { t, language } = useI18n('tracks');

	const difficultyLabel = t(`difficulty.${difficulty}`);
	const puzzleNumber = puzzleId.split('-')[1] || '1';
	const remainingHearts = Math.max(0, maxMistakes - mistakes);

	return (
		<S.HeaderContainer>
			<S.LeftSection>
				<a href={`/tracks/${language}/?difficulty=${difficulty}`} aria-label={t('controls.backToLobby')}>
					<Icon name="chevron-left" size="sm" />
				</a>
			</S.LeftSection>

			<S.CenterSection>
				<S.MetaRow>
					<span>{difficultyLabel}</span>
					<span>•</span>
					<span>{t('levels.puzzleNum', { number: puzzleNumber })}</span>
				</S.MetaRow>

				{gameMode === 'standard' && (
					<Timer
						seconds={elapsedSeconds}
						isPaused={isPaused}
						size="sm"
						showIcon={true}
						aria-label={t('status.timer')}
					/>
				)}

				<S.StatusRow>
					{gameMode === 'standard' ? (
						<S.StatusBadge data-variant="hearts" data-danger={remainingHearts <= 1 ? 'true' : 'false'}>
							{t('status.hearts', {
								current: String(remainingHearts),
								max: String(maxMistakes),
							})}
						</S.StatusBadge>
					) : (
						<S.StatusBadge data-variant="casual">{t('status.casualMode')}</S.StatusBadge>
					)}

					<S.StatusBadge data-variant="lines">
						{t('status.linesSatisfied', {
							current: String(satisfiedLines),
							total: String(totalLines),
						})}
					</S.StatusBadge>
				</S.StatusRow>
			</S.CenterSection>

			<Toolbar variant="ghost" size="sm" aria-label={t('settings.title')}>
				<S.HeaderButton
					type="button"
					onClick={onTogglePause}
					aria-label={isPaused ? t('controls.resume') : t('controls.pause')}
				>
					<Icon name={isPaused ? 'play' : 'pause'} size="sm" />
				</S.HeaderButton>

				<S.HeaderButton type="button" onClick={onOpenSettings} aria-label={t('settings.title')}>
					<Icon name="settings" size="sm" />
				</S.HeaderButton>
			</Toolbar>
		</S.HeaderContainer>
	);
}
