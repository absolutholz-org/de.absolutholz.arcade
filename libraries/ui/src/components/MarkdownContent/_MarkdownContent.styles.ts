import { styled } from '@linaria/react';
import { space } from '../../styles/spacing';

export const MarkdownContent = styled.article`
	color: var(--color-text-1);
	display: flex;
	flex-direction: column;
	margin-inline: auto;
	padding-inline: var(--page-content-padding, ${space('xl')});
	width: 100%;

	&[data-variant='standard'] {
		max-width: 48rem;
	}

	&[data-variant='wide'] {
		max-width: 64rem;
	}

	&[data-variant='full'] {
		max-width: 100%;
	}

	/* Headings */
	& h1 {
		color: var(--color-text-1);
		font-size: 2.25rem;
		font-weight: 800;
		line-height: 1.2;
		margin-bottom: ${space('lg')};
	}

	& h2 {
		border-bottom: 1px solid var(--color-container-2);
		color: var(--color-text-1);
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.3;
		margin-top: ${space('xl')};
		margin-bottom: ${space('sm')};
		padding-bottom: ${space('xs')};
	}

	& h3 {
		color: var(--color-text-1);
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.4;
		margin-top: ${space('lg')};
		margin-bottom: ${space('xs')};
	}

	& h4,
	& h5,
	& h6 {
		color: var(--color-text-1);
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.5;
		margin-top: ${space('md')};
		margin-bottom: ${space('xs')};
	}

	/* Paragraphs & Core Text */
	& p {
		color: var(--color-text-1);
		line-height: 1.6;
		margin-bottom: ${space('md')};
	}

	& strong {
		color: var(--color-text-1);
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
		color: var(--color-text-1);
		line-height: 1.6;
		margin-bottom: ${space('xs')};

		&::marker {
			color: var(--color-accent);
		}
	}

	/* Blockquotes & Callout / Tip Boxes */
	& blockquote,
	& aside {
		background: var(--color-container-1);
		border-left: 4px solid var(--color-accent);
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
		color: var(--color-text-1);
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
	& code {
		background: var(--color-container-1);
		border-radius: var(--radius-sm);
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.875em;
		padding: 0.125rem 0.375rem;
	}

	& pre {
		background: var(--color-container-1);
		border: 1px solid var(--color-container-2);
		border-radius: var(--radius-md);
		margin-bottom: ${space('lg')};
		overflow-x: auto;
		padding: ${space('md')};

		& code {
			background: transparent;
			padding: 0;
		}
	}

	/* Horizontal Dividers */
	& hr {
		border: none;
		border-top: 1px solid var(--color-container-2);
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
		border-bottom: 1px solid var(--color-container-2);
		padding: ${space('sm')} ${space('md')};
		text-align: left;
	}

	& th {
		border-bottom: 2px solid var(--color-container-2);
		color: var(--color-text-1);
		font-weight: 700;
	}

	/* Eliminate trailing bottom margin on the final direct child */
	& > :last-child {
		margin-bottom: 0;
	}
`;
