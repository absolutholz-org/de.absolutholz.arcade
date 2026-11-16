import { type ElementType, type ForwardedRef, Fragment, forwardRef } from 'react';
import { ClickableCard } from '../ClickableCard';
import type { ClickableCardProps } from '../ClickableCard/_ClickableCard.types';
import * as S from './_GameSelectionCard.styles';
import type { GameSelectionCardProps } from './_GameSelectionCard.types';

function GameSelectionCardInner<C extends ElementType = 'button'>(
	{ title, metadata, children, className, ...cardProps }: GameSelectionCardProps<C>,
	ref: ForwardedRef<HTMLElement>,
) {
	const metadataItems =
		metadata?.filter((item) => item !== null && item !== undefined && item !== false && item !== '') ?? [];

	return (
		<ClickableCard
			ref={ref}
			{...(cardProps as ClickableCardProps<C>)}
			className={className ? `${S.card} ${className}` : S.card}
		>
			<S.Title>{title}</S.Title>
			{children && <S.Content>{children}</S.Content>}
			{metadataItems.length > 0 && (
				<S.Metadata>
					{metadataItems.map((item, index) => (
						<Fragment key={typeof item === 'string' || typeof item === 'number' ? item : `meta-${index}`}>
							{index > 0 && <S.MetadataSeparator aria-hidden="true">•</S.MetadataSeparator>}
							<span>{item}</span>
						</Fragment>
					))}
				</S.Metadata>
			)}
		</ClickableCard>
	);
}

/**
 * Standard direct-launch card for deterministic levels and puzzle presets.
 * Entire card surface is interactive, inheriting hover elevation and focus rings from ClickableCard.
 */
export const GameSelectionCard = forwardRef(GameSelectionCardInner as never) as unknown as <
	C extends ElementType = 'button',
>(
	props: GameSelectionCardProps<C> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof GameSelectionCardInner>;
