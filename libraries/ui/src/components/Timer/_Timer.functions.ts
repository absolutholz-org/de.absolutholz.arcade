import type { TimerFormat } from './_Timer.types';

/**
 * Formats a total number of seconds into zero-padded digit strings.
 */
export function formatTime(seconds: number, format: TimerFormat = 'auto'): string {
	const totalSeconds = Math.max(0, Math.floor(seconds));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const remainingSeconds = totalSeconds % 60;

	const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

	if (format === 'hh:mm:ss' || (format === 'auto' && hours > 0)) {
		const paddedHours = hours.toString().padStart(2, '0');
		const paddedMinutes = minutes.toString().padStart(2, '0');
		return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
	}

	const totalMinutes = format === 'mm:ss' ? Math.floor(totalSeconds / 60) : minutes;
	const paddedMinutes = totalMinutes.toString().padStart(2, '0');
	return `${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Converts seconds into an ISO 8601 duration string (e.g. PT2M15S)
 * for the semantic <time dateTime="..."> attribute.
 */
export function formatDurationIso(seconds: number): string {
	const totalSeconds = Math.max(0, Math.floor(seconds));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const remainingSeconds = totalSeconds % 60;

	let duration = 'PT';
	if (hours > 0) duration += `${hours}H`;
	if (minutes > 0 || hours > 0) duration += `${minutes}M`;
	duration += `${remainingSeconds}S`;

	return duration;
}
