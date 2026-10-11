import type { JSX } from 'react';
import { useGameContainer } from './_GameContainer.hooks';
import * as S from './_GameContainer.styles';
import type { GameContainerProps } from './_GameContainer.types';

/**
 * Standardized full-viewport game screen container that pins a persistent
 * navigation header at the top and manages a full-bleed play area and overlay layer below.
 */
export function GameContainer({
	header,
	children,
	overlay,
	dialogs,
	id,
	className,
	...restProps
}: GameContainerProps): JSX.Element {
	const { resolvedId } = useGameContainer({ id });

	return (
		<S.GameContainerRoot id={resolvedId} className={className} {...restProps}>
			{header && <S.HeaderZone>{header}</S.HeaderZone>}
			<S.PlayArea>
				{children}
				{overlay}
			</S.PlayArea>
			{dialogs}
		</S.GameContainerRoot>
	);
}
