/**
 * Computes initials from a user display name according to the following logic:
 * - If two or more words (e.g., "Jane Doe"), use the first letter of each ("JD").
 * - If a single name (e.g., "Woody"), use the first two characters uppercase ("WO").
 * - Fallback to null if no valid name is available (for guest / unauthenticated).
 */
export function getInitials(name?: string | null): string | null {
	if (!name) return null;
	const trimmed = name.trim();
	if (!trimmed) return null;

	const words = trimmed.split(/\s+/).filter(Boolean);
	if (words.length >= 2) {
		return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
	}

	if (words.length === 1 && words[0].length > 0) {
		return words[0].slice(0, 2).toUpperCase();
	}

	return null;
}
