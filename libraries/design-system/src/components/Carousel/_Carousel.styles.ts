import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { space, type SpacingKey } from '../../styles/spacing';

const baseCarouselStyles = css`
	display: flex;
	margin-block: calc(-1 * ${space('lg')});
	overflow-x: auto;
	overflow-y: hidden;
	padding-block: ${space('lg')};
	scroll-behavior: smooth;
	scroll-snap-type: x mandatory;
	scrollbar-width: none;

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
	scroll-padding-left: 0;
	width: 100%;
`;

export const FullBleedCarousel = styled.div<{ $gap: SpacingKey }>`
	${baseCarouselStyles}
	--scrollable-container-margin: max(
		var(--page-content-padding, var(--space-xl)),
		calc(
			50% - (var(--page-content-max-width, 80rem) / 2) +
				var(--page-content-padding, var(--space-xl))
		)
	);

	gap: ${({ $gap }) => space($gap)};

	margin-inline: calc(50% - 50vw);
	scroll-padding-left: var(--scrollable-container-margin);
	width: 100vw;

	> :first-of-type {
		margin-left: var(--scrollable-container-margin);
	}

	> :last-of-type {
		margin-right: var(--scrollable-container-margin);
	}
`;
