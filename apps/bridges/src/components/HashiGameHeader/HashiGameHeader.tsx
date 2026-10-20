import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import type { JSX } from 'react';
import * as S from './HashiGameHeader.styles.js';
import type { HashiGameHeaderProps } from './HashiGameHeader.types.js';

export function HashiGameHeader({
	difficulty,
	puzzleId,
	satisfiedCount,
	totalIslands,
	elapsedSeconds,
	isPaused,
	gameMode,
	onTogglePause,
	onOpenSettings,
	onBackToLobby,
}: HashiGameHeaderProps): JSX.Element {
	const { t, language } = useI18n('bridges');

	const difficultyLabel = t(`difficulty.${difficulty}`);
	const puzzleNumber = puzzleId?.includes('-') ? puzzleId.split('-')[1] : '1';

	return (
		<S.HeaderContainer>
			<S.LeftSection>
				<a
					href={`/bridges/${language}/?difficulty=${difficulty}`}
					aria-label={t('controls.backToLobby')}
					onClick={onBackToLobby}
				>
					← {t('controls.backToLobby')}
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

				<S.IslandProgress>
					{t('status.satisfiedIslands')}: {satisfiedCount} / {totalIslands}
				</S.IslandProgress>
			</S.CenterSection>

			<Toolbar variant="ghost" size="sm" aria-label="Game controls">
				{gameMode === 'standard' && (
					<S.HeaderButton
						type="button"
						onClick={onTogglePause}
						aria-label={isPaused ? t('controls.resume') : t('controls.pause')}
					>
						{isPaused ? t('controls.resume') : t('controls.pause')}
					</S.HeaderButton>
				)}

				<S.HeaderButton type="button" onClick={onOpenSettings} aria-label={t('settings.title')}>
					{t('settings.title')}
				</S.HeaderButton>
			</Toolbar>
		</S.HeaderContainer>
	);
}
