import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { space, type SpacingKey } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';

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

const scrollButtonCommonStyles = css`
	&::scroll-button(*) {
		align-items: center;
		background-color: ${themeColor('surface')};
		border: 1px solid ${themeColor('container-2')};
		border-radius: 50%;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		color: ${themeColor('text-1')};
		cursor: pointer;
		display: flex;
		font-family: inherit;
		font-size: 1.5rem;
		font-weight: 500;
		height: 2.75rem;
		justify-content: center;
		transition:
			background-color 0.25s ease,
			color 0.25s ease,
			border-color 0.25s ease,
			transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.25s ease;
		width: 2.75rem;
		z-index: 10;
	}

	&::scroll-button(*):hover:not(:disabled) {
		background-color: ${themeColor('container-1')};
		border-color: ${themeColor('accent')};
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
		color: ${themeColor('accent')};
		transform: scale(1.08);
	}

	&::scroll-button(*):active:not(:disabled) {
		transform: scale(0.95);
	}

	&::scroll-button(*):disabled {
		box-shadow: none;
		cursor: not-allowed;
		opacity: 0.25;
	}

	&::scroll-button(*):focus-visible {
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}
`;

const standardScrollButtonStyles = css`
	${scrollButtonCommonStyles}
	anchor-name: --carousel-standard;

	&::scroll-button(left) {
		align-self: center;
		bottom: anchor(bottom);
		content: attr(data-scroll-prev) / attr(data-scroll-prev-label);
		left: calc(anchor(left) + 1rem);
		position: absolute;
		position-anchor: --carousel-standard;
		top: anchor(top);
	}

	&::scroll-button(right) {
		align-self: center;
		bottom: anchor(bottom);
		content: attr(data-scroll-next) / attr(data-scroll-next-label);
		left: calc(anchor(right) - 3.75rem);
		position: absolute;
		position-anchor: --carousel-standard;
		top: anchor(top);
	}
`;

const fullBleedScrollButtonStyles = css`
	${scrollButtonCommonStyles}
	anchor-name: --carousel-full-bleed;

	&::scroll-button(left) {
		align-self: center;
		bottom: anchor(bottom);
		content: attr(data-scroll-prev) / attr(data-scroll-prev-label);
		left: calc(
			anchor(left) + var(--scrollable-container-margin, 1.5rem) + 1rem
		);
		position: absolute;
		position-anchor: --carousel-full-bleed;
		top: anchor(top);
	}

	&::scroll-button(right) {
		align-self: center;
		bottom: anchor(bottom);
		content: attr(data-scroll-next) / attr(data-scroll-next-label);
		left: calc(
			anchor(right) - var(--scrollable-container-margin, 1.5rem) - 3.75rem
		);
		position: absolute;
		position-anchor: --carousel-full-bleed;
		top: anchor(top);
	}
`;

const scrollMarkerCommonStyles = css`
	scroll-marker-group: after;

	&::scroll-marker-group {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: ${space('xs')};
		z-index: 10;
		height: ${space('lg')};
	}

	> *::scroll-marker {
		content: '';
		display: inline-block;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 0.25rem;
		background-color: ${themeColor('text-1')};
		opacity: 0.35;
		cursor: pointer;
		transition:
			width 0.3s cubic-bezier(0.25, 1, 0.5, 1),
			opacity 0.3s ease,
			background-color 0.3s ease,
			transform 0.3s ease;
	}

	> *::scroll-marker:hover {
		opacity: 0.75;
		transform: scale(1.2);
	}

	> *::scroll-marker:target-current {
		width: 1.25rem;
		background-color: ${themeColor('accent')};
		opacity: 1;
		transform: scale(1);
	}
`;

const standardScrollMarkerStyles = css`
	${scrollMarkerCommonStyles}
	anchor-name: --carousel-standard;

	&::scroll-marker-group {
		position: absolute;
		position-anchor: --carousel-standard;
		top: calc(anchor(bottom) - ${space('xs')});
		left: anchor(left);
		right: anchor(right);
		justify-self: center;
	}
`;

const fullBleedScrollMarkerStyles = css`
	${scrollMarkerCommonStyles}
	anchor-name: --carousel-full-bleed;

	&::scroll-marker-group {
		position: absolute;
		position-anchor: --carousel-full-bleed;
		top: calc(anchor(bottom) - ${space('xs')});
		left: anchor(left);
		right: anchor(right);
		justify-self: center;
	}
`;

export const Carousel = styled.div<{
	$gap: SpacingKey;
	$scrollButtons?: boolean;
	$scrollMarkers?: boolean;
}>`
	${baseCarouselStyles}
	gap: ${({ $gap }) => space($gap)};
	scroll-padding-left: 0;
	width: 100%;

	${({ $scrollButtons }) => $scrollButtons && standardScrollButtonStyles}
	${({ $scrollMarkers }) => $scrollMarkers && standardScrollMarkerStyles}
	${({ $scrollMarkers }) =>
		$scrollMarkers &&
		css`
			margin-bottom: ${space('lg')};
		`}
`;

export const FullBleedCarousel = styled.div<{
	$gap: SpacingKey;
	$scrollButtons?: boolean;
	$scrollMarkers?: boolean;
}>`
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

	${({ $scrollButtons }) => $scrollButtons && fullBleedScrollButtonStyles}
	${({ $scrollMarkers }) => $scrollMarkers && fullBleedScrollMarkerStyles}
	${({ $scrollMarkers }) =>
		$scrollMarkers &&
		css`
			margin-bottom: ${space('lg')};
		`}
`;
