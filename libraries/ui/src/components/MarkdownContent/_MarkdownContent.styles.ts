import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';
import { generateFontShorthand } from '../Text/_Text.functions';
import { themeColor } from '../../styles/theme/theme.utils';

export const MarkdownContent = styled.article`
	max-width: 75ch;

	/* Headings */
	& h1 {
		font: ${generateFontShorthand('h1', 'bold')};
		margin-bottom: ${space('lg')};
	}

	& h2 {
		border-bottom: 1px solid ${themeColor('container-2')};
		font: ${generateFontShorthand('h2', 'bold')};
		margin-block: ${space('xl')} ${space('sm')};
		padding-bottom: ${space('xs')};
	}

	& h3 {
		font: ${generateFontShorthand('h3', 'bold')};
		margin-block: ${space('lg')} ${space('xs')};
	}

	& h4,
	& h5,
	& h6 {
		font: ${generateFontShorthand('base', 'regular')};
		margin-block: ${space('md')} ${space('xs')};
	}

	/* Paragraphs & Core Text */
	& p {
		line-height: 1.6;
		margin-bottom: ${space('md')};
	}

	& strong {
		font-weight: 700;
	}

	& em {
		font-style: italic;
	}

	/* Lists */
	& ul,
	& ol {
		margin-bottom: ${space('lg')};
		padding-left: ${space('lg')};
	}

	& ul {
		list-style-type: disc;
	}

	& ol {
		list-style-type: decimal;
	}

	& li {
		line-height: 1.6;
		margin-bottom: ${space('xs')};

		&::marker {
			color: ${themeColor('accent')};
		}
	}

	/* Blockquotes & Callout / Tip Boxes */
	& blockquote,
	& aside {
		background: ${themeColor('container-1')};
		border-left: 4px solid ${themeColor('accent')};
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
		color: ${themeColor('text-1')};
		margin-top: ${space('lg')};
		margin-bottom: ${space('lg')};
		padding: ${space('md')} ${space('lg')};

		& > :first-child {
			margin-top: 0;
		}

		& > :last-child {
			margin-bottom: 0;
		}

		& p {
			color: inherit;
		}
	}

	/* Code Blocks & Inline Code */
	/* & code {
		background: ${themeColor('container-1')};
		border-radius: var(--radius-sm);
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.875em;
		padding: 0.125rem 0.375rem;
	} */

	/* & pre {
		background: ${themeColor('container-1')};
		border: 1px solid ${themeColor('container-2')};
		border-radius: var(--radius-md);
		margin-bottom: ${space('lg')};
		overflow-x: auto;
		padding: ${space('md')};

		& code {
			background: transparent;
			padding: 0;
		}
	} */

	/* Horizontal Dividers */
	& hr {
		border: none;
		border-top: 1px solid ${themeColor('container-2')};
		margin: ${space('xl')} 0;
	}

	/* Tables */
	& table {
		border-collapse: collapse;
		margin-bottom: ${space('lg')};
		width: 100%;
	}

	& th,
	& td {
		border-bottom: 1px solid ${themeColor('container-2')};
		padding: ${space('sm')} ${space('md')};
		text-align: left;
	}

	& th {
		border-bottom: 2px solid ${themeColor('container-2')};
		color: var(--color-text-1);
		font-weight: 700;
	}

	/* Eliminate trailing bottom margin on the final direct child */
	& > :last-child {
		margin-bottom: 0;
	}
`;
