import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import type { JSX } from 'react';
import * as S from './WaterSortHeader.styles.js';
import type { WaterSortHeaderProps } from './WaterSortHeader.types.js';

export function WaterSortHeader({
	difficulty,
	seed,
	elapsedSeconds,
	moves,
	completedTubes,
	totalColorTubes,
	isPaused,
	onTogglePause,
	onOpenSettings,
}: WaterSortHeaderProps): JSX.Element {
	const { t, language } = useI18n('watersort');

	return (
		<header className={S.headerContainer}>
			<div className={S.leftSection}>
				<Button
					variant="ghost"
					size="sm"
					as="a"
					href={`/watersort/${language}/?difficulty=${difficulty}`}
					aria-label={t('controls.backToLobby')}
				>
					<Icon name="chevron-left" size="sm" />
				</Button>
			</div>

			<div className={S.centerSection}>
				<div className={S.metaRow}>
					<span>{t(`difficulty.${difficulty}` as Parameters<typeof t>[0])}</span>
					<span>•</span>
					<span>#{seed}</span>
				</div>

				<Timer
					seconds={elapsedSeconds}
					isPaused={isPaused}
					size="sm"
					showIcon={true}
					aria-label={t('status.timer')}
				/>

				<div className={S.statusRow}>
					<span className={S.statusBadge}>{t('status.moves', { count: String(moves) })}</span>
					<span className={S.statusBadge}>
						{t('status.tubesCompleted', {
							current: String(completedTubes),
							total: String(totalColorTubes),
						})}
					</span>
				</div>
			</div>

			<Toolbar variant="ghost" size="sm" aria-label="Game actions">
				<Button
					variant="ghost"
					size="sm"
					onClick={onTogglePause}
					aria-label={isPaused ? t('controls.resume') : t('controls.pause')}
				>
					<Icon name={isPaused ? 'play' : 'pause'} size="sm" />
				</Button>
				<Button variant="ghost" size="sm" onClick={onOpenSettings} aria-label={t('settings.title')}>
					<Icon name="settings" size="sm" />
				</Button>
			</Toolbar>
		</header>
	);
}
