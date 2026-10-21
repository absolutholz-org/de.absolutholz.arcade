import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import type { BoardLayoutId, GameVariant } from '../../engine/types.js';
import * as S from './SoloNobleGameHeader.styles.js';

export interface SoloNobleGameHeaderProps {
	layoutId: BoardLayoutId;
	variant: GameVariant;
	elapsedSeconds: number;
	isPaused: boolean;
	onTogglePause: () => void;
	onReset: () => void;
}

export function SoloNobleGameHeader({
	layoutId,
	variant,
	elapsedSeconds,
	isPaused,
	onTogglePause,
	onReset,
}: SoloNobleGameHeaderProps) {
	const { t, language } = useI18n('solo-noble');

	const layoutName = t(`layouts.${layoutId}`);
	const variantName = t(
		variant === 'classic-central'
			? 'variants.classicCentral'
			: variant === 'clear-out'
				? 'variants.clearOut'
				: 'variants.customStart',
	);

	return (
		<S.HeaderContainer>
			<S.LeftSection>
				<a
					href={`/solo-noble/${language}/`}
					data-astro-prefetch
					aria-label={t('controls.backToLobby', { defaultValue: 'Back to Lobby' })}
				>
					<Icon name="chevron-left" size="sm" />
				</a>
			</S.LeftSection>

			<S.CenterSection>
				<S.ModeTitle>
					{layoutName} • {variantName}
				</S.ModeTitle>
				<Timer seconds={elapsedSeconds} isPaused={isPaused} size="sm" showIcon={true} />
			</S.CenterSection>

			<Toolbar variant="ghost" size="sm" aria-label="Game actions">
				<S.HeaderButton type="button" onClick={onTogglePause} aria-label={isPaused ? 'Resume' : 'Pause'}>
					<Icon name={isPaused ? 'play' : 'pause'} size="sm" />
				</S.HeaderButton>
				<S.HeaderButton type="button" onClick={onReset} aria-label="Reset">
					<Icon name="refresh-cw" size="sm" />
				</S.HeaderButton>
			</Toolbar>
		</S.HeaderContainer>
	);
}
