import type { ChangeEvent, ElementType } from 'react';
import { SCHEME_LABELS, SCHEME_OPTIONS, SCHEME_SWITCHER_NAME } from './_SchemeSwitcher.constants';
import { useScheme } from './_SchemeSwitcher.hooks';
import * as S from './_SchemeSwitcher.styles';
import type { Scheme, SchemeSwitcherProps } from './_SchemeSwitcher.types';

/**
 * SchemeSwitcher provides an accessible radio group allowing users
 * to select between light, dark, and system color schemes.
 */
export function SchemeSwitcher<C extends ElementType = 'fieldset'>({
	legend = 'Color Scheme',
	hideLegend = false,
	orientation = 'horizontal',
	as,
}: SchemeSwitcherProps<C>) {
	const Component = as || 'fieldset';
	const [scheme, setScheme] = useScheme();

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setScheme(event.target.value as Scheme);
	};

	return (
		<S.SchemeSwitcher as={Component} $orientation={orientation}>
			{legend ? <S.Legend $visuallyHidden={hideLegend}>{legend}</S.Legend> : null}
			{SCHEME_OPTIONS.map((option) => {
				const optionId = `${SCHEME_SWITCHER_NAME}-${option}`;
				return (
					<S.Label key={option} htmlFor={optionId}>
						<S.Input
							id={optionId}
							type="radio"
							name={SCHEME_SWITCHER_NAME}
							value={option}
							checked={scheme === option}
							onChange={handleChange}
						/>
						<S.OptionText>{SCHEME_LABELS[option]}</S.OptionText>
					</S.Label>
				);
			})}
		</S.SchemeSwitcher>
	);
}
