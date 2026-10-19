import { describe, expect, it } from 'vitest';
import { render } from '../../test-utils';
import { MedalEmblem, MedalIcon } from '../MedalIcon/MedalIcon';
import { MedalCard } from './MedalCard';
import { TriadBadge } from './TriadBadge';

describe('MedalIcon', () => {
	it('renders with correct tier and unlocked state', () => {
		const { container } = render(<MedalIcon tier="gold" state="unlocked" size={48} />);
		const svg = container.querySelector('svg');
		expect(svg).not.toBeNull();
		expect(svg?.getAttribute('data-tier')).toBe('gold');
		expect(svg?.getAttribute('data-state')).toBe('unlocked');
		expect(svg?.getAttribute('width')).toBe('48');
	});

	it('renders locked state', () => {
		const { container } = render(<MedalIcon tier="silver" state="locked" />);
		const svg = container.querySelector('svg');
		expect(svg?.getAttribute('data-state')).toBe('locked');
	});

	it('renders custom emblem when provided as children', () => {
		const { container } = render(
			<MedalIcon tier="bronze">
				<circle cx="24" cy="29" r="6" data-testid="custom-emblem" />
			</MedalIcon>,
		);
		expect(container.querySelector('[data-testid="custom-emblem"]')).not.toBeNull();
	});
});

describe('TriadBadge', () => {
	it('renders silver, bronze, and gold medals in triangular arrangement', () => {
		const { container } = render(
			<TriadBadge bronzeUnlocked={true} silverUnlocked={false} goldUnlocked={false} size={36} />,
		);

		const silverMedal = container.querySelector('svg[data-tier="silver"]');
		const bronzeMedal = container.querySelector('svg[data-tier="bronze"]');
		const goldMedal = container.querySelector('svg[data-tier="gold"]');

		expect(silverMedal).not.toBeNull();
		expect(bronzeMedal).not.toBeNull();
		expect(goldMedal).not.toBeNull();

		expect(silverMedal?.getAttribute('data-state')).toBe('locked');
		expect(bronzeMedal?.getAttribute('data-state')).toBe('unlocked');
		expect(goldMedal?.getAttribute('data-state')).toBe('locked');
	});
});

describe('MedalCard', () => {
	it('renders standalone mode with centered MedalIcon', () => {
		const { container } = render(
			<MedalCard
				mode="standalone"
				title="Speed Demon"
				description="Solve puzzle in under 3 minutes"
				tier="gold"
				unlocked={true}
				unlockedDateText="Unlocked on Oct 19, 2026"
			/>,
		);

		expect(container.textContent).toContain('Speed Demon');
		expect(container.textContent).toContain('Solve puzzle in under 3 minutes');
		expect(container.textContent).toContain('Unlocked on Oct 19, 2026');

		const svg = container.querySelector('svg[data-tier="gold"]');
		expect(svg).not.toBeNull();
		expect(svg?.getAttribute('data-state')).toBe('unlocked');
	});

	it('renders progressive mode with TriadBadge and multi-step progress bar', () => {
		const { container } = render(
			<MedalCard
				mode="progressive"
				title="Win Streak"
				description="Win consecutive games"
				bronzeUnlocked={true}
				silverUnlocked={false}
				goldUnlocked={false}
				progressiveProgress={{
					current: 2,
					target: 3,
					nextTier: 'silver',
				}}
			/>,
		);

		expect(container.textContent).toContain('Win Streak');
		// Should render TriadBadge medals
		expect(container.querySelectorAll('svg[data-tier]').length).toBe(3);

		// Multi-step track should exist with 3 segments
		const stepSegments = container.querySelectorAll(
			'[data-tier="bronze"], [data-tier="silver"], [data-tier="gold"]',
		);
		expect(stepSegments.length).toBeGreaterThanOrEqual(3);
		expect(container.textContent).toContain('Next: silver');
	});
});
