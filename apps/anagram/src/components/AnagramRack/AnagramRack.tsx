import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import type { JSX } from 'react';
import * as S from './AnagramRack.styles.js';
import type { AnagramRackProps } from './AnagramRack.types.js';

export function AnagramRack({
	tiles,
	stagedIds,
	isDisabled,
	feedbackMessage,
	feedbackKind,
	onStageTile,
	onRecallTile,
}: AnagramRackProps): JSX.Element {
	const { t } = useI18n('anagram');
	const stagedTiles = stagedIds.flatMap((id) => tiles.find((tile) => tile.id === id) ?? []);

	return (
		<S.PlayArea>
			<S.StagedTray aria-label={t('hud.stagedLabel')}>
				{stagedTiles.map((tile) => (
					<Button
						key={tile.id}
						variant="primary"
						size="lg"
						disabled={isDisabled}
						aria-label={t('aria.stagedTile', { letter: tile.letter.toLocaleUpperCase() })}
						onClick={() => onRecallTile(tile.id)}
					>
						{tile.letter.toLocaleUpperCase()}
					</Button>
				))}
			</S.StagedTray>

			<S.FeedbackBanner aria-live="polite" aria-atomic="true" data-kind={feedbackKind}>
				{feedbackMessage}
			</S.FeedbackBanner>

			<S.RackRow aria-label={t('hud.rackLabel')}>
				{tiles.map((tile) => (
					<Button
						key={tile.id}
						variant="secondary"
						size="lg"
						disabled={isDisabled || stagedIds.includes(tile.id)}
						aria-label={t('aria.rackTile', { letter: tile.letter.toLocaleUpperCase() })}
						onClick={() => onStageTile(tile.id)}
					>
						{tile.letter.toLocaleUpperCase()}
					</Button>
				))}
			</S.RackRow>
		</S.PlayArea>
	);
}
