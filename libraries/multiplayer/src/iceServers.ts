import type { PeerJSOption } from 'peerjs';

interface MeteredConfig {
	readonly projectUrl?: string;
	readonly username?: string;
	readonly credential?: string;
}

function readMeteredConfig(): MeteredConfig {
	let projectUrl: string | undefined;
	let username: string | undefined;
	let credential: string | undefined;

	try {
		// Explicit literal accesses so Vite / Astro static define replaces them at bundle time
		projectUrl = import.meta.env.VITE_METERED_PROJECT_URL ?? import.meta.env.PUBLIC_METERED_PROJECT_URL;
		username = import.meta.env.VITE_METERED_USERNAME ?? import.meta.env.PUBLIC_METERED_USERNAME;
		credential = import.meta.env.VITE_METERED_CREDENTIAL ?? import.meta.env.PUBLIC_METERED_CREDENTIAL;
	} catch {
		// In pure Node or non-ESM environments, import.meta.env may be undefined
	}

	const globalScope =
		typeof globalThis !== 'undefined'
			? (globalThis as { process?: { env?: Record<string, string | undefined> } })
			: undefined;
	const nodeEnv = globalScope?.process?.env;

	projectUrl = projectUrl ?? nodeEnv?.VITE_METERED_PROJECT_URL ?? nodeEnv?.PUBLIC_METERED_PROJECT_URL;
	username = username ?? nodeEnv?.VITE_METERED_USERNAME ?? nodeEnv?.PUBLIC_METERED_USERNAME;
	credential = credential ?? nodeEnv?.VITE_METERED_CREDENTIAL ?? nodeEnv?.PUBLIC_METERED_CREDENTIAL;

	return {
		projectUrl: projectUrl?.trim(),
		username: username?.trim(),
		credential: credential?.trim(),
	};
}

function resolveStunUrl(rawUrl: string | undefined): string {
	if (!rawUrl) {
		return 'stun:stun.relay.metered.ca:80';
	}
	if (/^(stun|turns?):/i.test(rawUrl)) {
		return rawUrl;
	}
	return 'stun:stun.relay.metered.ca:80';
}

export function getIceServers(): RTCIceServer[] {
	const config = readMeteredConfig();
	const fallbackStunUrl = resolveStunUrl(config.projectUrl);

	const servers: RTCIceServer[] = [
		{ urls: 'stun:stun.1und1.de:3478' },
		{ urls: 'stun:stun.hosteurope.de:3478' },
		{ urls: fallbackStunUrl },
	];

	if (config.username) {
		const username = config.username;
		const credential = config.credential ?? '';
		servers.push(
			{
				urls: 'turn:eu.relay.metered.ca:80',
				username,
				credential,
			},
			{
				urls: 'turn:eu.relay.metered.ca:80?transport=tcp',
				username,
				credential,
			},
			{
				urls: 'turn:eu.relay.metered.ca:443',
				username,
				credential,
			},
			{
				urls: 'turns:eu.relay.metered.ca:443?transport=tcp',
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
