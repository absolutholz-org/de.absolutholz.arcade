import type { JSX } from 'react';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { usePauseOverlay } from './_PauseOverlay.hooks';
import * as S from './_PauseOverlay.styles';
import type { PauseOverlayProps } from './_PauseOverlay.types';

export function PauseOverlay({
	isOpen,
	title,
	description,
	resumeLabel,
	restartLabel,
	onResume,
	onRestart,
	children,
	id,
	...restProps
}: PauseOverlayProps): JSX.Element | null {
	const { titleId, descriptionId, resumeButtonRef } = usePauseOverlay({
		isOpen,
		onResume,
		id,
	});

	if (!isOpen) {
		return null;
	}

	return (
		// biome-ignore lint/a11y/useSemanticElements: in-game modal overlay obscuring canvas
		<S.OverlayBackdrop
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			aria-describedby={description ? descriptionId : undefined}
			id={id}
			{...restProps}
		>
			<S.OverlayCard>
				<Stack direction="column" spacing="xl" align="center" fullWidth>
					<Stack direction="column" spacing="xs" align="center">
						<h2 id={titleId}>{title}</h2>
						{description && <p id={descriptionId}>{description}</p>}
					</Stack>

					<Stack direction="column" spacing="md" fullWidth>
						<Button ref={resumeButtonRef} onClick={onResume} variant="primary" size="md">
							{resumeLabel}
						</Button>
						<Button onClick={onRestart} variant="secondary" size="md">
							{restartLabel}
						</Button>
					</Stack>

					{children}
				</Stack>
			</S.OverlayCard>
		</S.OverlayBackdrop>
	);
}
