import { styled } from '@linaria/react';
import { spacingKeys } from '../../styles/spacing';

const spacingRules = spacingKeys
	.map((key) => `&[data-spacing='${key}'] { --stack-gap: ${key === 'none' ? '0' : `var(--space-${key})`}; }`)
	.join('\n\t');

const crossSpacingRules = spacingKeys
	.map(
		(key) =>
			`&[data-cross-spacing='${key}'] { --stack-cross-gap: ${key === 'none' ? '0' : `var(--space-${key})`}; }`,
	)
	.join('\n\t');

export const Stack = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
	flex-wrap: nowrap;
	width: 100%;
	--stack-gap: var(--space-md);
	gap: var(--stack-gap);

	/* Inline modifier */
	&[data-inline='true'] {
		display: inline-flex;
		width: auto;
	}

	/* Full width modifier */
	&[data-full-width='false'] {
		width: auto;
	}

	/* Wrap modifier */
	&[data-wrap='true'] {
		flex-wrap: wrap;
	}

	/* Flex Direction & Gap axis resolution */
	&[data-direction='column'] {
		flex-direction: column;
		gap: var(--stack-gap) var(--stack-cross-gap, var(--stack-gap));
	}

	&[data-direction='row'] {
		flex-direction: row;
		gap: var(--stack-cross-gap, var(--stack-gap)) var(--stack-gap);
	}

	&[data-direction='column-reverse'] {
		flex-direction: column-reverse;
		gap: var(--stack-gap) var(--stack-cross-gap, var(--stack-gap));
	}

	&[data-direction='row-reverse'] {
		flex-direction: row-reverse;
		gap: var(--stack-cross-gap, var(--stack-gap)) var(--stack-gap);
	}

	/* Cross-axis Alignment */
	&[data-align='stretch'] {
		align-items: stretch;
	}
	&[data-align='start'] {
		align-items: flex-start;
	}
	&[data-align='end'] {
		align-items: flex-end;
	}
	&[data-align='center'] {
		align-items: center;
	}
	&[data-align='baseline'] {
		align-items: baseline;
	}

	/* Main-axis Justify */
	&[data-justify='start'] {
		justify-content: flex-start;
	}
	&[data-justify='end'] {
		justify-content: flex-end;
	}
	&[data-justify='center'] {
		justify-content: center;
	}
	&[data-justify='between'] {
		justify-content: space-between;
	}
	&[data-justify='around'] {
		justify-content: space-around;
	}
	&[data-justify='evenly'] {
		justify-content: space-evenly;
	}

	/* Spacing rules */
	${spacingRules}

	/* Cross-spacing rules */
	${crossSpacingRules}
`;
