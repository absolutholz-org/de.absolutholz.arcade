import { type JSX, type SyntheticEvent, useState } from 'react';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import * as S from './_Collapsible.styles';
import type { CollapsibleProps } from './_Collapsible.types';

export function Collapsible({
	title,
	count,
	badge,
	variant = 'default',
	defaultOpen = false,
	open: controlledOpen,
	onToggle,
	children,
	className,
	...rest
}: CollapsibleProps): JSX.Element {
	const isControlled = controlledOpen !== undefined;
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const currentOpen = isControlled ? controlledOpen : isOpen;

	const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
		if (!isControlled) {
			setIsOpen(event.currentTarget.open);
		}
		onToggle?.(event);
	};

	const badgeElement =
		badge ??
		(count !== undefined ? (
			<Badge variant="neutral" size="sm">
				{count}
			</Badge>
		) : null);

	return (
		<S.Collapsible
			className={className}
			data-variant={variant}
			open={currentOpen}
			onToggle={handleToggle}
			{...rest}
		>
			<S.Summary>
				<span data-slot="summary-content">
					<span data-slot="title">{title}</span>
					{badgeElement}
				</span>
				<span data-slot="chevron" aria-hidden="true">
					<Icon name="chevron-down" size="sm" />
				</span>
			</S.Summary>
			<S.Content>{children}</S.Content>
		</S.Collapsible>
	);
}
