import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { WakeLockToggleButton } from './_WakeLockToggleButton';

describe('WakeLockToggleButton', () => {
	it('renders nothing when isSupported is false', () => {
		const { container } = render(
			<I18nProvider language="en">
				<WakeLockToggleButton enabled={true} isActive={false} isSupported={false} onToggle={vi.fn()} />
			</I18nProvider>,
		);
		expect(container.querySelector('button')).toBeNull();
	});

	it('renders active state with aria-pressed="true" and toggles on click', () => {
		const onToggle = vi.fn();
		const { container } = render(
			<I18nProvider language="en">
				<WakeLockToggleButton enabled={true} isActive={true} isSupported={true} onToggle={onToggle} />
			</I18nProvider>,
		);

		const button = container.querySelector('button') as HTMLButtonElement;
		expect(button).not.toBeNull();
		expect(button.getAttribute('aria-pressed')).toBe('true');
		expect(button.getAttribute('data-variant')).toBe('subtle');
		expect(button.getAttribute('data-tone')).toBe('accent');
		expect(button.textContent).toContain('Keep screen awake');

		button.click();
		expect(onToggle).toHaveBeenCalledWith(false);
	});

	it('renders blocked state when enabled is true but isActive is false', () => {
		const { container } = render(
			<I18nProvider language="en">
				<WakeLockToggleButton enabled={true} isActive={false} isSupported={true} onToggle={vi.fn()} />
			</I18nProvider>,
		);

		const button = container.querySelector('button') as HTMLButtonElement;
		expect(button.getAttribute('aria-pressed')).toBe('true');
		expect(button.getAttribute('data-variant')).toBe('dashed');
		expect(button.getAttribute('data-tone')).toBe('neutral');
		expect(button.textContent).toContain('Screen stay-awake inactive');
	});

	it('renders off state with aria-pressed="false"', () => {
		const onToggle = vi.fn();
		const { container } = render(
			<I18nProvider language="en">
				<WakeLockToggleButton enabled={false} isActive={false} isSupported={true} onToggle={onToggle} />
			</I18nProvider>,
		);

		const button = container.querySelector('button') as HTMLButtonElement;
		expect(button.getAttribute('aria-pressed')).toBe('false');
		expect(button.getAttribute('data-variant')).toBe('outline');
		expect(button.getAttribute('data-tone')).toBe('neutral');

		button.click();
		expect(onToggle).toHaveBeenCalledWith(true);
	});
});
