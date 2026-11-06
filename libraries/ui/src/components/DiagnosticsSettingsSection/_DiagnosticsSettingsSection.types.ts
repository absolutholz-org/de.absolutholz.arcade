import type { CollapsibleListboxOption } from '../CollapsibleListbox';
import type { LOG_RANGE_OPTIONS } from './_DiagnosticsSettingsSection.constants';

export type LogRangeOptionValue = (typeof LOG_RANGE_OPTIONS)[number]['value'];

export type DiagnosticsRangeOption = CollapsibleListboxOption<LogRangeOptionValue>;

export interface DiagnosticsSettingsSectionProps {
	readonly id?: string;
	readonly className?: string;
}
