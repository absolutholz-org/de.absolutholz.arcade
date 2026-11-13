import type { PeerJSOption } from 'peerjs';

interface ViteMetaEnv {
	readonly VITE_METERED_PROJECT_URL?: string;
	readonly VITE_METERED_USERNAME?: string;
	readonly VITE_METERED_CREDENTIAL?: string;
}

function readMetaEnv(): ViteMetaEnv | undefined {
	try {
		return (import.meta as unknown as { readonly env?: ViteMetaEnv }).env;
	} catch {
		return undefined;
	}
}

export function getIceServers(): RTCIceServer[] {
	const env = readMetaEnv();
	const fallbackStunUrl = env?.VITE_METERED_PROJECT_URL || 'stun:stun.relay.metered.ca:80';

	const servers: RTCIceServer[] = [
		{ urls: 'stun:stun.1und1.de:3478' },
		{ urls: 'stun:stun.hosteurope.de:3478' },
		{ urls: fallbackStunUrl },
	];

	if (env?.VITE_METERED_USERNAME) {
		const username = env.VITE_METERED_USERNAME;
		const credential = env.VITE_METERED_CREDENTIAL ?? '';
		servers.push(
			{
				urls: 'turn:global.relay.metered.ca:80',
				username,
				credential,
			},
			{
				urls: 'turn:global.relay.metered.ca:80?transport=tcp',
				username,
				credential,
			},
			{
				urls: 'turn:global.relay.metered.ca:443',
				username,
				credential,
			},
			{
				urls: 'turns:global.relay.metered.ca:443?transport=tcp',
				username,
				credential,
			},
		);
	}

	return servers;
}

export const PEER_CONFIG: PeerJSOption['config'] = {
	iceServers: getIceServers(),
	iceTransportPolicy: 'all',
};
