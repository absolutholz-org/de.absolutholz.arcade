import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timer } from '.';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { TIMER_FORMATS, TIMER_SIZES } from './_Timer.constants';
import { useTimer } from './_Timer.hooks';

const meta = {
	component: Timer,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Timer component displays elapsed time using a semantic `<time>` element with tabular numerals (`tabular-nums`) to prevent layout shifts. It supports automatic or explicit hour formats, size variants, a timer icon, and pause styling.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Timer',
	argTypes: {
		seconds: {
			control: { type: 'number', min: 0 },
			description: 'Elapsed time in seconds to display',
		},
		size: {
			control: 'radio',
			options: TIMER_SIZES,
			description: 'Sizing preset dictating font size and icon scale',
		},
		format: {
			control: 'radio',
			options: TIMER_FORMATS,
			description: 'Time formatting structure (auto, mm:ss, hh:mm:ss)',
		},
		showIcon: {
			control: 'boolean',
			description: 'Whether to render the leading timer/stopwatch icon',
		},
		isPaused: {
			control: 'boolean',
			description: 'Applies dimmed visual indicator when timer is paused',
		},
	},
	args: {
		seconds: 142,
		size: 'md',
		format: 'auto',
		showIcon: true,
		isPaused: false,
	},
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard timer displaying minutes and seconds in medium scale.',
			},
		},
	},
	args: {
		seconds: 142,
	},
};

export const Small: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Compact timer variant designed for dense game headers or toolbars.',
			},
		},
	},
	args: {
		seconds: 85,
		size: 'sm',
	},
};

export const Large: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Large timer variant for prominent in-game displays.',
			},
		},
	},
	args: {
		seconds: 320,
		size: 'lg',
	},
};

export const WithHours: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Automatic switch to HH:MM:SS format when elapsed time exceeds 1 hour (3600s).',
			},
		},
	},
	args: {
		seconds: 3745,
	},
};

export const ExplicitHourFormat: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Timer forced to display HH:MM:SS even when duration is under one hour.',
			},
		},
	},
	args: {
		seconds: 142,
		format: 'hh:mm:ss',
	},
};

export const Paused: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Timer in paused state with dimmed visual appearance.',
			},
		},
	},
	args: {
		seconds: 245,
		isPaused: true,
	},
};

export const WithoutIcon: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Timer rendered without the leading clock icon, displaying only digits.',
			},
		},
	},
	args: {
		seconds: 75,
		showIcon: false,
	},
};

function InteractiveTickingDemo() {
	const { seconds, isRunning, start, pause, reset } = useTimer({
		initialSeconds: 0,
		isRunning: true,
	});

	return (
		<Stack direction="vertical" spacing="md" align="center">
			<Timer seconds={seconds} size="lg" isPaused={!isRunning} />
			<Stack direction="horizontal" spacing="sm">
				{isRunning ? (
					<Button onClick={pause} variant="secondary" size="sm">
						Pause
					</Button>
				) : (
					<Button onClick={start} variant="primary" size="sm">
						Resume
					</Button>
				)}
				<Button onClick={() => reset(0)} variant="secondary" size="sm">
					Reset
				</Button>
			</Stack>
		</Stack>
	);
}

export const InteractiveTicking: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Interactive demonstration using the companion useTimer hook with ticking state.',
			},
		},
	},
	render: () => <InteractiveTickingDemo />,
};
