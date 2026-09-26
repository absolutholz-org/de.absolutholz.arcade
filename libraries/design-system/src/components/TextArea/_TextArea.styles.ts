import styled from '@emotion/styled';
import { radius } from '../../styles/radius/radius.utils';
import { space } from '../../styles/spacing';
import { themeColor } from '../../styles/theme/theme.utils';
import type { TextAreaResize } from './_TextArea.types';

interface StyledTextAreaProps {
	$resize: TextAreaResize;
}

export const TextArea = styled.textarea<StyledTextAreaProps>`
	background-color: ${themeColor('container-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: ${radius('md')};
	color: ${themeColor('text-1')};
	field-sizing: content;
	font-family: inherit;
	font-size: var(--font-size-base);
	line-height: var(--line-height-base);
	min-block-size: 5lh;
	padding: ${space('sm')} ${space('md')};
	resize: ${({ $resize }) => $resize};
	transition:
		background-color 0.2s ease-in-out,
		border-color 0.2s ease-in-out,
		outline 0.2s ease-in-out;
	width: 100%;

	&::placeholder {
		color: ${themeColor('text-3')};
		opacity: 1;
	}

	&:hover:not(:disabled):not(:read-only) {
		border-color: ${themeColor('accent')};
	}

	&:focus-visible {
		border-color: ${themeColor('accent')};
		outline: 2px solid ${themeColor('accent')};
		outline-offset: 2px;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	&:read-only {
		cursor: default;
		opacity: 0.8;
	}

	&[aria-invalid='true'] {
		border-color: #d32f2f;
		outline-color: #d32f2f;
	}
`;
