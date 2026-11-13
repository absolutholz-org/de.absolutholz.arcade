# ADR-0011: Multiplayer Architecture and Engine for Turn-Based Arcade Games

**Status:** Accepted  
**Context:** Absolute Holz Arcade (`arcade.absolutholz.de`)  
**Scope:** `@arcade/lib-multiplayer`, `@arcade/lib-game-core`, game applications under `apps/` (initial pilot: `apps/tictactoe`)

---

## 1. Context & Baseline Principles

The Absolute Holz Arcade is introducing multiplayer gaming, starting with two-player Tic-Tac-Toe under `apps/` as the architectural pilot, with Yahtzee and Dominoes following.

To maintain simplicity, speed of execution, and privacy compliance, the following baseline decisions are finalized:

1. **Clean Mode Separation (No Hybrid Local/Remote):**
    - Games are explicitly either **Local Multiplayer (Pass-and-Play)** or **Remote Multiplayer (Networked)**.
    - Mixing local participants and remote peers in the same session is intentionally excluded to simplify turn coordination, UI state, and connection models.
2. **Zero-Network Local Mode:**
    - Local Pass-and-Play runs 100% in-memory with zero WebRTC, zero signaling, and zero network calls. It is completely instant and works entirely offline.
3. **P2P Star Topology via PeerJS & EU-First ICE:**
    - Remote play uses WebRTC DataChannels in an authoritative Host-Guest star topology ($O(N)$ connections).
    - Signaling uses public PeerJS (`0.peerjs.com:443`) under Art. 6 (1) (f) GDPR legitimate technical necessity (no game state or moves ever touch signaling).
    - ICE resolution prioritizes German STUN relays (`stun.1und1.de:3478`, `stun.hosteurope.de:3478`) with authenticated Metered.ca TURN fallback covered under the EU-Canada Adequacy Decision.
4. **Resilient & Extended Play (No Premature Disconnects):**
    - Turn-based matches may unfold over minutes or hours.
    - The aggressive 15-second severance timer from the planning-poker blueprint is removed.
    - Both host and guest persist their active match state in `localStorage` and can reconnect transparently when a tab is reopened, backgrounded, or refreshed.
5. **Human-Friendly Room Codes:**
    - Users see and share a concise 6-character code (e.g., `k7m2p9`).
    - Under the hood, PeerJS registers namespaced identifiers (e.g., `ah-arcade-k7m2p9`) to eliminate global collision risk on public signaling brokers.

---

## 2. User Journey & Screen States

### 2.1 Screen State Flow

```
+--------------------------------------------------------------+
|                    1. Mode Selection                         |
|                                                              |
|        [ Pass & Play ]              [ Online ]               |
+---------------+------------------------------+---------------+
                |                              |
                v                              v
+-------------------------------+ +-------------------------------+
|  2A. Local Match Setup        | |  2B. Online Lobby Form        |
|                               | |                               |
|  Player 1 (X): [ Guest      ] | |  Your Name: [ Guest         ] |
|  Player 2 (O): [ Player 2   ] | |                               |
|                               | |  "Join via room code?"        |
|  [ Start Game ]               | |  (Or expanded Room Code input)|
|                               | |                               |
|                               | |  [ Host a Session -> ]        |
|                               | |  (Or [ Join Session -> ] if   |
|                               | |   code is entered / in URL)   |
|                               | |                               |
|                               | |  [ (i) How it works & Privacy]|
+---------------+---------------+ +---------------+---------------+
                |                                 |
                +----------------+----------------+
                                 |
                                 v
+-----------------------------------------------------------------+
|                        3. Active Game Screen                    |
|                                                                 |
|   Header: Guest (X) vs Player 2 (O) | Share Link / Room Status  |
|   Turn Status: "Guest's Turn (X)"                               |
|                                                                 |
|                          [   |   |   ]                          |
|                          [---+---+---]                          |
|                          [   | X |   ]                          |
|                          [---+---+---]                          |
|                          [   |   | O ]                          |
|                                                                 |
+--------------------------------+--------------------------------+
                                 |
                                 v
+-----------------------------------------------------------------+
|                       4. Game Over Dialog                       |
|                                                                 |
|   "Guest Wins!" / "Match Drawn"                                 |
|   [ Back to Menu ]                      [ Play Again ]          |
+-----------------------------------------------------------------+
```

### 2.2 Online Lobby Form Specification (Adapted from P2P Planning Poker)

When the user switches the Segmented Control to **Online** (or arrives via a deep link `?room=XXXXXX`), the form renders the progressive-disclosure Lobby pattern:

1. **Your Name Input:**
    - Pre-populated from the arcade user profile (`useUserProfile().name`, defaulting to `"Guest"`).
2. **Progressive Room Code Field:**
    - **Default State (No URL `room` param):** Displays a clean text button: `"Join via room code?"`.
    - **Expanded State (Clicked toggle):** Reveals the `"ROOM CODE (OPTIONAL)"` input with placeholder `"Enter code or leave blank to host"`.
    - **Smart URL Parsing (`extractRoomCode`):** If a user pastes a full invite URL (`https://arcade.absolutholz.de/tictactoe/en/?room=k7m2p9`) into the Room Code input, it automatically strips the URL and extracts `k7m2p9`.
    - **Deep-Link State (`?room=k7m2p9` in URL):** If accessed directly via a shared link, the room code is automatically set, the mode switches to **Online**, and the CTA defaults to joining that room.
3. **Dynamic Primary CTA Button:**
    - When Room Code is empty: **`Host a Session`** (creates a 6-character code, sets role to `host`, and opens the room).
    - When Room Code has value: **`Join Session`** (sets role to `guest` and connects to the host's room).
4. **Host Disclaimer & Privacy Disclosure:**
    - Subtle disclaimer below the button: _"As the host, you hold the only copy of this session."_
    - Collapsible **`How it works & Privacy`** disclosure explaining:
        - **Serverless & Private:** WebRTC connects directly between browsers; game moves never touch a server.
        - **Session Persistence:** State is kept locally in the browser for the duration of the match.

---

## 3. Disconnection, Backgrounding, and Extended Play

Unlike real-time fast-twitch games or strict conference tools, casual turn-based board games need to survive mobile screen locks, background tab pausing, and slow turn responses.

1. **State Persistence in Storage:**
    - Every time `state` updates, the Host backs up `{ roomId, state, users }` to storage.
    - Guests persist their `peerId` UUID in `localStorage` (`getOrCreatePersistentId`) so refreshing the browser re-identifies them into their existing player slot (`X` or `O`) rather than adding a 3rd spectator.
2. **Heartbeat for Presence (Without Destructive Severance):**
    - The Host sends a `HEARTBEAT` pulse every `5000ms`.
    - If a peer's connection drops or times out, their entry in `users` is marked `isConnected: false` and the UI displays an unobtrusive status badge (_"Opponent offline — waiting to reconnect"_), allowing them to rejoin using the same link at any time.

---

## 4. Technical Architecture & Monorepo Boundaries

Games are located under `apps/` while reusable logic resides in shared libraries.

### 4.1 Core Hook Architecture (`useHostSession` & `useGuestSession`)

Ported directly from the proven Scrum Poker architecture and generalized for turn-based reducers:

- **`useHostSession<TState, TAction>`:**
    - Registers `new Peer(toPeerId(roomId), { config: { iceServers } })`.
    - Maintains `connectionsRef = useRef<Map<string, DataConnection>>(new Map())`.
    - Handles `JOIN_ROOM` (reconnecting existing `conn.peer` UUIDs or adding new players up to `maxPlayers`).
    - Processes incoming `GAME_ACTION` payloads through the game's pure reducer using functional state updates `setRoomState((prevState) => ...)` to prevent stale closures, then broadcasts `SYNC_STATE` to all open connections.
    - Runs the 5-second `HEARTBEAT` interval.
- **`useGuestSession<TState, TAction>`:**
    - Generates/reads a persistent UUID from `localStorage`.
    - Registers `new Peer(persistentId, { config: { iceServers } })`.
    - Inside `peer.on('open')` (preventing race conditions), calls `peer.connect(toPeerId(roomId))`.
    - Sends `JOIN_ROOM` on open, listens for `SYNC_STATE`, and exposes `sendAction(action)`.

### 4.2 Namespaced Room IDs & Smart Code Extractor

```typescript
const ROOM_NAMESPACE = "ah-arcade-";

export function toPeerId(shortCode: string): string {
	return `${ROOM_NAMESPACE}${shortCode.trim().toLowerCase()}`;
}

export function extractRoomCode(input: string): string {
	const trimmed = input.trim();
	if (!trimmed) return "";
	try {
		if (trimmed.includes("://") || trimmed.includes("?")) {
			const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
			const roomParam = url.searchParams.get("room");
			if (roomParam) return roomParam.trim().toLowerCase();
			const parts = url.pathname.split("/").filter(Boolean);
			return (parts[parts.length - 1] || trimmed).toLowerCase();
		}
	} catch {
		// Fallback to raw input
	}
	return trimmed.toLowerCase();
}
```
