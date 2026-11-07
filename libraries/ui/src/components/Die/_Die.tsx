import type { KeyboardEvent, MouseEvent } from 'react';
import { DIE_FACES, type DieFaceValue, FACE_PIP_SLOTS } from './_Die.constants';
import * as S from './_Die.styles';
import type { DieProps } from './_Die.types';

const GRID_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function Die({
	state,
	index,
	tumbleIndex,
	onToggleHold,
	isRolling,
	isSelectable = true,
	className,
}: DieProps): JSX.Element {
	const activeRolling = isRolling ?? state.isRolling;
	const tumbleVariant = ((((tumbleIndex ?? index ?? 0) % 6) + 6) % 6).toString();
	const dieNumber = typeof index === 'number' ? index + 1 : undefined;

	const label = [
		dieNumber !== undefined ? `Die ${dieNumber}: ` : 'Die: ',
		`${state.value}`,
		state.isHeld ? ', held' : '',
	].join('');

	const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
		if (!isSelectable) return;
		event.preventDefault();
		onToggleHold?.(state.id);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
		if (!isSelectable) return;
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			onToggleHold?.(state.id);
		}
	};

	// Clamp or fallback to face 1 if value is outside 1..6
	const faceValue = (state.value >= 1 && state.value <= 6 ? state.value : 1) as DieFaceValue;

	if (!isSelectable) {
		return (
			<S.DieWrapper
				as="div"
				className={className}
				data-selectable="false"
				data-held={state.isHeld ? 'true' : 'false'}
				data-rolling={activeRolling ? 'true' : 'false'}
				data-tumble={tumbleVariant}
				aria-label={label}
				role="img"
			>
				<S.Cube
					data-face={faceValue.toString()}
					data-rolling={activeRolling ? 'true' : 'false'}
					data-tumble={tumbleVariant}
				>
					{DIE_FACES.map((face) => {
						const activeSlots = FACE_PIP_SLOTS[face];
						return (
							<S.Face key={face} data-face-idx={face.toString()}>
								{GRID_SLOTS.map((slot) => (
									<span key={slot} data-pip={activeSlots.includes(slot) ? 'true' : 'false'} />
								))}
							</S.Face>
						);
					})}
				</S.Cube>
				{state.isHeld ? <S.HeldBadge aria-hidden="true">🔒 Held</S.HeldBadge> : null}
			</S.DieWrapper>
		);
	}

	return (
		<S.DieWrapper
			type="button"
			className={className}
			data-selectable="true"
			data-held={state.isHeld ? 'true' : 'false'}
			data-rolling={activeRolling ? 'true' : 'false'}
			data-tumble={tumbleVariant}
			aria-pressed={state.isHeld}
			aria-label={label}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			<S.Cube
				data-face={faceValue.toString()}
				data-rolling={activeRolling ? 'true' : 'false'}
				data-tumble={tumbleVariant}
			>
				{DIE_FACES.map((face) => {
					const activeSlots = FACE_PIP_SLOTS[face];
					return (
						<S.Face key={face} data-face-idx={face.toString()}>
							{GRID_SLOTS.map((slot) => (
								<span key={slot} data-pip={activeSlots.includes(slot) ? 'true' : 'false'} />
							))}
						</S.Face>
					);
				})}
			</S.Cube>
			{state.isHeld ? <S.HeldBadge aria-hidden="true">🔒 Held</S.HeldBadge> : null}
		</S.DieWrapper>
	);
}
