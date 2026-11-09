import { Button } from '../Button';
import { EmojiAvatar } from '../EmojiAvatar';
import { Popover } from '../Popover';
import { ARCADE_AVATAR_EMOJIS } from './_EmojiAvatarPicker.constants';
import { useEmojiAvatarPicker } from './_EmojiAvatarPicker.hooks';
import * as S from './_EmojiAvatarPicker.styles';
import type { EmojiAvatarPickerProps } from './_EmojiAvatarPicker.types';

/**
 * EmojiAvatarPicker provides an accessible popover containing a curated grid
 * of arcade-themed emojis and a custom single-emoji input fallback.
 */
export function EmojiAvatarPicker({
	value,
	onChange,
	disabled = false,
	ariaLabel,
	align = 'bottom',
	className,
	id,
}: EmojiAvatarPickerProps) {
	const {
		currentEmoji,
		customError,
		customInput,
		customInputId,
		focusedIndex,
		getOptionDomId,
		handleCustomApply,
		handleCustomInputChange,
		handleCustomInputKeyDown,
		handleOpenChange,
		handleOptionKeyDown,
		isOpen,
		popoverContentRef,
		radiogroupId,
		selectEmoji,
		triggerId,
	} = useEmojiAvatarPicker({
		id,
		onChange,
		value,
	});

	const triggerLabel = ariaLabel || `Change avatar: Current avatar ${currentEmoji}`;

	return (
		<Popover align={align} onOpenChange={handleOpenChange}>
			<S.TriggerButton
				id={triggerId}
				type="button"
				disabled={disabled}
				className={className}
				aria-label={triggerLabel}
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				aria-controls={radiogroupId}
			>
				<EmojiAvatar value={currentEmoji} size="md" />
			</S.TriggerButton>

			<S.PickerContainer ref={popoverContentRef}>
				<S.RadioGroup id={radiogroupId} role="radiogroup" aria-label="Choose an avatar emoji">
					<span data-slot="header">Choose Avatar</span>
					<S.Grid>
						{ARCADE_AVATAR_EMOJIS.map((emoji, index) => {
							const isSelected = emoji.value === currentEmoji;
							const isFocused = focusedIndex === index;

							return (
								<S.OptionButton
									key={emoji.value}
									id={getOptionDomId(index)}
									type="button"
									// biome-ignore lint/a11y/useSemanticElements: custom keyboard-accessible emoji grid with radiogroup pattern
									role="radio"
									aria-checked={isSelected}
									aria-label={emoji.label}
									title={emoji.label}
									tabIndex={isFocused ? 0 : -1}
									data-selected={isSelected ? 'true' : undefined}
									onClick={() => selectEmoji(emoji.value)}
									onKeyDown={(e) => handleOptionKeyDown(e, index)}
								>
									<span aria-hidden="true">{emoji.value}</span>
								</S.OptionButton>
							);
						})}
					</S.Grid>
				</S.RadioGroup>

				<S.CustomSection>
					<label htmlFor={customInputId} data-slot="custom-label">
						Custom emoji:
					</label>
					<div data-slot="custom-row">
						<S.CustomInput
							id={customInputId}
							type="text"
							maxLength={10}
							value={customInput}
							onChange={(e) => handleCustomInputChange(e.target.value)}
							onKeyDown={handleCustomInputKeyDown}
							placeholder="e.g. 🦄"
							aria-label="Custom emoji avatar"
							aria-invalid={customError ? 'true' : 'false'}
							data-invalid={customError ? 'true' : undefined}
						/>
						<Button
							type="button"
							size="sm"
							variant="secondary"
							onClick={handleCustomApply}
							disabled={!customInput.trim()}
						>
							Apply
						</Button>
					</div>
					{customError && (
						<span data-slot="custom-error" role="alert">
							{customError}
						</span>
					)}
				</S.CustomSection>
			</S.PickerContainer>
		</Popover>
	);
}
