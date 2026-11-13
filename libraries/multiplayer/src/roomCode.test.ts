import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	ROOM_NAMESPACE,
	extractRoomCode,
	generateRoomCode,
	getOrCreatePersistentPeerId,
	toPeerId,
} from './roomCode.ts';

describe('@arcade/lib-multiplayer - roomCode utilities', () => {
	it('generates a 6-character lowercase alphanumeric room code', () => {
		const code = generateRoomCode();
		assert.equal(code.length, 6);
		assert.match(code, /^[a-z0-9]{6}$/);
	});

	it('formats short codes into namespaced Peer IDs via toPeerId', () => {
		assert.equal(toPeerId('k7m2p9'), `${ROOM_NAMESPACE}k7m2p9`);
		assert.equal(toPeerId('  K7M2P9  '), `${ROOM_NAMESPACE}k7m2p9`);
		assert.equal(toPeerId('https://arcade.absolutholz.de/tictactoe/en/?room=k7m2p9'), `${ROOM_NAMESPACE}k7m2p9`);
	});

	it('extracts room codes from raw strings, query strings, and full invite URLs', () => {
		assert.equal(extractRoomCode('k7m2p9'), 'k7m2p9');
		assert.equal(extractRoomCode('  K7M2P9 '), 'k7m2p9');
		assert.equal(extractRoomCode('https://arcade.absolutholz.de/tictactoe/en/?room=k7m2p9'), 'k7m2p9');
		assert.equal(extractRoomCode('?room=AbC123&mode=online'), 'abc123');
		assert.equal(extractRoomCode('https://arcade.absolutholz.de/tictactoe/room/x9y8z7'), 'x9y8z7');
		assert.equal(extractRoomCode('/room/M4N5P6'), 'm4n5p6');
	});

	it('creates a valid persistent peer ID in non-browser environments', () => {
		const id = getOrCreatePersistentPeerId();
		assert.ok(typeof id === 'string' && id.length > 0);
	});
});
