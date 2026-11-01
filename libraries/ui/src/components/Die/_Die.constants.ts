export const DIE_FACES = [1, 2, 3, 4, 5, 6] as const;

export type DieFaceValue = (typeof DIE_FACES)[number];

/**
 * 3x3 grid slot mappings (1 through 9) active for each face of a standard D6:
 * [ 1, 2, 3 ]
 * [ 4, 5, 6 ]
 * [ 7, 8, 9 ]
 */
export const FACE_PIP_SLOTS: Record<DieFaceValue, readonly number[]> = {
	1: [5],
	2: [1, 9],
	3: [1, 5, 9],
	4: [1, 3, 7, 9],
	5: [1, 3, 5, 7, 9],
	6: [1, 3, 4, 6, 7, 9],
} as const;
