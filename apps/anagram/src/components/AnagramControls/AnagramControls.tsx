import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Icon } from '@arcade/lib-ui/components/Icon';
import type { JSX } from 'react';
import * as S from './AnagramControls.styles.js';
import type { AnagramControlsProps } from './AnagramControls.types.js';

export function AnagramControls({
	canSubmit,
	isDisabled,
	isEnded,
	hasClearedBaseline,
	showReveal,
	onShuffle,
	onClear,
	onSubmit,
	onReveal,
	onNewRound,
}: AnagramControlsProps): JSX.Element {
	const { t } = useI18n('anagram');

	return (
		<S.ControlsContainer>
			<S.MainBar>
				<S.ButtonGroup>
					<Button variant="primary" size="sm" disabled={isDisabled || !canSubmit} onClick={onSubmit}>
						{t('controls.submit')}
					</Button>
					<Button variant="secondary" size="sm" disabled={isDisabled} onClick={onShuffle}>
						{t('controls.shuffle')}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						disabled={isDisabled || !canSubmit}
						leadingIcon={<Icon name="undo" size="xs" />}
						onClick={onClear}
					>
						{t('controls.clear')}
					</Button>
				</S.ButtonGroup>

				<S.ButtonGroup>
					{showReveal && !isEnded && (
						<Button variant="outline" size="sm" disabled={isDisabled} onClick={onReveal}>
							{t('controls.reveal')}
						</Button>
					)}
					<Button
						variant={hasClearedBaseline ? 'secondary' : 'ghost'}
						size="sm"
						leadingIcon={<Icon name="rotate-ccw" size="xs" />}
						onClick={onNewRound}
					>
						{t('controls.newRound')}
					</Button>
				</S.ButtonGroup>
			</S.MainBar>
		</S.ControlsContainer>
	);
}
