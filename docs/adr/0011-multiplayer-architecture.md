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
    - Users see and share a concise 6-character code (e.g., `482-915` or `K7M2P9`).
    - Under the hood, PeerJS registers namespaced identifiers (e.g., `ah-arcade-482915`) to eliminate global collision risk on public signaling brokers.

---

## 2. User Journey & Screen States

### 2.1 Screen State Flow

```
+--------------------------------------------------------------+
|                    1. Match Setup Modal                      |
|                                                              |
|   "Play Tic-Tac-Toe"                                         |
|                                                              |
|   [ Option A: Same Device ]        [ Option B: Play Remote ] |
|   (Instant pass-and-play)          (Invite friend via link)  |
+-----------------------------+--------------------------------+
                              |
              +---------------+---------------+
              |                               |
              v                               v
+-------------------------------+ +-------------------------------+
|  2A. Local Match Init         | |  2B. Remote Host Lobby        |
|                               | |                               |
|  Player 1 (X): [ Dominic    ] | |  Room Code: [ 4 8 2 - 9 1 5 ] |
|  Player 2 (O): [ Dad        ] | |  [ Copy Link ] [ Show QR ]    |
|                               | |                               |
|  [ Start Game ]               | |  Status: Waiting for peer...  |
+---------------+---------------+ +---------------+---------------+
                |                                 |
                |                                 | (Guest clicks link)
                |                                 v
                |                 +-------------------------------+
                |                 |  2C. Remote Guest Landing     |
                |                 |                               |
                |                 |  "Join Dad's Room"            |
                |                 |  Your Name: [ Dominic ]       |
                |                 |  [ Connect & Play ]           |
                |                 +---------------+---------------+
                |                                 |
                +----------------+----------------+
                                 |
                                 v
+-----------------------------------------------------------------+
|                        3. Active Game Screen                    |
|                                                                 |
|   Header: Dominic (X) vs Dad (O)    | Connection: [ Live / Offline ]
|   Turn Status: "Dad's Turn"                                     |
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
|                       4. Game Over Overlay                      |
|                                                                 |
|   "Dominic Wins!"                                               |
|   [ Play Again ] (Swaps first turn)    [ Exit to Setup ]        |
+-----------------------------------------------------------------+
```

### 2.2 Screen Specifications

#### Screen 1: Match Setup Modal (`LobbyModeSelectModal`)

- **Trigger:** Initial launch of any multiplayer game or clicking "New Game".
- **Two distinct paths:**
    1. **Pass & Play (Same Device):** Proceeds to Screen 2A with immediate start.
    2. **Play Remote (Different Devices):** Prompts Host/Join selection.

#### Screen 2A: Local Match Init (`LocalSetupCard`)

- Configures Player 1 and Player 2 labels (e.g., "Dominic" & "Dad").
- Randomizes or assigns starting token ($X$ vs $O$).
- Action: Instantly mounts the board. No network libraries or peers are invoked.

#### Screen 2B: Remote Host Lobby (`RemoteHostLobby`)

- Generates a 6-character room code (e.g. `K7M2P9`).
- Displays:
    - Clickable direct invite URL (`arcade.absolutholz.de/tictactoe?room=K7M2P9`).
    - Native Web Share API trigger button (convenient for mobile messaging apps).
    - High-contrast QR code for instant phone-to-phone camera scanning.
    - Live status beacon: _"Waiting for friend to join..."_.

#### Screen 2C: Remote Guest Landing (`RemoteGuestJoin`)

- Automatically populates the room code from the URL parameter `?room=...`.
- Input for Guest Name (remembers last entered name in `localStorage`).
- Button: "Join Match" which initiates PeerJS handshake.

#### Screen 3: Unified Game Board (`GameBoardContainer`)

- Renders the game board component (`Grid`, `Tokens`, `TurnBanner`).
- **Input gating:**
    - **Local Mode:** Active player alternates with each valid tap. Inputs are always open to whoever has the current turn.
    - **Remote Mode:** Inputs are only active if `isMyTurn === true`. When waiting on the remote peer, the board shows a subtle pulsing indicator.
- **Connection Pill:** Shows `Local`, `Connected (Direct)`, `Connected (Relay)`, or `Peer Away (Saved)`.

#### Screen 4: Match Resolution & Rematch (`GameOverModal`)

- Highlights the winning line or declares a draw.
- Rematch flow:
    - **Local:** "Play Again" immediately clears the board and inverts the starting mark ($O$ starts next).
    - **Remote:** "Play Again" sends a `REQUEST_REMATCH` action over the data channel. The opponent accepts with one tap, swapping starting turns.

---

## 3. Disconnection, Backgrounding, and Extended Play

Unlike real-time fast-twitch games or strict conference tools, casual turn-based board games need to survive mobile screen locks, background tab pausing, and slow turn responses.

```
       [Tab Active] ──(Screen Lock / Tab Switch)──> [Suspended]
            │                                             │
            ▼                                             ▼
     Direct DataChannel                             Channel Closes
            │                                             │
            │                                 (Local State Persisted)
            │                                             │
       [Tab Resumed] ◄──(Re-open Link / Return)───────────┘
            │
            ▼
    Auto-Reconnect via
   Saved Room ID & UUID
            │
            ▼
   Host Sends SYNC_STATE
   (Game continues seamlessly)
```

1. **State Persistence in LocalStorage:**
    - Every time `state` updates, the Host saves `{ roomId, state, players }` to `localStorage`.
    - Guests save `{ roomId, myPeerId, lastState }`.
2. **No Arbitrary 15s Timeout:**
    - The 15-second severance destruction timer is eliminated.
    - If the peer drops, the UI displays a non-blocking indicator: _"Opponent is away. You can leave this page open or return later via your game link."_
3. **Seamless Reconnection Handshake:**
    - When the guest re-opens the URL or wakes their device, their persistent UUID dials into the Host's room ID.
    - If the Host tab was refreshed, the Host reclaims their registered room ID (`ah-arcade-ROOMID`), restores the game state from `localStorage`, and waits for the guest to re-ping.
    - The Host emits `SYNC_STATE` upon reconnection, restoring the board instantly to the last valid turn.

---

## 4. Technical Architecture & Monorepo Boundaries

Games are located under `apps/` while reusable logic resides in shared packages.

```text
apps/
└── tictactoe/                    # Game application package
    ├── src/
    │   ├── engine/               # Pure Rules: board logic, win checks, reducer
    │   │   ├── tictactoeEngine.ts
    │   │   └── types.ts
    │   ├── components/           # Board UI: Grid, Cell, TurnIndicator
    │   │   ├── Board.tsx
    │   │   └── Cell.tsx
    │   └── ...                   # Reuses shared UI tokens/components
packages/
└── shared/
    ├── lib-game-core/            # Pure TypeScript: Contracts and interfaces
    │   └── src/types.ts          # GameEngine, BaseAction, PlayerId
    └── lib-multiplayer/          # Reusable P2P & Local Session Management
        └── src/                  # ArcadeEngine, session orchestration, EU ICE
```

### 4.1 Shared Game Engine Contract (`@arcade/lib-game-core`)

All games export a deterministic reducer completely decoupled from rendering and networking:

```typescript
export type PlayerMark = "X" | "O";

export interface BaseAction<TType extends string = string, TPayload = unknown> {
	type: TType;
	payload: TPayload;
}

export interface GameEngine<TState, TAction extends BaseAction> {
	initialState: TState;
	reduce: (state: TState, action: TAction, senderMark: PlayerMark) => TState;
	checkWinner: (state: TState) => PlayerMark | "draw" | null;
	getNextTurn: (state: TState) => PlayerMark;
}
```

### 4.2 Unified Session Hook (`useMultiplayerRoom`)

Whether local or remote, the game UI consumes a single unified API:

```typescript
export interface MultiplayerRoomResult<TState, TAction> {
	gameState: TState;
	mode: "local" | "remote";
	activeTurnMark: PlayerMark;
	localPlayerMark: PlayerMark;
	isMyTurn: boolean;
	winner: PlayerMark | "draw" | null;
	connectionStatus: "idle" | "local" | "connecting" | "connected" | "peer-away" | "error";
	dispatch: (action: TAction) => void;
	restartGame: () => void;
}
```

- When `mode === 'local'`, actions are dispatched synchronously to `LocalEngine`.
- When `mode === 'remote'`, actions are routed through `ArcadeEngine` (via WebRTC `RTCDataChannel`).

---

## 5. Network Configuration & Privacy Defaults

### 5.1 Namespaced Room IDs

To prevent room code collisions on `0.peerjs.com` while presenting a clean 6-character code to players:

```typescript
const ROOM_NAMESPACE = "ah-arcade-";

export function toPeerId(shortCode: string): string {
	return `${ROOM_NAMESPACE}${shortCode.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
}

export function generateShortRoomCode(): string {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}
```

### 5.2 EU-First ICE Configuration

```typescript
export const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
	// 1. Primary EU STUN Servers (Germany - Fast, No Relay, Privacy First)
	{ urls: ["stun:stun.1und1.de:3478", "stun:stun.hosteurope.de:3478"] },
	// 2. Metered STUN
	{ urls: import.meta.env.VITE_METERED_PROJECT_URL || "stun:stun.relay.metered.ca:80" },
	// 3. Metered TURN Relay Fallback (Protected under Canada EU Adequacy Decision)
	{
		urls: [
			import.meta.env.VITE_METERED_TURN_URL || "turn:standard.relay.metered.ca:80?transport=tcp",
			import.meta.env.VITE_METERED_TURN_URL_TLS || "turns:standard.relay.metered.ca:443?transport=tcp",
		],
		username: import.meta.env.VITE_METERED_USERNAME || "49bd01bf0aa87c984af8ad6d",
		credential: import.meta.env.VITE_METERED_CREDENTIAL || "Rf/OQ/E+MLxhEYiZ",
	},
];
```

---

## 6. Implementation Sequence

1. **Step 1: Game Engine & Local Pass-and-Play (Instant Win)**
    - Implement Tic-Tac-Toe under `apps/` with a pure reducer and local UI.
    - Verify complete local two-player pass-and-play functionality with zero network dependencies.
2. **Step 2: Core Multiplayer Library (`@arcade/lib-multiplayer`)**
    - Port `ArcadeEngine.ts` with the removed 15s severance watchdog and added `localStorage` persistence.
    - Add `toPeerId` room namespacing and the EU-first ICE defaults.
3. **Step 3: Lobby & Sharing UX**
    - Build the reusable `LobbyModal`, `InviteShareCard`, and QR code generator.
4. **Step 4: End-to-End Testing**
    - Validate peer connection between desktop and mobile across separate networks (Wi-Fi vs Cellular).
