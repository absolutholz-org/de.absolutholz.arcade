import type { ElementType } from 'react';
import * as S from './_Logo.styles';
import type { LogoProps, LogoSize } from './_Logo.types';

const SIZE_COMPONENTS: Record<LogoSize, typeof S.Logo> = {
	sm: S.Small,
	md: S.Logo,
	lg: S.Large,
	xl: S.ExtraLarge,
};

/**
 * Logo component displaying the arcade controller vector mark
 * against an authentic wood-grain background.
 */
export function Logo<C extends ElementType = 'span'>({ as, size = 'md', label }: LogoProps<C>) {
	const Component = as || 'span';
	const StyledComponent = SIZE_COMPONENTS[size] || S.Logo;
	const isDecorative = !label;

	return (
		<StyledComponent
			as={Component}
			role={isDecorative ? undefined : 'img'}
			aria-label={label}
			aria-hidden={isDecorative ? true : undefined}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 -960 960 960"
				fill="#ffffff"
				aria-hidden="true"
				focusable="false"
			>
				<path d="M182-200q-51 0-79-35.5T82-322l42-300q9-60 53.5-99T282-760h396q60 0 104.5 39t53.5 99l42 300q7 51-21 86.5T778-200q-21 0-39-7.5T706-230l-90-90H344l-90 90q-15 15-33 22.5t-39 7.5m526.5-251.5Q720-463 720-480t-11.5-28.5T680-520t-28.5 11.5T640-480t11.5 28.5T680-440t28.5-11.5m-80-120Q640-583 640-600t-11.5-28.5T600-640t-28.5 11.5T560-600t11.5 28.5T600-560t28.5-11.5M310-440h60v-70h70v-60h-70v-70h-60v70h-70v60h70z" />
			</svg>
		</StyledComponent>
	);
}
