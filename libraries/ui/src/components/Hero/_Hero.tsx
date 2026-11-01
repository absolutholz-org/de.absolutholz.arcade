import type { ElementType } from 'react';
import { Text } from '../Text';
import * as S from './_Hero.styles';
import type { HeroProps } from './_Hero.types';

/**
 * Hero section component providing a high-impact intro block with
 * optional visual logo/graphic, title, and tagline.
 */
export function Hero<C extends ElementType = 'header'>({
	as,
	headingLevel = 'h1',
	logo,
	tagline,
	title,
}: HeroProps<C>) {
	const Component = as || 'header';
	const HeadingTag = headingLevel;

	return (
		<S.Hero as={Component}>
			{logo ? <S.Hero_Visual>{logo}</S.Hero_Visual> : null}
			<S.Hero_Body>
				<Text as={HeadingTag} variant="display">
					{title}
				</Text>
				{tagline ? (
					<S.Hero_Tagline as="p" variant="h3">
						{tagline}
					</S.Hero_Tagline>
				) : null}
			</S.Hero_Body>
		</S.Hero>
	);
}
