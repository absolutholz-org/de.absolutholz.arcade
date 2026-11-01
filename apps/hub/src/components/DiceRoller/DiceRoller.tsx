import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { Button } from '@arcade/lib-ui/components/Button';
import { DiceTray, type DiceTrayHandle } from '@arcade/lib-ui/components/DiceTray';
import { useShakeToRoll } from '@arcade/lib-ui/hooks/useShakeToRoll';
import { useCallback, useRef, useState } from 'react';
import * as S from './DiceRoller.styles';
import type { DiceRollerProps } from './DiceRoller.types';

function DiceRollerContent({ lang }: DiceRollerProps): JSX.Element {
	const { t } = useI18n();
	const trayRef = useRef<DiceTrayHandle>(null);
	const [isShakeActive, setIsShakeActive] = useState<boolean>(true);

	const handleShake = useCallback(() => {
		trayRef.current?.roll();
	}, []);

	const { isSupported, needsPermission, isPermissionGranted, requestPermission } = useShakeToRoll({
		onShake: handleShake,
		threshold: 16,
		cooldownMs: 800,
		enableHaptics: true,
		enabled: isShakeActive,
	});

	return (
		<div className={S.Container}>
			{isSupported && (
				<div className={S.UtilityHeader}>
					{needsPermission && !isPermissionGranted ? (
						<Button size="sm" variant="secondary" onClick={() => void requestPermission()}>
							📱 {t('tools.dice.enableShake')}
						</Button>
					) : (
						<Button
							size="sm"
							variant={isShakeActive ? 'secondary' : 'outline'}
							onClick={() => setIsShakeActive(!isShakeActive)}
							aria-pressed={isShakeActive}
							title={isShakeActive ? t('tools.dice.shakeEnabled') : t('tools.dice.shakeDisabled')}
						>
							📱 {isShakeActive ? t('tools.dice.shakeEnabled') : t('tools.dice.shakeDisabled')}
						</Button>
					)}
				</div>
			)}

			<div className={S.StyledDiceTrayWrapper}>
				<DiceTray ref={trayRef} defaultCount={5} ariaLabel={t('tools.dice.title')} />
			</div>
		</div>
	);
}

export function DiceRoller({ lang }: DiceRollerProps): JSX.Element {
	return (
		<I18nProvider language={lang}>
			<DiceRollerContent lang={lang} />
		</I18nProvider>
	);
}
