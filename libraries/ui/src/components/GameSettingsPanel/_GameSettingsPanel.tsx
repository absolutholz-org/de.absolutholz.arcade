import type { SettingFieldDescriptor } from '@arcade/lib-games';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode, TranslationKey } from '@arcade/lib-i18n/types/i18n.types';
import type { JSX, ReactNode } from 'react';
import { CollapsibleListbox } from '../CollapsibleListbox';
import { Dialog } from '../Dialog';
import { LanguageSelector } from '../LanguageSelector';
import { SchemeSelector } from '../SchemeSelector';
import { SegmentedControl } from '../SegmentedControl';
import { Switch } from '../Switch';
import { ThemeSelector } from '../ThemeSelector';
import { VisuallyHidden } from '../VisuallyHidden';
import { resolveSupportedLanguage, useGameSettingsPanel } from './_GameSettingsPanel.hooks';
import * as S from './_GameSettingsPanel.styles';
import type { GameSettingsPanelProps } from './_GameSettingsPanel.types';

function GameSettingsPanelContent<T extends Record<string, unknown>>({
	config,
	mode,
	onSettingsChange,
	onResetProgress,
	className,
}: GameSettingsPanelProps<T>): JSX.Element {
	const { t: tCommon } = useI18n('common');
	const { t: tGame } = useI18n(config.gameId);
	const { settings, updateSetting, isResetDialogOpen, openResetDialog, closeResetDialog, confirmResetProgress } =
		useGameSettingsPanel(config, onSettingsChange, onResetProgress);

	const translate = (key: string | undefined): string => {
		if (!key) return '';
		if (key.startsWith('common.')) {
			return tCommon(key.slice(7) as TranslationKey);
		}
		if (key.startsWith(`${config.gameId}.`)) {
			return tGame(key.slice(config.gameId.length + 1) as TranslationKey);
		}
		const gameTrans = tGame(key as TranslationKey);
		if (gameTrans && gameTrans !== key) return gameTrans;
		const commonTrans = tCommon(key as TranslationKey);
		if (commonTrans && commonTrans !== key) return commonTrans;
		return gameTrans || key;
	};

	const visibleFields = mode === 'compact' ? config.fields.filter((field) => field.availableInGame) : config.fields;

	const renderControl = (field: SettingFieldDescriptor): ReactNode => {
		const rawValue = settings[field.key] ?? field.defaultValue;
		const labelText = translate(field.i18n.labelKey);

		switch (field.control) {
			case 'boolean': {
				const isChecked = Boolean(rawValue);
				return (
					<Switch
						id={`setting-${config.gameId}-${field.key}`}
						checked={isChecked}
						onChange={(e) => updateSetting(field.key, e.target.checked)}
						aria-label={labelText}
					/>
				);
			}

			case 'segmented': {
				const options =
					field.options?.map((opt) => ({
						value: String(opt.value),
						label: translate(opt.labelKey),
					})) ?? [];

				return (
					<SegmentedControl
						options={options}
						value={String(rawValue)}
						onChange={(val) => updateSetting(field.key, val)}
						ariaLabel={labelText}
					/>
				);
			}

			case 'select': {
				const options =
					field.options?.map((opt) => ({
						id: String(opt.value),
						label: translate(opt.labelKey),
					})) ?? [];

				return (
					<CollapsibleListbox
						options={options}
						activeId={String(rawValue)}
						onSelect={(val) => updateSetting(field.key, val)}
						aria-label={labelText}
					/>
				);
			}

			default:
				return null;
		}
	};

	return (
		<S.Container className={className} data-mode={mode}>
			{/* Game-specific Settings Section */}
			<S.Section>
				{mode === 'detailed' && (
					<S.SectionHeader>
						<h2>{tCommon('settings.gameSectionTitle')}</h2>
						<p>{tCommon('settings.gameSectionDescription')}</p>
					</S.SectionHeader>
				)}

				<S.FieldList>
					<VisuallyHidden as="legend">{tCommon('settings.title')}</VisuallyHidden>
					{visibleFields.map((field) => {
						const labelText = translate(field.i18n.labelKey);
						const descriptionText = field.i18n.descriptionKey
							? translate(field.i18n.descriptionKey)
							: undefined;

						return (
							<S.FieldItem key={field.key} data-control={field.control} data-mode={mode}>
								<S.FieldMeta>
									<S.FieldLabel id={`setting-label-${config.gameId}-${field.key}`}>
										{labelText}
									</S.FieldLabel>
									{mode === 'detailed' && descriptionText && (
										<S.FieldDescription>{descriptionText}</S.FieldDescription>
									)}
								</S.FieldMeta>

								<S.ControlContainer data-control={field.control}>
									{renderControl(field)}
								</S.ControlContainer>
							</S.FieldItem>
						);
					})}
				</S.FieldList>
			</S.Section>

			{/* Detailed mode extra sections */}
			{mode === 'detailed' && (
				<>
					{/* Global Appearance Section */}
					<S.Section>
						<S.SectionHeader>
							<h2>{tCommon('settings.appearanceSectionTitle')}</h2>
							<p>{tCommon('settings.appearanceSectionDescription')}</p>
						</S.SectionHeader>

						<S.AppearanceGrid>
							<S.AppearanceCard>
								<h3>{tCommon('settings.schemeSectionTitle')}</h3>
								<p>{tCommon('settings.schemeSectionDescription')}</p>
								<SchemeSelector />
							</S.AppearanceCard>

							<S.AppearanceCard>
								<h3>{tCommon('settings.themeSectionTitle')}</h3>
								<p>{tCommon('settings.themeSectionDescription')}</p>
								<ThemeSelector />
							</S.AppearanceCard>

							<S.AppearanceCard>
								<h3>{tCommon('settings.languageSectionTitle')}</h3>
								<p>{tCommon('settings.languageSectionDescription')}</p>
								<LanguageSelector />
							</S.AppearanceCard>
						</S.AppearanceGrid>
					</S.Section>

					{/* Data Management & Destructive Reset Action */}
					<S.Section data-variant="danger">
						<S.SectionHeader>
							<h2>{tCommon('settings.dataSectionTitle')}</h2>
							<p>{tCommon('settings.dataSectionDescription')}</p>
						</S.SectionHeader>

						<S.DangerZone>
							<div>
								<S.FieldLabel>{tCommon('settings.resetProgressButton')}</S.FieldLabel>
								<S.FieldDescription>
									{tCommon('settings.resetProgressConfirmMessage')}
								</S.FieldDescription>
							</div>

							<S.DangerButton type="button" onClick={openResetDialog}>
								{tCommon('settings.resetProgressButton')}
							</S.DangerButton>
						</S.DangerZone>
					</S.Section>

					{/* Reset Confirmation Dialog */}
					<Dialog
						isOpen={isResetDialogOpen}
						title={tCommon('settings.resetProgressConfirmTitle')}
						message={tCommon('settings.resetProgressConfirmMessage')}
						onCancel={closeResetDialog}
						onConfirm={confirmResetProgress}
						cancelText={tCommon('settings.resetProgressCancelButton')}
						confirmText={tCommon('settings.resetProgressConfirmButton')}
					/>
				</>
			)}
		</S.Container>
	);
}

export function GameSettingsPanel<T extends Record<string, unknown>>(props: GameSettingsPanelProps<T>): JSX.Element {
	const resolvedLang: SupportedLanguageCode = resolveSupportedLanguage(props.lang);

	return (
		<I18nProvider language={resolvedLang}>
			<GameSettingsPanelContent {...props} />
		</I18nProvider>
	);
}
