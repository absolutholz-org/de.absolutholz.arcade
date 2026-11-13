export const ROOM_NAMESPACE = 'ah-arcade-';
export const PERSISTENT_PEER_ID_STORAGE_KEY = 'arcade-persistent-peer-id';

const ALPHANUMERIC_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

export function generateRoomCode(): string {
	let code = Math.random().toString(36).substring(2, 8).toLowerCase();
	while (code.length < 6) {
		const randomIndex = Math.floor(Math.random() * ALPHANUMERIC_CHARS.length);
		code += ALPHANUMERIC_CHARS[randomIndex];
	}
	return code.slice(0, 6);
}

export function toPeerId(shortCode: string): string {
	const cleaned = extractRoomCode(shortCode);
	if (cleaned.startsWith(ROOM_NAMESPACE)) {
		return cleaned;
	}
	return `${ROOM_NAMESPACE}${cleaned}`;
}

export function extractRoomCode(input: string): string {
	const trimmed = input.trim();
	if (!trimmed) {
		return '';
	}

	// Match ?room=XXXXXX or &room=XXXXXX in query string or full URL
	const queryMatch = trimmed.match(/[?&]room=([a-zA-Z0-9_-]+)/i);
	if (queryMatch?.[1]) {
		return queryMatch[1].trim().toLowerCase();
	}

	// Match /room/XXXXXX in URL path or pathname
	const pathMatch = trimmed.match(/\/room\/([a-zA-Z0-9_-]+)/i);
	if (pathMatch?.[1]) {
		return pathMatch[1].trim().toLowerCase();
	}

	// Strip namespace prefix if user pasted full peer ID
	const lower = trimmed.toLowerCase();
	if (lower.startsWith(ROOM_NAMESPACE)) {
		return lower.slice(ROOM_NAMESPACE.length);
	}

	return lower;
}

function createFallbackUuid(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return `peer-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`;
}

export function getOrCreatePersistentPeerId(): string {
	if (typeof window === 'undefined') {
		return createFallbackUuid();
	}

	try {
		const existing = window.localStorage.getItem(PERSISTENT_PEER_ID_STORAGE_KEY);
		if (existing && existing.trim().length > 0) {
			return existing.trim();
		}
		const created = createFallbackUuid();
		window.localStorage.setItem(PERSISTENT_PEER_ID_STORAGE_KEY, created);
		return created;
	} catch {
		return createFallbackUuid();
	}
}
