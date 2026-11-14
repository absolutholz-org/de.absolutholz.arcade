import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import { DiceTray, type DiceTrayHandle } from '@arcade/lib-ui/components/DiceTray';
import { ShakeToggle } from '@arcade/lib-ui/components/ShakeToggle';
import { useCallback, useRef } from 'react';
import * as S from './DiceRoller.styles';
import type { DiceRollerProps } from './DiceRoller.types';

function DiceRollerContent({ lang }: DiceRollerProps): JSX.Element {
	const { t } = useI18n();
	const trayRef = useRef<DiceTrayHandle>(null);

	const handleShake = useCallback(() => {
		trayRef.current?.roll();
	}, []);

	return (
		<div className={S.Container}>
			<div className={S.UtilityHeader}>
				<ShakeToggle
					onShake={handleShake}
					enableLabel={t('tools.dice.enableShake')}
					enabledLabel={t('tools.dice.shakeEnabled')}
					disabledLabel={t('tools.dice.shakeDisabled')}
				/>
			</div>

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
