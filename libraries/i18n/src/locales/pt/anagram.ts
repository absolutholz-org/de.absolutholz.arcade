import type { AnagramTranslationContract } from '../../schemas/anagram.schema.js';
import { enAnagram } from '../en/anagram.js';

// English placeholder until the pt translation is approved.
export const ptAnagram: AnagramTranslationContract = {
	...enAnagram,
	description: 'Forme palavras válidas com as letras antes que o tempo se esgote.',
};
