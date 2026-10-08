import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Timer } from '@arcade/lib-ui/components/Timer';
import * as S from './SudokuGameHeader.styles';
import type { SudokuGameHeaderProps } from './SudokuGameHeader.types';

export function SudokuGameHeader({
	difficulty,
	elapsedSeconds,
	isPaused,
	onTogglePause,
	onOpenSettings,
}: SudokuGameHeaderProps) {
	const { t, language } = useI18n('sudoku');

	const difficultyLabel = t(`difficulty.${difficulty}`);

	return (
		<S.HeaderContainer>
			<S.LeftSection>
				<a href={`/sudoku/${language}/`} aria-label={t('controls.backToLobby')}>
					<Icon name="chevron-left" size="sm" />
				</a>
			</S.LeftSection>

			<S.CenterSection>
				<S.DifficultyText>{difficultyLabel}</S.DifficultyText>
				<Timer
					seconds={elapsedSeconds}
					isPaused={isPaused}
					size="sm"
					showIcon={true}
					aria-label={t('status.timer')}
				/>
			</S.CenterSection>

			<S.RightSection>
				<button
					type="button"
					onClick={onTogglePause}
					aria-label={isPaused ? t('controls.resume') : t('controls.pause')}
				>
					<Icon name={isPaused ? 'play' : 'pause'} size="sm" />
				</button>

				<button type="button" onClick={onOpenSettings} aria-label={t('settings.title')}>
					<Icon name="settings" size="sm" />
				</button>
			</S.RightSection>
		</S.HeaderContainer>
	);
}
