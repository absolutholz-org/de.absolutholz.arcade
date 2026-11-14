import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from '../Button';
import { Coin, type CoinFace } from '../Coin';
import { NumberStepper } from '../NumberStepper';
import { DEFAULT_TRAY_COINS, MAX_TRAY_COINS, MIN_TRAY_COINS } from './_CoinTray.constants';
import { useCoinTray } from './_CoinTray.hooks';
import * as S from './_CoinTray.styles';
import type { CoinTrayHandle, CoinTrayProps } from './_CoinTray.types';

function CoinTrayInner(
	{
		defaultCount = DEFAULT_TRAY_COINS,
		count,
		onCountChange,
		onFlipComplete,
		styleVariant = 'token',
		disabled = false,
		ariaLabel = 'Coin Tray',
		className,
		headsLabel = 'Heads',
		tailsLabel = 'Tails',
		headsShort = 'H',
		tailsShort = 'T',
		countLabel = 'Number of coins',
		decrementLabel = 'Decrease coin count',
		incrementLabel = 'Increase coin count',
		flipButtonLabel = 'Flip Coin',
		flipBatchButtonLabel = 'Flip Coins',
		resetButtonLabel = 'Reset',
		summaryFormatter,
		singleResultFormatter,
		batchResultFormatter,
	}: CoinTrayProps,
	ref: ForwardedRef<CoinTrayHandle>,
): JSX.Element {
	const { activeCount, coins, isFlipping, summary, announcement, handleCountChange, handleFlip, handleReset } =
		useCoinTray({
			defaultCount,
			count,
			onCountChange,
			onFlipComplete,
			headsLabel,
			tailsLabel,
			singleResultFormatter,
			batchResultFormatter,
		});

	useImperativeHandle(
		ref,
		() => ({
			flip: handleFlip,
			reset: handleReset,
		}),
		[handleFlip, handleReset],
	);

	const isSingle = activeCount === 1;
	const singleCoin = coins[0] ?? { id: 0, face: 'heads' as CoinFace, spinVariant: 'a' as const };
	const displaySingleFace: CoinFace =
		isSingle && isFlipping ? (summary.heads === 1 ? 'heads' : 'tails') : singleCoin.face;
	const singleFaceText = displaySingleFace === 'heads' ? headsLabel : tailsLabel;

	return (
		<S.TrayContainer aria-label={ariaLabel} className={className}>
			<S.TopBar>
				<NumberStepper
					value={activeCount}
					onChange={handleCountChange}
					min={MIN_TRAY_COINS}
					max={MAX_TRAY_COINS}
					disabled={disabled || isFlipping}
					label={countLabel}
					decrementLabel={decrementLabel}
					incrementLabel={incrementLabel}
				/>
				<S.StatusBadge>
					{isSingle ? (
						<strong>{singleFaceText}</strong>
					) : summaryFormatter ? (
						summaryFormatter(summary.heads, summary.tails)
					) : (
						<>
							{headsLabel}: <strong>{summary.heads}</strong> · {tailsLabel}:{' '}
							<strong>{summary.tails}</strong>
						</>
					)}
				</S.StatusBadge>
			</S.TopBar>

			{isSingle ? (
				<S.SingleStage>
					<Coin
						face={singleCoin.face}
						styleVariant={styleVariant}
						isFlipping={isFlipping}
						spinVariant={singleCoin.spinVariant}
						size="md"
						headsShort={headsShort}
						tailsShort={tailsShort}
						onClick={handleFlip}
						disabled={disabled || isFlipping}
						ariaLabel={`${flipButtonLabel} (${singleFaceText})`}
					/>
				</S.SingleStage>
			) : (
				<S.BatchGrid data-count={activeCount.toString()}>
					{coins.map((coin) => {
						const coinLabel = coin.face === 'heads' ? headsLabel : tailsLabel;
						return (
							<Coin
								key={coin.id}
								face={coin.face}
								styleVariant={styleVariant}
								isFlipping={isFlipping}
								spinVariant={coin.spinVariant}
								headsShort={headsShort}
								tailsShort={tailsShort}
								onClick={handleFlip}
								disabled={disabled || isFlipping}
								ariaLabel={`${coinLabel} — ${flipBatchButtonLabel}`}
							/>
						);
					})}
				</S.BatchGrid>
			)}

			<S.ControlsBar>
				<Button variant="primary" onClick={handleFlip} disabled={disabled || isFlipping}>
					{isSingle ? flipButtonLabel : flipBatchButtonLabel}
				</Button>
				<Button variant="secondary" onClick={handleReset} disabled={disabled || isFlipping}>
					{resetButtonLabel}
				</Button>
			</S.ControlsBar>

			<S.LiveAnnouncer aria-live="polite" aria-atomic="true">
				{announcement}
			</S.LiveAnnouncer>
		</S.TrayContainer>
	);
}

export const CoinTray = forwardRef(CoinTrayInner);
CoinTray.displayName = 'CoinTray';
