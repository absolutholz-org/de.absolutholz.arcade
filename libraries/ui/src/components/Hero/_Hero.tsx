import type { ElementType } from 'react';
import * as S from './_Hero.styles';
import type { HeroProps } from './_Hero.types';

/**
 * Hero section component providing a high-impact intro block with
 * optional visual logo/graphic, title, tagline, and action items.
 */
export function Hero<C extends ElementType = 'header'>({
	align = 'left',
	as,
	children,
	headingLevel = 'h1',
	logo,
	tagline,
	title,
}: HeroProps<C>) {
	const Component = as || 'header';
	const HeadingTag = headingLevel;

	return (
		<S.Hero as={Component} data-align={align}>
			{logo ? <S.Hero_Visual>{logo}</S.Hero_Visual> : null}
			<S.Hero_Body>
				<S.Hero_Title as={HeadingTag}>{title}</S.Hero_Title>
				{tagline ? <S.Hero_Tagline>{tagline}</S.Hero_Tagline> : null}
				{children ? <S.Hero_Actions>{children}</S.Hero_Actions> : null}
			</S.Hero_Body>
		</S.Hero>
	);
}
