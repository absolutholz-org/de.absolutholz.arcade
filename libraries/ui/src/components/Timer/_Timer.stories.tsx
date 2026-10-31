import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Timer } from '.';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { TIMER_FORMATS, TIMER_SIZES, TIMER_VARIANTS } from './_Timer.constants';
import { useTimer } from './_Timer.hooks';
import type { TimerProps } from './_Timer.types';

function InteractiveTimerStory(props: TimerProps) {
	const [isPaused, setIsPaused] = useState(props.isPaused ?? false);
	const [seconds, setSeconds] = useState(props.seconds ?? 0);

	useEffect(() => {
		setIsPaused(props.isPaused ?? false);
	}, [props.isPaused]);

	useEffect(() => {
		setSeconds(props.seconds ?? 0);
	}, [props.seconds]);

	useEffect(() => {
		if (isPaused || props.disabled) return;
		const timer = setInterval(() => {
			setSeconds((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [isPaused, props.disabled]);

	return (
		<Timer
			{...props}
			seconds={seconds}
			isPaused={isPaused}
			onTogglePause={() => {
				setIsPaused((prev) => !prev);
				props.onTogglePause?.();
			}}
		/>
	);
}

const meta = {
	component: Timer,
	render: (args) => <InteractiveTimerStory {...args} />,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Timer component renders a semantic `<button type="button">` pill that displays elapsed time and doubles as an interactive pause/resume control. All stories include live mock ticking and pause/resume toggling on click or Space/Enter.',
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
		isPaused: {
			control: 'boolean',
			description: 'Indicates whether the timer is currently paused',
		},
		onTogglePause: {
			action: 'togglePause',
			description: 'Callback invoked when the timer control is activated',
		},
		variant: {
			control: 'radio',
			options: TIMER_VARIANTS,
			description: 'Visual variant (pill or unbordered inline)',
		},
		size: {
			control: 'radio',
			options: TIMER_SIZES,
			description: 'Sizing preset dictating button scale, font size, and icons',
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
		disabled: {
			control: 'boolean',
			description: 'Disables interactive state',
		},
	},
	args: {
		seconds: 142,
		size: 'md',
		format: 'auto',
		showIcon: true,
		isPaused: false,
		onTogglePause: () => {},
	},
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard interactive timer ticking live in running state. Click the pill to pause/resume.',
			},
		},
	},
	args: {
		seconds: 142,
		isPaused: false,
	},
};

export const Paused: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Timer initialized in paused state displaying resume play icon. Click to unpause and resume ticking.',
			},
		},
	},
	args: {
		seconds: 245,
		isPaused: true,
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
		isPaused: false,
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
		isPaused: false,
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
		isPaused: false,
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
		isPaused: false,
	},
};

export const WithoutIcon: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Timer rendered without the leading clock icon, displaying only digits and action state icon.',
			},
		},
	},
	args: {
		seconds: 75,
		showIcon: false,
		isPaused: false,
	},
};

export const Inline: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Unbordered inline timer metric for game status sub-bars.',
			},
		},
	},
	args: {
		seconds: 71,
		variant: 'inline',
		isPaused: false,
	},
};

export const Disabled: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Disabled interactive timer where ticking and clicks are deactivated.',
			},
		},
	},
	args: {
		seconds: 120,
		disabled: true,
		isPaused: false,
	},
};

function DedicatedHookDemo() {
	const { seconds, isRunning, start, pause, reset } = useTimer({
		initialSeconds: 0,
		isRunning: true,
	});

	const handleToggle = () => {
		if (isRunning) {
			pause();
		} else {
			start();
		}
	};

	return (
		<Stack direction="vertical" spacing="md" align="center">
			<Timer seconds={seconds} size="lg" isPaused={!isRunning} onTogglePause={handleToggle} announceOnToggle />
			<Button onClick={() => reset(0)} variant="secondary" size="sm">
				Reset to 00:00
			</Button>
		</Stack>
	);
}

export const DedicatedHookIntegration: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Demonstrates explicit integration with the companion useTimer hook and external reset control.',
			},
		},
	},
	render: () => <DedicatedHookDemo />,
};
