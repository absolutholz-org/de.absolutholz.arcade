import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Timer } from '@arcade/lib-ui/components/Timer';
import type { JSX } from 'react';
import type { BoardSizeId, DifficultyId } from '../../engine/types';
import { FlagIcon, MineIcon, ZoomInIcon, ZoomOutIcon } from '../MinesweeperIcons';
import * as S from './MinesweeperGameHeader.styles';

export interface MinesweeperGameHeaderProps {
	size: BoardSizeId;
	difficulty: DifficultyId;
	minesLeft: number;
	elapsedSeconds: number;
	isPaused: boolean;
	interactionMode: 'reveal' | 'flag';
	fitToScreen: boolean;
	onTogglePause: () => void;
	onRestart: () => void;
	onOpenSettings: () => void;
	onToggleInteractionMode: () => void;
	onToggleFitToScreen: () => void;
}

export function MinesweeperGameHeader({
	size,
	difficulty,
	minesLeft,
	elapsedSeconds,
	isPaused,
	interactionMode,
	fitToScreen,
	onTogglePause,
	onRestart,
	onOpenSettings,
	onToggleInteractionMode,
	onToggleFitToScreen,
}: MinesweeperGameHeaderProps): JSX.Element {
	const { t, language } = useI18n('minesweeper');

	return (
		<header className={S.headerRoot}>
			<div className={S.leftSection}>
				<Button
					as="a"
					href={`/minesweeper/${language}/`}
					variant="ghost"
					size="sm"
					aria-label={t('controls.backToLobby')}
				>
					<Icon name="chevron-left" size="sm" />
				</Button>

				<div className={S.badge} aria-label={`${t('status.minesLeft')}: ${minesLeft}`}>
					<MineIcon />
					<span>{minesLeft}</span>
				</div>

				<Button
					variant={interactionMode === 'flag' ? 'secondary' : 'ghost'}
					size="sm"
					onClick={onToggleInteractionMode}
					aria-label={interactionMode === 'flag' ? t('controls.modeFlag') : t('controls.modeReveal')}
				>
					<FlagIcon />
				</Button>
			</div>

			<div className={S.centerSection}>
				<Timer seconds={elapsedSeconds} size="sm" showIcon={true} />
			</div>

			<div className={S.rightSection}>
				<Button
					variant="ghost"
					size="sm"
					onClick={onTogglePause}
					aria-label={isPaused ? t('controls.resume') : t('controls.pause')}
				>
					<Icon name={isPaused ? 'play' : 'pause'} size="sm" />
				</Button>

				<Button
					variant={fitToScreen ? 'ghost' : 'secondary'}
					size="sm"
					onClick={onToggleFitToScreen}
					aria-label={fitToScreen ? t('controls.zoomBoard') : t('controls.fitBoard')}
				>
					{fitToScreen ? <ZoomInIcon /> : <ZoomOutIcon />}
				</Button>

				<Button variant="ghost" size="sm" onClick={onRestart} aria-label={t('controls.restart')}>
					<Icon name="rotate-ccw" size="sm" />
				</Button>

				<Button variant="ghost" size="sm" onClick={onOpenSettings} aria-label={t('settings.title')}>
					<Icon name="settings" size="sm" />
				</Button>
			</div>
		</header>
	);
}
