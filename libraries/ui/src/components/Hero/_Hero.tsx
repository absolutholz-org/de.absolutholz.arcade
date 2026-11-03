import type { ElementType } from 'react';
import { Badge } from '../Badge';
import { Text } from '../Text';
import * as S from './_Hero.styles';
import type { HeroProps } from './_Hero.types';

/**
 * Hero section component providing a high-impact intro block with
 * optional visual logo/graphic, category eyebrow, title, tagline, and metadata tag pills.
 */
export function Hero<C extends ElementType = 'header'>({
	as,
	eyebrow,
	headingLevel = 'h1',
	logo,
	tagline,
	tags,
	tagsAriaLabel,
	title,
}: HeroProps<C>) {
	const Component = as || 'header';
	const HeadingTag = headingLevel;

	return (
		<S.Hero as={Component}>
			{logo ? <S.Hero_Visual>{logo}</S.Hero_Visual> : null}
			<S.Hero_Body>
				{eyebrow ? (
					<S.Hero_Eyebrow as="p" variant="small">
						{eyebrow}
					</S.Hero_Eyebrow>
				) : null}
				<Text as={HeadingTag} variant="display">
					{title}
				</Text>
				{tagline ? (
					<S.Hero_Tagline as="p" variant="h3">
						{tagline}
					</S.Hero_Tagline>
				) : null}
				{tags && tags.length > 0 ? (
					// biome-ignore lint/a11y/useSemanticElements: VoiceOver requires explicit role="list" on ul with list-style: none
					<S.Hero_TagsList role="list" aria-label={tagsAriaLabel}>
						{tags.map((tag) => (
							<S.Hero_TagItem key={tag}>
								<Badge variant="neutral" size="sm">
									{tag}
								</Badge>
							</S.Hero_TagItem>
						))}
					</S.Hero_TagsList>
				) : null}
			</S.Hero_Body>
		</S.Hero>
	);
}
