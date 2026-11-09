import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmojiAvatarPicker } from '.';
import { render } from '../../test-utils';
import { ARCADE_AVATAR_EMOJIS, GRID_COLUMNS } from './_EmojiAvatarPicker.constants';

describe('EmojiAvatarPicker', () => {
	beforeEach(() => {
		// Polyfill Popover API for happy-dom if not present
		if (!HTMLElement.prototype.showPopover) {
			HTMLElement.prototype.showPopover = function () {
				this.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
			};
		}
		if (!HTMLElement.prototype.hidePopover) {
			HTMLElement.prototype.hidePopover = function () {
				this.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
			};
		}
	});

	function openPicker(container: HTMLElement) {
		const popover = container.querySelector('[popover]') as HTMLElement;
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
		});
		return popover;
	}

	function closePicker(container: HTMLElement) {
		const popover = container.querySelector('[popover]') as HTMLElement;
		act(() => {
			popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' }));
		});
		return popover;
	}

	it('renders trigger button displaying the current avatar with accessible label', () => {
		const { container, unmount } = render(
			<EmojiAvatarPicker value={{ type: 'emoji', value: '👾' }} onChange={() => {}} />,
		);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]');
		expect(trigger).not.toBeNull();
		expect(trigger?.getAttribute('aria-label')).toBe('Change avatar: Current avatar 👾');
		expect(trigger?.getAttribute('aria-expanded')).toBe('false');
		expect(trigger?.textContent).toContain('👾');

		unmount();
	});

	it('accepts custom trigger ariaLabel prop', () => {
		const { container, unmount } = render(
			<EmojiAvatarPicker value="🎮" onChange={() => {}} ariaLabel="Select player icon" />,
		);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]');
		expect(trigger?.getAttribute('aria-label')).toBe('Select player icon');

		unmount();
	});

	it('disables trigger when disabled prop is true', () => {
		const { container, unmount } = render(<EmojiAvatarPicker value="👾" onChange={() => {}} disabled />);

		const trigger = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]');
		expect(trigger?.disabled).toBe(true);

		unmount();
	});

	it('configures popover container as a semantic radiogroup with radio items', () => {
		const { container, unmount } = render(
			<EmojiAvatarPicker value={{ type: 'emoji', value: '👾' }} onChange={() => {}} />,
		);

		openPicker(container);

		const radiogroup = container.querySelector('[role="radiogroup"]');
		expect(radiogroup).not.toBeNull();
		expect(radiogroup?.getAttribute('aria-label')).toBe('Choose an avatar emoji');

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		expect(radios.length).toBe(ARCADE_AVATAR_EMOJIS.length);

		// '👾' is index 0 in ARCADE_AVATAR_EMOJIS
		expect(radios[0].getAttribute('aria-checked')).toBe('true');
		expect(radios[0].getAttribute('data-selected')).toBe('true');
		expect(radios[0].tabIndex).toBe(0);

		// Other radios are unchecked with roving tabindex -1
		expect(radios[1].getAttribute('aria-checked')).toBe('false');
		expect(radios[1].tabIndex).toBe(-1);

		unmount();
	});

	it('calls onChange with PlayerAvatar when an emoji radio is clicked', () => {
		const handleChange = vi.fn();
		const { container, unmount } = render(
			<EmojiAvatarPicker value={{ type: 'emoji', value: '👾' }} onChange={handleChange} />,
		);

		openPicker(container);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		// Index 1 is '🎮' (Video game controller)
		act(() => {
			radios[1].click();
		});

		expect(handleChange).toHaveBeenCalledWith({
			type: 'emoji',
			value: '🎮',
		});

		unmount();
	});

	it('navigates with ArrowRight and ArrowLeft keys with circular wrapping', () => {
		const { container, unmount } = render(<EmojiAvatarPicker value="👾" onChange={() => {}} />);

		openPicker(container);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		const total = radios.length;

		// Focus on index 0
		act(() => {
			radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		});
		expect(radios[1].tabIndex).toBe(0);
		expect(radios[0].tabIndex).toBe(-1);

		// Move left from 1 back to 0
		act(() => {
			radios[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		});
		expect(radios[0].tabIndex).toBe(0);

		// Wrap around from 0 to last index via ArrowLeft
		act(() => {
			radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		});
		expect(radios[total - 1].tabIndex).toBe(0);

		// Wrap around from last index to 0 via ArrowRight
		act(() => {
			radios[total - 1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		});
		expect(radios[0].tabIndex).toBe(0);

		unmount();
	});

	it('navigates with ArrowDown and ArrowUp keys with vertical circular wrapping', () => {
		const { container, unmount } = render(<EmojiAvatarPicker value="👾" onChange={() => {}} />);

		openPicker(container);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		const total = radios.length;

		// ArrowDown from 0 -> GRID_COLUMNS
		act(() => {
			radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
		});
		expect(radios[GRID_COLUMNS].tabIndex).toBe(0);

		// ArrowUp from GRID_COLUMNS -> 0
		act(() => {
			radios[GRID_COLUMNS].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
		});
		expect(radios[0].tabIndex).toBe(0);

		// ArrowUp from 0 wraps around to bottom
		act(() => {
			radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
		});
		const expectedBottomIndex = (0 - GRID_COLUMNS + total) % total;
		expect(radios[expectedBottomIndex].tabIndex).toBe(0);

		unmount();
	});

	it('navigates to first and last items using Home and End keys', () => {
		const { container, unmount } = render(<EmojiAvatarPicker value="🎮" onChange={() => {}} />);

		openPicker(container);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		const total = radios.length;

		// Press End to jump to last item
		act(() => {
			radios[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
		});
		expect(radios[total - 1].tabIndex).toBe(0);

		// Press Home to jump to first item
		act(() => {
			radios[total - 1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
		});
		expect(radios[0].tabIndex).toBe(0);

		unmount();
	});

	it('selects emoji and triggers onChange on Enter and Space keydown', () => {
		const handleChange = vi.fn();
		const { container, unmount } = render(<EmojiAvatarPicker value="👾" onChange={handleChange} />);

		openPicker(container);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');

		// Press Enter on index 2 ('🕹️')
		act(() => {
			radios[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		});
		expect(handleChange).toHaveBeenCalledWith({
			type: 'emoji',
			value: '🕹️',
		});

		// Press Space on index 3 ('🎲')
		act(() => {
			radios[3].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
		});
		expect(handleChange).toHaveBeenCalledWith({
			type: 'emoji',
			value: '🎲',
		});

		unmount();
	});

	it('supports custom emoji text input and validates single grapheme emoji', () => {
		const handleChange = vi.fn();
		const { container, unmount } = render(<EmojiAvatarPicker value="👾" onChange={handleChange} />);

		openPicker(container);

		const input = container.querySelector<HTMLInputElement>('input[type="text"]');
		expect(input).not.toBeNull();

		// Enter valid single grapheme emoji (e.g. '🦄')
		act(() => {
			if (input) {
				const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
					window.HTMLInputElement.prototype,
					'value',
				)?.set;
				nativeInputValueSetter?.call(input, '🦄');
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}
		});

		// Submit with Enter key on input
		act(() => {
			input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		});

		expect(handleChange).toHaveBeenCalledWith({
			type: 'emoji',
			value: '🦄',
		});

		unmount();
	});

	it('displays validation error and rejects invalid multi-character custom input', () => {
		const handleChange = vi.fn();
		const { container, unmount } = render(<EmojiAvatarPicker value="👾" onChange={handleChange} />);

		openPicker(container);

		const input = container.querySelector<HTMLInputElement>('input[type="text"]');

		// Enter invalid text
		act(() => {
			if (input) {
				const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
					window.HTMLInputElement.prototype,
					'value',
				)?.set;
				nativeInputValueSetter?.call(input, 'invalid text');
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}
		});

		// Press Enter to submit
		act(() => {
			input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		});

		// Should not call onChange
		expect(handleChange).not.toHaveBeenCalled();

		// Inline alert message must be rendered
		const alert = container.querySelector('[role="alert"]');
		expect(alert).not.toBeNull();
		expect(alert?.textContent).toContain('Please enter a single valid emoji');

		unmount();
	});

	it('restores focus to trigger on popover close', () => {
		const { container, unmount } = render(<EmojiAvatarPicker value="👾" onChange={() => {}} />);

		const trigger = container.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]');
		trigger?.focus();

		openPicker(container);
		closePicker(container);

		// Trigger should retain or regain focus
		expect(document.activeElement).toBe(trigger);

		unmount();
	});
});
