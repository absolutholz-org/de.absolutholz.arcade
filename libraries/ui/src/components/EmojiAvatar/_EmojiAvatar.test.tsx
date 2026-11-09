import { describe, expect, it } from 'vitest';
import { EmojiAvatar } from '.';
import { render } from '../../test-utils';

describe('EmojiAvatar', () => {
	it('renders default fallback avatar when value is empty or default', () => {
		const { container, unmount } = render(<EmojiAvatar value="👾" />);
		const avatar = container.querySelector('span');

		expect(avatar).not.toBeNull();
		expect(avatar?.textContent).toContain('👾');
		expect(avatar?.getAttribute('data-size')).toBe('md');
		expect(avatar?.getAttribute('aria-hidden')).toBe('true');

		unmount();
	});

	it('renders avatar from PlayerAvatar object', () => {
		const { container, unmount } = render(<EmojiAvatar value={{ type: 'emoji', value: '🎮' }} size="lg" />);
		const avatar = container.querySelector('span');

		expect(avatar?.textContent).toContain('🎮');
		expect(avatar?.getAttribute('data-size')).toBe('lg');

		unmount();
	});

	it('supports accessible labels and img role when aria-label is provided', () => {
		const { container, unmount } = render(<EmojiAvatar value="🚀" aria-label="Rocket player badge" />);
		const avatar = container.querySelector('span');

		expect(avatar?.getAttribute('role')).toBe('img');
		expect(avatar?.getAttribute('aria-label')).toBe('Rocket player badge');
		expect(avatar?.getAttribute('aria-hidden')).toBeNull();

		unmount();
	});

	it('renders small and extra large sizes via data-size attribute', () => {
		const { container: c1, unmount: u1 } = render(<EmojiAvatar value="👑" size="sm" />);
		expect(c1.querySelector('span')?.getAttribute('data-size')).toBe('sm');
		u1();

		const { container: c2, unmount: u2 } = render(<EmojiAvatar value="👑" size="xl" />);
		expect(c2.querySelector('span')?.getAttribute('data-size')).toBe('xl');
		u2();
	});
});
