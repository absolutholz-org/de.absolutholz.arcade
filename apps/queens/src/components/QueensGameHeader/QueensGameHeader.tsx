import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import type { JSX } from 'react';
import * as S from './QueensGameHeader.styles.js';
import type { QueensGameHeaderProps } from './QueensGameHeader.types.js';

export function QueensGameHeader({
	difficulty,
	puzzleId,
	tokenCount,
	totalTokens,
	elapsedSeconds,
	isPaused,
	onTogglePause,
	onOpenSettings,
}: QueensGameHeaderProps): JSX.Element {
	const { t, language } = useI18n('queens');

	const difficultyLabel = t(`difficulty.${difficulty}`);

	// Parse puzzle number from id (e.g., 'easy-1' -> 1)
	const puzzleNumber = puzzleId.split('-')[1] || '1';

	return (
		<S.HeaderContainer>
			<S.LeftSection>
				<a href={`/queens/${language}/`} aria-label={t('controls.backToLobby')}>
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
				<S.TokenCounter>{t('status.tokensPlaced', { current: tokenCount, total: totalTokens })}</S.TokenCounter>
			</S.CenterSection>

			<Toolbar variant="ghost" size="sm" aria-label={t('aria.headerToolbar')}>
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
