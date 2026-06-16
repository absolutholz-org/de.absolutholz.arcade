import { css } from '@emotion/react';
import styled from '@emotion/styled';
import type { SpacingKey } from '../../styles/spacing/spacing.utils';
import { space } from '../../styles/spacing/spacing.utils';

const baseCarouselStyles = css`
	display: flex;
	overflow-x: auto;
	overflow-y: hidden;
	scroll-snap-type: x mandatory;
	scroll-behavior: smooth;
	scrollbar-width: none;
	padding-block: ${space('lg')};
	margin-block: calc(-1 * ${space('lg')});

	&::-webkit-scrollbar {
		display: none;
	}

	> * {
		flex-shrink: 0;
		scroll-snap-align: start;
	}
`;

export const Carousel = styled.div<{ $gap: SpacingKey }>`
	${baseCarouselStyles}
	gap: ${({ $gap }) => space($gap)};
	width: 100%;
	scroll-padding-left: 0;
`;

export const FullBleedCarousel = styled.div<{ $gap: SpacingKey }>`
	${baseCarouselStyles}
	gap: ${({ $gap }) => space($gap)};

	--scrollable-container-margin: max(
		var(--page-content-padding, var(--space-xl)),
		calc(
			50% - (var(--page-content-max-width, 80rem) / 2) +
				var(--page-content-padding, var(--space-xl))
		)
	);

	width: 100vw;
	margin-inline: calc(50% - 50vw);
	scroll-padding-left: var(--scrollable-container-margin);

	> :first-of-type {
		margin-left: var(--scrollable-container-margin);
	}

	> :last-of-type {
		margin-right: var(--scrollable-container-margin);
	}
`;
