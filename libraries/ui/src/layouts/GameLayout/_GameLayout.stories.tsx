import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { GameHeader } from '../../components/GameHeader';
import { Icon } from '../../components/Icon';
import { Timer } from '../../components/Timer';
import { GameLayout } from './_GameLayout';

const meta = {
	title: 'Layouts/GameLayout',
	component: GameLayout,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof GameLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

function SudokuBoardPlaceholder() {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
				aspectRatio: '1 / 1',
				width: 'min(70vh, 26rem)',
				gap: '1px',
				backgroundColor: 'var(--color-container-2)',
				border: '2px solid var(--color-border)',
				borderRadius: 'var(--radius-md)',
				padding: '2px',
				boxSizing: 'border-box',
			}}
		>
			{Array.from({ length: 81 }, (_, i) => `cell-${i}`).map((cellId, i) => {
				const isClue = i % 7 === 0 || i % 11 === 0;
				const clueVal = (i % 9) + 1;
				return (
					<div
						key={cellId}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: 'var(--color-surface)',
							fontSize: '0.875rem',
							fontWeight: isClue ? 700 : 400,
							color: isClue ? 'var(--color-accent)' : 'var(--color-text-2)',
						}}
					>
						{isClue ? clueVal : ''}
					</div>
				);
			})}
		</div>
	);
}

function SudokuKeypadToolbar() {
	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				gap: 'var(--space-xs)',
				paddingInline: 'var(--space-md)',
			}}
		>
			{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
				<Button key={num} variant="secondary" size="md">
					{num}
				</Button>
			))}
			<Button variant="ghost" size="md" leadingIcon={<Icon name="undo" size="sm" />}>
				Undo
			</Button>
			<Button variant="ghost" size="md" leadingIcon={<Icon name="eraser" size="sm" />}>
				Erase
			</Button>
		</div>
	);
}

export const SudokuGame: Story = {
	args: {
		header: (
			<GameHeader
				backHref="/lobby"
				backLabel="Lobby"
				difficulty="Medium"
				timer={<Timer seconds={222} isPaused={false} />}
				onOpenSettings={() => {}}
			/>
		),
		children: <SudokuBoardPlaceholder />,
		toolbar: <SudokuKeypadToolbar />,
	},
};

export const WithStatusSubBar: Story = {
	args: {
		header: (
			<GameHeader
				backHref="/lobby"
				backLabel="Lobby"
				difficulty="Hard"
				timer={<Timer seconds={84} isPaused={false} />}
				onOpenSettings={() => {}}
			/>
		),
		status: (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingInline: 'var(--space-md)',
					paddingBlock: 'var(--space-2xs)',
					borderBottom: '1px solid var(--color-container-2)',
					backgroundColor: 'var(--color-surface)',
				}}
			>
				<div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
					<Badge variant="accent" size="sm">
						Lives: 3/3
					</Badge>
				</div>
				<div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
					<Badge variant="outline" size="sm">
						Moves: 14
					</Badge>
				</div>
			</div>
		),
		children: <SudokuBoardPlaceholder />,
		toolbar: <SudokuKeypadToolbar />,
	},
};

export const MobileViewport: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
	args: {
		header: (
			<GameHeader
				backHref="/lobby"
				backLabel="Lobby"
				difficulty="Easy"
				timer={<Timer seconds={42} isPaused={false} />}
				onOpenSettings={() => {}}
			/>
		),
		children: <SudokuBoardPlaceholder />,
		toolbar: <SudokuKeypadToolbar />,
	},
};
