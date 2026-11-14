import type { AnagramTranslationContract } from '../../schemas/anagram.schema.js';
import { enAnagram } from '../en/anagram.js';

// English placeholder until the fr translation is approved.
export const frAnagram: AnagramTranslationContract = {
	...enAnagram,
	description: 'Formez des mots valides avec vos lettres avant la fin du temps imparti.',
};
