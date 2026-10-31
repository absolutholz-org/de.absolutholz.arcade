import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from '.';
import { render } from '../../test-utils';
import type { SegmentedControlItem } from './_SegmentedControl.types';

const items: SegmentedControlItem[] = [
	{ id: 'easy', label: 'Easy', sublabel: 'Quick' },
	{ id: 'medium', label: 'Medium' },
	{ id: 'hard', label: 'Hard' },
	{ id: 'expert', label: 'Expert', disabled: true },
];

describe('SegmentedControl', () => {
	it('renders as a radiogroup with radio items', () => {
		const { container, unmount } = render(
			<SegmentedControl items={items} value="medium" onChange={() => {}} ariaLabel="Difficulty" />,
		);

		const group = container.querySelector('[role="radiogroup"]');
		expect(group).not.toBeNull();
		expect(group?.getAttribute('aria-label')).toBe('Difficulty');

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		expect(radios.length).toBe(4);

		expect(radios[0].getAttribute('aria-checked')).toBe('false');
		expect(radios[1].getAttribute('aria-checked')).toBe('true');
		expect(radios[3].disabled).toBe(true);
		expect(radios[3].getAttribute('aria-disabled')).toBe('true');

		unmount();
	});

	it('manages roving tabindex correctly', () => {
		const { container, unmount } = render(<SegmentedControl items={items} value="medium" onChange={() => {}} />);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		expect(radios[0].tabIndex).toBe(-1);
		expect(radios[1].tabIndex).toBe(0);
		expect(radios[2].tabIndex).toBe(-1);

		unmount();
	});

	it('calls onChange when clicking an enabled segment', () => {
		const handleChange = vi.fn();
		const { container, unmount } = render(
			<SegmentedControl items={items} value="medium" onChange={handleChange} />,
		);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		act(() => {
			radios[0].click();
		});
		expect(handleChange).toHaveBeenCalledWith('easy');

		unmount();
	});

	it('does not call onChange when clicking a disabled segment', () => {
		const handleChange = vi.fn();
		const { container, unmount } = render(
			<SegmentedControl items={items} value="medium" onChange={handleChange} />,
		);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		act(() => {
			radios[3].click();
		});
		expect(handleChange).not.toHaveBeenCalled();

		unmount();
	});

	it('navigates with ArrowRight and ArrowLeft keys', () => {
		const handleChange = vi.fn();
		const { container, unmount } = render(
			<SegmentedControl items={items} value="medium" onChange={handleChange} />,
		);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		radios[1].focus();

		act(() => {
			radios[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		});
		expect(handleChange).toHaveBeenCalledWith('hard');

		act(() => {
			radios[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		});
		expect(handleChange).toHaveBeenCalledWith('easy');

		unmount();
	});

	it('skips disabled items and wraps around on arrows', () => {
		const handleChange = vi.fn();
		const { container, unmount } = render(<SegmentedControl items={items} value="hard" onChange={handleChange} />);

		const radios = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
		radios[2].focus();

		// Moving right from 'hard' should skip disabled 'expert' and cycle to 'easy'
		act(() => {
			radios[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		});
		expect(handleChange).toHaveBeenCalledWith('easy');

		unmount();
	});

	it('renders as a tablist with tab items when role="tablist"', () => {
		const { container, unmount } = render(
			<SegmentedControl
				items={items.map((i) => ({ ...i, ariaControls: `panel-${i.id}` }))}
				value="medium"
				onChange={() => {}}
				role="tablist"
				ariaLabel="Tabs"
			/>,
		);

		const tablist = container.querySelector('[role="tablist"]');
		expect(tablist).not.toBeNull();
		expect(tablist?.getAttribute('aria-label')).toBe('Tabs');

		const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
		expect(tabs.length).toBe(4);
		expect(tabs[0].getAttribute('aria-selected')).toBe('false');
		expect(tabs[1].getAttribute('aria-selected')).toBe('true');
		expect(tabs[0].getAttribute('aria-controls')).toBe('panel-easy');
		expect(tabs[1].getAttribute('aria-controls')).toBe('panel-medium');

		unmount();
	});
});
