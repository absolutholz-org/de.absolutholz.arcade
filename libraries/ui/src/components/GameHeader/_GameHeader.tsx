import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { SchemeSwitcher } from '../SchemeSwitcher';
import {
	DEFAULT_BACK_ARIA_LABEL,
	DEFAULT_HEADER_ARIA_LABEL,
	DEFAULT_RULES_ARIA_LABEL,
	DEFAULT_SETTINGS_ARIA_LABEL,
} from './_GameHeader.constants';
import * as S from './_GameHeader.styles';
import type { GameHeaderProps } from './_GameHeader.types';

/**
 * Top landmark organism for active gameplay.
 * Guarantees mathematical centering for the timer slot regardless
 * of asymmetric actions between left and right zones.
 */
export function GameHeader({
	backHref,
	backLabel,
	onBackClick,
	difficulty,
	timer,
	onOpenRules,
	rulesLabel,
	onOpenSettings,
	settingsHref,
	settingsLabel,
	showSchemeSwitcher = false,
	actions,
	hasBorder = true,
	'aria-label': ariaLabel = DEFAULT_HEADER_ARIA_LABEL,
	children,
}: GameHeaderProps) {
	const { t } = useI18n('common');

	const resolvedBackLabel = backLabel ?? t('actions.back') ?? DEFAULT_BACK_ARIA_LABEL;
	const resolvedRulesLabel = rulesLabel ?? t('navigation.rules') ?? DEFAULT_RULES_ARIA_LABEL;
	const resolvedSettingsLabel = settingsLabel ?? t('navigation.settings') ?? DEFAULT_SETTINGS_ARIA_LABEL;
	const centerSlot = timer ?? children;

	return (
		<S.Header role="banner" aria-label={ariaLabel} data-has-border={hasBorder ? 'true' : 'false'}>
			<div className="game-header-grid">
				<div className="game-header-left">
					{backHref ? (
						<Button
							as="a"
							href={backHref}
							onClick={onBackClick}
							variant="ghost"
							size="md"
							isIconOnly
							aria-label={resolvedBackLabel}
							title={resolvedBackLabel}
							leadingIcon={<Icon name="arrow-left" size="sm" />}
						/>
					) : onBackClick ? (
						<Button
							type="button"
							onClick={onBackClick}
							variant="ghost"
							size="md"
							isIconOnly
							aria-label={resolvedBackLabel}
							title={resolvedBackLabel}
							leadingIcon={<Icon name="arrow-left" size="sm" />}
						/>
					) : null}

					{difficulty && (
						<Badge variant="outline" size="sm">
							{difficulty}
						</Badge>
					)}
				</div>

				<div className="game-header-center">{centerSlot}</div>

				<div className="game-header-right">
					{showSchemeSwitcher && <SchemeSwitcher size="md" variant="ghost" />}
					{actions}
					{onOpenRules ? (
						<Button
							type="button"
							onClick={onOpenRules}
							variant="ghost"
							size="md"
							isIconOnly
							aria-label={resolvedRulesLabel}
							title={resolvedRulesLabel}
							leadingIcon={<Icon name="info" size="sm" />}
						/>
					) : null}
					{settingsHref ? (
						<Button
							as="a"
							href={settingsHref}
							onClick={onOpenSettings}
							variant="ghost"
							size="md"
							isIconOnly
							aria-label={resolvedSettingsLabel}
							title={resolvedSettingsLabel}
							leadingIcon={<Icon name="settings" size="sm" />}
						/>
					) : onOpenSettings ? (
						<Button
							type="button"
							onClick={onOpenSettings}
							variant="ghost"
							size="md"
							isIconOnly
							aria-label={resolvedSettingsLabel}
							title={resolvedSettingsLabel}
							leadingIcon={<Icon name="settings" size="sm" />}
						/>
					) : null}
				</div>
			</div>
		</S.Header>
	);
}
