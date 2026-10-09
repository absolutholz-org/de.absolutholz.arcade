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
			{logo ? <div className="hero-visual">{logo}</div> : null}
			<div className="hero-body">
				<HeadingTag className="hero-title">{title}</HeadingTag>
				{tagline ? <p className="hero-tagline">{tagline}</p> : null}
				{children ? <div className="hero-actions">{children}</div> : null}
			</div>
		</S.Hero>
	);
}
