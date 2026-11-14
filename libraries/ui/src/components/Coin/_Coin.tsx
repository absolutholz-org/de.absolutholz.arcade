import * as S from './_Coin.styles';
import type { CoinFace, CoinProps, CoinStyle } from './_Coin.types';

function TokenFaceSvg({ side, label }: { readonly side: CoinFace; readonly label: string }): JSX.Element {
	const isHeads = side === 'heads';
	return (
		<svg viewBox="0 0 120 120" aria-hidden="true">
			<circle
				cx="60"
				cy="60"
				r="56"
				fill={isHeads ? 'oklch(0.76 0.13 75)' : 'oklch(0.48 0.08 55)'}
				stroke={isHeads ? 'oklch(0.55 0.11 65)' : 'oklch(0.68 0.11 75)'}
				strokeWidth="4"
			/>
			<circle
				cx="60"
				cy="60"
				r="46"
				fill={isHeads ? 'oklch(0.86 0.11 82)' : 'oklch(0.39 0.07 52)'}
				stroke={isHeads ? 'oklch(0.62 0.12 70)' : 'oklch(0.74 0.12 78)'}
				strokeWidth="2"
				strokeDasharray={isHeads ? undefined : '4 3'}
			/>
			{isHeads ? (
				<>
					<path
						d="M38 46 L46 32 L60 41 L74 32 L82 46 Z"
						fill="oklch(0.45 0.1 55)"
						stroke="oklch(0.35 0.08 50)"
						strokeWidth="2"
						strokeLinejoin="round"
					/>
					<text
						x="60"
						y="84"
						textAnchor="middle"
						fontSize="30"
						fontWeight="800"
						fill="oklch(0.34 0.08 50)"
						fontFamily="system-ui, sans-serif"
					>
						{label}
					</text>
				</>
			) : (
				<>
					<polygon
						points="60,26 74,40 60,54 46,40"
						fill="oklch(0.82 0.12 80)"
						stroke="oklch(0.66 0.11 74)"
						strokeWidth="2"
					/>
					<text
						x="60"
						y="86"
						textAnchor="middle"
						fontSize="30"
						fontWeight="800"
						fill="oklch(0.92 0.06 82)"
						fontFamily="system-ui, sans-serif"
					>
						{label}
					</text>
				</>
			)}
		</svg>
	);
}

function ClassicFaceSvg({ side, label }: { readonly side: CoinFace; readonly label: string }): JSX.Element {
	const isHeads = side === 'heads';
	return (
		<svg viewBox="0 0 120 120" aria-hidden="true">
			<circle
				cx="60"
				cy="60"
				r="56"
				fill={isHeads ? 'oklch(0.84 0.14 86)' : 'oklch(0.84 0.02 245)'}
				stroke={isHeads ? 'oklch(0.62 0.13 78)' : 'oklch(0.58 0.03 245)'}
				strokeWidth="4"
			/>
			<circle
				cx="60"
				cy="60"
				r="46"
				fill="none"
				stroke={isHeads ? 'oklch(0.66 0.12 80)' : 'oklch(0.64 0.03 245)'}
				strokeWidth="2"
				strokeDasharray={isHeads ? '2 4' : undefined}
			/>
			{isHeads ? (
				<>
					<circle cx="60" cy="40" r="10" fill="none" stroke="oklch(0.45 0.1 72)" strokeWidth="2.5" />
					<path
						d="M48 48 Q60 56 72 48"
						fill="none"
						stroke="oklch(0.45 0.1 72)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>
					<text
						x="60"
						y="86"
						textAnchor="middle"
						fontSize="30"
						fontWeight="700"
						fill="oklch(0.38 0.09 70)"
						fontFamily="Georgia, serif"
					>
						{label}
					</text>
				</>
			) : (
				<>
					<line
						x1="40"
						y1="36"
						x2="80"
						y2="36"
						stroke="oklch(0.42 0.03 245)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>
					<line
						x1="46"
						y1="44"
						x2="74"
						y2="44"
						stroke="oklch(0.42 0.03 245)"
						strokeWidth="2.5"
						strokeLinecap="round"
					/>
					<text
						x="60"
						y="86"
						textAnchor="middle"
						fontSize="30"
						fontWeight="700"
						fill="oklch(0.32 0.03 245)"
						fontFamily="Georgia, serif"
					>
						{label}
					</text>
				</>
			)}
		</svg>
	);
}

function MinimalFaceSvg({ side, label }: { readonly side: CoinFace; readonly label: string }): JSX.Element {
	const isHeads = side === 'heads';
	return (
		<svg viewBox="0 0 120 120" aria-hidden="true">
			<circle
				cx="60"
				cy="60"
				r="56"
				fill={isHeads ? 'oklch(0.24 0.02 250)' : 'oklch(0.97 0.01 90)'}
				stroke={isHeads ? 'oklch(0.92 0.02 90)' : 'oklch(0.24 0.02 250)'}
				strokeWidth="5"
			/>
			<circle
				cx="60"
				cy="60"
				r="44"
				fill="none"
				stroke={isHeads ? 'oklch(0.75 0.15 80)' : 'oklch(0.45 0.14 250)'}
				strokeWidth="2.5"
				strokeDasharray={isHeads ? undefined : '6 4'}
			/>
			<text
				x="60"
				y="74"
				textAnchor="middle"
				fontSize={label.length > 1 ? '38' : '48'}
				fontWeight="900"
				fill={isHeads ? 'oklch(0.98 0.01 90)' : 'oklch(0.18 0.02 250)'}
				fontFamily="system-ui, sans-serif"
			>
				{label}
			</text>
		</svg>
	);
}

function CoinFaceContent({
	side,
	styleVariant,
	label,
}: {
	readonly side: CoinFace;
	readonly styleVariant: CoinStyle;
	readonly label: string;
}): JSX.Element {
	if (styleVariant === 'classic') {
		return <ClassicFaceSvg side={side} label={label} />;
	}
	if (styleVariant === 'minimal') {
		return <MinimalFaceSvg side={side} label={label} />;
	}
	return <TokenFaceSvg side={side} label={label} />;
}

export function Coin({
	face,
	styleVariant = 'token',
	isFlipping = false,
	spinVariant = 'a',
	size = 'md',
	headsShort = 'H',
	tailsShort = 'T',
	onClick,
	disabled = false,
	ariaLabel,
}: CoinProps): JSX.Element {
	const defaultLabel = face === 'heads' ? 'Flip coin (Heads)' : 'Flip coin (Tails)';

	return (
		<S.CoinButton type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel ?? defaultLabel}>
			<S.CoinRotor
				data-face={face}
				data-flipping={isFlipping ? 'true' : 'false'}
				data-spin={spinVariant}
				data-size={size}
			>
				<S.CoinFaceLayer data-side="heads">
					<CoinFaceContent side="heads" styleVariant={styleVariant} label={headsShort} />
				</S.CoinFaceLayer>
				<S.CoinFaceLayer data-side="tails">
					<CoinFaceContent side="tails" styleVariant={styleVariant} label={tailsShort} />
				</S.CoinFaceLayer>
			</S.CoinRotor>
		</S.CoinButton>
	);
}
