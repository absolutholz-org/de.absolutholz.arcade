import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../test-utils';
import { Badge } from './_Badge';

describe('Badge', () => {
	it('renders a static span by default with data attributes', async () => {
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<Badge variant="subtle" tone="success" size="sm">
					Solved
				</Badge>,
			);
		});

		const el = utils?.container.querySelector('span[data-variant="subtle"]');
		expect(el).not.toBeNull();
		expect(el?.getAttribute('data-tone')).toBe('success');
		expect(el?.getAttribute('data-size')).toBe('sm');
		expect(el?.getAttribute('data-interactive')).toBeNull();
		expect(el?.textContent).toBe('Solved');
		utils?.unmount();
	});

	it('renders screenReaderLabel via VisuallyHidden without aria-label on span', async () => {
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<Badge variant="subtle" tone="warning" screenReaderLabel="Heads">
					H
				</Badge>,
			);
		});

		const root = utils?.container.querySelector('span[data-variant="subtle"]');
		expect(root?.getAttribute('aria-label')).toBeNull();

		const visible = root?.querySelector('span[data-slot="label"]');
		expect(visible?.getAttribute('aria-hidden')).toBe('true');
		expect(visible?.textContent).toBe('H');
		expect(root?.textContent).toBe('HHeads');
		utils?.unmount();
	});

	it('renders an interactive button badge with aria-pressed and handles clicks', async () => {
		const onClick = vi.fn();
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<Badge as="button" pressed={true} tone="accent" onClick={onClick}>
					Active
				</Badge>,
			);
		});

		const btn = utils?.container.querySelector('button');
		expect(btn).not.toBeNull();
		expect(btn?.getAttribute('type')).toBe('button');
		expect(btn?.getAttribute('aria-pressed')).toBe('true');
		expect(btn?.getAttribute('data-interactive')).toBe('true');

		await act(async () => {
			btn?.click();
		});
		expect(onClick).toHaveBeenCalledTimes(1);
		utils?.unmount();
	});

	it('keeps ariaDisabled button focusable while preventing onClick activation', async () => {
		const onClick = vi.fn();
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<Badge as="button" ariaDisabled={true} onClick={onClick}>
					Unavailable
				</Badge>,
			);
		});

		const btn = utils?.container.querySelector('button');
		expect(btn?.disabled).toBe(false);
		expect(btn?.getAttribute('aria-disabled')).toBe('true');

		await act(async () => {
			btn?.click();
		});
		expect(onClick).not.toHaveBeenCalled();
		utils?.unmount();
	});

	it('renders a link badge with href and aria-current', async () => {
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<Badge as="a" href="/en/categories/logic" current={true} variant="outline">
					Logic
				</Badge>,
			);
		});

		const link = utils?.container.querySelector('a');
		expect(link).not.toBeNull();
		expect(link?.getAttribute('href')).toBe('/en/categories/logic');
		expect(link?.getAttribute('aria-current')).toBe('page');
		expect(link?.getAttribute('data-interactive')).toBe('true');
		utils?.unmount();
	});

	it('wraps leading and trailing icons in aria-hidden="true"', async () => {
		let utils: ReturnType<typeof render>;
		await act(async () => {
			utils = render(
				<Badge leadingIcon={<svg data-testid="lead" />} trailingIcon={<svg data-testid="trail" />}>
					Label
				</Badge>,
			);
		});

		const icons = utils?.container.querySelectorAll('span[data-slot="icon"]');
		expect(icons?.length).toBe(2);
		expect(icons?.[0]?.getAttribute('aria-hidden')).toBe('true');
		expect(icons?.[1]?.getAttribute('aria-hidden')).toBe('true');
		utils?.unmount();
	});
});
