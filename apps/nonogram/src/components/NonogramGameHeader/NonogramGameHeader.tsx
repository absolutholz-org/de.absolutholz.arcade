import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import { Timer } from '@arcade/lib-ui/components/Timer';
import { Toolbar } from '@arcade/lib-ui/components/Toolbar';
import type { JSX } from 'react';
import type { NonogramPuzzle } from '../../engine/types';
import { PuzzleIcon } from '../NonogramIcons';
import * as S from './NonogramGameHeader.styles';

export interface NonogramGameHeaderProps {
	puzzle: NonogramPuzzle;
	elapsedSeconds: number;
	moves: number;
	isPaused: boolean;
	onTogglePause: () => void;
	onOpenPuzzleSelect: () => void;
	onOpenSettings: () => void;
	onReset: () => void;
}

export function NonogramGameHeader({
	puzzle,
	elapsedSeconds,
	moves,
	isPaused,
	onTogglePause,
	onOpenPuzzleSelect,
	onOpenSettings,
	onReset,
}: NonogramGameHeaderProps): JSX.Element {
	const { t, language } = useI18n('nonogram');

	const title = t(puzzle.titleKey as TranslationKey);

	return (
		<S.HeaderRoot>
			{/* Left section: back to lobby and puzzle selector */}
			<Toolbar variant="ghost" size="sm" aria-label={t('aria.navigationControls')}>
				<Button
					as="a"
					href={`/nonogram/${language}/`}
					variant="ghost"
					size="sm"
					aria-label={t('controls.backToLobby')}
				>
					<Icon name="chevron-left" size="sm" />
				</Button>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onOpenPuzzleSelect}
					aria-label={t('controls.puzzleSelect')}
				>
					<PuzzleIcon />
				</Button>
			</Toolbar>

			{/* Center section: meta badge, timer, and moves */}
			<S.CenterSection>
				<S.MetaBadge>
					<span>{title}</span>
					<span>•</span>
					<span>{t(`difficulty.${puzzle.difficulty}` as TranslationKey)}</span>
				</S.MetaBadge>

				<Timer seconds={elapsedSeconds} isPaused={isPaused} size="sm" showIcon={true} />

				<S.MoveCounter aria-label={`${t('status.moves')}: ${moves}`}>
					{t('status.moves')}: {moves}
				</S.MoveCounter>
			</S.CenterSection>

			{/* Right section: pause, reset, settings */}
			<Toolbar variant="ghost" size="sm" aria-label={t('aria.gameControls')}>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onTogglePause}
					aria-label={isPaused ? t('controls.resume') : t('controls.pause')}
				>
					<Icon name={isPaused ? 'play' : 'pause'} size="sm" />
				</Button>

				<Button type="button" variant="ghost" size="sm" onClick={onReset} aria-label={t('controls.resetBoard')}>
					<Icon name="rotate-ccw" size="sm" />
				</Button>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onOpenSettings}
					aria-label={t('settings.title')}
				>
					<Icon name="settings" size="sm" />
				</Button>
			</Toolbar>
		</S.HeaderRoot>
	);
}
