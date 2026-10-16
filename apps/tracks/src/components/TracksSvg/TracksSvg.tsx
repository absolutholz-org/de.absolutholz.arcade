import type { JSX } from 'react';
import * as S from './TracksSvg.styles.js';
import type {
	CellMarkerProps,
	GhostTrackProps,
	TrackGateProps,
	TrackTileProps,
	TrainLocomotiveProps,
} from './TracksSvg.types.js';

export function TrackStraightHorizontal({
	isFixed = false,
	isError = false,
	isVictory = false,
	className,
}: TrackTileProps = {}): JSX.Element {
	return (
		<S.TileSvg
			viewBox="0 0 100 100"
			aria-hidden="true"
			data-fixed={isFixed ? 'true' : 'false'}
			data-error={isError ? 'true' : 'false'}
			data-victory={isVictory ? 'true' : 'false'}
			className={className}
		>
			<path className="track-ballast" d="M 0 50 L 100 50" />
			<line className="track-sleeper" x1="12.5" y1="24" x2="12.5" y2="76" />
			<line className="track-sleeper" x1="37.5" y1="24" x2="37.5" y2="76" />
			<line className="track-sleeper" x1="62.5" y1="24" x2="62.5" y2="76" />
			<line className="track-sleeper" x1="87.5" y1="24" x2="87.5" y2="76" />
			<path className="track-rail" d="M 0 36 L 100 36" />
			<path className="track-rail" d="M 0 64 L 100 64" />
		</S.TileSvg>
	);
}

export function TrackStraightVertical({
	isFixed = false,
	isError = false,
	isVictory = false,
	className,
}: TrackTileProps = {}): JSX.Element {
	return (
		<S.TileSvg
			viewBox="0 0 100 100"
			aria-hidden="true"
			data-fixed={isFixed ? 'true' : 'false'}
			data-error={isError ? 'true' : 'false'}
			data-victory={isVictory ? 'true' : 'false'}
			className={className}
		>
			<path className="track-ballast" d="M 50 0 L 50 100" />
			<line className="track-sleeper" x1="24" y1="12.5" x2="76" y2="12.5" />
			<line className="track-sleeper" x1="24" y1="37.5" x2="76" y2="37.5" />
			<line className="track-sleeper" x1="24" y1="62.5" x2="76" y2="62.5" />
			<line className="track-sleeper" x1="24" y1="87.5" x2="76" y2="87.5" />
			<path className="track-rail" d="M 36 0 L 36 100" />
			<path className="track-rail" d="M 64 0 L 64 100" />
		</S.TileSvg>
	);
}

export function TrackCurveNE({
	isFixed = false,
	isError = false,
	isVictory = false,
	className,
}: TrackTileProps = {}): JSX.Element {
	return (
		<S.TileSvg
			viewBox="0 0 100 100"
			aria-hidden="true"
			data-fixed={isFixed ? 'true' : 'false'}
			data-error={isError ? 'true' : 'false'}
			data-victory={isVictory ? 'true' : 'false'}
			className={className}
		>
			<path className="track-ballast" d="M 50 0 A 50 50 0 0 0 100 50" />
			<line className="track-sleeper" x1="77.17" y1="7.42" x2="27.72" y2="23.49" />
			<line className="track-sleeper" x1="83.03" y1="16.97" x2="46.26" y2="53.74" />
			<line className="track-sleeper" x1="92.58" y1="22.83" x2="76.51" y2="72.28" />
			<path className="track-rail" d="M 64 0 A 36 36 0 0 0 100 36" />
			<path className="track-rail" d="M 36 0 A 64 64 0 0 0 100 64" />
		</S.TileSvg>
	);
}

export function TrackCurveNW({
	isFixed = false,
	isError = false,
	isVictory = false,
	className,
}: TrackTileProps = {}): JSX.Element {
	return (
		<S.TileSvg
			viewBox="0 0 100 100"
			aria-hidden="true"
			data-fixed={isFixed ? 'true' : 'false'}
			data-error={isError ? 'true' : 'false'}
			data-victory={isVictory ? 'true' : 'false'}
			className={className}
		>
			<path className="track-ballast" d="M 50 0 A 50 50 0 0 1 0 50" />
			<line className="track-sleeper" x1="22.83" y1="7.42" x2="72.28" y2="23.49" />
			<line className="track-sleeper" x1="16.97" y1="16.97" x2="53.74" y2="53.74" />
			<line className="track-sleeper" x1="7.42" y1="22.83" x2="23.49" y2="72.28" />
			<path className="track-rail" d="M 36 0 A 36 36 0 0 1 0 36" />
			<path className="track-rail" d="M 64 0 A 64 64 0 0 1 0 64" />
		</S.TileSvg>
	);
}

export function TrackCurveSE({
	isFixed = false,
	isError = false,
	isVictory = false,
	className,
}: TrackTileProps = {}): JSX.Element {
	return (
		<S.TileSvg
			viewBox="0 0 100 100"
			aria-hidden="true"
			data-fixed={isFixed ? 'true' : 'false'}
			data-error={isError ? 'true' : 'false'}
			data-victory={isVictory ? 'true' : 'false'}
			className={className}
		>
			<path className="track-ballast" d="M 50 100 A 50 50 0 0 1 100 50" />
			<line className="track-sleeper" x1="77.17" y1="92.58" x2="27.72" y2="76.51" />
			<line className="track-sleeper" x1="83.03" y1="83.03" x2="46.26" y2="46.26" />
			<line className="track-sleeper" x1="92.58" y1="77.17" x2="76.51" y2="27.72" />
			<path className="track-rail" d="M 64 100 A 36 36 0 0 1 100 64" />
			<path className="track-rail" d="M 36 100 A 64 64 0 0 1 100 36" />
		</S.TileSvg>
	);
}

export function TrackCurveSW({
	isFixed = false,
	isError = false,
	isVictory = false,
	className,
}: TrackTileProps = {}): JSX.Element {
	return (
		<S.TileSvg
			viewBox="0 0 100 100"
			aria-hidden="true"
			data-fixed={isFixed ? 'true' : 'false'}
			data-error={isError ? 'true' : 'false'}
			data-victory={isVictory ? 'true' : 'false'}
			className={className}
		>
			<path className="track-ballast" d="M 50 100 A 50 50 0 0 0 0 50" />
			<line className="track-sleeper" x1="22.83" y1="92.58" x2="72.28" y2="76.51" />
			<line className="track-sleeper" x1="16.97" y1="83.03" x2="53.74" y2="46.26" />
			<line className="track-sleeper" x1="7.42" y1="77.17" x2="23.49" y2="27.72" />
			<path className="track-rail" d="M 36 100 A 36 36 0 0 0 0 64" />
			<path className="track-rail" d="M 64 100 A 64 64 0 0 0 0 36" />
		</S.TileSvg>
	);
}

export function TrackGate({ variant, side, label, className }: TrackGateProps): JSX.Element {
	const badgeText = label ?? (variant === 'start' ? 'A' : 'B');

	return (
		<S.GateSvg
			viewBox="0 0 100 100"
			aria-hidden="true"
			data-variant={variant}
			data-side={side}
			className={className}
		>
			{side === 'N' && (
				<g>
					<rect className="gate-bar" x="22" y="-5" width="56" height="10" rx="4" />
					{variant === 'start' ? (
						<polygon className="gate-arrow" points="50,18 40,6 60,6" />
					) : (
						<polygon className="gate-arrow" points="50,-11 40,1 60,1" />
					)}
					<circle className="gate-badge" cx="20" cy="20" r="14" />
					<text className="gate-text" x="20" y="20">
						{badgeText}
					</text>
				</g>
			)}
			{side === 'S' && (
				<g>
					<rect className="gate-bar" x="22" y="95" width="56" height="10" rx="4" />
					{variant === 'start' ? (
						<polygon className="gate-arrow" points="50,82 40,94 60,94" />
					) : (
						<polygon className="gate-arrow" points="50,111 40,99 60,99" />
					)}
					<circle className="gate-badge" cx="20" cy="80" r="14" />
					<text className="gate-text" x="20" y="80">
						{badgeText}
					</text>
				</g>
			)}
			{side === 'W' && (
				<g>
					<rect className="gate-bar" x="-5" y="22" width="10" height="56" rx="4" />
					{variant === 'start' ? (
						<polygon className="gate-arrow" points="18,50 6,40 6,60" />
					) : (
						<polygon className="gate-arrow" points="-11,50 1,40 1,60" />
					)}
					<circle className="gate-badge" cx="20" cy="20" r="14" />
					<text className="gate-text" x="20" y="20">
						{badgeText}
					</text>
				</g>
			)}
			{side === 'E' && (
				<g>
					<rect className="gate-bar" x="95" y="22" width="10" height="56" rx="4" />
					{variant === 'start' ? (
						<polygon className="gate-arrow" points="82,50 94,40 94,60" />
					) : (
						<polygon className="gate-arrow" points="111,50 99,40 99,60" />
					)}
					<circle className="gate-badge" cx="80" cy="20" r="14" />
					<text className="gate-text" x="80" y="20">
						{badgeText}
					</text>
				</g>
			)}
		</S.GateSvg>
	);
}

export function CellCross({ isError = false, className }: CellMarkerProps = {}): JSX.Element {
	return (
		<S.MarkerSvg
			viewBox="0 0 100 100"
			aria-hidden="true"
			data-error={isError ? 'true' : 'false'}
			className={className}
		>
			<line className="cross-line" x1="28" y1="28" x2="72" y2="72" />
			<line className="cross-line" x1="72" y1="28" x2="28" y2="72" />
		</S.MarkerSvg>
	);
}

export function CellCandidate({ className }: CellMarkerProps = {}): JSX.Element {
	return (
		<S.MarkerSvg viewBox="0 0 100 100" aria-hidden="true" className={className}>
			<line className="candidate-guide" x1="16" y1="50" x2="84" y2="50" />
			<line className="candidate-guide" x1="50" y1="16" x2="50" y2="84" />
			<circle className="candidate-dot" cx="50" cy="50" r="10" />
		</S.MarkerSvg>
	);
}

export function GhostTrack({ track, className }: GhostTrackProps = {}): JSX.Element {
	if (!track) {
		return <CellCandidate className={className} />;
	}

	return (
		<S.MarkerSvg viewBox="0 0 100 100" aria-hidden="true" className={className}>
			{track === 'straight-h' && (
				<>
					<path className="candidate-guide" d="M 0 36 L 100 36" />
					<path className="candidate-guide" d="M 0 64 L 100 64" />
				</>
			)}
			{track === 'straight-v' && (
				<>
					<path className="candidate-guide" d="M 36 0 L 36 100" />
					<path className="candidate-guide" d="M 64 0 L 64 100" />
				</>
			)}
			{track === 'curve-ne' && (
				<>
					<path className="candidate-guide" d="M 64 0 A 36 36 0 0 0 100 36" />
					<path className="candidate-guide" d="M 36 0 A 64 64 0 0 0 100 64" />
				</>
			)}
			{track === 'curve-nw' && (
				<>
					<path className="candidate-guide" d="M 36 0 A 36 36 0 0 1 0 36" />
					<path className="candidate-guide" d="M 64 0 A 64 64 0 0 1 0 64" />
				</>
			)}
			{track === 'curve-se' && (
				<>
					<path className="candidate-guide" d="M 64 100 A 36 36 0 0 1 100 64" />
					<path className="candidate-guide" d="M 36 100 A 64 64 0 0 1 100 36" />
				</>
			)}
			{track === 'curve-sw' && (
				<>
					<path className="candidate-guide" d="M 36 100 A 36 36 0 0 0 0 64" />
					<path className="candidate-guide" d="M 64 100 A 64 64 0 0 0 0 36" />
				</>
			)}
		</S.MarkerSvg>
	);
}

export function TrainLocomotive({ direction, exitTo, className }: TrainLocomotiveProps = {}): JSX.Element {
	const heading = exitTo ?? direction ?? 'E';

	return (
		<S.LocomotiveSvg viewBox="0 0 100 100" aria-hidden="true" data-direction={heading} className={className}>
			<rect className="loco-shadow" x="16" y="29" width="70" height="46" rx="12" />
			<rect className="loco-body" x="14" y="26" width="68" height="48" rx="12" />
			<rect className="loco-cab" x="18" y="31" width="26" height="38" rx="6" />
			<rect className="loco-window" x="23" y="36" width="16" height="28" rx="4" />
			<circle className="loco-chimney" cx="64" cy="50" r="8" />
			<circle className="loco-lamp" cx="80" cy="40" r="4" />
			<circle className="loco-lamp" cx="80" cy="60" r="4" />
		</S.LocomotiveSvg>
	);
}
