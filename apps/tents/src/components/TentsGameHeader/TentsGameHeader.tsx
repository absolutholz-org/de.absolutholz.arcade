import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import type { JSX } from 'react';
import * as S from './TentsGameHeader.styles.js';
import type { TentsGameHeaderProps } from './TentsGameHeader.types.js';

export function TentsGameHeader({
	difficulty,
	puzzleId,
	placedTents,
	totalTrees,
	satisfiedLines,
	totalLines,
	elapsedSeconds,
	mistakesCount,
	isPaused,
	onTogglePause,
	onOpenSettings,
}: TentsGameHeaderProps): JSX.Element {
	const { t, language } = useI18n('tents');

	const difficultyLabel = t(`difficulty.${difficulty}`);
	const puzzleNumber = puzzleId.split('-')[1] || '1';

	return (
		<S.HeaderContainer>
			<S.LeftSection>
				<a href={`/tents/${language}/?difficulty=${difficulty}`} aria-label={t('controls.backToLobby')}>
					<Icon name="chevron-left" size="sm" />
				</a>
			</S.LeftSection>

			<S.CenterSection>
				<S.MetaRow>
					<span>{difficultyLabel}</span>
					<span>•</span>
					<span>{t('levels.puzzleNum', { number: puzzleNumber })}</span>
				</S.MetaRow>

				<Timer
					seconds={elapsedSeconds}
					isPaused={isPaused}
					size="sm"
					showIcon={true}
					aria-label={t('status.timer')}
				/>

				<S.StatusRow>
					<S.StatusBadge data-variant="tents">
						{t('status.tentsRemaining', {
							current: String(placedTents),
							total: String(totalTrees),
						})}
					</S.StatusBadge>

					<S.StatusBadge data-variant="lines">
						{t('status.linesSatisfied', {
							current: String(satisfiedLines),
							total: String(totalLines),
						})}
					</S.StatusBadge>

					{mistakesCount > 0 && (
						<S.StatusBadge data-variant="mistakes" data-has-mistakes="true">
							{t('status.moves')}: {mistakesCount}
						</S.StatusBadge>
					)}
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
