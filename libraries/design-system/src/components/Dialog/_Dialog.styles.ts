import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { space } from '../../styles/spacing/spacing.utils';

export const fadeIn = keyframes`
	from { opacity: 0; }
	to { opacity: 1; }
`;

export const fadeOut = keyframes`
	from { opacity: 1; }
	to { opacity: 0; }
`;

export const slideUp = keyframes`
	from { opacity: 0; transform: scale(0.95) translateY(0.625rem); }
	to { opacity: 1; transform: scale(1) translateY(0); }
`;

export const slideDown = keyframes`
	from { opacity: 1; transform: scale(1) translateY(0); }
	to { opacity: 0; transform: scale(0.95) translateY(0.625rem); }
`;

export const DialogBase = styled.dialog`
	background: transparent;
	border: none;
	margin: auto;
	max-width: 40rem;
	overflow: visible;
	padding: 0;
	width: calc(100% - 2rem);

	&::backdrop {
		animation: ${fadeIn} 0.3s ease-out forwards;
		backdrop-filter: blur(2px);
		background-color: rgba(0, 0, 0, 0.5);
	}

	&[open] {
		animation: ${slideUp} 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	&[data-closing='true'] {
		animation: ${slideDown} 0.2s ease-in forwards;

		&::backdrop {
			animation: ${fadeOut} 0.2s ease-in forwards;
		}
	}

	&:focus-visible {
		outline: none;
	}
`;

export const DialogContainer = styled.div`
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	box-shadow:
		0 10px 25px -5px rgba(0, 0, 0, 0.1),
		0 8px 10px -6px rgba(0, 0, 0, 0.1);
	color: var(--color-text-1);
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

export const DialogHeader = styled.div`
	align-items: center;
	background-color: transparent;
	border-bottom: 1px solid var(--color-container-2);
	display: flex;
	justify-content: space-between;
	padding: ${space('lg')};
`;

export const DialogTitle = styled.h2`
	color: var(--color-text-1);
	font-size: var(--font-size-h2);
	font-weight: 700;
	line-height: var(--line-height-h2);
	margin: 0;
`;

export const CloseButton = styled.button`
	align-items: center;
	background: transparent;
	border: none;
	color: var(--color-text-2);
	cursor: pointer;
	display: flex;
	justify-content: center;
	padding: ${space('sm')};
	transition: all 0.2s;

	&:hover {
		background-color: var(--color-container-1);
		color: var(--color-text-1);
	}

	&:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: -3px;
	}
`;

export const DialogContent = styled.div`
	color: var(--color-text-2);
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);
	padding: ${space('lg')};

	p {
		margin: 0;
	}
`;

export const DialogFooter = styled.div`
	padding: 0 ${space('lg')} ${space('lg')} ${space('lg')};
`;

export const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
	background-color: ${({ $variant }) =>
		$variant === 'primary' ? 'var(--color-accent)' : 'transparent'};
	border: ${({ $variant }) =>
		$variant === 'primary' ? 'none' : '1px solid var(--color-container-2)'};
	color: ${({ $variant }) =>
		$variant === 'primary'
			? 'var(--color-accent-contrast)'
			: 'var(--color-text-1)'};
	cursor: pointer;
	font-weight: 500;
	padding: 8px 16px;
	transition: all 0.2s ease-in-out;

	&:hover {
		background-color: ${({ $variant }) =>
			$variant === 'primary'
				? 'var(--color-accent)'
				: 'var(--color-container-1)'};
		opacity: 0.9;
	}

	&:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: -3px;
	}
`;
