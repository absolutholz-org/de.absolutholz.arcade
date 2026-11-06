import { SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { Children, type JSX, isValidElement } from 'react';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { SegmentedControl } from '../SegmentedControl';
import { Stack } from '../Stack';
import { Switch } from '../Switch';
import { useGameSettingsDialog } from './_GameSettingsDialog.hooks';
import * as S from './_GameSettingsDialog.styles';
import type { GameSettingsDialogProps } from './_GameSettingsDialog.types';

export function GameSettingsDialog({
	children,
	className,
	gameTitle,
	id,
	isOpen,
	onClose,
	onLanguageChange,
	...dialogProps
}: GameSettingsDialogProps): JSX.Element {
	const {
		dialogId,
		handleHapticsToggle,
		handleLanguageChange,
		handleSchemeChange,
		handleSoundToggle,
		haptics,
		language,
		scheme,
		sound,
		t,
	} = useGameSettingsDialog({ id, isOpen, onLanguageChange });

	const hasChildren = Children.toArray(children).some(
		(child) => isValidElement(child) || (typeof child === 'string' && child.trim().length > 0),
	);

	const schemeOptions = [
		{ value: 'light', label: t('switchers.scheme.options.light') },
		{ value: 'dark', label: t('switchers.scheme.options.dark') },
		{ value: 'system', label: t('switchers.scheme.options.system') },
	] as const;

	return (
		<Dialog
			id={dialogId}
			isOpen={isOpen}
			onCancel={onClose}
			title={
				<S.HeaderGroup>
					<S.PrimaryTitle>{t('settings.title')}</S.PrimaryTitle>
					{gameTitle && <S.Subtitle>{gameTitle}</S.Subtitle>}
				</S.HeaderGroup>
			}
			showCloseButton={true}
			className={className}
			{...dialogProps}
		>
			<S.DialogBody>
				{hasChildren && (
					<S.Section data-section="gameplay">
						<S.SectionHeader>
							<S.SectionTitle>{t('settings.gameSectionTitle')}</S.SectionTitle>
						</S.SectionHeader>
						<S.SectionContent>{children}</S.SectionContent>
					</S.Section>
				)}

				<S.Section data-section="arcade">
					<S.SectionHeader>
						<S.SectionTitle>{t('settings.arcadeSectionTitle')}</S.SectionTitle>
					</S.SectionHeader>
					<S.SectionContent>
						<S.SettingRow>
							<S.SettingInfo>
								<S.SettingLabel>{t('settings.soundTitle')}</S.SettingLabel>
								<S.SettingDescription>{t('settings.soundDescription')}</S.SettingDescription>
							</S.SettingInfo>
							<S.SettingControl>
								<Switch
									id={`${dialogId}-sound`}
									checked={sound}
									onChange={(e) => handleSoundToggle(e.target.checked)}
									aria-label={t('settings.soundTitle')}
								/>
							</S.SettingControl>
						</S.SettingRow>

						<S.SettingRow>
							<S.SettingInfo>
								<S.SettingLabel>{t('settings.hapticsTitle')}</S.SettingLabel>
								<S.SettingDescription>{t('settings.hapticsDescription')}</S.SettingDescription>
							</S.SettingInfo>
							<S.SettingControl>
								<Switch
									id={`${dialogId}-haptics`}
									checked={haptics}
									onChange={(e) => handleHapticsToggle(e.target.checked)}
									aria-label={t('settings.hapticsTitle')}
								/>
							</S.SettingControl>
						</S.SettingRow>

						<S.SettingRow data-wrap="responsive">
							<S.SettingInfo>
								<S.SettingLabel>{t('settings.schemeSectionTitle')}</S.SettingLabel>
							</S.SettingInfo>
							<S.SettingControl data-full-width="mobile">
								<SegmentedControl
									options={schemeOptions}
									value={scheme}
									onChange={handleSchemeChange}
									size="sm"
									ariaLabel={t('settings.schemeSectionTitle')}
								/>
							</S.SettingControl>
						</S.SettingRow>

						<S.SettingRow>
							<S.SettingInfo>
								<S.SettingLabel>{t('settings.languageSectionTitle')}</S.SettingLabel>
							</S.SettingInfo>
							<S.SettingControl>
								<S.Select
									id={`${dialogId}-language`}
									value={language}
									onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguageCode)}
									aria-label={t('settings.languageSectionTitle')}
								>
									{SUPPORTED_LANGUAGES.map((langItem) => (
										<option key={langItem.code} value={langItem.code}>
											{langItem.flag} {langItem.label}
										</option>
									))}
								</S.Select>
							</S.SettingControl>
						</S.SettingRow>
					</S.SectionContent>
				</S.Section>

				<Stack align="end">
					<Button as="a" href={`/${language}/settings`} variant="ghost" size="sm">
						{t('settings.moreSettings')}
					</Button>
				</Stack>
			</S.DialogBody>
		</Dialog>
	);
}
