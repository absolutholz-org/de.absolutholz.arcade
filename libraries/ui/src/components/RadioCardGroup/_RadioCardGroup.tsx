import { useId } from 'react';
import { Icon } from '../Icon';
import * as S from './_RadioCardGroup.styles';
import type { RadioCardGroupProps, RadioCardOptionProps } from './_RadioCardGroup.types';

/**
 * Native radio group rendered as selectable cards. Uses a fieldset/legend with visually
 * hidden radio inputs, so Tab/Arrow-key behavior and selection semantics are browser-native.
 */
export function RadioCardGroup({
	legend,
	description,
	hideHeader = false,
	layout = 'row',
	lang,
	className,
	children,
}: RadioCardGroupProps) {
	const descriptionId = useId();
	const showDescription = Boolean(description) && !hideHeader;

	return (
		<S.Fieldset className={className} lang={lang} aria-describedby={showDescription ? descriptionId : undefined}>
			<S.Legend data-visually-hidden={hideHeader ? 'true' : undefined}>{legend}</S.Legend>
			{showDescription && <S.Description id={descriptionId}>{description}</S.Description>}
			<S.Options data-layout={layout}>{children}</S.Options>
		</S.Fieldset>
	);
}

export function RadioCardOption({ name, value, checked, onChange, children, preview }: RadioCardOptionProps) {
	return (
		<S.Card>
			<S.Radio type="radio" name={name} value={value} checked={checked} onChange={onChange} />
			<S.Header>
				<S.Content>{children}</S.Content>
				<S.CheckIndicator aria-hidden="true">
					<Icon name="check" size="xs" />
				</S.CheckIndicator>
			</S.Header>
			{preview}
		</S.Card>
	);
}
